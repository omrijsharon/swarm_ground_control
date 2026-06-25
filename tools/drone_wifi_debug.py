#!/usr/bin/env python3
"""Send live-position debug commands over the Web OTA/debug API.

Examples:
  python tools/drone_wifi_debug.py --host simple-mesh-magc.local status
  python tools/drone_wifi_debug.py --host simple-mesh-telegc.local status
  python tools/drone_wifi_debug.py --host simple-mesh-7.local status
  python tools/drone_wifi_debug.py --host simple-mesh-7.local config
  python tools/drone_wifi_debug.py --host simple-mesh-7.local files
  python tools/drone_wifi_debug.py --host simple-mesh-7.local rf-loss 2
  python tools/drone_wifi_debug.py --host simple-mesh-7.local delay-next 20
  python tools/drone_wifi_debug.py --host simple-mesh-7.local schedule-next 1234567
  python tools/drone_wifi_debug.py --host simple-mesh-7.local reboot hold
"""

from __future__ import annotations

import argparse
import base64
import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit, urlunsplit
from urllib.request import Request, urlopen


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def normalize_base_url(host: str, port: int) -> str:
    clean = (host or "").strip()
    if not clean:
        raise ValueError("--host is required")
    if "://" not in clean:
        clean = f"http://{clean}"
    parsed = urlsplit(clean)
    netloc = parsed.netloc
    if ":" not in netloc.rsplit("@", 1)[-1]:
        netloc = f"{netloc}:{port}"
    return urlunsplit((parsed.scheme or "http", netloc, "", "", "")).rstrip("/")


def build_payload(argv: list[str], command_id: str) -> dict[str, Any]:
    if not argv:
        raise ValueError("missing command")
    command = argv[0].lower().replace("_", "-")
    value = argv[1] if len(argv) > 1 else None

    if command in {"status", "get-status"}:
        return {"type": "command", "command": "get_status", "commandId": command_id}
    if command in {"config", "get-config"}:
        return {"type": "command", "command": "get_config", "commandId": command_id}
    if command in {"files", "get-files"}:
        return {"type": "command", "command": "get_files", "commandId": command_id}
    if command == "ping":
        return {"type": "command", "command": "ping", "commandId": command_id}
    if command in {"hold", "join-hold"}:
        return {"type": "command", "command": "debug_join_control", "commandId": command_id, "joinMode": "hold"}
    if command in {"release", "auto", "join-auto"}:
        return {"type": "command", "command": "debug_join_control", "commandId": command_id, "joinMode": "auto"}
    if command in {"join-now", "join"}:
        return {"type": "command", "command": "debug_send_join_request", "commandId": command_id}
    if command in {"restart-join", "restart"}:
        return {
            "type": "command",
            "command": "debug_restart_join",
            "commandId": command_id,
            "hold": (value or "auto").lower() == "hold",
        }
    if command == "pause":
        return {"type": "command", "command": "debug_pause_telemetry", "commandId": command_id, "enabled": True}
    if command == "resume":
        return {"type": "command", "command": "debug_pause_telemetry", "commandId": command_id, "enabled": False}
    if command in {"rf-loss", "simulate-rf-loss"}:
        cycles = int(value or "1")
        return {"type": "command", "command": "debug_simulate_rf_loss", "commandId": command_id, "cycles": cycles}
    if command in {"drop", "drop-silent", "drop-telemetry"}:
        cycles = int(value or "1")
        return {"type": "command", "command": "debug_drop_telemetry", "commandId": command_id, "cycles": cycles}
    if command in {"delay-next", "delay-next-telemetry", "phase-delay"}:
        delay_ms = int(value or "20")
        return {"type": "command", "command": "debug_delay_next_telemetry", "commandId": command_id, "delayMs": delay_ms}
    if command in {"schedule-next", "schedule-next-telemetry", "schedule-telemetry"}:
        if value is None:
            raise ValueError("schedule-next requires targetGcMillis")
        return {
            "type": "command",
            "command": "debug_schedule_next_telemetry",
            "commandId": command_id,
            "targetGcMillis": int(value),
        }
    if command == "reboot":
        mode = (value or "auto").lower()
        if mode not in {"auto", "hold"}:
            raise ValueError("reboot mode must be auto or hold")
        return {
            "type": "command",
            "command": "debug_reboot",
            "commandId": command_id,
            "bootJoinMode": mode,
            "delayMs": 250,
        }
    if command == "raw":
        if value is None:
            raise ValueError("raw requires a JSON payload")
        payload = json.loads(" ".join(argv[1:]))
        payload.setdefault("type", "command")
        payload.setdefault("commandId", command_id)
        return payload
    raise ValueError(f"unknown command: {argv[0]}")


def auth_header(user: str | None, password: str | None) -> str | None:
    if not user:
        return None
    token = base64.b64encode(f"{user}:{password or ''}".encode("utf-8")).decode("ascii")
    return f"Basic {token}"


def append_log(path: Path | None, entry: dict[str, Any]) -> None:
    if path is None:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(entry, separators=(",", ":")) + "\n")


def post_command(base_url: str, payload: dict[str, Any], timeout_s: float, auth: str | None) -> tuple[int, str]:
    body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    headers = {
        "Content-Type": "text/plain",
        "Accept": "application/x-ndjson, application/json, text/plain",
    }
    if auth:
        headers["Authorization"] = auth
    request = Request(f"{base_url}/debug/command", data=body, headers=headers, method="POST")
    try:
        with urlopen(request, timeout=timeout_s) as response:
            return response.status, response.read().decode("utf-8", errors="replace")
    except HTTPError as exc:
        return exc.code, exc.read().decode("utf-8", errors="replace")


def main() -> int:
    parser = argparse.ArgumentParser(description="Control or query a live-position device over Wi-Fi debug HTTP.")
    parser.add_argument("--host", required=True, help="Device hostname, IP, or base URL, e.g. simple-mesh-magc.local")
    parser.add_argument("--port", type=int, default=8080, help="HTTP port when --host has no explicit port")
    parser.add_argument("--timeout", type=float, default=3.0, help="HTTP timeout in seconds")
    parser.add_argument("--user", help="Optional OTA/debug basic-auth username")
    parser.add_argument("--password", help="Optional OTA/debug basic-auth password")
    parser.add_argument("--log", type=Path, help="Optional JSONL log path")
    parser.add_argument("--raw-output", action="store_true", help="Print response bytes without JSON formatting")
    parser.add_argument("command", nargs=argparse.REMAINDER, help="Command, e.g. status, rf-loss 2, reboot hold")
    args = parser.parse_args()

    try:
        base_url = normalize_base_url(args.host, args.port)
        command_id = f"wifi-{int(time.time() * 1000) % 100000000:08d}"
        payload = build_payload(args.command, command_id)
        append_log(args.log, {"pcTimeIso": utc_now_iso(), "direction": "pc_to_drone_wifi", "url": base_url, "json": payload})
        status, text = post_command(base_url, payload, args.timeout, auth_header(args.user, args.password))
        for line in text.splitlines():
            stripped = line.strip()
            if not stripped:
                continue
            entry: dict[str, Any] = {"pcTimeIso": utc_now_iso(), "direction": "drone_wifi_to_pc", "status": status, "raw": stripped}
            try:
                entry["json"] = json.loads(stripped)
            except json.JSONDecodeError:
                pass
            append_log(args.log, entry)
        if args.raw_output:
            sys.stdout.write(text)
        else:
            print(f"HTTP {status} {base_url}")
            for line in text.splitlines():
                stripped = line.strip()
                if not stripped:
                    continue
                try:
                    print(json.dumps(json.loads(stripped), indent=2, sort_keys=True))
                except json.JSONDecodeError:
                    print(stripped)
        return 0 if 200 <= status < 300 else 1
    except (ValueError, URLError, TimeoutError, OSError) as exc:
        print(f"Wi-Fi debug failed: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
