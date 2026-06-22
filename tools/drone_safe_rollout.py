#!/usr/bin/env python3
"""Safe USB/Wi-Fi audit and optional firmware-only rollout for one drone.

This helper is intentionally conservative:
- It reads the identity that the firmware loaded from LittleFS.
- It refuses to flash unless --expected-node-id matches the observed node.
- It uses firmware-only flashing, so LittleFS /config.json is not uploaded.
- It verifies the identity again after flashing when --flash is used.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_FIRMWARE_REPO = Path(r"C:\Users\tamipinhasi\Documents\PlatformIO\Projects\simple-mesh")


def utc_stamp() -> str:
    return datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")


def run_checked(command: list[str], *, cwd: Path, timeout: float) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(
        command,
        cwd=str(cwd),
        text=True,
        capture_output=True,
        timeout=timeout,
    )
    if result.returncode != 0:
        if result.stdout:
            print(result.stdout, end="")
        if result.stderr:
            print(result.stderr, end="", file=sys.stderr)
        raise RuntimeError(f"command failed ({result.returncode}): {' '.join(command)}")
    return result


def read_jsonl(path: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    if not path.exists():
        return rows
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line:
                continue
            try:
                rows.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    return rows


def parse_usb_audit(rows: list[dict[str, Any]]) -> dict[str, Any]:
    observed: dict[str, Any] = {
        "node_id": None,
        "source_role": None,
        "node_role_text": None,
        "state": None,
        "ota_ready_host": None,
        "ota_ready_ip": None,
        "ota_transport_hint": None,
        "boot_count": None,
        "telemetry_tx_count": None,
        "config_file_exists": None,
        "config_node_id": None,
        "config_node_role": None,
        "wifi_ota_file_exists": None,
        "wifi_ota_ssid": None,
        "littlefs_files": None,
        "log_warning": None,
    }
    for row in rows:
        raw = str(row.get("raw") or "")
        compact_raw = raw.replace("\r", "").replace("\n", " ")
        node_id_match = re.search(r"Node ID:\s*(\d+)", compact_raw)
        if node_id_match:
            observed["node_id"] = int(node_id_match.group(1), 10)
        if observed["node_role_text"] is None:
            role_match = re.search(r"Node Role:\s*([A-Za-z_ -]+)", compact_raw)
            if role_match:
                observed["node_role_text"] = role_match.group(1).strip().lower()
        ready_match = re.search(
            r"Web OTA ready: http://([^:/\s]+)(?::\d+)?(?:\.local)?(?::\d+)? or http://([0-9.]+):(\d+)",
            compact_raw,
        )
        if ready_match:
            observed["ota_ready_host"] = ready_match.group(1).replace(".local", "")
            observed["ota_ready_ip"] = ready_match.group(2)
            observed["ota_transport_hint"] = "sta"
        ap_match = re.search(r"AP running: ssid=([^ ]+) url=http://([0-9.]+):(\d+)", compact_raw)
        if ap_match:
            observed["ota_ready_host"] = ap_match.group(1)
            observed["ota_ready_ip"] = ap_match.group(2)
            observed["ota_transport_hint"] = "ap"

        payload = row.get("json")
        if not isinstance(payload, dict):
            continue
        if payload.get("type") == "littlefs_file":
            path = payload.get("path")
            if path == "/config.json":
                observed["config_file_exists"] = payload.get("exists")
                config_node_id = payload.get("nodeId")
                if isinstance(config_node_id, int) and config_node_id > 0:
                    observed["config_node_id"] = config_node_id
                config_node_role = payload.get("nodeRole")
                if isinstance(config_node_role, str):
                    observed["config_node_role"] = config_node_role.strip().lower()
                content = payload.get("content")
                if isinstance(content, str):
                    try:
                        parsed_content = json.loads(content)
                    except json.JSONDecodeError:
                        parsed_content = None
                    if isinstance(parsed_content, dict):
                        if isinstance(parsed_content.get("node_id"), int):
                            observed["config_node_id"] = parsed_content["node_id"]
                        if isinstance(parsed_content.get("node_role"), str):
                            observed["config_node_role"] = parsed_content["node_role"].strip().lower()
            elif path == "/wifi_ota.json":
                observed["wifi_ota_file_exists"] = payload.get("exists")
                ssid = payload.get("wifiSsid")
                if isinstance(ssid, str):
                    observed["wifi_ota_ssid"] = ssid
        elif payload.get("type") == "littlefs_files":
            files = payload.get("files")
            if isinstance(files, list):
                observed["littlefs_files"] = [
                    item.get("path")
                    for item in files
                    if isinstance(item, dict) and isinstance(item.get("path"), str)
                ]
        if payload.get("type") in {"drone_debug_status", "drone_live_status"}:
            node_id = payload.get("nodeId")
            if isinstance(node_id, int):
                observed["node_id"] = node_id
            state = payload.get("state")
            if isinstance(state, str):
                observed["state"] = state
            source_role = payload.get("sourceRole")
            if isinstance(source_role, str):
                observed["source_role"] = source_role
            boot_count = payload.get("bootCount")
            if isinstance(boot_count, int):
                observed["boot_count"] = boot_count
            tx_count = payload.get("telemetryTxCount")
            if isinstance(tx_count, int):
                observed["telemetry_tx_count"] = tx_count
    if observed["node_id"] is None:
        observed["log_warning"] = "No drone_debug_status/drone_live_status nodeId observed"
    return observed


def run_usb_audit(port: str, duration: int, label: str) -> tuple[dict[str, Any], Path]:
    log_dir = REPO_ROOT / "logs_summary"
    log_dir.mkdir(exist_ok=True)
    log_path = log_dir / f"drone_safe_rollout_{label}_{utc_stamp()}.jsonl"
    command = [
        sys.executable,
        "tools\\sgc_live_debug.py",
        "--drone",
        port,
        "--duration",
        str(duration),
        "--send",
        "drone:status",
        "--send",
        "drone:config",
        "--send",
        "drone:files",
        "--log",
        str(log_path),
    ]
    result = run_checked(command, cwd=REPO_ROOT, timeout=duration + 25)
    if result.stdout:
        # Keep the rollout output readable while still preserving full evidence in JSONL.
        interesting = [
            line for line in result.stdout.splitlines()
            if "drone_debug_status" in line
            or "drone_live_status" in line
            or "littlefs_file" in line
            or "littlefs_files" in line
            or "Web OTA ready" in line
            or "AP running" in line
            or "Node ID" in line
            or "Node Role" in line
        ]
        for line in interesting[:12]:
            print(line)
        if len(interesting) > 12:
            print(f"... {len(interesting) - 12} more USB audit lines in {log_path}")
    return parse_usb_audit(read_jsonl(log_path)), log_path


def http_json(url: str, timeout: float) -> dict[str, Any]:
    with urllib.request.urlopen(url, timeout=timeout) as response:
        body = response.read().decode("utf-8", errors="replace")
    return json.loads(body)


def http_drone_status(host: str, port: int, timeout: float) -> list[dict[str, Any]]:
    return http_drone_command(host, port, timeout, "get_status")


def http_drone_command(host: str, port: int, timeout: float, command: str) -> list[dict[str, Any]]:
    url = f"http://{host}:{port}/debug/command"
    payload = {
        "type": "command",
        "command": command,
        "commandId": f"safe-rollout-{int(time.time() * 1000)}",
    }
    request = urllib.request.Request(
        url,
        data=json.dumps(payload, separators=(",", ":")).encode("utf-8"),
        headers={"Content-Type": "text/plain"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        body = response.read().decode("utf-8", errors="replace")
    rows: list[dict[str, Any]] = []
    for line in body.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            rows.append(json.loads(line))
        except json.JSONDecodeError:
            rows.append({"type": "raw", "raw": line})
    return rows


def verify_wifi(host: str, port: int, expected_node_id: int | None, timeout: float) -> dict[str, Any]:
    result: dict[str, Any] = {
        "host": host,
        "ota_status": None,
        "debug_status": None,
        "ok": False,
        "error": None,
    }
    try:
        result["ota_status"] = http_json(f"http://{host}:{port}/ota_status", timeout)
        rows = http_drone_status(host, port, timeout)
        rows.extend(http_drone_command(host, port, timeout, "get_config"))
        result["debug_status"] = rows
        node_ids = [
            row.get("nodeId")
            for row in rows
            if isinstance(row, dict) and row.get("type") in {"drone_debug_status", "drone_live_status"}
        ]
        if expected_node_id is not None and expected_node_id not in node_ids:
            result["error"] = f"Wi-Fi debug nodeId mismatch; expected {expected_node_id}, saw {node_ids}"
            return result
        result["ok"] = True
    except (OSError, urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        result["error"] = str(exc)
    return result


def assert_identity(observed: dict[str, Any], expected_node_id: int | None) -> None:
    node_id = observed.get("node_id")
    if not isinstance(node_id, int) or node_id <= 0:
        raise RuntimeError(f"no valid drone nodeId observed: {observed}")
    if expected_node_id is not None and node_id != expected_node_id:
        raise RuntimeError(f"expected nodeId {expected_node_id}, observed {node_id}")
    config_node_id = observed.get("config_node_id")
    if isinstance(config_node_id, int) and config_node_id != node_id:
        raise RuntimeError(f"runtime nodeId {node_id} does not match /config.json node_id {config_node_id}")
    if expected_node_id is not None and isinstance(config_node_id, int) and config_node_id != expected_node_id:
        raise RuntimeError(f"expected nodeId {expected_node_id}, /config.json has {config_node_id}")
    config_node_role = observed.get("config_node_role")
    if isinstance(config_node_role, str) and config_node_role != "drone":
        raise RuntimeError(f"expected /config.json node_role drone, observed {config_node_role!r}")
    role_text = observed.get("node_role_text")
    source_role = observed.get("source_role")
    if role_text is not None and role_text != "drone":
        raise RuntimeError(f"expected Node Role drone, observed {role_text!r}")
    if source_role is not None and source_role != "drone":
        raise RuntimeError(f"expected sourceRole drone, observed {source_role!r}")


def write_report(path: Path, report: dict[str, Any]) -> None:
    lines = [
        "# Drone Safe Rollout Report",
        "",
        f"- Created: `{datetime.now(timezone.utc).isoformat(timespec='seconds')}`",
        f"- Port: `{report['port']}`",
        f"- Expected node ID: `{report.get('expected_node_id')}`",
        f"- Flash requested: `{report['flash_requested']}`",
        f"- Flash performed: `{report['flash_performed']}`",
        "",
        "## Preflight USB",
        "",
        f"- Log: `{report['pre_usb_log']}`",
        f"- Observed: `{json.dumps(report['pre_usb'], sort_keys=True)}`",
        "",
        "## Wi-Fi",
        "",
        f"- Host checked: `{report.get('wifi_host')}`",
        f"- Result: `{json.dumps(report.get('wifi'), sort_keys=True)}`",
    ]
    if report.get("post_usb") is not None:
        lines += [
            "",
            "## Post-Flash USB",
            "",
            f"- Log: `{report['post_usb_log']}`",
            f"- Observed: `{json.dumps(report['post_usb'], sort_keys=True)}`",
        ]
    if report.get("post_wifi") is not None:
        lines += [
            "",
            "## Post-Flash Wi-Fi",
            "",
            f"- Result: `{json.dumps(report.get('post_wifi'), sort_keys=True)}`",
        ]
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Safely audit and optionally firmware-flash one drone.")
    parser.add_argument("--port", required=True, help="Drone USB COM port, e.g. COM13")
    parser.add_argument("--expected-node-id", type=int, help="Required when --flash is used")
    parser.add_argument("--firmware-repo", default=str(DEFAULT_FIRMWARE_REPO))
    parser.add_argument("--environment", default="seeed-xiao-s3")
    parser.add_argument("--duration", type=int, default=14, help="USB audit duration in seconds")
    parser.add_argument("--wifi-host", help="Override Wi-Fi host/IP; defaults to simple-mesh-<nodeId>.local")
    parser.add_argument("--wifi-port", type=int, default=8080)
    parser.add_argument("--skip-wifi", action="store_true")
    parser.add_argument("--flash", action="store_true", help="Perform firmware-only flash after identity audit")
    args = parser.parse_args()

    if args.flash and args.expected_node_id is None:
        parser.error("--flash requires --expected-node-id")

    firmware_repo = Path(args.firmware_repo)
    if args.flash and not firmware_repo.exists():
        raise RuntimeError(f"firmware repo not found: {firmware_repo}")

    print(f"Auditing drone on {args.port}...")
    pre_usb, pre_log = run_usb_audit(args.port, args.duration, "pre")
    assert_identity(pre_usb, args.expected_node_id)
    node_id = int(pre_usb["node_id"])
    print(f"USB identity OK: nodeId={node_id}, sourceRole={pre_usb.get('source_role')}, state={pre_usb.get('state')}")

    wifi_host = args.wifi_host or pre_usb.get("ota_ready_ip") or f"simple-mesh-{node_id}.local"
    wifi_result: dict[str, Any] | None = None
    if not args.skip_wifi:
        print(f"Verifying Wi-Fi debug at {wifi_host}:{args.wifi_port}...")
        wifi_result = verify_wifi(str(wifi_host), args.wifi_port, node_id, 8)
        if wifi_result["ok"]:
            ota = wifi_result.get("ota_status") or {}
            print(
                "Wi-Fi debug OK: "
                f"transport={ota.get('transport')} ip={ota.get('ip')} "
                f"rssi={ota.get('wifiRssi')} channel={ota.get('wifiChannel')}"
            )
        else:
            print(f"Wi-Fi debug not verified: {wifi_result.get('error')}")

    post_usb = None
    post_log = None
    post_wifi_result: dict[str, Any] | None = None
    flash_performed = False
    if args.flash:
        print("Flashing firmware only; LittleFS will not be uploaded.")
        command = [
            "powershell",
            "-ExecutionPolicy",
            "Bypass",
            "-File",
            "tools\\flash_firmware_only.ps1",
            "-Port",
            args.port,
            "-FirmwareRepo",
            str(firmware_repo),
            "-Environment",
            args.environment,
        ]
        flash_result = run_checked(command, cwd=REPO_ROOT, timeout=180)
        if flash_result.stdout:
            print(flash_result.stdout)
        flash_performed = True
        time.sleep(3)
        print("Re-auditing after firmware-only flash...")
        post_usb, post_log = run_usb_audit(args.port, args.duration, "post")
        assert_identity(post_usb, node_id)
        print(f"Post-flash identity OK: nodeId={post_usb.get('node_id')}, state={post_usb.get('state')}")
        if not args.skip_wifi:
            post_wifi_host = post_usb.get("ota_ready_ip") or wifi_host
            print(f"Verifying post-flash Wi-Fi debug at {post_wifi_host}:{args.wifi_port}...")
            post_wifi_result = verify_wifi(str(post_wifi_host), args.wifi_port, node_id, 8)
            if post_wifi_result["ok"]:
                ota = post_wifi_result.get("ota_status") or {}
                print(
                    "Post-flash Wi-Fi debug OK: "
                    f"transport={ota.get('transport')} ip={ota.get('ip')} "
                    f"rssi={ota.get('wifiRssi')} channel={ota.get('wifiChannel')}"
                )
            else:
                print(f"Post-flash Wi-Fi debug not verified: {post_wifi_result.get('error')}")

    report = {
        "port": args.port,
        "expected_node_id": args.expected_node_id,
        "flash_requested": args.flash,
        "flash_performed": flash_performed,
        "pre_usb": pre_usb,
        "pre_usb_log": str(pre_log),
        "wifi_host": wifi_host,
        "wifi": wifi_result,
        "post_usb": post_usb,
        "post_usb_log": str(post_log) if post_log else None,
        "post_wifi": post_wifi_result,
    }
    report_path = REPO_ROOT / "logs_summary" / f"drone_safe_rollout_node{node_id}_{utc_stamp()}.md"
    write_report(report_path, report)
    print(f"Report written: {report_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
