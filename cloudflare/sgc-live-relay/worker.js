const APP_PREFIX = "/swarm_ground_control";
const GITHUB_PAGES_ORIGIN = "https://omrijsharon.github.io";
const MAX_RELAY_MESSAGE_BYTES = 64 * 1024;
const ALLOWED_SGC_MESSAGE_TYPES = new Set([
  "drone_telemetry",
  "gc_status",
  "channel_table",
  "assignments",
  "assignment_event",
  "search_event",
  "scanner_event",
  "drone_link_status",
  "channel_scan_event",
  "session_event",
  "command_ack",
  "warning",
  "error",
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

function isLiveRelayPath(pathname) {
  return pathname === `${APP_PREFIX}/live/ws` || pathname === `${APP_PREFIX}/live/status`;
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
  const response = new Response(upstreamResponse.body, upstreamResponse);
  response.headers.set("x-sgc-proxy", "cloudflare-worker");
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
    return {
      sessionId: normalizeSessionId(url.searchParams.get("sessionId")),
      publisherConnected: Boolean(this.publisher),
      viewerCount: this.viewers.size,
      lastMessageAt: this.lastMessageAt,
      publishTokenConfigured: Boolean(normalizeSecret(this.env.PUBLISH_TOKEN)),
    };
  }

  acceptPublisher(request, url) {
    const token = normalizeSecret(url.searchParams.get("token") || request.headers.get("x-publish-token") || "");
    const expectedToken = normalizeSecret(this.env.PUBLISH_TOKEN);
    if (!expectedToken || token !== expectedToken) {
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

    server.addEventListener("message", (event) => this.handlePublisherMessage(server, event.data));
    server.addEventListener("close", () => this.removePublisher(server));
    server.addEventListener("error", () => this.removePublisher(server));
    this.safeSend(server, {
      kind: "relay_status",
      state: "connected",
      role: "publisher",
      publisherConnected: true,
      viewerCount: this.viewers.size,
    });
    this.broadcastStatus();
    return new Response(null, { status: 101, webSocket: client });
  }

  acceptViewer(url) {
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

    this.safeSend(server, {
      kind: "relay_status",
      state: "connected",
      role: "viewer",
      sessionId: normalizeSessionId(url.searchParams.get("sessionId")),
      publisherConnected: Boolean(this.publisher),
      viewerCount: this.viewers.size,
    });
    if (!this.publisher) {
      this.safeSend(server, {
        kind: "relay_error",
        code: "publisher_required",
        message: "No publisher is connected.",
      });
    }
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

    this.lastMessageAt = Date.now();
    this.broadcastToViewers({
      kind: "sgc_message",
      message,
      receivedAt: this.lastMessageAt,
    });
  }

  broadcastToViewers(payload) {
    for (const [connectionId, viewer] of this.viewers) {
      if (!this.safeSend(viewer.socket, payload)) {
        this.viewers.delete(connectionId);
      }
    }
  }

  broadcastStatus() {
    const payload = {
      kind: "relay_status",
      state: "connected",
      publisherConnected: Boolean(this.publisher),
      viewerCount: this.viewers.size,
      lastMessageAt: this.lastMessageAt,
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

  safeSend(socket, payload) {
    try {
      socket.send(JSON.stringify(payload));
      return true;
    } catch {
      return false;
    }
  }
}
