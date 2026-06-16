# SGC Cloudflare Live Relay

This Worker serves two roles under the same Cloudflare route:

- Proxy `https://www.flying-agents.com/swarm_ground_control/` to GitHub Pages.
- Relay live SGC scene snapshots over `wss://www.flying-agents.com/swarm_ground_control/live/ws`.

The live relay uses a Durable Object. One browser connects as `publisher` from the field laptop, and remote browsers connect as `viewer`.

The current deployment uses one public session named `public`. Viewers do not need a token, and the operator UI auto-switches between viewer and publisher based on whether USB Serial is connected.

The relay intentionally mirrors only the scene instances that viewers need:

- `drones_state`: full drone snapshot from the publisher SGC, including publisher source metadata. Serial telemetry arrivals drive the cadence with an 80 ms minimum send interval; a 250 ms timer remains as a heartbeat/backup.
- `homes_state`: full HOME snapshot from the publisher SGC, sent every 5 seconds and immediately after HOME changes.

The Worker caches the latest drone and HOME snapshots and sends them immediately to late-joining viewers. It rejects old firmware/diagnostic relay messages such as `drone_telemetry`, `gc_status`, `channel_table`, and scan/search events.

Endpoint viewers use `drones_state.publisherSource` plus optional bridge fields such as `publisherBridgeTransport`, `publisherBridgeAgeMs`, `publisherBridgeRssi`, and `publisherBridgeSnr` to show whether the publisher computer is connected directly to GC USB or through an ESP-NOW/LoRa bridge.

Publisher connections that do not publish any scene state within 5 seconds, or stop publishing for 10 seconds, are treated as stale and evicted so the real GC browser can reconnect.

## Debugging Update Rate

The status endpoint exposes relay timing counters:

```text
https://www.flying-agents.com/swarm_ground_control/live/status?sessionId=public
```

Use these fields to split endpoint lag by segment:

- `lastDronesStateRateHz` / `lastDronesStateIntervalMs`: rate arriving at Cloudflare from the publisher.
- `lastPublisherToWorkerMs`: publisher browser to Cloudflare Worker delay.
- `lastDronesStateMaxDroneAgeMs`: oldest drone packet age already inside the publisher snapshot.
- `lastDronesStateAgeMs`: time since the Worker last received a drone snapshot.
- `lastBroadcastViewerCount`: number of viewers that the latest snapshot was broadcast to.

The SGC Relay row shows the visible last drone snapshot age in endpoint mode. Its tooltip also shows publisher rate, viewer receive rate, publisher-to-Cloudflare delay, Cloudflare-to-viewer delay, end-to-end delay, and duplicate/applied drone counts.

## Deploy

```powershell
cd C:\Users\tamipinhasi\Documents\repos\swarm_ground_control\cloudflare\sgc-live-relay
npx wrangler deploy
```

## Manual Smoke Test

Publisher URL:

```text
wss://www.flying-agents.com/swarm_ground_control/live/ws?role=publisher&sessionId=public
```

Viewer URL:

```text
wss://www.flying-agents.com/swarm_ground_control/live/ws?role=viewer&sessionId=public
```

Only one publisher may connect at a time. Viewers are read-only.
