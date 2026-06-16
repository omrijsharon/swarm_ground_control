const APP_PREFIX = "/swarm_ground_control";
const GITHUB_PAGES_ORIGIN = "https://omrijsharon.github.io";
const APP_ASSET_VERSION = "live-scene-relay-5";
const MAX_RELAY_MESSAGE_BYTES = 64 * 1024;
const PUBLISHER_STARTUP_GRACE_MS = 5000;
const PUBLISHER_IDLE_TIMEOUT_MS = 10000;
const ALLOWED_SGC_MESSAGE_TYPES = new Set([
  "drones_state",
  "homes_state",
]);

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
    },
  });
}

function normalizeSessionId(value) {
  const clean = String(value || "default").trim().replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80);
  return clean || "default";
}

function normalizeSecret(value) {
  return String(value || "").trim();
}

function isPublicPublishEnabled(env) {
  return String(env.PUBLIC_PUBLISH || "").trim().toLowerCase() === "true";
}

function isLiveRelayPath(pathname) {
  return pathname === `${APP_PREFIX}/live/ws` || pathname === `${APP_PREFIX}/live/status`;
}

function isHtmlPath(pathname) {
  return pathname === "/" || pathname.endsWith("/");
}

function rewriteAppHtml(html) {
  return String(html || "")
    .replace(/\.\/style\.css\?v=[^"']+/g, `./style.css?v=${APP_ASSET_VERSION}`)
    .replace(/\.\/script\.js\?v=[^"']+/g, `./script.js?v=${APP_ASSET_VERSION}`);
}

async function proxyGithubPages(request) {
  const url = new URL(request.url);
  if (url.pathname === APP_PREFIX) {
    url.pathname = `${APP_PREFIX}/`;
    return Response.redirect(url.toString(), 308);
  }

  if (!url.pathname.startsWith(`${APP_PREFIX}/`)) {
    return new Response("Not found", { status: 404 });
  }

  const upstreamPath = url.pathname.slice(APP_PREFIX.length) || "/";
  const upstreamUrl = new URL(`${GITHUB_PAGES_ORIGIN}${APP_PREFIX}${upstreamPath}`);
  upstreamUrl.search = url.search;
  const upstreamHeaders = new Headers(request.headers);
  upstreamHeaders.delete("host");

  const upstreamRequest = new Request(upstreamUrl.toString(), {
    method: request.method,
    headers: upstreamHeaders,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
    redirect: "follow",
  });

  const upstreamResponse = await fetch(upstreamRequest);
  if (isHtmlPath(upstreamPath)) {
    const headers = new Headers(upstreamResponse.headers);
    headers.set("content-type", "text/html; charset=utf-8");
    headers.set("cache-control", "no-store");
    headers.set("x-sgc-proxy", "cloudflare-worker");
    return new Response(rewriteAppHtml(await upstreamResponse.text()), {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers,
    });
  }

  const response = new Response(upstreamResponse.body, upstreamResponse);
  response.headers.set("x-sgc-proxy", "cloudflare-worker");
  if (/\.(?:js|css)$/i.test(upstreamPath)) {
    response.headers.set("cache-control", "no-cache");
  }
  return response;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (isLiveRelayPath(url.pathname)) {
      if (!env.LIVE_RELAY) {
        return jsonResponse({ error: "LIVE_RELAY Durable Object binding is missing" }, 500);
      }
      const sessionId = normalizeSessionId(url.searchParams.get("sessionId"));
      const id = env.LIVE_RELAY.idFromName(sessionId);
      return env.LIVE_RELAY.get(id).fetch(request);
    }

    return proxyGithubPages(request);
  },
};

export class LiveRelaySession {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.publisher = null;
    this.viewers = new Map();
    this.nextConnectionId = 1;
    this.lastMessageAt = null;
    this.latestDronesState = null;
    this.latestHomesState = null;
    this.lastDronesStateAt = null;
    this.lastHomesStateAt = null;
    this.totalMessageCount = 0;
    this.dronesStateCount = 0;
    this.homesStateCount = 0;
    this.lastDronesStateIntervalMs = null;
    this.lastPublisherToWorkerMs = null;
    this.lastDronesStateSentAt = null;
    this.lastDronesStateDroneCount = 0;
    this.lastDronesStateMinDroneAgeMs = null;
    this.lastDronesStateMaxDroneAgeMs = null;
    this.lastBroadcastViewerCount = 0;
  }

  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname.endsWith("/live/status")) {
      return jsonResponse(this.statusPayload(url));
    }

    if (request.headers.get("upgrade")?.toLowerCase() !== "websocket") {
      return new Response("Expected WebSocket upgrade", { status: 426 });
    }

    const role = url.searchParams.get("role") || "viewer";
    if (role === "publisher") return this.acceptPublisher(request, url);
    if (role === "viewer") return this.acceptViewer(url);
    return new Response("Invalid role", { status: 400 });
  }

  statusPayload(url) {
    const now = Date.now();
    this.cleanupStalePublisher(now);
    return {
      sessionId: normalizeSessionId(url.searchParams.get("sessionId")),
      publisherConnected: Boolean(this.publisher),
      viewerCount: this.viewers.size,
      lastMessageAt: this.lastMessageAt,
      lastDronesStateAt: this.lastDronesStateAt,
      lastHomesStateAt: this.lastHomesStateAt,
      lastMessageAgeMs: this.lastMessageAt ? Math.max(0, now - this.lastMessageAt) : null,
      lastDronesStateAgeMs: this.lastDronesStateAt ? Math.max(0, now - this.lastDronesStateAt) : null,
      lastHomesStateAgeMs: this.lastHomesStateAt ? Math.max(0, now - this.lastHomesStateAt) : null,
      publisherConnectedAt: this.publisher?.connectedAt || null,
      publisherIdleMs: this.publisher ? this.publisherIdleMs(now) : null,
      publisherHasPublished: Boolean(this.lastMessageAt),
      totalMessageCount: this.totalMessageCount,
      dronesStateCount: this.dronesStateCount,
      homesStateCount: this.homesStateCount,
      lastDronesStateIntervalMs: this.lastDronesStateIntervalMs,
      lastDronesStateRateHz: this.lastDronesStateIntervalMs > 0 ? 1000 / this.lastDronesStateIntervalMs : null,
      lastDronesStateSentAt: this.lastDronesStateSentAt,
      lastPublisherToWorkerMs: this.lastPublisherToWorkerMs,
      lastDronesStateDroneCount: this.lastDronesStateDroneCount,
      lastDronesStateMinDroneAgeMs: this.lastDronesStateMinDroneAgeMs,
      lastDronesStateMaxDroneAgeMs: this.lastDronesStateMaxDroneAgeMs,
      lastBroadcastViewerCount: this.lastBroadcastViewerCount,
      publicPublish: isPublicPublishEnabled(this.env),
      publishTokenConfigured: Boolean(normalizeSecret(this.env.PUBLISH_TOKEN)),
    };
  }

  acceptPublisher(request, url) {
    this.cleanupStalePublisher(Date.now());
    const token = normalizeSecret(url.searchParams.get("token") || request.headers.get("x-publish-token") || "");
    const expectedToken = normalizeSecret(this.env.PUBLISH_TOKEN);
    if (!isPublicPublishEnabled(this.env) && (!expectedToken || token !== expectedToken)) {
      return new Response("Unauthorized publisher", { status: 401 });
    }
    if (this.publisher) {
      return new Response("Publisher already connected", { status: 409 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    const connectionId = this.nextConnectionId++;
    server.accept();
    this.publisher = { id: connectionId, socket: server, connectedAt: Date.now() };
    this.lastMessageAt = null;
    this.latestDronesState = null;
    this.latestHomesState = null;
    this.lastDronesStateAt = null;
    this.lastHomesStateAt = null;
    this.totalMessageCount = 0;
    this.dronesStateCount = 0;
    this.homesStateCount = 0;
    this.lastDronesStateIntervalMs = null;
    this.lastPublisherToWorkerMs = null;
    this.lastDronesStateSentAt = null;
    this.lastDronesStateDroneCount = 0;
    this.lastDronesStateMinDroneAgeMs = null;
    this.lastDronesStateMaxDroneAgeMs = null;
    this.lastBroadcastViewerCount = 0;

    server.addEventListener("message", (event) => this.handlePublisherMessage(server, event.data));
    server.addEventListener("close", () => this.removePublisher(server));
    server.addEventListener("error", () => this.removePublisher(server));
    const now = Date.now();
    this.safeSend(server, {
      kind: "relay_status",
      state: "connected",
      role: "publisher",
      publisherConnected: true,
      viewerCount: this.viewers.size,
      lastMessageAt: this.lastMessageAt,
      lastDronesStateAt: this.lastDronesStateAt,
      lastHomesStateAt: this.lastHomesStateAt,
      totalMessageCount: this.totalMessageCount,
      dronesStateCount: this.dronesStateCount,
      homesStateCount: this.homesStateCount,
      lastDronesStateIntervalMs: this.lastDronesStateIntervalMs,
      lastDronesStateAgeMs: this.lastDronesStateAt ? Math.max(0, now - this.lastDronesStateAt) : null,
      lastPublisherToWorkerMs: this.lastPublisherToWorkerMs,
    });
    this.broadcastStatus();
    return new Response(null, { status: 101, webSocket: client });
  }

  acceptViewer(url) {
    this.cleanupStalePublisher(Date.now());
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    const connectionId = this.nextConnectionId++;
    server.accept();
    this.viewers.set(connectionId, { socket: server, connectedAt: Date.now() });

    server.addEventListener("close", () => this.removeViewer(connectionId));
    server.addEventListener("error", () => this.removeViewer(connectionId));
    server.addEventListener("message", () => {
      this.safeSend(server, {
        kind: "relay_error",
        code: "viewer_read_only",
        message: "Viewer connections are read-only.",
      });
    });

    const now = Date.now();
    this.safeSend(server, {
      kind: "relay_status",
      state: "connected",
      role: "viewer",
      sessionId: normalizeSessionId(url.searchParams.get("sessionId")),
      publisherConnected: Boolean(this.publisher),
      viewerCount: this.viewers.size,
      lastMessageAt: this.lastMessageAt,
      lastDronesStateAt: this.lastDronesStateAt,
      lastHomesStateAt: this.lastHomesStateAt,
      publisherConnectedAt: this.publisher?.connectedAt || null,
      publisherIdleMs: this.publisher ? this.publisherIdleMs() : null,
      publisherHasPublished: Boolean(this.lastMessageAt),
      totalMessageCount: this.totalMessageCount,
      dronesStateCount: this.dronesStateCount,
      homesStateCount: this.homesStateCount,
      lastDronesStateIntervalMs: this.lastDronesStateIntervalMs,
      lastDronesStateAgeMs: this.lastDronesStateAt ? Math.max(0, now - this.lastDronesStateAt) : null,
      lastPublisherToWorkerMs: this.lastPublisherToWorkerMs,
    });
    if (!this.publisher) {
      this.safeSend(server, {
        kind: "relay_error",
        code: "publisher_required",
        message: "No publisher is connected.",
      });
    }
    this.sendCachedSceneState(server);
    this.broadcastStatus();
    return new Response(null, { status: 101, webSocket: client });
  }

  handlePublisherMessage(socket, rawData) {
    if (!this.publisher || this.publisher.socket !== socket) return;
    const rawText = typeof rawData === "string" ? rawData : "";
    if (!rawText || rawText.length > MAX_RELAY_MESSAGE_BYTES) {
      this.safeSend(socket, {
        kind: "relay_error",
        code: "message_rejected",
        message: "Relay message is empty or too large.",
      });
      return;
    }

    let envelope;
    try {
      envelope = JSON.parse(rawText);
    } catch {
      this.safeSend(socket, {
        kind: "relay_error",
        code: "invalid_json",
        message: "Publisher message must be JSON.",
      });
      return;
    }

    const message = envelope?.message;
    if (envelope?.kind !== "sgc_message" || !message || typeof message !== "object") {
      this.safeSend(socket, {
        kind: "relay_error",
        code: "invalid_envelope",
        message: "Expected kind=sgc_message with a message object.",
      });
      return;
    }

    if (!ALLOWED_SGC_MESSAGE_TYPES.has(message.type)) {
      this.safeSend(socket, {
        kind: "relay_error",
        code: "message_type_rejected",
        message: "This SGC message type is not relayable.",
      });
      return;
    }

    const now = Date.now();
    this.lastMessageAt = now;
    this.totalMessageCount++;
    if (message.type === "drones_state") {
      this.dronesStateCount++;
      this.lastDronesStateIntervalMs = this.lastDronesStateAt ? Math.max(0, now - this.lastDronesStateAt) : null;
      this.latestDronesState = message;
      this.lastDronesStateAt = now;
      this.lastDronesStateSentAt = Number.isFinite(Number(message.sentAt)) ? Number(message.sentAt) : null;
      this.lastPublisherToWorkerMs =
        this.lastDronesStateSentAt !== null ? Math.max(0, now - this.lastDronesStateSentAt) : null;
      const drones = Array.isArray(message.drones) ? message.drones : [];
      const ages = drones
        .map((drone) => Number(drone?.ageMs))
        .filter((ageMs) => Number.isFinite(ageMs));
      this.lastDronesStateDroneCount = drones.length;
      this.lastDronesStateMinDroneAgeMs = ages.length ? Math.min(...ages) : null;
      this.lastDronesStateMaxDroneAgeMs = ages.length ? Math.max(...ages) : null;
    } else if (message.type === "homes_state") {
      this.homesStateCount++;
      this.latestHomesState = message;
      this.lastHomesStateAt = now;
    }
    this.lastBroadcastViewerCount = this.viewers.size;
    this.broadcastToViewers({
      kind: "sgc_message",
      message,
      receivedAt: now,
      publisherToWorkerMs: this.lastPublisherToWorkerMs,
      workerDronesStateIntervalMs: this.lastDronesStateIntervalMs,
      workerMessageCount: this.totalMessageCount,
      workerDronesStateCount: this.dronesStateCount,
    });
  }

  sendCachedSceneState(socket) {
    if (this.latestHomesState) {
      this.safeSend(socket, {
        kind: "sgc_message",
        message: this.latestHomesState,
        receivedAt: this.lastHomesStateAt,
        workerMessageCount: this.totalMessageCount,
        workerDronesStateCount: this.dronesStateCount,
      });
    }
    if (this.latestDronesState) {
      this.safeSend(socket, {
        kind: "sgc_message",
        message: this.dronesStateForReplay(),
        receivedAt: this.lastDronesStateAt,
        publisherToWorkerMs: this.lastPublisherToWorkerMs,
        workerDronesStateIntervalMs: this.lastDronesStateIntervalMs,
        workerMessageCount: this.totalMessageCount,
        workerDronesStateCount: this.dronesStateCount,
      });
    }
  }

  dronesStateForReplay() {
    if (!this.latestDronesState || !this.lastDronesStateAt) return this.latestDronesState;
    const cachedForMs = Math.max(0, Date.now() - this.lastDronesStateAt);
    return {
      ...this.latestDronesState,
      drones: Array.isArray(this.latestDronesState.drones)
        ? this.latestDronesState.drones.map((drone) => {
            const ageMs = Number(drone?.ageMs);
            if (!Number.isFinite(ageMs)) return drone;
            return { ...drone, ageMs: Math.max(0, Math.round(ageMs + cachedForMs)) };
          })
        : [],
    };
  }

  broadcastToViewers(payload) {
    for (const [connectionId, viewer] of this.viewers) {
      if (!this.safeSend(viewer.socket, payload)) {
        this.viewers.delete(connectionId);
      }
    }
  }

  broadcastStatus() {
    const now = Date.now();
    const payload = {
      kind: "relay_status",
      state: "connected",
      publisherConnected: Boolean(this.publisher),
      viewerCount: this.viewers.size,
      lastMessageAt: this.lastMessageAt,
      lastDronesStateAt: this.lastDronesStateAt,
      lastHomesStateAt: this.lastHomesStateAt,
      publisherConnectedAt: this.publisher?.connectedAt || null,
      publisherIdleMs: this.publisher ? this.publisherIdleMs(now) : null,
      publisherHasPublished: Boolean(this.lastMessageAt),
      totalMessageCount: this.totalMessageCount,
      dronesStateCount: this.dronesStateCount,
      homesStateCount: this.homesStateCount,
      lastDronesStateIntervalMs: this.lastDronesStateIntervalMs,
      lastDronesStateRateHz: this.lastDronesStateIntervalMs > 0 ? 1000 / this.lastDronesStateIntervalMs : null,
      lastDronesStateAgeMs: this.lastDronesStateAt ? Math.max(0, now - this.lastDronesStateAt) : null,
      lastPublisherToWorkerMs: this.lastPublisherToWorkerMs,
      lastDronesStateDroneCount: this.lastDronesStateDroneCount,
      lastDronesStateMinDroneAgeMs: this.lastDronesStateMinDroneAgeMs,
      lastDronesStateMaxDroneAgeMs: this.lastDronesStateMaxDroneAgeMs,
      lastBroadcastViewerCount: this.lastBroadcastViewerCount,
    };
    if (this.publisher) this.safeSend(this.publisher.socket, { ...payload, role: "publisher" });
    for (const [connectionId, viewer] of this.viewers) {
      if (!this.safeSend(viewer.socket, { ...payload, role: "viewer" })) {
        this.viewers.delete(connectionId);
      }
    }
  }

  removePublisher(socket) {
    if (this.publisher?.socket === socket) {
      this.publisher = null;
      this.broadcastStatus();
    }
  }

  removeViewer(connectionId) {
    if (this.viewers.delete(connectionId)) {
      this.broadcastStatus();
    }
  }

  publisherIdleMs(now = Date.now()) {
    if (!this.publisher) return null;
    const activityAt = this.lastMessageAt || this.publisher.connectedAt;
    return Math.max(0, now - activityAt);
  }

  publisherIsStale(now = Date.now()) {
    if (!this.publisher) return false;
    if (!this.lastMessageAt) {
      return now - this.publisher.connectedAt > PUBLISHER_STARTUP_GRACE_MS;
    }
    return now - this.lastMessageAt > PUBLISHER_IDLE_TIMEOUT_MS;
  }

  cleanupStalePublisher(now = Date.now()) {
    if (!this.publisherIsStale(now)) return false;
    const staleSocket = this.publisher.socket;
    this.publisher = null;
    try {
      staleSocket.close(4000, "publisher idle");
    } catch {
      // The connection is already gone or cannot be closed; clearing state is enough.
    }
    this.broadcastStatus();
    return true;
  }

  safeSend(socket, payload) {
    try {
      socket.send(JSON.stringify(payload));
      return true;
    } catch {
      return false;
    }
  }
}
