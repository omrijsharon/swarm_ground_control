# Part 9: Cloudflare Live Relay Plan

Goal: let one operator SGC browser read the GC ESP32 over USB Serial and automatically broadcast the same parsed live-position JSON stream to remote SGC browsers.

The static app remains available at:

```text
https://www.flying-agents.com/swarm_ground_control/
```

The live relay endpoint is:

```text
wss://www.flying-agents.com/swarm_ground_control/live/ws
```

## Milestone 1: Worker Relay

- [x] Add a Cloudflare Worker implementation that keeps the existing GitHub Pages proxy path.
- [x] Add `/swarm_ground_control/live/ws` as a WebSocket endpoint.
- [x] Add `/swarm_ground_control/live/status` as a basic JSON status endpoint.
- [x] Use a Durable Object to isolate each live `sessionId`.
- [x] Allow one `publisher` per session.
- [x] Allow multiple `viewer` connections per session.
- [x] Reject a second publisher for the same session.
- [x] Switch to one public session named `public`.
- [x] Allow public publisher connection for the single-session field setup.
- [x] Keep only one active publisher so a second broadcaster cannot replace an active operator session.
- [x] Reject viewer-originated WebSocket messages as read-only.
- [x] Relay only display-oriented SGC JSON message types.
- [x] Deploy the Worker with the Durable Object binding and route.
- [x] Verify `/swarm_ground_control/` still serves the GitHub Pages app through the Worker.
- [x] Verify `/swarm_ground_control/live/ws` accepts WebSocket upgrades.

## Milestone 2: SGC Source Modes

- [x] Add automatic source mode.
- [x] Start as a public live endpoint viewer when USB serial is not connected.
- [x] Switch to public broadcaster when USB serial connects.
- [x] Switch back to viewer if USB serial disconnects.
- [x] Remove visible endpoint, session ID, source mode, and publish token controls from the normal operator path.
- [x] Store only the relay endpoint override in browser localStorage.
- [x] Do not store or ask for a publish token in the operator UI.
- [x] Connect to the relay as `viewer` when USB Serial is not connected.
- [x] Connect to the relay as `publisher` when USB Serial is connected.
- [x] Reconnect the relay automatically after unexpected socket close.
- [x] Show relay connection state in the live control panel.

## Milestone 3: Relay Data Flow

- [x] Publish parsed GC-to-SGC JSON after local serial handling.
- [x] Do not publish raw firmware log text.
- [x] Feed remote relay messages into `handleLiveProtocolMessage(message, "live-endpoint")`.
- [x] Stop mock telemetry when live endpoint telemetry arrives.
- [x] Display remote drone telemetry with the same map/card path as USB serial telemetry.
- [x] Keep command state local to the operator browser.
- [x] Disable operator commands while acting as a viewer.
- [x] Disable Reset, Search, Re-lock, Delete, Re-scan, and Profile Apply while acting as a viewer.
- [x] Verify a remote WebSocket viewer receives relayed `drone_telemetry` from a publisher smoke test.
- [ ] Verify a remote browser receives live drone telemetry from an operator browser.
- [ ] Verify relay disconnect/reconnect does not break USB serial reading.

## Milestone 4: Field Verification

- [ ] Operator laptop reads GC ESP32 over USB Serial.
- [ ] Operator opens the online SGC app and connects the GC ESP32 over USB Serial.
- [ ] Remote laptop/phone opens the same SGC app URL.
- [ ] Remote browser sees the same drones and status updates.
- [ ] Remote command controls are unavailable in viewer mode.
- [ ] If the publisher disconnects, viewers show stale/offline state without crashing.

## Deployment Notes

Deploy artifact:

```text
cloudflare/sgc-live-relay/
```

Suggested deploy commands:

```powershell
cd C:\Users\tamipinhasi\Documents\repos\swarm_ground_control\cloudflare\sgc-live-relay
npx wrangler deploy
```

## Out Of Scope

- [x] Do not use Cloudflare Tunnel for v1 live mirroring.
- [x] Do not let remote viewers control the GC in v1.
- [x] Do not add a backend server outside Cloudflare Worker/Durable Object.
- [x] Do not change the GC ESP32 firmware for this relay feature.
