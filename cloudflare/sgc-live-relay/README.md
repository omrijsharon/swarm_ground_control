# SGC Cloudflare Live Relay

This Worker serves two roles under the same Cloudflare route:

- Proxy `https://www.flying-agents.com/swarm_ground_control/` to GitHub Pages.
- Relay live SGC messages over `wss://www.flying-agents.com/swarm_ground_control/live/ws`.

The live relay uses a Durable Object. One browser connects as `publisher` from the field laptop, and remote browsers connect as `viewer`.

## Deploy

```powershell
cd C:\Users\tamipinhasi\Documents\repos\swarm_ground_control\cloudflare\sgc-live-relay
npx wrangler secret put PUBLISH_TOKEN
npx wrangler deploy
```

Use the same publish token in SGC when selecting `USB + Broadcast`.

## Manual Smoke Test

Publisher URL:

```text
wss://www.flying-agents.com/swarm_ground_control/live/ws?role=publisher&sessionId=field-test-001
```

Viewer URL:

```text
wss://www.flying-agents.com/swarm_ground_control/live/ws?role=viewer&sessionId=field-test-001
```

Only the publisher may send `sgc_message` envelopes. Viewers are read-only.
