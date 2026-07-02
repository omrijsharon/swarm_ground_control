#!/usr/bin/env python3
"""Dual-port GC/bridge serial debugger for live-position firmware.

Examples:
  python tools/gc_bridge_serial_debug.py --gc COM18 --bridge COM4 --duration 60
  python tools/gc_bridge_serial_debug.py --gc COM18 --bridge COM4 --send gc:status --send bridge:status
  python tools/gc_bridge_serial_debug.py --gc COM18 --bridge COM4 --interactive
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


COMMAND_MAP = {
    "ping": "ping",
    "status": "get_status",
    "table": "get_channel_table",
    "assignments": "get_assignments",
    "bind": "start_search",
    "rescan": "rescan_channels",
    "rebind": "relock_drone",
    "profile": "set_radio_profile",
    "join-profile": "debug_bridge_join_profile",
    "debug-join-profile": "debug_bridge_join_profile",
    "clear": "clear_assignment",
    "clear-all": "clear_all_assignments",
}


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds")


def build_command(name: str, args: list[str], command_id: str) -> dict[str, Any]:
    normalized = name.strip().lower()
    command = COMMAND_MAP.get(normalized)
    if command is None:
        raise ValueError(f"unknown command '{name}'")

    payload: dict[str, Any] = {
        "type": "command",
        "command": command,
        "commandId": command_id,
    }
    if normalized in {"rebind", "clear"}:
        if not args:
            raise ValueError(f"{normalized} requires nodeId")
        payload["nodeId"] = int(args[0])
    elif normalized in {"profile", "join-profile", "debug-join-profile"}:
        if not args:
            raise ValueError(f"{normalized} requires radioProfileId")
        payload["radioProfileId"] = int(args[0])
        if normalized == "profile" and len(args) > 1 and args[1].lower() in {"persist", "true", "1", "yes"}:
            payload["persist"] = True
    return payload


def parse_send_spec(spec: str) -> tuple[str, str, list[str]]:
    if ":" not in spec:
        raise ValueError(f"--send must look like target:command, got '{spec}'")
    target, command_spec = spec.split(":", 1)
    target = target.strip().lower()
    parts = command_spec.replace(":", " ").split()
    if not parts:
        raise ValueError(f"missing command in '{spec}'")
    if target not in {"gc", "bridge", "both"}:
        raise ValueError(f"target must be gc, bridge, or both, got '{target}'")
    return target, parts[0], parts[1:]


class SerialPeer:
    def __init__(self, label: str, port: str, baud: int, events: queue.Queue[dict[str, Any]]) -> None:
        self.label = label
        self.port = port
        self.baud = baud
        self.events = events
        self.serial: serial.Serial | None = None
        self.write_lock = threading.Lock()
        self.stop_event = threading.Event()
        self.thread: threading.Thread | None = None

    def open(self) -> None:
        self.serial = serial.Serial(self.port, baudrate=self.baud, timeout=0.2)
        try:
            self.serial.dtr = False
            self.serial.rts = False
        except Exception:
            pass
        self.thread = threading.Thread(target=self._read_loop, name=f"read-{self.label}", daemon=True)
        self.thread.start()

    def close(self) -> None:
        self.stop_event.set()
        if self.thread is not None:
            self.thread.join(timeout=1.0)
        if self.serial is not None and self.serial.is_open:
            self.serial.close()

    def send_json(self, payload: dict[str, Any]) -> None:
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

    def _read_loop(self) -> None:
        assert self.serial is not None
        buffer = b""
        while not self.stop_event.is_set():
            try:
                data = self.serial.read(1024)
            except Exception as exc:
                self.events.put({
                    "kind": "error",
                    "source": self.label,
                    "port": self.port,
                    "raw": f"read_error: {exc}",
                    "timestamp": utc_now_iso(),
                })
                break
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


def print_event(index: int, event: dict[str, Any]) -> None:
    direction = "<<" if event["kind"] == "rx" else ">>"
    if event["kind"] == "error":
        direction = "!!"
    print(f"{event['timestamp']} #{index:06d} {event['source']} {direction} {event['raw']}")


def write_event(log_file: Any, index: int, event: dict[str, Any]) -> None:
    if log_file is None:
        return
    record = dict(event)
    record["lineIndex"] = index
    log_file.write(json.dumps(record, separators=(",", ":")) + "\n")
    log_file.flush()


def interactive_loop(peers: dict[str, SerialPeer], command_counter: list[int]) -> None:
    print("Interactive commands: gc status | bridge bind | both status | gc rebind 7 | bridge profile 0 persist | bridge join-profile 46 | quit")
    while True:
        try:
            line = input("dbg> ").strip()
        except EOFError:
            return
        if not line:
            continue
        if line.lower() in {"q", "quit", "exit"}:
            return
        parts = line.split()
        if len(parts) < 2:
            print("Use: <gc|bridge|both> <command> [args...]")
            continue
        target, name, args = parts[0].lower(), parts[1], parts[2:]
        if target not in {"gc", "bridge", "both"}:
            print("Target must be gc, bridge, or both")
            continue
        try:
            send_canned(peers, target, name, args, command_counter)
        except Exception as exc:
            print(f"send failed: {exc}", file=sys.stderr)


def send_canned(
    peers: dict[str, SerialPeer],
    target: str,
    name: str,
    args: list[str],
    command_counter: list[int],
) -> None:
    labels = ["gc", "bridge"] if target == "both" else [target]
    for label in labels:
        peer = peers.get(label)
        if peer is None:
            raise RuntimeError(f"{label} port was not opened")
        command_counter[0] += 1
        command_id = f"dbg-{label}-{command_counter[0]:04d}"
        peer.send_json(build_command(name, args, command_id))


def main() -> int:
    parser = argparse.ArgumentParser(description="GC/bridge dual serial debugger")
    parser.add_argument("--gc", help="GC serial port, for example COM18")
    parser.add_argument("--bridge", help="Bridge serial port, for example COM4")
    parser.add_argument("--baud", type=int, default=921600)
    parser.add_argument("--duration", type=float, default=30.0, help="Capture duration in seconds")
    parser.add_argument("--log", default="", help="Output JSONL log path")
    parser.add_argument("--send", action="append", default=[], help="Send target:command, e.g. gc:status or bridge:rebind:7")
    parser.add_argument("--interactive", action="store_true")
    args = parser.parse_args()

    if not args.gc and not args.bridge:
        parser.error("open at least one of --gc or --bridge")

    events: queue.Queue[dict[str, Any]] = queue.Queue()
    peers: dict[str, SerialPeer] = {}
    if args.gc:
        peers["gc"] = SerialPeer("gc", args.gc, args.baud, events)
    if args.bridge:
        peers["bridge"] = SerialPeer("bridge", args.bridge, args.baud, events)

    log_path = Path(args.log) if args.log else None
    log_file = None
    if log_path is not None:
        log_path.parent.mkdir(parents=True, exist_ok=True)
        log_file = log_path.open("a", encoding="utf-8", newline="\n")

    command_counter = [0]
    stop_at = time.time() + max(args.duration, 0)
    interactive_thread: threading.Thread | None = None
    try:
        for peer in peers.values():
            peer.open()
            events.put({
                "kind": "info",
                "source": peer.label,
                "port": peer.port,
                "raw": f"opened {peer.port} at {peer.baud}",
                "timestamp": utc_now_iso(),
            })

        for spec in args.send:
            target, name, command_args = parse_send_spec(spec)
            send_canned(peers, target, name, command_args, command_counter)

        if args.interactive:
            interactive_thread = threading.Thread(target=interactive_loop, args=(peers, command_counter), daemon=True)
            interactive_thread.start()

        line_index = 0
        while time.time() < stop_at or args.interactive:
            if args.interactive and interactive_thread is not None and not interactive_thread.is_alive():
                break
            try:
                event = events.get(timeout=0.2)
            except queue.Empty:
                continue
            line_index += 1
            print_event(line_index, event)
            write_event(log_file, line_index, event)
    finally:
        for peer in peers.values():
            peer.close()
        if log_file is not None:
            log_file.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
