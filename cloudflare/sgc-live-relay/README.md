# SGC Cloudflare Live Relay

This Worker serves two roles under the same Cloudflare route:

- Proxy `https://www.flying-agents.com/swarm_ground_control/` to GitHub Pages.
- Relay live SGC messages over `wss://www.flying-agents.com/swarm_ground_control/live/ws`.

The live relay uses a Durable Object. One browser connects as `publisher` from the field laptop, and remote browsers connect as `viewer`.

The current deployment uses one public session named `public`. Viewers do not need a token, and the operator UI auto-switches between viewer and publisher based on whether USB Serial is connected.

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
