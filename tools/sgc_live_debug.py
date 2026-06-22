#!/usr/bin/env python3
"""Live TeleGC/MaGC/drone serial debugger for Swarm Ground Control.

Examples:
  python tools/sgc_live_debug.py --telegc COM18 --duration 60
  python tools/sgc_live_debug.py --telegc COM18 --drone COM22 --interactive
  python tools/sgc_live_debug.py --telegc COM18 --send magc:status --send magc:bind
  python tools/sgc_live_debug.py --drone COM13 --startup-delay 25 --send drone:status
  python tools/sgc_live_debug.py --telegc COM18 --drone COM22 --scenario bind-from-held-drone --log logs_summary/live_debug_bind.jsonl
  python tools/sgc_live_debug.py --telegc COM18 --drone COM22 --scenario auto-rebind-after-reset --duration 60
  python tools/sgc_live_debug.py --telegc COM16 --drone COM13 --scenario magc-clear-then-drone-auto-join --duration 90
"""

from __future__ import annotations

import argparse
import json
import queue
import sys
import threading
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

try:
    import serial
except Exception as exc:  # pragma: no cover - useful on machines without pyserial.
    print(f"pyserial import failed: {exc}", file=sys.stderr)
    print("Install with: python -m pip install pyserial", file=sys.stderr)
    raise


GC_COMMAND_MAP = {
    "ping": "ping",
    "status": "get_status",
    "table": "get_channel_table",
    "assignments": "get_assignments",
    "bind": "start_search",
    "search": "start_search",
    "cancel": "cancel_search",
    "rescan": "rescan_channels",
    "rebind": "relock_drone",
    "relock": "relock_drone",
    "profile": "set_radio_profile",
    "clear": "clear_assignment",
    "clear-all": "clear_all_assignments",
    "clear_all": "clear_all_assignments",
    "probe": "debug_shared_rx_probe",
    "overlap": "debug_schedule_assignment_overlap",
    "schedule-overlap": "debug_schedule_assignment_overlap",
    "schedule_overlap": "debug_schedule_assignment_overlap",
}

DRONE_COMMANDS = {
    "ping",
    "status",
    "config",
    "get-config",
    "files",
    "get-files",
    "hold",
    "auto",
    "release",
    "join-now",
    "join_now",
    "restart-join",
    "restart_join",
    "pause",
    "resume",
    "drop",
    "drop-telemetry",
    "drop_telemetry",
    "drop-silent",
    "drop_silent",
    "rf-loss",
    "rf_loss",
    "simulate-rf-loss",
    "simulate_rf_loss",
    "delay-next",
    "delay_next",
    "delay-next-telemetry",
    "delay_next_telemetry",
    "phase-delay",
    "phase_delay",
    "schedule-next",
    "schedule_next",
    "schedule-next-telemetry",
    "schedule_next_telemetry",
    "schedule-telemetry",
    "schedule_telemetry",
    "reboot",
}


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds")


def event_epoch_s(event: dict[str, Any]) -> float:
    ts = event.get("timestamp")
    if isinstance(ts, str):
        try:
            return datetime.fromisoformat(ts.replace("Z", "+00:00")).timestamp()
        except Exception:
            pass
    return time.time()


def parse_bool(value: str) -> bool:
    return value.strip().lower() in {"1", "true", "yes", "y", "on", "hold"}


def is_int_text(value: str) -> bool:
    try:
        int(value, 10)
        return True
    except ValueError:
        return False


def normalize_target(target: str) -> str:
    value = target.strip().lower()
    if value in {"gc", "tele", "telegc", "telemetry", "telemetry_ground_control"}:
        return "telegc"
    if value in {"magic", "magc", "magic_ground_control"}:
        return "magc"
    if value in {"drone", "node"}:
        return "drone"
    return value


def next_command_id(command_counter: list[int], target: str) -> str:
    command_counter[0] += 1
    return f"live-dbg-{target}-{command_counter[0]:04d}"


def build_gc_command(target: str, name: str, args: list[str], command_id: str) -> dict[str, Any]:
    normalized = name.strip().lower()
    command = GC_COMMAND_MAP.get(normalized)
    if command is None:
        raise ValueError(f"unknown GC command '{name}'")

    payload: dict[str, Any] = {
        "type": "command",
        "target": target,
        "command": command,
        "commandId": command_id,
    }
    if normalized in {"rebind", "relock", "clear"}:
        if not args:
            raise ValueError(f"{normalized} requires nodeId")
        payload["nodeId"] = int(args[0], 10)
    elif normalized == "profile":
        if not args:
            raise ValueError("profile requires radioProfileId")
        payload["radioProfileId"] = int(args[0], 10)
        if len(args) > 1 and parse_bool(args[1]):
            payload["persist"] = True
    elif normalized == "probe":
        if args:
            payload["durationMs"] = int(args[0], 10)
    elif normalized in {"overlap", "schedule-overlap", "schedule_overlap"}:
        if len(args) < 3:
            raise ValueError(f"{normalized} requires targetGcMillis and at least two node IDs")
        payload["targetGcMillis"] = int(args[0], 10)
        payload["nodeIds"] = [int(item, 10) for item in args[1].split(",")]
        payload["offsetsMs"] = [int(item, 10) for item in args[2].split(",")]
    return payload


def build_drone_command(name: str, args: list[str], command_id: str) -> dict[str, Any]:
    normalized = name.strip().lower().replace("_", "-")
    if normalized not in {item.replace("_", "-") for item in DRONE_COMMANDS}:
        raise ValueError(f"unknown drone command '{name}'")

    payload: dict[str, Any] = {
        "type": "command",
        "commandId": command_id,
    }
    if normalized == "ping":
        payload["command"] = "ping"
    elif normalized == "status":
        payload["command"] = "get_status"
    elif normalized in {"config", "get-config"}:
        payload["command"] = "get_config"
    elif normalized in {"files", "get-files"}:
        payload["command"] = "get_files"
    elif normalized == "hold":
        payload["command"] = "debug_join_control"
        payload["joinMode"] = "hold"
        if args and is_int_text(args[0]):
            payload["holdMs"] = int(args[0], 10)
    elif normalized in {"auto", "release"}:
        payload["command"] = "debug_join_control"
        payload["joinMode"] = "auto"
    elif normalized == "join-now":
        payload["command"] = "debug_send_join_request"
    elif normalized == "restart-join":
        payload["command"] = "debug_restart_join"
        payload["hold"] = any(parse_bool(arg) for arg in args) if args else False
    elif normalized == "pause":
        payload["command"] = "debug_pause_telemetry"
        payload["enabled"] = True
    elif normalized == "resume":
        payload["command"] = "debug_pause_telemetry"
        payload["enabled"] = False
    elif normalized in {"drop", "drop-telemetry", "drop-silent"}:
        payload["command"] = "debug_drop_telemetry"
        payload["cycles"] = int(args[0], 10) if args and is_int_text(args[0]) else 1
    elif normalized in {"rf-loss", "simulate-rf-loss"}:
        payload["command"] = "debug_simulate_rf_loss"
        payload["cycles"] = int(args[0], 10) if args and is_int_text(args[0]) else 1
    elif normalized in {"delay-next", "delay-next-telemetry", "phase-delay"}:
        payload["command"] = "debug_delay_next_telemetry"
        payload["delayMs"] = int(args[0], 10) if args and is_int_text(args[0]) else 20
    elif normalized in {"schedule-next", "schedule-next-telemetry", "schedule-telemetry"}:
        if not args or not is_int_text(args[0]):
            raise ValueError("schedule-next requires targetGcMillis")
        payload["command"] = "debug_schedule_next_telemetry"
        payload["targetGcMillis"] = int(args[0], 10)
    elif normalized == "reboot":
        payload["command"] = "debug_reboot"
        hold = any(arg.strip().lower() == "hold" or parse_bool(arg) for arg in args)
        payload["bootJoinMode"] = "hold" if hold else "auto"
        delay_ms = next((int(arg, 10) for arg in args if is_int_text(arg)), 250)
        payload["delayMs"] = delay_ms
    else:
        raise ValueError(f"unknown drone command '{name}'")
    return payload


def parse_send_spec(spec: str) -> tuple[str, str, list[str]]:
    if ":" not in spec:
        raise ValueError(f"--send must look like target:command, got '{spec}'")
    target, command_spec = spec.split(":", 1)
    target = normalize_target(target)
    parts = command_spec.replace(":", " ").split()
    if not parts:
        raise ValueError(f"missing command in '{spec}'")
    if target not in {"telegc", "magc", "drone"}:
        raise ValueError(f"target must be telegc, magc, or drone, got '{target}'")
    return target, parts[0], parts[1:]


class SerialPeer:
    def __init__(self, label: str, port: str, baud: int, events: queue.Queue[dict[str, Any]]) -> None:
        self.label = label
        self.port = port
        self.baud = baud
        self.events = events
        self.serial: serial.Serial | None = None
        self.write_lock = threading.Lock()
        self.open_lock = threading.Lock()
        self.stop_event = threading.Event()
        self.thread: threading.Thread | None = None

    def start(self) -> None:
        self.stop_event.clear()
        self._open_serial()
        self.thread = threading.Thread(target=self._read_loop, name=f"read-{self.label}", daemon=True)
        self.thread.start()

    def close(self) -> None:
        self.stop_event.set()
        if self.thread is not None:
            self.thread.join(timeout=1.0)
        self._close_serial()

    def send_json(self, payload: dict[str, Any]) -> None:
        self._ensure_open_for_write()
        if self.serial is None or not self.serial.is_open:
            raise RuntimeError(f"{self.label} serial is not open")
        data = (json.dumps(payload, separators=(",", ":")) + "\n").encode("utf-8")
        with self.write_lock:
            self.serial.write(data)
            self.serial.flush()
        self.events.put({
            "kind": "tx",
            "source": self.label,
            "port": self.port,
            "raw": data.decode("utf-8").rstrip(),
            "json": payload,
            "timestamp": utc_now_iso(),
        })

    def _open_serial(self) -> None:
        with self.open_lock:
            if self.serial is not None and self.serial.is_open:
                return
            self.serial = serial.Serial(self.port, baudrate=self.baud, timeout=0.2)
            try:
                self.serial.dtr = False
                self.serial.rts = False
            except Exception:
                pass
            self.events.put({
                "kind": "info",
                "source": self.label,
                "port": self.port,
                "raw": f"opened {self.port} at {self.baud}",
                "timestamp": utc_now_iso(),
            })

    def _close_serial(self) -> None:
        with self.open_lock:
            if self.serial is not None:
                try:
                    if self.serial.is_open:
                        self.serial.close()
                finally:
                    self.serial = None

    def _ensure_open_for_write(self) -> None:
        if self.serial is not None and self.serial.is_open:
            return
        self._open_serial()

    def _read_loop(self) -> None:
        buffer = b""
        while not self.stop_event.is_set():
            if self.serial is None or not self.serial.is_open:
                try:
                    self._open_serial()
                except Exception as exc:
                    self.events.put({
                        "kind": "error",
                        "source": self.label,
                        "port": self.port,
                        "raw": f"open_error: {exc}",
                        "timestamp": utc_now_iso(),
                    })
                    time.sleep(1.0)
                    continue
            try:
                assert self.serial is not None
                data = self.serial.read(1024)
            except Exception as exc:
                self.events.put({
                    "kind": "error",
                    "source": self.label,
                    "port": self.port,
                    "raw": f"read_error: {exc}",
                    "timestamp": utc_now_iso(),
                })
                self._close_serial()
                time.sleep(1.0)
                continue
            if not data:
                continue
            buffer += data
            while b"\n" in buffer:
                line, buffer = buffer.split(b"\n", 1)
                raw = line.decode("utf-8", errors="replace").rstrip("\r")
                event: dict[str, Any] = {
                    "kind": "rx",
                    "source": self.label,
                    "port": self.port,
                    "raw": raw,
                    "timestamp": utc_now_iso(),
                }
                try:
                    event["json"] = json.loads(raw)
                except Exception:
                    pass
                self.events.put(event)


def build_command_for_target(target: str, name: str, args: list[str], command_counter: list[int]) -> tuple[str, dict[str, Any]]:
    target = normalize_target(target)
    command_id = next_command_id(command_counter, target)
    if target in {"telegc", "magc"}:
        return "telegc", build_gc_command(target, name, args, command_id)
    if target == "drone":
        return "drone", build_drone_command(name, args, command_id)
    raise ValueError(f"unknown target '{target}'")


def send_canned(
    peers: dict[str, SerialPeer],
    target: str,
    name: str,
    args: list[str],
    command_counter: list[int],
) -> None:
    port_label, payload = build_command_for_target(target, name, args, command_counter)
    peer = peers.get(port_label)
    if peer is None:
        raise RuntimeError(f"{port_label} port was not opened")
    peer.send_json(payload)


def enqueue_marker(events: queue.Queue[dict[str, Any]], text: str) -> None:
    events.put({
        "kind": "marker",
        "source": "tool",
        "port": "",
        "raw": text,
        "timestamp": utc_now_iso(),
    })


def scenario_bind_from_held_drone(
    peers: dict[str, SerialPeer],
    command_counter: list[int],
    events: queue.Queue[dict[str, Any]],
    join_delay_s: float,
) -> None:
    if "telegc" not in peers:
        raise RuntimeError("--scenario bind-from-held-drone requires --telegc")
    if "drone" not in peers:
        raise RuntimeError("--scenario bind-from-held-drone requires --drone")

    enqueue_marker(events, "scenario_start bind-from-held-drone")
    send_canned(peers, "drone", "reboot", ["hold", "250"], command_counter)
    enqueue_marker(events, "drone reboot hold requested; waiting for serial reconnect")
    time.sleep(30.0)
    send_canned(peers, "drone", "status", [], command_counter)
    send_canned(peers, "drone", "restart-join", ["hold"], command_counter)
    time.sleep(0.4)
    send_canned(peers, "telegc", "status", [], command_counter)
    time.sleep(0.2)
    send_canned(peers, "magc", "status", [], command_counter)
    time.sleep(0.2)
    send_canned(peers, "magc", "bind", [], command_counter)
    time.sleep(max(0.0, join_delay_s))
    send_canned(peers, "drone", "join-now", [], command_counter)
    enqueue_marker(events, f"one held-drone JOIN request requested after {join_delay_s:0.1f}s")


def scenario_auto_rebind_after_reset(
    peers: dict[str, SerialPeer],
    command_counter: list[int],
    events: queue.Queue[dict[str, Any]],
) -> None:
    if "telegc" not in peers:
        raise RuntimeError("--scenario auto-rebind-after-reset requires --telegc")
    if "drone" not in peers:
        raise RuntimeError("--scenario auto-rebind-after-reset requires --drone")

    enqueue_marker(events, "scenario_start auto-rebind-after-reset")
    send_canned(peers, "telegc", "status", [], command_counter)
    time.sleep(0.2)
    send_canned(peers, "magc", "status", [], command_counter)
    time.sleep(0.2)
    send_canned(peers, "drone", "reboot", ["250"], command_counter)
    enqueue_marker(events, "drone reboot auto requested; not sending magc bind")
    for delay_s in (3.0, 6.0, 10.0, 15.0):
        time.sleep(delay_s)
        send_canned(peers, "magc", "status", [], command_counter)


def scenario_magc_clear_then_drone_auto_join(
    peers: dict[str, SerialPeer],
    command_counter: list[int],
    events: queue.Queue[dict[str, Any]],
) -> None:
    if "telegc" not in peers:
        raise RuntimeError("--scenario magc-clear-then-drone-auto-join requires --telegc")
    if "drone" not in peers:
        raise RuntimeError("--scenario magc-clear-then-drone-auto-join requires --drone")

    enqueue_marker(events, "scenario_start magc-clear-then-drone-auto-join")
    send_canned(peers, "telegc", "status", [], command_counter)
    time.sleep(0.4)
    send_canned(peers, "magc", "status", [], command_counter)
    time.sleep(2.0)

    send_canned(peers, "drone", "reboot", ["hold", "250"], command_counter)
    enqueue_marker(events, "drone reboot hold requested before MaGC clear")
    time.sleep(30.0)

    send_canned(peers, "telegc", "status", [], command_counter)
    time.sleep(0.3)
    send_canned(peers, "magc", "status", [], command_counter)
    time.sleep(2.0)

    send_canned(peers, "magc", "clear-all", [], command_counter)
    enqueue_marker(events, "magc clear-all requested before drone auto reboot")
    time.sleep(1.0)

    send_canned(peers, "drone", "reboot", ["250"], command_counter)
    enqueue_marker(events, "scenario_reset_origin magc-clear-then-drone-auto-join")
    enqueue_marker(events, "drone reboot auto requested after MaGC clear; not sending magc bind")
    for delay_s in (3.0, 6.0, 10.0, 15.0):
        time.sleep(delay_s)
        send_canned(peers, "magc", "status", [], command_counter)


def scenario_thread_main(
    peers: dict[str, SerialPeer],
    command_counter: list[int],
    events: queue.Queue[dict[str, Any]],
    scenario: str,
    join_delay_s: float,
) -> None:
    try:
        if scenario == "bind-from-held-drone":
            scenario_bind_from_held_drone(peers, command_counter, events, join_delay_s)
        elif scenario == "auto-rebind-after-reset":
            scenario_auto_rebind_after_reset(peers, command_counter, events)
        elif scenario == "magc-clear-then-drone-auto-join":
            scenario_magc_clear_then_drone_auto_join(peers, command_counter, events)
        else:
            raise RuntimeError(f"unknown scenario {scenario}")
    except Exception as exc:
        events.put({
            "kind": "error",
            "source": "tool",
            "port": "",
            "raw": f"scenario_error: {exc}",
            "timestamp": utc_now_iso(),
        })


def interactive_loop(
    peers: dict[str, SerialPeer],
    command_counter: list[int],
    events: queue.Queue[dict[str, Any]],
) -> None:
    print("Interactive commands:")
    print("  telegc status | magc status | magc bind | magc cancel | magc probe [ms]")
    print("  drone hold | drone join-now | drone restart-join hold | drone pause | drone resume")
    print("  drone rf-loss [cycles] | drone drop-silent [cycles] | drone delay-next [ms] | drone schedule-next [gcMillis] | drone reboot hold")
    print("  mark <text> | wait <seconds> | quit")
    while True:
        try:
            line = input("live-dbg> ").strip()
        except EOFError:
            return
        if not line:
            continue
        if line.lower() in {"q", "quit", "exit"}:
            return
        if line.lower().startswith("mark "):
            enqueue_marker(events, line[5:].strip())
            continue
        if line.lower().startswith("wait "):
            try:
                time.sleep(max(0.0, float(line.split(None, 1)[1])))
            except Exception as exc:
                print(f"wait failed: {exc}", file=sys.stderr)
            continue
        parts = line.split()
        if len(parts) < 2:
            print("Use: <telegc|magc|drone> <command> [args...]")
            continue
        target, name, args = normalize_target(parts[0]), parts[1], parts[2:]
        if target not in {"telegc", "magc", "drone"}:
            print("Target must be telegc, magc, or drone")
            continue
        try:
            send_canned(peers, target, name, args, command_counter)
        except Exception as exc:
            print(f"send failed: {exc}", file=sys.stderr)


def print_event(index: int, event: dict[str, Any]) -> None:
    direction = "??"
    if event["kind"] == "rx":
        direction = "<<"
    elif event["kind"] == "tx":
        direction = ">>"
    elif event["kind"] == "error":
        direction = "!!"
    elif event["kind"] in {"info", "marker"}:
        direction = "--"
    print(f"{event['timestamp']} #{index:06d} {event['source']} {direction} {event['raw']}")


def write_event(log_file: Any, index: int, event: dict[str, Any]) -> None:
    if log_file is None:
        return
    record = dict(event)
    record["lineIndex"] = index
    log_file.write(json.dumps(record, separators=(",", ":")) + "\n")
    log_file.flush()


def main() -> int:
    parser = argparse.ArgumentParser(description="Live TeleGC/MaGC/drone serial debugger")
    parser.add_argument("--telegc", help="TeleGC USB serial port, for example COM18")
    parser.add_argument("--drone", help="Optional drone USB serial port, for example COM22")
    parser.add_argument("--baud", type=int, default=921600)
    parser.add_argument("--duration", type=float, default=30.0, help="Capture duration in seconds")
    parser.add_argument("--startup-delay", type=float, default=0.0, help="Wait this many seconds after opening ports before sending commands")
    parser.add_argument("--log", default="", help="Output JSONL log path")
    parser.add_argument("--send", action="append", default=[], help="Send target:command, e.g. magc:status or drone:hold")
    parser.add_argument(
        "--send-interval-ms",
        type=float,
        default=50.0,
        help="Delay between scripted --send commands; use 0 for a raw USB burst",
    )
    parser.add_argument("--interactive", action="store_true")
    parser.add_argument(
        "--scenario",
        choices=["bind-from-held-drone", "auto-rebind-after-reset", "magc-clear-then-drone-auto-join"],
        help="Run a canned debug scenario",
    )
    parser.add_argument(
        "--scenario-join-delay",
        type=float,
        default=0.5,
        help="Seconds to wait after normal magc bind before drone join-now in bind-from-held-drone",
    )
    args = parser.parse_args()

    if not args.telegc and not args.drone:
        parser.error("open at least one of --telegc or --drone")
    if args.scenario == "bind-from-held-drone" and (not args.telegc or not args.drone):
        parser.error("--scenario bind-from-held-drone requires --telegc and --drone")
    if args.scenario == "auto-rebind-after-reset" and (not args.telegc or not args.drone):
        parser.error("--scenario auto-rebind-after-reset requires --telegc and --drone")
    if args.scenario == "magc-clear-then-drone-auto-join" and (not args.telegc or not args.drone):
        parser.error("--scenario magc-clear-then-drone-auto-join requires --telegc and --drone")

    events: queue.Queue[dict[str, Any]] = queue.Queue()
    peers: dict[str, SerialPeer] = {}
    if args.telegc:
        peers["telegc"] = SerialPeer("telegc", args.telegc, args.baud, events)
    if args.drone:
        peers["drone"] = SerialPeer("drone", args.drone, args.baud, events)

    log_path = Path(args.log) if args.log else None
    log_file = None
    if log_path is not None:
        log_path.parent.mkdir(parents=True, exist_ok=True)
        log_file = log_path.open("a", encoding="utf-8", newline="\n")

    command_counter = [0]
    stop_at = time.time() + max(args.duration, 0)
    background_threads: list[threading.Thread] = []
    try:
        for peer in peers.values():
            peer.start()

        if args.startup_delay > 0:
            enqueue_marker(events, f"startup_delay {args.startup_delay:0.1f}s")
            time.sleep(args.startup_delay)

        for index, spec in enumerate(args.send):
            target, name, command_args = parse_send_spec(spec)
            send_canned(peers, target, name, command_args, command_counter)
            if args.send_interval_ms > 0 and index + 1 < len(args.send):
                time.sleep(args.send_interval_ms / 1000.0)

        if args.scenario:
            thread = threading.Thread(
                target=scenario_thread_main,
                args=(peers, command_counter, events, args.scenario, args.scenario_join_delay),
                daemon=True,
            )
            background_threads.append(thread)
            thread.start()

        if args.interactive:
            thread = threading.Thread(target=interactive_loop, args=(peers, command_counter, events), daemon=True)
            background_threads.append(thread)
            thread.start()

        line_index = 0
        scenario_failed = False
        post_bind_ack_s: dict[int, float] = {}
        post_bind_assigned_started_s: dict[int, float] = {}
        post_bind_first_telemetry_s: dict[int, float] = {}
        scenario_reset_origin_s: float | None = None
        scenario_reset_to_join_mode_s: float | None = None
        scenario_reset_to_join_tx_s: float | None = None
        scenario_reset_to_bind0_s: float | None = None
        scenario_reset_to_first_telem_s: float | None = None
        while time.time() < stop_at or args.interactive:
            if args.interactive and background_threads and not any(thread.is_alive() for thread in background_threads):
                break
            try:
                event = events.get(timeout=0.2)
            except queue.Empty:
                continue
            raw_text = str(event.get("raw") or "")
            if args.scenario == "magc-clear-then-drone-auto-join" and raw_text.startswith("scenario_reset_origin"):
                scenario_reset_origin_s = event_epoch_s(event)
                enqueue_marker(events, "scenario_metric reset_origin_observed")
            msg = event.get("json")
            if isinstance(msg, dict):
                node_id = msg.get("nodeId")
                event_name = str(msg.get("event") or "")
                ts_s = event_epoch_s(event)
                if args.scenario == "magc-clear-then-drone-auto-join" and scenario_reset_origin_s is not None:
                    reset_delta_s = ts_s - scenario_reset_origin_s
                    if (
                        event.get("source") == "drone" and
                        isinstance(node_id, int) and
                        msg.get("type") == "drone_join_event" and
                        event_name == "join_start_shared_channel" and
                        scenario_reset_to_join_mode_s is None
                    ):
                        scenario_reset_to_join_mode_s = reset_delta_s
                        enqueue_marker(events, f"scenario_metric reset_to_join_mode_s={reset_delta_s:0.3f}")
                    elif (
                        event.get("source") == "drone" and
                        isinstance(node_id, int) and
                        msg.get("type") == "drone_join_event" and
                        event_name == "join_request_sent" and
                        scenario_reset_to_join_tx_s is None
                    ):
                        scenario_reset_to_join_tx_s = reset_delta_s
                        enqueue_marker(events, f"scenario_metric reset_to_join_tx_s={reset_delta_s:0.3f}")
                    elif (
                        isinstance(node_id, int) and
                        msg.get("type") == "assignment_event" and
                        event_name == "join_request_received" and
                        scenario_reset_to_bind0_s is None
                    ):
                        scenario_reset_to_bind0_s = reset_delta_s
                        if reset_delta_s > 6.0:
                            scenario_failed = True
                            enqueue_marker(events, f"scenario_fail reset_to_bind0_s={reset_delta_s:0.3f}")
                        else:
                            enqueue_marker(events, f"scenario_metric reset_to_bind0_s={reset_delta_s:0.3f}")
                    elif (
                        isinstance(node_id, int) and
                        msg.get("type") == "drone_telemetry" and
                        msg.get("sourceRole") == "telemetry_ground_control" and
                        scenario_reset_to_first_telem_s is None
                    ):
                        scenario_reset_to_first_telem_s = reset_delta_s
                        enqueue_marker(events, f"scenario_metric reset_to_first_telegc_telemetry_s={reset_delta_s:0.3f}")
                if isinstance(node_id, int) and msg.get("type") == "assignment_event" and event_name in {"join_ack_received", "late_join_ack_received"}:
                    post_bind_ack_s[node_id] = ts_s
                    post_bind_first_telemetry_s.pop(node_id, None)
                    enqueue_marker(events, f"post_bind_metric node={node_id} join_ack_observed")
                elif isinstance(node_id, int) and msg.get("type") == "drone_join_event" and event_name == "assigned_telemetry_started":
                    post_bind_assigned_started_s[node_id] = ts_s
                    post_bind_first_telemetry_s.pop(node_id, None)
                    enqueue_marker(events, f"post_bind_metric node={node_id} drone_assigned_telemetry_started")
                elif isinstance(node_id, int) and msg.get("type") == "drone_telemetry" and node_id not in post_bind_first_telemetry_s:
                    post_bind_first_telemetry_s[node_id] = ts_s
                    ack_s = post_bind_ack_s.get(node_id)
                    assigned_s = post_bind_assigned_started_s.get(node_id)
                    latency_text = []
                    if ack_s is not None:
                        ack_latency = ts_s - ack_s
                        latency_text.append(f"ack_to_telemetry_s={ack_latency:0.3f}")
                        if args.scenario in {"auto-rebind-after-reset", "magc-clear-then-drone-auto-join"} and ack_latency > 3.0:
                            scenario_failed = True
                            enqueue_marker(events, f"scenario_fail post_bind_telemetry_latency node={node_id} {ack_latency:0.3f}s")
                    if assigned_s is not None:
                        latency_text.append(f"assigned_to_telemetry_s={ts_s - assigned_s:0.3f}")
                    enqueue_marker(events, f"post_bind_metric node={node_id} first_telegc_telemetry {' '.join(latency_text)}")
            line_index += 1
            print_event(line_index, event)
            write_event(log_file, line_index, event)
        if args.scenario == "auto-rebind-after-reset":
            now_s = time.time()
            for node_id, ack_s in post_bind_ack_s.items():
                if node_id not in post_bind_first_telemetry_s and now_s - ack_s > 3.0:
                    scenario_failed = True
                    marker = {
                        "kind": "marker",
                        "source": "tool",
                        "port": "",
                        "raw": f"scenario_fail post_bind_telemetry_missing node={node_id} age_s={now_s - ack_s:0.3f}",
                        "timestamp": utc_now_iso(),
                    }
                    line_index += 1
                    print_event(line_index, marker)
                    write_event(log_file, line_index, marker)
            if scenario_failed:
                return 2
        if args.scenario == "magc-clear-then-drone-auto-join":
            if scenario_reset_origin_s is not None:
                if scenario_reset_to_bind0_s is None:
                    scenario_failed = True
                    marker = {
                        "kind": "marker",
                        "source": "tool",
                        "port": "",
                        "raw": "scenario_fail reset_to_bind0_missing",
                        "timestamp": utc_now_iso(),
                    }
                    line_index += 1
                    print_event(line_index, marker)
                    write_event(log_file, line_index, marker)
                if scenario_reset_to_first_telem_s is None:
                    scenario_failed = True
                    marker = {
                        "kind": "marker",
                        "source": "tool",
                        "port": "",
                        "raw": "scenario_fail reset_to_first_telegc_telemetry_missing",
                        "timestamp": utc_now_iso(),
                    }
                    line_index += 1
                    print_event(line_index, marker)
                    write_event(log_file, line_index, marker)
            if scenario_failed:
                return 2
    finally:
        for peer in peers.values():
            peer.close()
        if log_file is not None:
            log_file.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
