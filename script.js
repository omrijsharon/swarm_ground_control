// Live-position branch: browser UI with Web Serial telemetry ingress and retained C2 prototype paths.

function cfg(key, fallback) {
  if (typeof CONFIG !== "undefined" && CONFIG && CONFIG[key] !== undefined) {
    return CONFIG[key];
  }
  return fallback;
}

const SETTINGS = {
  HISTORY_LIMIT: cfg("HISTORY_LIMIT", 900),
  BATTERY_RATE_WINDOW_SEC: cfg("BATTERY_RATE_WINDOW_SEC", 120),
  BATTERY_MIN_SAMPLES: cfg("BATTERY_MIN_SAMPLES", 4),
  LINK_STALE_THRESHOLD_SEC: cfg("LINK_STALE_THRESHOLD_SEC", 3),
  SELECTION_SHAPE_W_SCALE: cfg("SELECTION_SHAPE_W_SCALE", 1.4),
  SELECTION_SHAPE_H_SCALE: cfg("SELECTION_SHAPE_H_SCALE", 1.7),
  SELECTION_SHAPE_INDENT_SCALE: cfg("SELECTION_SHAPE_INDENT_SCALE", 0.45),
  SELECTION_GLOW_COLOR: cfg("SELECTION_GLOW_COLOR", "rgba(120, 220, 255, 1.0)"),
  SELECTION_GLOW_OUTER_BLUR: cfg("SELECTION_GLOW_OUTER_BLUR", 4.0),
  SELECTION_GLOW_MID_BLUR: cfg("SELECTION_GLOW_MID_BLUR", 3.0),
  SELECTION_GLOW_INNER_BLUR: cfg("SELECTION_GLOW_INNER_BLUR", 1.6),
  SELECTION_GLOW_OUTER_ALPHA: cfg("SELECTION_GLOW_OUTER_ALPHA", 0.9),
  SELECTION_GLOW_MID_ALPHA: cfg("SELECTION_GLOW_MID_ALPHA", 1.0),
  SELECTION_GLOW_INNER_ALPHA: cfg("SELECTION_GLOW_INNER_ALPHA", 1.0),
  SELECTION_OUTLINE_WIDTH_FACTOR: cfg("SELECTION_OUTLINE_WIDTH_FACTOR", 0.35),
  SELECTION_OUTLINE_ALPHA: cfg("SELECTION_OUTLINE_ALPHA", 0.95),
};

const APP_MODE = cfg("APP_MODE", "live-position");
const LIVE_POSITION_MODE = APP_MODE === "live-position";
const LIVE_POSITION_MOCK_DEFAULT = cfg("LIVE_POSITION_MOCK_DEFAULT", false);
const LIVE_POSITION_AUTO_CONNECT = cfg("LIVE_POSITION_AUTO_CONNECT", true);
const LIVE_FRESHNESS_MS = {
  fresh: 1000,
  late: 2000,
  stale: 5000,
};
const LIVE_FRESHNESS_SCALE = {
  fresh: 1.8,
  late: 3.0,
  stale: 6.0,
};
const LIVE_RELOCK_TIMEOUT_MS = 8000;
const LIVE_BINDING_TTL_MS = 60000;
const LIVE_BINDING_FAILED_TTL_MS = 15000;
const LIVE_BINDING_DEFAULT_PHASE_MS = 2000;
const LIVE_BINDING_ANIMATION_INTERVAL_MS = 20;
const LIVE_BINDING_COMPLETION_MS = 200;
const LIVE_BINDING_COMPLETION_HOLD_MS = 40;
const LIVE_BINDING_COMPLETION_START_PROGRESS = 0.9;
const LIVE_BINDING_TIMING_PROGRESS_END = 0.96;
const LIVE_BINDING_WAITING_PROGRESS_END = 0.99;
const LIVE_BINDING_WAITING_CRAWL_MS = 4000;
const LIVE_BINDING_TIMING_LOCK_PERIODS = 3;
const LIVE_BINDING_TIMING_LOCK_GUARD_MS = 250;
const LIVE_BINDING_TIMING_LOCK_MAX_MS = 6000;
const LIVE_BINDING_TIMING_REQUIRED_OBSERVATIONS = 2;
const LIVE_RECOVERY_STATE_TTL_MS = 30000;
const LIVE_BINDING_PHASE_ORDER = ["discovery", "quiet", "assign", "ack", "telemetry_bind", "timing"];
const LIVE_BINDING_PHASES = {
  discovery: { label: "Shared discovery", fallbackMs: 925, start: 0.00, end: 0.12 },
  quiet: { label: "Quieting shared channel", fallbackMs: 925, start: 0.00, end: 0.22 },
  assign: { label: "Assigning channel", fallbackMs: 1188, start: 0.22, end: 0.52 },
  ack: { label: "Waiting for ACK", fallbackMs: 1800, start: 0.52, end: 0.72 },
  telemetry_bind: { label: "Binding telemetry", fallbackMs: LIVE_BINDING_DEFAULT_PHASE_MS, start: 0.72, end: 0.84 },
  timing: { label: "Timing", fallbackMs: LIVE_BINDING_DEFAULT_PHASE_MS, start: 0.84, end: LIVE_BINDING_TIMING_PROGRESS_END },
};
const LIVE_LINK_RECOVERY_CONFIRM_PACKETS = 2;
const LIVE_LINK_RECOVERY_CONFIRM_MS = 2000;
const LIVE_SCAN_ANIMATION_HOLD_MS = 3000;
const LIVE_CAD_SUSPECT_TTL_MS = cfg("LIVE_CAD_SUSPECT_TTL_MS", 5000);
const LIVE_SERIAL_RECONNECT_INTERVAL_MS = 750;
const LOG_RING_CAPACITY = Math.max(1, Math.floor(Number(cfg("LOG_RING_CAPACITY", 1024)) || 1024));
const LIVE_DRONE_ALIAS_STORAGE_KEY = "sgc.livePosition.droneAliases.v1";
const LIVE_DRONE_ACTION_LONGPRESS_MS = 460;
const LIVE_RELAY_ENDPOINT_STORAGE_KEY = "sgc.livePosition.relayEndpoint.v1";
const LIVE_RELAY_PUBLIC_SESSION_ID = "public";
const LIVE_RELAY_RECONNECT_MS = 1500;
const LIVE_RELAY_DRONES_STATE_INTERVAL_MS = 250;
const LIVE_RELAY_DRONES_STATE_DATA_MIN_INTERVAL_MS = 80;
const LIVE_RELAY_HOMES_STATE_INTERVAL_MS = 5000;
const LIVE_FOLLOW_ANIMATION_DURATION_MS = 360;
const LIVE_DEBUG_STORAGE_KEY = "sgc.livePosition.debugEnabled.v1";
const LIVE_DRONE_WIFI_HOST_STORAGE_KEY = "sgc.livePosition.droneWifiHost.v1";
const LIVE_BINDING_STALL_GRACE_MS = 1000;
const LIVE_BINDING_STALL_REPEAT_MS = 3000;
const LIVE_FRESH_SESSION_RETRY_MAX = 5;
const LIVE_FRESH_SESSION_RETRY_DELAY_MS = 350;
const LIVE_RELAY_MESSAGE_TYPES = new Set([
  "drones_state",
  "homes_state",
]);

function getLiveDebugEnabledDefault() {
  try {
    const params = new URLSearchParams(window.location.search || "");
    if (params.get("debug") === "1" || params.get("liveDebug") === "1") return true;
    if (params.get("debug") === "0" || params.get("liveDebug") === "0") return false;
    return window.localStorage?.getItem(LIVE_DEBUG_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

class RingLog {
  constructor(capacity = LOG_RING_CAPACITY) {
    this.capacity = Math.max(1, Math.floor(Number(capacity) || LOG_RING_CAPACITY));
    this.entries = new Array(this.capacity);
    this.nextSequence = 0;
    this.size = 0;
  }

  push(entry) {
    const logSequence = this.nextSequence;
    const logSlot = logSequence % this.capacity;
    const loggedAt = Date.now();
    const stored = entry && typeof entry === "object" && !Array.isArray(entry)
      ? { ...entry }
      : { value: entry };
    const next = { ...stored, logSequence, logSlot, loggedAt };
    this.entries[logSlot] = next;
    this.nextSequence += 1;
    if (this.size < this.capacity) this.size += 1;
    return next;
  }

  toArray() {
    const start = this.nextSequence - this.size;
    const ordered = [];
    for (let i = 0; i < this.size; i += 1) {
      const entry = this.entries[(start + i) % this.capacity];
      if (entry) ordered.push(entry);
    }
    return ordered;
  }

  latest() {
    if (!this.size) return null;
    return this.entries[(this.nextSequence - 1) % this.capacity] || null;
  }

  clear() {
    this.entries = new Array(this.capacity);
    this.nextSequence = 0;
    this.size = 0;
  }

  get count() {
    return this.size;
  }

  get totalWritten() {
    return this.nextSequence;
  }
}

let map;
let overlay, ctx;
let drones = [];
let groundStations = [];
let waypoints = new Map(); // wpId -> { id, lat, lng, name? }
let nextWaypointId = 1;
let waypointTargets = new Map(); // droneId -> { wpId, speedKmh, altM }
let orbitTargets = new Map(); // droneId -> { anchor, radiusM, orbitPeriodMin, altitudeM, direction, orbitSpeedKmh?, approachSpeedKmh? }
let groundControl;

const COMMAND_OPTIONS = [
  "Arm",
  "Disarm",
  "Takeoff",
  "Land",
  "Goto WP",
  "Hold position",
  "Follow drone",
  "Search target",
  "Attack target",
  "Boid group",
];

let tooltipEl;
let hoveredDroneId = null;
let pinnedDroneId = null;
let lastPointer = null;
let tooltipMode = "info"; // "info" | "commands" | "assign-team"
let tooltipPinnedPos = null; // { left, top } when user drags the tooltip
let tooltipPinnedForKey = null;
let menuDragSuppressUntil = 0;
let waypointMenuEl = null;
let pendingWaypoint = null;
let waypointCloseSuppressUntil = 0;
let tooltipSuppressUntil = 0;
let waypointDroneId = null;
let waypointTeamId = null;
let waypointDrag = null; // { type: "pending"|"existing", droneId?, pointerId }
let activeWaypointId = null;
let waypointRelocate = null; // { wpId } while user is placing the WP on the map
let editWaypointMenuEl = null;
let pendingEditWaypoint = null; // { wpId }
let createWaypointMenuEl = null;
let pendingCreateWaypoint = null; // { lat, lng }
let liveMapMenuEl = null;
let pendingLiveMapPlacement = null; // { lat, lng }
let distanceMeasurements = [];
let pendingDistanceMeasurement = null; // { startLat, startLng, previewLat?, previewLng? }
let nextDistanceMeasurementId = 1;
let distanceMeasurementMenuEl = null;
let distanceMeasurementHelperEl = null;
let distanceMeasurementHitRegions = [];
let statusMemberMenuEl = null;
let pendingStatusMember = null;
let followMenuEl = null;
let pendingFollow = null;
let relationMenuEl = null;
let pendingRelation = null;
let orbitMenuEl = null;
let pendingOrbit = null;

const liveState = {
  port: null,
  reader: null,
  keepReading: false,
  lineBuffer: "",
  commandSeq: 0,
  pendingCommands: new Map(),
  baudRate: 921600,
  connected: false,
  portLabel: "None",
  lastMessageAt: null,
  lastJsonAt: null,
  parseErrors: new RingLog(),
  gcStatus: null,
  interGcStatus: null,
  usbDeviceRole: null,
  channelTable: null,
  channelScanEvents: new RingLog(),
  scanInProgress: false,
  scanAnimationVisible: false,
  scanAnimationHideTimer: null,
  scanRows: new Map(),
  scanCandidateCount: 0,
  scanProfileName: "",
  spectrumPanelOpen: false,
  spectrumRescanPending: false,
  spectrumRescanConfirming: false,
  spectrumStatus: "",
  lastScanCompletedAt: null,
  channelTableReceivedAt: null,
  lastCommandAck: null,
  sessionEvents: new RingLog(),
  freshSessionPending: false,
  freshSessionConfirming: false,
  freshSessionRetryCount: 0,
  freshSessionRetryTimer: null,
  searchPending: false,
  searchMode: false,
  profilePickerOpen: false,
  profileDraft: null,
  profileSimpleMode: true,
  profileApplyPending: false,
  assignmentEvents: new RingLog(),
  scannerEvents: new RingLog(),
  searchEvents: new RingLog(),
  orphanRecoveryEvents: new RingLog(),
  linkStatuses: new Map(),
  bindingStates: new Map(),
  recoveryStates: new Map(),
  bindingAnimationTimer: null,
  relockRequests: new Map(),
  deleteRequests: new Map(),
  assignmentTelemetryWatchdogs: new Map(),
  droneAliases: loadLiveDroneAliases(),
  droneActionSheet: null,
  followDroneId: null,
  followResumeAt: 0,
  followTargetLatLng: null,
  followFromLatLng: null,
  followAnimationStartedAt: 0,
  followAnimationDurationMs: LIVE_FOLLOW_ANIMATION_DURATION_MS,
  followAnimationFrame: 0,
  homePlacementActive: false,
  mockEnabled: LIVE_POSITION_MOCK_DEFAULT,
  mockActive: false,
  mockTimers: [],
  serialTelemetrySeen: false,
  lastSerialPort: null,
  lastSerialPortInfo: null,
  reconnectTimer: null,
  reconnecting: false,
  userClosedSerial: false,
  gcDiagnosticLog: new RingLog(),
  gcDiagnosticLineNumber: 0,
  gcDiagnosticStartedAt: Date.now(),
  debugEnabled: getLiveDebugEnabledDefault(),
  debugStateText: "Idle",
  droneDebugPort: null,
  droneDebugReader: null,
  droneDebugKeepReading: false,
  droneDebugLineBuffer: "",
  droneDebugConnected: false,
  droneDebugPortLabel: "None",
  droneDebugCommandSeq: 0,
  droneDebugPendingCommands: new Map(),
  droneDebugStatus: null,
  droneDebugTelemetryPaused: false,
  droneWifiHost: loadLiveStorageValue(LIVE_DRONE_WIFI_HOST_STORAGE_KEY, "simple-mesh-7.local"),
  droneWifiBusy: false,
  droneWifiStateText: "Idle",
  bindingStallRecords: new Map(),
  telemetrySourceMode: "auto",
  relayEndpoint: loadLiveStorageValue(LIVE_RELAY_ENDPOINT_STORAGE_KEY, getDefaultLiveRelayEndpoint()),
  relaySessionId: LIVE_RELAY_PUBLIC_SESSION_ID,
  relayPublishToken: "",
  relaySocket: null,
  relayConnected: false,
  relayState: "disconnected",
  relayRole: null,
  relayViewerCount: null,
  relayPublisherConnected: false,
  relayUserClosed: true,
  relayReconnectTimer: null,
  relayReconnectAttempts: 0,
  relayLastError: "",
  relayDronesStateTimer: null,
  relayHomesStateTimer: null,
  relayLastDronesStatePublishedAt: 0,
  relayDebug: {
    publisherSentCount: 0,
    publisherLastSentAt: null,
    publisherLastIntervalMs: null,
    publisherLastDronesStateSentAt: null,
    publisherLastDronesStateIntervalMs: null,
    publisherLastMessageType: "",
    publisherLastDronesCount: null,
    publisherLastDroneMaxAgeMs: null,
    viewerReceivedCount: 0,
    viewerDronesStateCount: 0,
    viewerLastReceivedAt: null,
    viewerLastDronesStateReceivedAt: null,
    viewerLastDronesStateIntervalMs: null,
    viewerPublisherToWorkerMs: null,
    viewerWorkerToViewerMs: null,
    viewerEndToEndMs: null,
    viewerWorkerDronesStateIntervalMs: null,
    viewerLastDronesStateWorkerAt: null,
    viewerLastDronesStatePublisherSentAt: null,
    viewerDronesCount: null,
    viewerDroneMaxAgeMs: null,
    viewerAppliedDroneCount: null,
    viewerDuplicateDroneCount: null,
    workerMessageCount: null,
    workerDronesStateCount: null,
    workerLastDronesStateAt: null,
    workerLastDronesStateAgeMs: null,
    workerPublisherIdleMs: null,
  },
  remoteDroneNames: new Map(),
  remotePublisherStatus: null,
};
let orbitCloseSuppressUntil = 0;

function loadLiveStorageValue(key, fallback = "") {
  try {
    const value = window.localStorage?.getItem(key);
    return value || fallback;
  } catch {
    return fallback;
  }
}

function saveLiveStorageValue(key, value) {
  try {
    if (value === null || value === undefined || value === "") {
      window.localStorage?.removeItem(key);
    } else {
      window.localStorage?.setItem(key, String(value));
    }
  } catch {
    // Storage is optional; the live relay should still work in private browsing.
  }
}

function makeDefaultLiveRelaySessionId() {
  return LIVE_RELAY_PUBLIC_SESSION_ID;
}

function getDefaultLiveRelayEndpoint() {
  const fallback = "wss://www.flying-agents.com/swarm_ground_control/live/ws";
  try {
    const origin = window.location?.origin || "";
    const protocol = window.location?.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location?.host || "";
    if (!origin || window.location?.protocol === "file:" || /^(localhost|127\.0\.0\.1|\[::1\])(?::|$)/.test(host)) {
      return fallback;
    }
    return `${protocol}//${host}/swarm_ground_control/live/ws`;
  } catch {
    return fallback;
  }
}

function normalizeLiveSourceMode(mode) {
  return ["auto", "usb", "live", "broadcast"].includes(mode) ? mode : "auto";
}

function isLiveRemoteViewerMode() {
  return liveState.telemetrySourceMode === "live" || (liveState.telemetrySourceMode === "auto" && !liveState.connected);
}

function isLiveBridgeMode() {
  return Boolean(liveState.gcStatus?.bridgeMode);
}

function normalizeLiveUsbDeviceRole(role) {
  const value = String(role || "").trim().toLowerCase();
  if (value === "magc" || value === "magic" || value === "magic_ground_control") return "magic_ground_control";
  if (value === "telegc" || value === "telemetry" || value === "telemetry_ground_control") return "telemetry_ground_control";
  if (value === "gc" || value === "ground_control" || value === "ground_station") return "ground_station";
  if (value === "bridge" || value === "lora_bridge" || value === "bridge_receiver") return "bridge_receiver";
  return value || "";
}

function labelLiveUsbDeviceRole(role) {
  const normalized = normalizeLiveUsbDeviceRole(role);
  if (normalized === "magic_ground_control") return "MaGC";
  if (normalized === "telemetry_ground_control") return "TeleGC";
  if (normalized === "ground_station") return "GC";
  if (normalized === "bridge_receiver") return "Bridge";
  return normalized ? normalized.replaceAll("_", " ") : "";
}

function rememberLiveUsbDeviceRole(role) {
  const normalized = normalizeLiveUsbDeviceRole(role);
  if (normalized) liveState.usbDeviceRole = normalized;
  return normalized;
}

function inferLiveUsbDeviceRole(status = liveState.gcStatus || {}) {
  const statusRole = normalizeLiveUsbDeviceRole(status.nodeRole || status.node_role);
  if (statusRole) return statusRole;
  return normalizeLiveUsbDeviceRole(liveState.usbDeviceRole);
}

function getLiveUsbRoleWarning(status = liveState.gcStatus || {}) {
  if (!liveState.connected || isLiveRemoteViewerMode()) return "";
  const role = inferLiveUsbDeviceRole(status);
  if (role === "magic_ground_control") {
    return "MaGC is connected by USB. Connect TeleGC to this computer for SGC.";
  }
  return "";
}

function formatLiveLocalSourceValue(status = liveState.gcStatus || {}) {
  if (isLiveBridgeMode()) return `${getLiveBridgeTransportLabel(status)} bridge`;
  if (!liveState.connected) return "USB disconnected";
  const role = inferLiveUsbDeviceRole(status);
  const label = labelLiveUsbDeviceRole(role);
  return label ? `${label} connected` : "USB connected";
}

function getLiveBridgeDownlinkAgeMs() {
  const age = Number(liveState.gcStatus?.backhaulLastPacketAgeMs);
  return Number.isFinite(age) ? age : Infinity;
}

function getLiveBridgeTransportLabel(status = liveState.gcStatus || {}) {
  const transport = String(status.bridgeTransport || "").toLowerCase();
  if (transport === "espnow") return "ESP-NOW";
  if (transport === "lora") return "LoRa";
  if (status.espnowBridgeLive === true) return "ESP-NOW";
  if (status.loraFallbackLive === true) return "LoRa";
  return "Bridge";
}

function getLiveBridgeSecondaryStatus(status = liveState.gcStatus || {}) {
  const transport = String(status.bridgeTransport || "").toLowerCase();
  if (transport === "espnow") {
    return status.loraFallbackLive === true ? "LoRa standby" : "";
  }
  if (transport === "lora") {
    if (status.espnowBridgeLive === true || status.espnowBeaconLive === true) return "ESP-NOW beacon";
    if (status.espnowProbing === true) return "ESP-NOW probing";
    return "ESP-NOW standby";
  }
  if (status.espnowProbing === true) return "ESP-NOW probing";
  return "";
}

function normalizeLiveBridgeTransport(value) {
  const transport = String(value || "").trim().toLowerCase();
  if (transport === "espnow" || transport === "esp-now") return "espnow";
  if (transport === "lora" || transport === "lo-ra") return "lora";
  return "";
}

function formatLiveBridgeTransportName(value) {
  const transport = normalizeLiveBridgeTransport(value);
  if (transport === "espnow") return "ESP-NOW";
  if (transport === "lora") return "LoRa";
  return "Bridge";
}

function buildLivePublisherSourceMetadata(now = Date.now()) {
  const status = liveState.gcStatus || {};
  const bridgeMode = status.bridgeMode === true;
  const bridgeTransport = bridgeMode
    ? normalizeLiveBridgeTransport(status.bridgeTransport) ||
      (status.espnowBridgeLive === true ? "espnow" : status.loraFallbackLive === true ? "lora" : "")
    : "";
  const bridgeAgeMs = Number(status.backhaulLastPacketAgeMs);
  return {
    publisherSource: bridgeMode ? "bridge" : liveState.connected ? "gc_usb" : "unknown",
    publisherSerialConnected: liveState.connected === true,
    publisherSentAt: now,
    publisherBridgeTransport: bridgeMode ? bridgeTransport || null : null,
    publisherBridgeControl: bridgeMode ? status.bridgeControl === true : null,
    publisherBridgeStale: bridgeMode ? status.bridgeStale === true : null,
    publisherBridgeAgeMs:
      bridgeMode && Number.isFinite(bridgeAgeMs) && bridgeAgeMs >= 0 && bridgeAgeMs < 0xFFFFFFFF
        ? Math.round(bridgeAgeMs)
        : null,
    publisherBridgeRssi: bridgeMode && Number.isFinite(Number(status.backhaulRssi)) ? Number(status.backhaulRssi) : null,
    publisherBridgeSnr: bridgeMode && Number.isFinite(Number(status.backhaulSnr)) ? Number(status.backhaulSnr) : null,
    publisherBridgeHandshake: bridgeMode ? String(status.bridgeHandshake || "") || null : null,
    publisherBridgeFallbackReason: bridgeMode ? String(status.bridgeFallbackReason || "") || null : null,
  };
}

function normalizeLivePublisherSourceMetadata(message, receivedAt = Date.now()) {
  if (!message || typeof message !== "object") return null;
  const source = String(message.publisherSource || "").trim().toLowerCase();
  const sceneSource = String(message.source || "").trim().toLowerCase();
  const bridgeTransport = normalizeLiveBridgeTransport(message.publisherBridgeTransport);
  const inferredBridgeTransport =
    bridgeTransport ||
    (sceneSource === "espnow_bridge" ? "espnow" : sceneSource === "lora_bridge" ? "lora" : "");
  const publisherSource =
    source === "bridge" || inferredBridgeTransport
      ? "bridge"
      : source === "gc_usb" || source === "usb_gc" || source === "direct_gc"
        ? "gc_usb"
        : source || "unknown";
  const bridgeAgeMs = relayDebugNumber(message.publisherBridgeAgeMs);
  const publisherSentAt = relayDebugNumber(message.publisherSentAt ?? message.sentAt);
  return {
    publisherSource,
    publisherSerialConnected: message.publisherSerialConnected === true,
    publisherSentAt,
    receivedAt,
    publisherBridgeTransport: inferredBridgeTransport || null,
    publisherBridgeControl: message.publisherBridgeControl === true,
    publisherBridgeStale: message.publisherBridgeStale === true,
    publisherBridgeAgeMs: bridgeAgeMs,
    publisherBridgeRssi: relayDebugNumber(message.publisherBridgeRssi),
    publisherBridgeSnr: relayDebugNumber(message.publisherBridgeSnr),
    publisherBridgeHandshake: message.publisherBridgeHandshake ? String(message.publisherBridgeHandshake) : "",
    publisherBridgeFallbackReason: message.publisherBridgeFallbackReason ? String(message.publisherBridgeFallbackReason) : "",
  };
}

function getLiveRemotePublisherBridgeAgeMs(now = Date.now()) {
  const status = liveState.remotePublisherStatus;
  const ageMs = relayDebugNumber(status?.publisherBridgeAgeMs);
  if (ageMs === null) return null;
  const receivedAt = relayDebugNumber(status?.receivedAt);
  return receivedAt !== null ? ageMs + Math.max(0, now - receivedAt) : ageMs;
}

function formatLiveRemotePublisherSource() {
  const status = liveState.remotePublisherStatus;
  if (!status) return "Live endpoint";
  if (status.publisherSource === "bridge") {
    return `Live endpoint via ${formatLiveBridgeTransportName(status.publisherBridgeTransport)} bridge`;
  }
  if (status.publisherSource === "gc_usb") return "Live endpoint via GC USB";
  return "Live endpoint";
}

function formatLiveRemotePublisherBridgeSummary(status = liveState.remotePublisherStatus || {}) {
  if (!status || status.publisherSource !== "bridge") return "N/A";
  const ageMs = getLiveRemotePublisherBridgeAgeMs();
  const live = status.publisherBridgeControl === true && status.publisherBridgeStale !== true;
  const parts = [
    `${formatLiveBridgeTransportName(status.publisherBridgeTransport)} ${live ? "live" : "stale"}`,
    `age ${formatRelayDebugMs(ageMs)}`,
  ];
  if (Number.isFinite(Number(status.publisherBridgeRssi))) {
    parts.push(`${Number(status.publisherBridgeRssi).toFixed(0)} dBm`);
  }
  if (Number.isFinite(Number(status.publisherBridgeSnr))) {
    parts.push(`${Number(status.publisherBridgeSnr).toFixed(1)} dB`);
  }
  return parts.join(" | ");
}

function formatLiveRemotePublisherBridgeDetails(status = liveState.remotePublisherStatus || {}) {
  if (!status || status.publisherSource !== "bridge") return "";
  const ageMs = getLiveRemotePublisherBridgeAgeMs();
  const fallbackReason = status.publisherBridgeFallbackReason
    ? String(status.publisherBridgeFallbackReason).replace(/_/g, " ")
    : "";
  return [
    `Publisher computer is connected through a ${formatLiveBridgeTransportName(status.publisherBridgeTransport)} bridge.`,
    status.publisherBridgeControl === true && status.publisherBridgeStale !== true
      ? "Bridge control/downlink was fresh when this snapshot was published."
      : "Bridge link was stale or control unavailable when this snapshot was published.",
    `Publisher bridge age: ${formatRelayDebugMs(ageMs)}.`,
    status.publisherBridgeHandshake ? `Handshake: ${status.publisherBridgeHandshake}.` : "",
    fallbackReason ? `Fallback: ${fallbackReason}.` : "",
  ].filter(Boolean).join(" ");
}

function isLiveBridgeControlAvailable() {
  if (!isLiveBridgeMode()) return false;
  if (liveState.gcStatus?.bridgeControl !== true) return false;
  if (liveState.gcStatus?.bridgeStale === true) return false;
  return getLiveBridgeDownlinkAgeMs() <= 3000;
}

function isLiveCommandReadOnlyMode() {
  return isLiveRemoteViewerMode() || (isLiveBridgeMode() && !isLiveBridgeControlAvailable());
}

function liveCommandReadOnlyMessage() {
  if (isLiveRemoteViewerMode()) return "Remote live endpoint is read-only.";
  if (isLiveBridgeMode()) return `${getLiveBridgeTransportLabel()} control link is not ready.`;
  return "";
}

function isLiveRelayMode() {
  return liveState.telemetrySourceMode === "auto" ||
    liveState.telemetrySourceMode === "usb" ||
    liveState.telemetrySourceMode === "live" ||
    liveState.telemetrySourceMode === "broadcast";
}

function isLiveRelayBroadcastMode() {
  return liveState.telemetrySourceMode === "broadcast" ||
    ((liveState.telemetrySourceMode === "auto" || liveState.telemetrySourceMode === "usb") && liveState.connected);
}

function getLiveRelayDesiredRole() {
  return isLiveRelayBroadcastMode() ? "publisher" : "viewer";
}

let orbitDroneId = null;
let orbitTeamId = null;
let orbitPreview = null; // { key, orbit }
let flankMenuEl = null;
let pendingFlank = null;
let flankCloseSuppressUntil = 0;
let longPressTimer = null;
let longPressSuppressUntil = 0;
let suppressMapClickUntil = 0;
let suppressNextMapClick = false;
let isMapDragging = false;
let suppressStatusClickUntil = 0;
let pendingEmptyMapClickTimer = null;
let sequenceMenuEl = null;
let sequenceGotoWpMenuEl = null;
let pendingSequenceGotoWp = null; // { key, wpId, speedKmh, altM }
let suppressSequenceClickUntil = 0;
let sequenceGotoWpEditMenuEl = null;
let pendingSequenceGotoWpEdit = null; // { key, index, wpId }
let sequenceSelected = { key: null, index: 0 };
let sequencePlayingByKey = new Map(); // key -> boolean
let sequenceActiveIndexByKey = new Map(); // key -> number (user-defined list index)
let followTargets = new Map(); // followerId -> targetId
let homeTargets = new Map(); // droneId -> stationId
let teams = [];
let pinnedTeamId = null;
let lastCreatedTeamId = null;
let userHomePromptEl = null;
let pendingUserHomePlacement = false;
let orbitAnim = { running: false, raf: 0, lastFrame: 0 };
let scaleControl = null;
let scaleUnits = "metric"; // "metric" | "imperial"
let scaleMenuEl = null;
let gsNameMenuEl = null;
let pendingGsNaming = null; // { stationId }
let userGroundStationId = null;
let gsMenuEl = null;
let activeGroundStationId = null;
let gsRelocate = null; // { stationId } while user is placing a GS on the map
let gsWatchId = null;
let commsLogsByStationId = new Map(); // stationId -> { messages: RingLog }
let commsComposerEl = null;
let commsDraftByStationId = new Map(); // stationId -> string
let commsComposerInputEl = null;
let commsComposerSendEl = null;
let commsKeyboardActive = false;
let commsKeyboardTracking = false;
let pageScrollLock = { active: false, x: 0, y: 0 };
let globalKeyboardActive = false;

function forceRedraw() {
  draw();
  requestAnimationFrame(draw);
  setTimeout(draw, 0);
}

function closeScaleMenu() {
  if (scaleMenuEl && scaleMenuEl.parentNode) {
    scaleMenuEl.parentNode.removeChild(scaleMenuEl);
  }
  scaleMenuEl = null;
  document.removeEventListener("pointerdown", handleScaleMenuOutsideClick, true);
}

function handleScaleMenuOutsideClick(e) {
  if (!scaleMenuEl) return;
  if (scaleMenuEl.contains(e.target)) return;
  closeScaleMenu();
}

function setScaleUnits(units) {
  const next = units === "imperial" ? "imperial" : "metric";
  scaleUnits = next;
  if (!map) return;
  // Recreate Leaflet scale control to apply new options.
  if (scaleControl) {
    try {
      map.removeControl(scaleControl);
    } catch {
      // ignore
    }
    scaleControl = null;
  }
  scaleControl = L.control.scale({
    position: "bottomleft",
    metric: next === "metric",
    imperial: next === "imperial",
    maxWidth: 140,
  });
  scaleControl.addTo(map);

  const el = scaleControl.getContainer && scaleControl.getContainer();
  if (el) {
    // Prevent map click/pan triggers when tapping the scale bar.
    L.DomEvent.disableClickPropagation(el);
    L.DomEvent.disableScrollPropagation(el);
    el.style.cursor = "pointer";
    el.title = "Scale units";
    el.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      openScaleMenu();
    });
  }
}

function openScaleMenu() {
  if (!map) return;
  const host = document.getElementById("app") || document.body;
  closeScaleMenu();

  scaleMenuEl = document.createElement("div");
  scaleMenuEl.className = "relative-menu";
  host.appendChild(scaleMenuEl);
  scaleMenuEl.addEventListener("pointerdown", (ev) => ev.stopPropagation());
  enableMenuDrag(scaleMenuEl);

  // Always anchor to bottom-left of the browser window (within the host bounds).
  const pad = 12;
  const hostRect = host.getBoundingClientRect();
  scaleMenuEl.style.left = `${pad}px`;
  scaleMenuEl.style.top = `${pad}px`; // temporary until we know the height

  const isMetric = scaleUnits === "metric";
  scaleMenuEl.innerHTML = `
    <div class="menu-head">
      <h4>Scale Units</h4>
    </div>
    <div class="segmented" role="group" aria-label="Scale units">
      <button class="seg-btn${isMetric ? " is-active" : ""}" type="button" data-scale="metric">Metric</button>
      <button class="seg-btn${!isMetric ? " is-active" : ""}" type="button" data-scale="imperial">Imperial (miles)</button>
    </div>
  `;

  scaleMenuEl.querySelectorAll("[data-scale]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const v = btn.dataset.scale === "imperial" ? "imperial" : "metric";
      setScaleUnits(v);
      closeScaleMenu();
    });
  });

  document.addEventListener("pointerdown", handleScaleMenuOutsideClick, true);

  // Reposition after layout so its bottom-left sits inside the bottom-left of the host.
  requestAnimationFrame(() => {
    if (!scaleMenuEl) return;
    const menuH = scaleMenuEl.offsetHeight || 120;
    const maxTop = Math.max(pad, hostRect.height - menuH - pad);
    scaleMenuEl.style.left = `${pad}px`;
    scaleMenuEl.style.top = `${maxTop}px`;
  });
}

function clearTooltipPinnedIfSelectionChanges(nextDroneId, nextTeamId) {
  const prevKey = pinnedTeamId !== null ? `team:${pinnedTeamId}` : pinnedDroneId !== null ? `drone:${pinnedDroneId}` : null;
  const nextKey = nextTeamId !== null ? `team:${nextTeamId}` : nextDroneId !== null ? `drone:${nextDroneId}` : null;
  if (prevKey !== nextKey) {
    tooltipPinnedPos = null;
    tooltipPinnedForKey = null;
  }
}

function enableMenuDrag(el, { handleSelector = null, onMove = null } = {}) {
  if (!el) return;
  const host = document.getElementById("app") || document.body;

  // Avoid double-binding
  if (el._dragBound) return;
  el._dragBound = true;

  const clampWithinHost = (left, top) => {
    const hostRect = host.getBoundingClientRect();
    const menuW = el.offsetWidth || 220;
    const menuH = el.offsetHeight || 120;
    const pad = 8;
    const maxLeft = hostRect.width - menuW - pad;
    const maxTop = hostRect.height - menuH - pad;
    return {
      left: Math.max(pad, Math.min(maxLeft, left)),
      top: Math.max(pad, Math.min(maxTop, top)),
    };
  };

  const isInteractive = (t) => {
    if (!t || !(t instanceof Element)) return false;
    return !!t.closest("button, input, select, textarea, a, label, [data-no-drag]");
  };

  el.style.touchAction = "none";

  el.addEventListener(
    "pointerdown",
    (ev) => {
      if (handleSelector) {
        const okHandle = ev.target instanceof Element && ev.target.closest(handleSelector);
        if (!okHandle) return;
      }
      if (isInteractive(ev.target)) return;
      if (typeof ev.button === "number" && ev.button !== 0) return;
      ev.preventDefault();
      ev.stopPropagation();

      // If this menu was previously auto-positioned (e.g. status-member menu), stop re-anchoring after the user drags it.
      if (el._reposition) {
        el._dragged = true;
        el._reposition = null;
      }

      const hostRect = host.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      const startLeft = rect.left - hostRect.left;
      const startTop = rect.top - hostRect.top;
      const start = { x: ev.clientX, y: ev.clientY, left: startLeft, top: startTop };
      let moved = false;
      const DRAG_START_PX = 3;

      try {
        el.setPointerCapture(ev.pointerId);
      } catch {
        // ignore
      }

      const move = (e) => {
        if (e.pointerId !== ev.pointerId) return;
        e.preventDefault();
        const dx = (e.clientX ?? 0) - start.x;
        const dy = (e.clientY ?? 0) - start.y;
        if (!moved && Math.hypot(dx, dy) >= DRAG_START_PX) moved = true;
        const next = clampWithinHost(start.left + dx, start.top + dy);
        el.style.left = `${next.left}px`;
        el.style.top = `${next.top}px`;
        if (typeof onMove === "function") onMove(next.left, next.top);
      };

      const up = (e) => {
        if (e.pointerId !== ev.pointerId) return;
        try {
          el.releasePointerCapture(ev.pointerId);
        } catch {
          // ignore
        }
        window.removeEventListener("pointermove", move, true);
        window.removeEventListener("pointerup", up, true);
        window.removeEventListener("pointercancel", up, true);
        // Only suppress "click" behaviors if the user actually dragged.
        if (moved) menuDragSuppressUntil = performance.now() + 250;
      };

      window.addEventListener("pointermove", move, true);
      window.addEventListener("pointerup", up, true);
      window.addEventListener("pointercancel", up, true);
    },
    true
  );
}

function closeUserHomePrompt() {
  if (userHomePromptEl && userHomePromptEl.parentNode) {
    userHomePromptEl.parentNode.removeChild(userHomePromptEl);
  }
  userHomePromptEl = null;
}

function openUserHomePrompt(reason = "Location unavailable") {
  const host = document.getElementById("app") || document.body;
  closeUserHomePrompt();
  pendingUserHomePlacement = true;
  if (LIVE_POSITION_MODE) liveState.homePlacementActive = true;
  userHomePromptEl = document.createElement("div");
  userHomePromptEl.className = "relative-menu";
  userHomePromptEl.addEventListener("pointerdown", (ev) => ev.stopPropagation());
  userHomePromptEl.innerHTML = `
    <div class="menu-head">
      <h4>Set Home Location</h4>
    </div>
    <div class="status-mission" style="line-height:1.35; opacity:0.9;">
      ${reason}. Tap on the map to place your Home (H).
    </div>
    <div class="command-list cmd-action-list column">
      <button class="cmd-chip cmd-action" type="button" data-action="cancel-home">Keep default home</button>
    </div>
  `;
  host.appendChild(userHomePromptEl);
  enableMenuDrag(userHomePromptEl);

  const hostRect = host.getBoundingClientRect();
  const menuW = userHomePromptEl.offsetWidth || 260;
  const menuH = userHomePromptEl.offsetHeight || 140;
  userHomePromptEl.style.left = `${Math.max(10, (hostRect.width - menuW) / 2)}px`;
  userHomePromptEl.style.top = `${Math.max(10, (hostRect.height - menuH) / 2)}px`;

  const cancel = userHomePromptEl.querySelector("[data-action='cancel-home']");
  if (cancel) {
    cancel.addEventListener("click", (e) => {
      e.stopPropagation();
      pendingUserHomePlacement = false;
      liveState.homePlacementActive = false;
      closeUserHomePrompt();
      renderLiveHomeTool();
    });
  }
}

function closeGroundStationNameMenu() {
  if (gsNameMenuEl && gsNameMenuEl.parentNode) {
    gsNameMenuEl.parentNode.removeChild(gsNameMenuEl);
  }
  gsNameMenuEl = null;
  pendingGsNaming = null;
  document.removeEventListener("pointerdown", handleGsNameOutsideClick, true);
  window.removeEventListener("keydown", handleGsNameKeydown, true);
  if (!gsMenuEl) forceRedraw();
}

function finalizeGroundStationNamingDefault() {
  const stationId = pendingGsNaming && pendingGsNaming.stationId;
  if (stationId === null || stationId === undefined) return;
  const gs = groundStations.find((g) => g.id === stationId);
  if (!gs) return;
  if (!gs.name || !String(gs.name).trim()) {
    gs.name = `Home #${gs.id + 1}`;
    publishLiveHomesStateSoon();
  }
}

function handleGsNameOutsideClick(e) {
  if (!gsNameMenuEl) return;
  if (gsNameMenuEl.contains(e.target)) return;
  // Leaving naming via outside click: keep default name and suppress map click side-effects.
  finalizeGroundStationNamingDefault();
  closeGroundStationNameMenu();
  suppressMapClickUntil = performance.now() + 450;
  longPressSuppressUntil = performance.now() + 450;
  forceRedraw();
}

function handleGsNameKeydown(e) {
  if (!gsNameMenuEl) return;
  if (e.key !== "Escape") return;
  e.preventDefault();
  e.stopPropagation();
  // Leaving naming via ESC: keep default name.
  finalizeGroundStationNamingDefault();
  closeGroundStationNameMenu();
  suppressMapClickUntil = performance.now() + 450;
  longPressSuppressUntil = performance.now() + 450;
  forceRedraw();
}

function openGroundStationNameMenu(stationId) {
  if (isLiveRemoteViewerMode()) return;
  const gs = groundStations.find((g) => g.id === stationId);
  if (!gs) return;

  const host = document.getElementById("app") || document.body;
  closeGroundStationMenu(false);
  closeGroundStationNameMenu();
  pendingGsNaming = { stationId };
  activeGroundStationId = stationId;
  gsNameMenuEl = document.createElement("div");
  gsNameMenuEl.className = "relative-menu";
  gsNameMenuEl.addEventListener("pointerdown", (ev) => ev.stopPropagation());
  host.appendChild(gsNameMenuEl);
  enableMenuDrag(gsNameMenuEl);

  gsNameMenuEl.innerHTML = `
    <div class="menu-head">
      <h4>Ground Station Name</h4>
    </div>
    <div class="status-mission" style="line-height:1.35; opacity:0.9; margin-top:2px;">
      Name this location so it shows on the map.
    </div>
    <div style="margin-top:10px; display:flex; gap:8px; align-items:center;">
      <input data-gs-name-input type="text" placeholder="e.g., Field HQ"
        style="flex:1; background:rgba(0,0,0,0.35); border:1px solid rgba(255,255,255,0.18); color:#fff; border-radius:10px; padding:10px 12px; outline:none;">
      <button class="cmd-chip cmd-action" data-action="gs-name-save" type="button" disabled style="white-space:nowrap;">Save</button>
    </div>
  `;

  const hostRect = host.getBoundingClientRect();
  const menuW = gsNameMenuEl.offsetWidth || 300;
  const menuH = gsNameMenuEl.offsetHeight || 180;
  gsNameMenuEl.style.left = `${Math.max(10, (hostRect.width - menuW) / 2)}px`;
  gsNameMenuEl.style.top = `${Math.max(10, (hostRect.height - menuH) / 2)}px`;

  const input = gsNameMenuEl.querySelector("[data-gs-name-input]");
  const save = gsNameMenuEl.querySelector("[data-action='gs-name-save']");
  if (input) input.value = (gs.name || "").trim();

  const updateState = () => {
    const v = (input && input.value ? input.value : "").trim();
    if (save) save.disabled = !v;
  };

  const doSave = () => {
    const v = (input && input.value ? input.value : "").trim();
    if (!v) return;
    const g2 = groundStations.find((g) => g.id === stationId);
    if (g2) g2.name = v;
    publishLiveHomesStateSoon();
    closeGroundStationNameMenu();
    forceRedraw();
  };

  if (input) {
    input.addEventListener("input", updateState);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        doSave();
      }
    });
    setTimeout(() => {
      try {
        input.focus();
        input.select();
      } catch {
        // ignore
      }
      updateState();
    }, 0);
  }
  if (save) {
    save.addEventListener("click", (e) => {
      e.stopPropagation();
      doSave();
    });
  }
  updateState();

  document.addEventListener("pointerdown", handleGsNameOutsideClick, true);
  window.addEventListener("keydown", handleGsNameKeydown, true);
}

function closeGroundStationMenu(clearSelection = false) {
  if (gsMenuEl && gsMenuEl.parentNode) {
    gsMenuEl.parentNode.removeChild(gsMenuEl);
  }
  gsMenuEl = null;
  gsRelocate = null;
  if (clearSelection) activeGroundStationId = null;
  document.removeEventListener("pointerdown", handleGsMenuOutsideClick, true);
  updateCommandSequencePanel();
  forceRedraw();
}

function handleGsMenuOutsideClick(e) {
  if (!gsMenuEl) return;
  if (gsMenuEl.contains(e.target)) return;
  // While "Change location" is active, allow a map click to place without closing via outside-click.
  if (gsRelocate && activeGroundStationId !== null && activeGroundStationId !== undefined) return;
  closeGroundStationMenu(false);
}

function positionGroundStationMenuForStation(station) {
  if (!map || !gsMenuEl || !station) return;
  const lat = Number(station.lat);
  const lng = Number(station.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
  const host = document.getElementById("app") || document.body;
  const hostRect = host.getBoundingClientRect();
  const mapRect = map.getContainer().getBoundingClientRect();
  const point = map.latLngToContainerPoint([lat, lng]);
  const pad = 8;
  const menuW = gsMenuEl.offsetWidth || 220;
  const menuH = gsMenuEl.offsetHeight || 160;
  let left = mapRect.left - hostRect.left + point.x + 12;
  let top = mapRect.top - hostRect.top + point.y - 10;
  left = Math.max(pad, Math.min(hostRect.width - menuW - pad, left));
  top = Math.max(pad, Math.min(hostRect.height - menuH - pad, top));
  gsMenuEl.style.left = `${left}px`;
  gsMenuEl.style.top = `${top}px`;
}

function stopGsDynamicUpdates() {
  if (gsWatchId !== null && gsWatchId !== undefined && typeof navigator !== "undefined" && navigator.geolocation) {
    try {
      navigator.geolocation.clearWatch(gsWatchId);
    } catch {
      // ignore
    }
  }
  gsWatchId = null;
}

function startGsDynamicUpdates(stationId) {
  const gs = groundStations.find((g) => g.id === stationId);
  if (!gs) return;
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    window.alert("Device location not supported.");
    return;
  }
  stopGsDynamicUpdates();
  gsWatchId = navigator.geolocation.watchPosition(
    (pos) => {
      const lat = Number(pos?.coords?.latitude);
      const lng = Number(pos?.coords?.longitude);
      const alt = Number(pos?.coords?.altitude);
      if (!isFinite(lat) || !isFinite(lng)) return;
      gs.updatePosition({ lat, lng, alt: isFinite(alt) ? alt : gs.alt });
      publishLiveHomesStateSoon();
      forceRedraw();
    },
    (err) => {
      stopGsDynamicUpdates();
      const msg =
        err && err.code === 1
          ? "Location permission denied"
          : err && err.code === 2
            ? "Location unavailable"
            : "Location request timed out";
      window.alert(msg);
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 2000 }
  );
}

function renderGroundStationMenu() {
  if (!gsMenuEl) return;
  const gs = groundStations.find((g) => g.id === activeGroundStationId);
  if (!gs) return;
  const isReadOnlyViewer = isLiveRemoteViewerMode();
  const isUser = !isReadOnlyViewer && (LIVE_POSITION_MODE || (userGroundStationId !== null && Number(userGroundStationId) === Number(gs.id)));
  const relocating = gsRelocate && Number(gsRelocate.stationId) === Number(gs.id);
  const isDynamic = !!gs.isDynamic;
  const name = (gs.name || `Home #${gs.id + 1}`).trim();

  if (relocating) {
    gsMenuEl.classList.add("live-placement-helper");
    gsMenuEl.innerHTML = `
      <div class="menu-head">
        <h4>Move HOME</h4>
      </div>
      <div class="status-mission">Choose a new coordinate for ${name}</div>
    `;
    if (LIVE_POSITION_MODE) {
      const host = document.getElementById("app") || document.body;
      requestAnimationFrame(() => {
        if (!gsMenuEl) return;
        const hostRect = host.getBoundingClientRect();
        const menuW = gsMenuEl.offsetWidth || 280;
        gsMenuEl.style.left = `${Math.max(12, (hostRect.width - menuW) / 2)}px`;
        gsMenuEl.style.top = "18px";
      });
    }
    return;
  }

  gsMenuEl.classList.remove("live-placement-helper");
  gsMenuEl.innerHTML = `
    <div class="menu-head">
      <h4>${name}</h4>
      <span class="menu-eta">${LIVE_POSITION_MODE ? "HOME" : "Ground Station"}</span>
    </div>
    <div class="command-list cmd-action-list column" style="margin-top:2px;">
      ${isUser ? `<button class="cmd-chip cmd-action" data-action="gs-rename" type="button">Change name</button>` : ""}
      ${
        isUser
          ? `<button class="cmd-chip cmd-action" data-action="gs-move" type="button" ${
              isDynamic ? "disabled" : ""
            } style="${isDynamic ? "opacity:0.45; cursor:not-allowed;" : ""}">${
              LIVE_POSITION_MODE ? "Move HOME" : "Change location"
            }</button>`
          : ""
      }
      ${LIVE_POSITION_MODE ? `<button class="cmd-chip cmd-action danger" data-action="gs-delete" type="button">Delete HOME</button>` : ""}
    </div>
    ${
      isUser && !LIVE_POSITION_MODE
        ? `<div class="seg-wrap" style="margin-top:10px;">
            <div class="seg">
              <button class="seg-btn${!isDynamic ? " is-active" : ""}" data-gs-mode="static" type="button">Static</button>
              <button class="seg-btn${isDynamic ? " is-active" : ""}" data-gs-mode="dynamic" type="button">Dynamic</button>
            </div>
          </div>`
        : LIVE_POSITION_MODE && !isReadOnlyViewer
          ? ""
        : `<div class="status-mission" style="line-height:1.35; opacity:0.85; margin-top:10px;">Read-only.</div>`
    }
  `;

  const rename = gsMenuEl.querySelector("[data-action='gs-rename']");
  if (rename) {
    rename.addEventListener("click", (e) => {
      e.stopPropagation();
      closeGroundStationMenu(false);
      openGroundStationNameMenu(gs.id);
    });
  }

  const move = gsMenuEl.querySelector("[data-action='gs-move']");
  if (move) {
    move.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isDynamic) return;
      gsRelocate = { stationId: gs.id };
      renderGroundStationMenu();
      forceRedraw();
    });
  }

  const deleteBtn = gsMenuEl.querySelector("[data-action='gs-delete']");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const currentName = (gs.name || `Home #${gs.id + 1}`).trim();
      if (!window.confirm(`Delete ${currentName}? This only removes the local HOME marker.`)) return;
      groundStations = groundStations.filter((g) => Number(g.id) !== Number(gs.id));
      if (Number(userGroundStationId) === Number(gs.id)) {
        userGroundStationId = groundStations.length ? groundStations[0].id : null;
      }
      publishLiveHomesStateSoon();
      activeGroundStationId = null;
      gsRelocate = null;
      closeGroundStationMenu(false);
      forceRedraw();
    });
  }

  gsMenuEl.querySelectorAll("[data-gs-mode]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const mode = btn.dataset.gsMode === "dynamic" ? "dynamic" : "static";
      const g2 = groundStations.find((g) => g.id === gs.id);
      if (!g2) return;
      if (mode === "dynamic") {
        g2.isDynamic = true;
        startGsDynamicUpdates(g2.id);
      } else {
        g2.isDynamic = false;
        stopGsDynamicUpdates();
      }
      renderGroundStationMenu();
      forceRedraw();
    });
  });
}

function openGroundStationMenu(station, containerPoint) {
  if (!map || !station || !containerPoint) return;
  const host = document.getElementById("app") || document.body;
  closeGroundStationMenu();
  closeGroundStationNameMenu();
  closeUserHomePrompt();
  closeWaypointMenu(false, true);
  closeOrbitMenu(false, true);
  closeHomeMenu(false);
  closeFollowMenu(false);
  closeRelationMenu(false);
  closeSequenceMenu();

  activeGroundStationId = station.id;
  gsRelocate = null;

  gsMenuEl = document.createElement("div");
  gsMenuEl.className = "relative-menu";
  host.appendChild(gsMenuEl);
  gsMenuEl.addEventListener("pointerdown", (ev) => ev.stopPropagation());
  enableMenuDrag(gsMenuEl);

  if (LIVE_POSITION_MODE) {
    positionGroundStationMenuForStation(station);
  } else {
    const mapRect = map.getContainer().getBoundingClientRect();
    gsMenuEl.style.left = `${mapRect.left + containerPoint.x + 12}px`;
    gsMenuEl.style.top = `${mapRect.top + containerPoint.y - 10}px`;
  }

  renderGroundStationMenu();
  if (LIVE_POSITION_MODE) {
    positionGroundStationMenuForStation(station);
    if (Number.isFinite(Number(station.lat)) && Number.isFinite(Number(station.lng))) {
      const zoom = map.getZoom ? map.getZoom() : undefined;
      let tracking = true;
      const updatePosition = () => positionGroundStationMenuForStation(station);
      const stopTracking = () => {
        if (!tracking) return;
        tracking = false;
        map.off("move", updatePosition);
        positionGroundStationMenuForStation(station);
      };
      map.on("move", updatePosition);
      map.once("moveend", stopTracking);
      if (typeof map.flyTo === "function") {
        map.flyTo([station.lat, station.lng], zoom, { duration: 0.45 });
      } else {
        map.setView([station.lat, station.lng], zoom, { animate: true });
      }
      window.setTimeout(stopTracking, 800);
      suppressMapClickUntil = performance.now() + 450;
    }
  }
  document.addEventListener("pointerdown", handleGsMenuOutsideClick, true);
  updateCommandSequencePanel();
  forceRedraw();
}

function addUserHomeAtLatLng(latlng, alt = 0, options = {}) {
  if (isLiveRemoteViewerMode()) return;
  if (!latlng) return;
  const lat = Number(latlng.lat);
  const lng = Number(latlng.lng);
  if (!isFinite(lat) || !isFinite(lng)) return;
  const stationId = options && options.stationId !== undefined && options.stationId !== null ? Number(options.stationId) : null;
  const forceCreate = LIVE_POSITION_MODE && !Number.isFinite(stationId);
  if (!forceCreate && Number.isFinite(stationId)) {
    const existing = groundStations.find((g) => Number(g.id) === stationId);
    if (existing) {
      existing.updatePosition({ lat, lng, alt: isFinite(Number(alt)) ? Number(alt) : existing.alt });
      userGroundStationId = existing.id;
    }
  } else if (!forceCreate && userGroundStationId !== null && userGroundStationId !== undefined) {
    const existing = groundStations.find((g) => g.id === userGroundStationId);
    if (existing) {
      existing.updatePosition({ lat, lng, alt: isFinite(Number(alt)) ? Number(alt) : existing.alt });
    }
  } else {
    const nextId = groundStations.reduce((m, g) => Math.max(m, g.id), -1) + 1;
    userGroundStationId = nextId;
    const name = LIVE_POSITION_MODE ? `Home ${groundStations.length + 1}` : null;
    groundStations.push(new GroundStation(nextId, lat, lng, isFinite(Number(alt)) ? Number(alt) : 0, name));
  }
  pendingUserHomePlacement = false;
  liveState.homePlacementActive = false;
  closeUserHomePrompt();
  renderLiveHomeTool();
  const gs = groundStations.find((g) => g.id === userGroundStationId);
  if (gs && (!gs.name || !String(gs.name).trim())) openGroundStationNameMenu(gs.id);
  activeGroundStationId = gs ? gs.id : activeGroundStationId;
  publishLiveHomesStateSoon();
  forceRedraw();
}

function focusTeamView(team) {
  if (!map || !team || !team.members || team.members.size < 2) return false;

  const latLngs = [];
  for (const id of team.members) {
    const d = getDroneById(id);
    const latest = d && d.getLatest && d.getLatest();
    if (!latest) continue;
    const lat = Number(latest.lat);
    const lng = Number(latest.lng);
    if (!isFinite(lat) || !isFinite(lng)) continue;
    latLngs.push(L.latLng(lat, lng));
  }
  if (!latLngs.length) return false;

  const bounds = L.latLngBounds(latLngs);
  if (!bounds.isValid()) return false;

  const pad = isMobileLike() ? 60 : 90;
  const padding = L.point(pad, pad);

  try {
    map.stop();
    map.invalidateSize({ pan: false });
    if (typeof map.flyToBounds === "function") {
      map.flyToBounds(bounds, { padding, maxZoom: 17, duration: 0.6 });
    } else {
      map.fitBounds(bounds, { padding, maxZoom: 17, animate: true });
    }
  } catch {
    const center = bounds.getCenter();
    const targetZoom = Math.max(map.getZoom(), 14);
    map.flyTo([center.lat, center.lng], targetZoom, { duration: 0.6 });
  }

  map.once("moveend", forceRedraw);
  setTimeout(forceRedraw, 80);
  return true;
}

function clearSelection(hideTooltip = true) {
  stopLiveDroneFollow();
  pinnedTeamId = null;
  pinnedDroneId = null;
  hoveredDroneId = null;
  if (hideTooltip && tooltipEl) tooltipEl.style.display = "none";
  closeSequenceMenu();
  updateCommandSequencePanel();
  forceRedraw();
}
let homeMenuEl = null;
let pendingHome = null;

function isMobileLike() {
  return (
    (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 900px)").matches) ||
    ("ontouchstart" in window) ||
    (navigator && navigator.maxTouchPoints > 1)
  );
}

function haversine2dMeters(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function bearingDeg(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const toDeg = (r) => (r * 180) / Math.PI;
  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
  const brng = toDeg(Math.atan2(y, x));
  return (brng + 360) % 360;
}

function destinationLatLng(lat, lon, bearingDegVal, distanceM) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const toDeg = (r) => (r * 180) / Math.PI;
  const brng = toRad(bearingDegVal);
  const lat1 = toRad(lat);
  const lon1 = toRad(lon);
  const dr = distanceM / R;
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(dr) + Math.cos(lat1) * Math.sin(dr) * Math.cos(brng));
  const lon2 =
    lon1 +
    Math.atan2(Math.sin(brng) * Math.sin(dr) * Math.cos(lat1), Math.cos(dr) - Math.sin(lat1) * Math.sin(lat2));
  return { lat: toDeg(lat2), lng: toDeg(lon2) };
}

class Drone {
  constructor(id, options = {}) {
    this.id = id;
    this.type = options.type || "core";
    this.historyLimit = options.historyLimit || SETTINGS.HISTORY_LIMIT;
    this.history = [];
    this.current = null;
    this.lastReceivedAt = null; // wall-clock ms when last packet arrived
    this.cooldownUntil = 0;
  }

  updateTelemetry(packet, receivedAt = Date.now()) {
    const prevCommand = this.current && this.current.command;
    const entry = {
      uptimeSec: packet.uptimeSec ?? packet.t ?? 0,
      lat: packet.lat,
      lng: packet.lng,
      alt: packet.alt ?? 0,
      heading: packet.heading ?? 0,
      headingSource: packet.headingSource ?? packet.heading_source ?? null,
      courseOverGround: packet.courseOverGround ?? packet.course_over_ground ?? null,
      yaw: packet.yaw ?? null,
      yawHeading: packet.yawHeading ?? packet.yaw_heading ?? null,
      yawBiasDeg: packet.yawBiasDeg ?? packet.yaw_bias_deg ?? null,
      yawBiasValid: packet.yawBiasValid ?? packet.yaw_bias_valid ?? false,
      yawBiasSamples: packet.yawBiasSamples ?? packet.yaw_bias_samples ?? 0,
      cogWeight: packet.cogWeight ?? packet.cog_weight ?? null,
      cogTrusted: packet.cogTrusted ?? packet.cog_trusted ?? false,
      groundSpeed: packet.groundSpeed ?? packet.ground_speed ?? null,
      satelliteCount: packet.satelliteCount ?? packet.satellite_count ?? null,
      gpsSource: packet.gpsSource ?? packet.gps_source ?? null,
      gpsSimulated: packet.gpsSimulated ?? packet.gps_simulated ?? false,
      gpsFixQuality: packet.gpsFixQuality ?? packet.gps_fix_quality ?? null,
      receivedAt,
      snr: packet.snr ?? null,
      frequencyMhz: packet.frequencyMhz ?? packet.frequency_mhz ?? null,
      radioProfileId: packet.radioProfileId ?? packet.radio_profile_id ?? (this.current && this.current.radioProfileId) ?? null,
      txPeriodMs: packet.txPeriodMs ?? packet.tx_period_ms ?? (this.current && this.current.txPeriodMs) ?? null,
      telemetryAirtimeMs: packet.telemetryAirtimeMs ?? packet.telemetry_airtime_ms ?? (this.current && this.current.telemetryAirtimeMs) ?? null,
      expectedUpdateMs: packet.expectedUpdateMs ?? packet.expected_update_ms ?? packet.targetServiceMs ?? packet.target_service_ms ?? (this.current && this.current.expectedUpdateMs) ?? null,
      sequenceId: packet.sequenceId ?? packet.sequence_id ?? null,
      gcMillis: packet.gcMillis ?? packet.gc_millis ?? null,
      battery: packet.battery ?? 0,
      rssi: packet.rssi ?? null,
      command: packet.command || null,
      armed: packet.armed ?? (this.current && this.current.armed) ?? false,
      rescuePhase: packet.rescuePhase ?? packet.rescue_phase ?? (this.current && this.current.rescuePhase) ?? null,
    };

    this.current = entry;
    this.lastReceivedAt = receivedAt;

    this.history.push(entry);
    if (this.history.length > this.historyLimit) {
      this.history.splice(0, this.history.length - this.historyLimit);
    }

    // Clear any pending waypoint visuals if mission changed away from Goto.
    if (prevCommand && prevCommand !== entry.command && waypointTargets.has(this.id)) {
      waypointTargets.delete(this.id);
    }
    // Clear follow link if mission changed away from follow.
  if (prevCommand && prevCommand !== entry.command && followTargets.has(this.id)) {
    followTargets.delete(this.id);
  }
    // Clear RTH link if mission changed away from RTH.
    if (prevCommand && prevCommand !== entry.command && homeTargets.has(this.id)) {
      homeTargets.delete(this.id);
    }
  }

  getLatest() {
    return this.current;
  }

  isArmed() {
    return !!(this.current && this.current.armed);
  }

  isLanded() {
    return !isInAir(this.current);
  }

  getTrail() {
    return this.history.map((h) => ({ lat: h.lat, lng: h.lng }));
  }

  getSecondsSinceLastUpdate(nowMs = Date.now()) {
    if (!this.lastReceivedAt) return null;
    return (nowMs - this.lastReceivedAt) / 1000;
  }

  isStale(nowMs = Date.now(), thresholdSec = SETTINGS.LINK_STALE_THRESHOLD_SEC) {
    const age = this.getSecondsSinceLastUpdate(nowMs);
    if (age === null) return false;
    return age > thresholdSec;
  }

  getBatteryRatePerMinute(windowSec = SETTINGS.BATTERY_RATE_WINDOW_SEC) {
    if (!this.current || this.history.length < SETTINGS.BATTERY_MIN_SAMPLES) return null;

    const latest = this.current;
    const threshold = latest.uptimeSec - windowSec;

    // Find the earliest sample within the window (or the first after threshold).
    let earliest = null;
    for (let i = this.history.length - 1; i >= 0; i--) {
      const h = this.history[i];
      if (h.uptimeSec <= threshold) {
        // Use the next one (the first inside the window) if it exists
        earliest = this.history[Math.min(this.history.length - 1, i + 1)];
        break;
      }
      earliest = h;
    }

    if (!earliest) return null;

    const dt = latest.uptimeSec - earliest.uptimeSec;
    if (dt <= 0) return null;

    const deltaBattery = latest.battery - earliest.battery;
    const ratePerSec = -deltaBattery / dt; // positive when discharging
    const ratePerMin = ratePerSec * 60;

    if (!isFinite(ratePerMin) || ratePerMin <= 0) return null;
    return ratePerMin;
  }

  getEstimatedTimeRemainingMinutes(windowSec = SETTINGS.BATTERY_RATE_WINDOW_SEC) {
    const ratePerMin = this.getBatteryRatePerMinute(windowSec);
    if (ratePerMin === null || ratePerMin <= 0) return null;
    if (!this.current || this.current.battery === undefined || this.current.battery === null) return null;
    return this.current.battery / ratePerMin;
  }

  getGroundSpeedMps() {
    if (this.history.length < 2) return null;
    const b = this.history[this.history.length - 1];
    // Find previous sample with a smaller uptime (guard against duplicate timestamps)
    let idx = this.history.length - 2;
    while (idx >= 0 && this.history[idx].uptimeSec === b.uptimeSec) idx--;
    if (idx < 0) return null;
    const a = this.history[idx];
    const dt = b.uptimeSec - a.uptimeSec;
    if (dt <= 0) return null;
    const dist = haversine2dMeters(a.lat, a.lng, b.lat, b.lng);
    return dist / dt;
  }

  setCooldown(ms, now = Date.now()) {
    this.cooldownUntil = Math.max(this.cooldownUntil, now + ms);
  }

  getCooldownRemaining(now = Date.now()) {
    return Math.max(0, this.cooldownUntil - now);
  }
}

class GroundStation {
  constructor(id, lat, lng, alt = 0, name = null) {
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.alt = alt;
    this.name = name || null;
  }

  updatePosition({ lat, lng, alt }) {
    if (lat !== undefined && lat !== null) this.lat = lat;
    if (lng !== undefined && lng !== null) this.lng = lng;
    if (alt !== undefined && alt !== null) this.alt = alt;
  }

  getLatLng() {
    return { lat: this.lat, lng: this.lng, alt: this.alt };
  }
}

class GroundControl {
  constructor() {
    this.assigned = new Map(); // droneId -> { command, issuedAt }
    this.planned = new Map(); // key -> { commands: string[], updatedAt }
    this.logs = new RingLog();
  }

  assignMission(droneId, command, issuedAt = Date.now()) {
    const entry = { droneId, command, issuedAt };
    this.assigned.set(droneId, entry);
    this.logs.push(entry);
  }

  getAssigned(droneId) {
    return this.assigned.get(droneId) || null;
  }

  _keyForDrone(droneId) {
    return `drone:${droneId}`;
  }

  _keyForTeam(teamId) {
    return `team:${teamId}`;
  }

  getPlanned(key) {
    const entry = this.planned.get(key);
    return entry ? entry.commands : [];
  }

  clearPlanned(key) {
    this.planned.set(key, { commands: [], updatedAt: Date.now() });
  }

  appendPlanned(key, command) {
    const prev = this.planned.get(key);
    const next = prev ? [...prev.commands, command] : [command];
    this.planned.set(key, { commands: next, updatedAt: Date.now() });
  }

  setPlanned(key, commands) {
    this.planned.set(key, { commands: [...commands], updatedAt: Date.now() });
  }
}

function appendPlannedForKey(key, command) {
  if (!groundControl || !key || !command) return;
  groundControl.appendPlanned(key, command);
  updateCommandSequencePanel();
}

// Smoothstep/sigmoid helpers for zoom interpolation
function clamp01(t) {
  return Math.max(0, Math.min(1, t));
}

function sigmoid01(t, k = 10) {
  // Logistic sigmoid remapped to [0,1]
  t = clamp01(t);
  const x = (t - 0.5) * k;
  const s = 1 / (1 + Math.exp(-x));
  // normalize so t=0 => 0, t=1 => 1
  const s0 = 1 / (1 + Math.exp(k / 2));
  const s1 = 1 / (1 + Math.exp(-k / 2));
  return (s - s0) / (s1 - s0);
}

let zoomInterp = {
  active: false,
  t0: 0,
  durationMs: 220,
  fromZoom: 0,
  toZoom: 0,
  fromCenter: null,
  toCenter: null,
};

// Track when we're actively zooming so we can use live projections.
let isZooming = false;

function projectToContainerAtView(lat, lng, centerLatLng, zoom) {
  // Project a lat/lng to container pixels as if the map were at (centerLatLng, zoom)
  const size = map.getSize();
  const half = L.point(size.x / 2, size.y / 2);
  const worldTarget = map.project([lat, lng], zoom);
  const worldCenter = map.project(centerLatLng, zoom);
  const topLeft = worldCenter.subtract(half);
  const p = worldTarget.subtract(topLeft);
  return { x: p.x, y: p.y };
}

function latLngToScreen(lat, lng) {
  // When zooming (trackpad pinch / wheel), always use Leaflet's live projection
  // so pixels match the current animated map transform.
  if (isZooming) {
    const p = map.latLngToContainerPoint([lat, lng]);
    return { x: p.x, y: p.y };
  }

  // Optional post-zoom easing (kept for non-pinch/programmatic jumps)
  if (zoomInterp.active && zoomInterp.fromCenter && zoomInterp.toCenter) {
    const elapsed = performance.now() - zoomInterp.t0;
    const rawT = elapsed / zoomInterp.durationMs;
    const t = sigmoid01(rawT, 11);

    const a = projectToContainerAtView(lat, lng, zoomInterp.fromCenter, zoomInterp.fromZoom);
    const b = projectToContainerAtView(lat, lng, zoomInterp.toCenter, zoomInterp.toZoom);

    return {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
    };
  }

  const p = map.latLngToContainerPoint([lat, lng]);
  return { x: p.x, y: p.y };
}

function getDroneById(id) {
  return drones.find((d) => d.id === id) || null;
}

function getTeamById(id) {
  return teams.find((t) => t && t.members.size >= 2 && t.id === id) || null;
}

function getTeamForDrone(droneId) {
  return teams.find((t) => t && t.members.size >= 2 && t.members.has(droneId)) || null;
}

function computeTeamCentroid(team) {
  const members = [...team.members].map((id) => getDroneById(id)).filter(Boolean);
  if (!members.length) return null;
  let sumLat = 0;
  let sumLng = 0;
  members.forEach((d) => {
    const latest = d.getLatest && d.getLatest();
    if (latest) {
      sumLat += latest.lat;
      sumLng += latest.lng;
    }
  });
  const count = members.length;
  return { lat: sumLat / count, lng: sumLng / count };
}

function ensureTeam(droneIds) {
  const uniqueIds = [...new Set(droneIds)].filter((id) => getDroneById(id));
  if (uniqueIds.length < 2) return null;

  // Find any existing teams containing these drones
  const containing = teams.filter((t) => uniqueIds.some((id) => t.members.has(id)));

  // Create or pick base team
  const base =
    containing.length > 0
      ? containing[0]
      : (() => {
          const nextId = teams.length ? Math.max(...teams.map((t) => t.id)) + 1 : 0;
          const t = { id: nextId, members: new Set() };
          teams.push(t);
          lastCreatedTeamId = t.id;
          return t;
        })();

  // Remove members from other teams and merge
  containing.forEach((t) => {
    if (t === base) return;
    t.members.forEach((id) => base.members.add(id));
    teams = teams.filter((x) => x !== t);
    if (pinnedTeamId === t.id) pinnedTeamId = base.id;
  });

  // Add new ids, removing them from any other teams
  uniqueIds.forEach((id) => {
    teams.forEach((t) => {
      if (t !== base && t.members.has(id)) {
        t.members.delete(id);
        if (t.members.size < 2) {
          teams = teams.filter((x) => x !== t);
          if (pinnedTeamId === t.id) pinnedTeamId = null;
        }
      }
    });
    base.members.add(id);
  });

  // Drop tiny teams
  teams = teams.filter((t) => t.members.size >= 2);
  if (base.members.size < 2) {
    if (pinnedTeamId === base.id) pinnedTeamId = null;
    forceRedraw();
    return null;
  }
  // Suppress tooltip after team mutations to prevent pop-up
  tooltipSuppressUntil = performance.now() + 800;
  hoveredDroneId = null;
  if (tooltipEl) tooltipEl.style.display = "none";
  forceRedraw();
  return base;
}

function detachFromTeam(droneId) {
  const team = getTeamForDrone(droneId);
  if (!team) return null;
  team.members.delete(droneId);
  if (team.members.size < 2) {
    teams = teams.filter((t) => t !== team);
    if (pinnedTeamId === team.id) {
      pinnedTeamId = null;
      // if one member remains, select it as a single drone
      const remaining = [...team.members][0];
      if (remaining !== undefined) setPinnedDrone(remaining);
    }
    forceRedraw();
    return null;
  }
  forceRedraw();
  return team;
}

function getTeamSnapshot(team) {
  const members = [...team.members]
    .map((id) => getDroneById(id))
    .map((d) => d && d.getLatest && d.getLatest())
    .filter(Boolean);
  if (!members.length) return null;
  const n = members.length;
  const sum = members.reduce(
    (acc, m) => {
      acc.lat += m.lat;
      acc.lng += m.lng;
      acc.alt += m.alt ?? 0;
      acc.battery += m.battery ?? 0;
      acc.rssi += m.rssi ?? -120;
      acc.armedAll = acc.armedAll && !!m.armed;
      return acc;
    },
    { lat: 0, lng: 0, alt: 0, battery: 0, rssi: 0, armedAll: true }
  );
  return {
    lat: sum.lat / n,
    lng: sum.lng / n,
    alt: sum.alt / n,
    battery: sum.battery / n,
    rssi: sum.rssi / n,
    heading: members[0].heading,
    command: members[0].command,
    armed: sum.armedAll,
  };
}

function scrollStatusIntoView(droneId) {
  const row = document.querySelector(`[data-drone-id="${droneId}"]`);
  if (!row) return;
  row.scrollIntoView({ block: "center", behavior: "smooth" });
}

function scrollTeamIntoView(teamId) {
  const header = document.querySelector(`.status-team-header[data-team-id="${teamId}"]`);
  if (!header) return;
  header.scrollIntoView({ block: "center", behavior: "smooth" });
}

function stopLiveDroneFollow() {
  if (!LIVE_POSITION_MODE) return;
  if (liveState.followAnimationFrame) {
    cancelAnimationFrame(liveState.followAnimationFrame);
  }
  liveState.followDroneId = null;
  liveState.followResumeAt = 0;
  liveState.followTargetLatLng = null;
  liveState.followFromLatLng = null;
  liveState.followAnimationStartedAt = 0;
  liveState.followAnimationDurationMs = LIVE_FOLLOW_ANIMATION_DURATION_MS;
  liveState.followAnimationFrame = 0;
}

function syncLiveDroneFollowState() {
  if (!LIVE_POSITION_MODE || liveState.followDroneId === null) return false;
  const followId = Number(liveState.followDroneId);
  if (!Number.isFinite(followId) || Number(pinnedDroneId) !== followId || !getDroneById(followId)) {
    stopLiveDroneFollow();
    return false;
  }
  return true;
}

function startLiveDroneFollow(id, { resumeDelayMs = 650 } = {}) {
  if (!LIVE_POSITION_MODE) return;
  const followId = Number(id);
  if (!Number.isFinite(followId) || !getDroneById(followId)) {
    stopLiveDroneFollow();
    return;
  }
  liveState.followDroneId = followId;
  liveState.followTargetLatLng = null;
  liveState.followFromLatLng = null;
  liveState.followAnimationStartedAt = 0;
  liveState.followAnimationDurationMs = LIVE_FOLLOW_ANIMATION_DURATION_MS;
  const now = typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
  liveState.followResumeAt = now + Math.max(0, Number(resumeDelayMs) || 0);
}

function runLiveDroneFollowAnimationFrame() {
  liveState.followAnimationFrame = 0;
  if (!LIVE_POSITION_MODE || !map || !syncLiveDroneFollowState()) return;
  const from = liveState.followFromLatLng;
  const target = liveState.followTargetLatLng;
  if (!from || !target) return;
  const fromLat = Number(from.lat);
  const fromLng = Number(from.lng);
  const targetLat = Number(target.lat);
  const targetLng = Number(target.lng);
  if (![fromLat, fromLng, targetLat, targetLng].every(Number.isFinite)) return;

  const now = typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
  const durationMs = Math.max(1, Number(liveState.followAnimationDurationMs) || LIVE_FOLLOW_ANIMATION_DURATION_MS);
  const rawT = (now - Number(liveState.followAnimationStartedAt || now)) / durationMs;
  const t = clamp01(rawT);
  const eased = sigmoid01(t, 11);
  const lat = fromLat + (targetLat - fromLat) * eased;
  const lng = fromLng + (targetLng - fromLng) * eased;
  map.setView([lat, lng], map.getZoom(), { animate: false });

  if (t < 1) {
    liveState.followAnimationFrame = requestAnimationFrame(runLiveDroneFollowAnimationFrame);
    return;
  }

  liveState.followFromLatLng = { lat: targetLat, lng: targetLng };
}

function queueLiveDroneFollowCenter(drone, { force = false } = {}) {
  if (!LIVE_POSITION_MODE || !map || !drone || !syncLiveDroneFollowState()) return;
  if (Number(drone.id) !== Number(liveState.followDroneId)) return;
  const now = typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
  if (!force && Number(liveState.followResumeAt) > now) return;
  const latest = drone.getLatest && drone.getLatest();
  const lat = Number(latest?.lat);
  const lng = Number(latest?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

  const center = map.getCenter();
  liveState.followFromLatLng = { lat: center.lat, lng: center.lng };
  liveState.followTargetLatLng = { lat, lng };
  liveState.followAnimationStartedAt = now;
  liveState.followAnimationDurationMs = LIVE_FOLLOW_ANIMATION_DURATION_MS;
  if (!liveState.followAnimationFrame) {
    liveState.followAnimationFrame = requestAnimationFrame(runLiveDroneFollowAnimationFrame);
  }
}

function setPinnedDrone(id) {
  const nextTeam = getTeamForDrone(id);
  const nextTeamId = nextTeam ? nextTeam.id : null;
  const nextDroneId = nextTeam ? null : id;
  clearTooltipPinnedIfSelectionChanges(nextDroneId, nextTeamId);
  const team = getTeamForDrone(id);
  pinnedTeamId = team ? team.id : null;
  pinnedDroneId = team ? null : id;
  syncLiveDroneFollowState();
  hoveredDroneId = id;
  tooltipMode = "info";
  closeSequenceMenu();
  closeOrbitMenu(false, true);
  closeFlankMenu(false, true);
  // Only close waypoint menu if selecting a different drone; keep it if it's for the same drone.
  if (waypointDroneId === null || waypointDroneId !== id) {
    closeWaypointMenu();
  }
  closeFollowMenu(false);
  closeHomeMenu(false);
  tooltipSuppressUntil = 0;
  updateStatusList();
  scrollStatusIntoView(id);
  updateCommandSequencePanel();
  updateTooltip();
  if (team) {
    focusTeamView(team);
  }
  forceRedraw();
}

function setPinnedTeam(id, suppressTooltip = false) {
  stopLiveDroneFollow();
  clearTooltipPinnedIfSelectionChanges(null, id);
  pinnedTeamId = id;
  pinnedDroneId = null;
  hoveredDroneId = null;
  tooltipMode = "info";
  closeSequenceMenu();
  closeOrbitMenu(false, true);
  closeFlankMenu(false, true);
  closeWaypointMenu();
  closeFollowMenu(false);
  closeHomeMenu(false);
  tooltipSuppressUntil = suppressTooltip ? performance.now() + 800 : 0;
  if (suppressTooltip && tooltipEl) tooltipEl.style.display = "none";
  updateStatusList();
  if (lastCreatedTeamId !== null && lastCreatedTeamId === id) {
    scrollTeamIntoView(id);
    lastCreatedTeamId = null;
  }
  updateCommandSequencePanel();
  updateTooltip();
  forceRedraw();
  const team = getTeamById(id);
  if (map && team) {
    requestAnimationFrame(() => focusTeamView(team));
    setTimeout(() => focusTeamView(team), 160);
    setTimeout(forceRedraw, 180);
  }
}

function rssiLevelFromDbm(rssi) {
  if (rssi === null || rssi === undefined || !isFinite(rssi)) return 0;
  if (rssi < -120) return 0;
  if (rssi < -110) return 1;
  if (rssi < -100) return 2;
  if (rssi < -88) return 3;
  return 4;
}

function focusDroneById(id) {
  const d = getDroneById(id);
  if (!d || !map) return;
  const team = getTeamForDrone(id);
  const latest = team ? getTeamSnapshot(team) : d.getLatest && d.getLatest();
  if (!latest) return;

  if (team) setPinnedTeam(team.id);
  else setPinnedDrone(d.id);
  const targetZoom = Math.max(map.getZoom(), 14);
  if (team) {
    focusTeamView(team);
  } else {
    map.flyTo([latest.lat, latest.lng], targetZoom, { duration: 0.6 });
  }
}

function getHoverRadius() {
  const zoom = map ? map.getZoom() : 10;
  return Math.max(12, Math.min(22, zoom * 1.2));
}

function findNearestDrone(containerPoint, maxDist) {
  let best = null;
  let bestDist = maxDist;
  drones.forEach((d) => {
    const latest = d.getLatest && d.getLatest();
    if (!latest) return;
    const p = map.latLngToContainerPoint([latest.lat, latest.lng]);
    const dist = Math.hypot(p.x - containerPoint.x, p.y - containerPoint.y);
    if (dist < bestDist) {
      best = d;
      bestDist = dist;
    }
  });
  return best;
}

function findNearestGroundStation(containerPoint, maxDist) {
  let best = null;
  let bestDist = maxDist;
  groundStations.forEach((g) => {
    const p = map.latLngToContainerPoint([g.lat, g.lng]);
    const dist = Math.hypot(p.x - containerPoint.x, p.y - containerPoint.y);
    if (dist < bestDist) {
      best = g;
      bestDist = dist;
    }
  });
  return best;
}

function createWaypoint(lat, lng, { name = null } = {}) {
  const id = nextWaypointId++;
  const wp = { id, lat: Number(lat), lng: Number(lng), name: name || null };
  waypoints.set(id, wp);
  return wp;
}

function getWaypointById(id) {
  return waypoints.get(Number(id));
}

function updateWaypointPosition(id, lat, lng) {
  const wp = getWaypointById(id);
  if (!wp) return null;
  wp.lat = Number(lat);
  wp.lng = Number(lng);
  return wp;
}

function normalizeWaypointTarget(droneId) {
  const t = waypointTargets.get(droneId);
  if (!t) return null;
  // Legacy shape: { lat, lng, speedKmh, altM } -> promote to waypoint object.
  if (t.wpId === undefined && t.lat !== undefined && t.lng !== undefined) {
    const wp = createWaypoint(t.lat, t.lng);
    const speedKmh = t.speedKmh;
    const altM = t.altM;
    waypointTargets.set(droneId, { wpId: wp.id, speedKmh, altM });
    return waypointTargets.get(droneId);
  }
  return t;
}

function getAnyDroneTargetingWaypoint(wpId, { excludeDroneId = null } = {}) {
  const id = Number(wpId);
  for (const [droneId, t0] of waypointTargets.entries()) {
    const t = normalizeWaypointTarget(droneId);
    if (!t) continue;
    if (excludeDroneId !== null && droneId === excludeDroneId) continue;
    if (Number(t.wpId) === id) return droneId;
  }
  return null;
}

function findNearestWaypoint(containerPoint, maxDist = 14) {
  let best = null;
  let bestDist = maxDist;
  waypoints.forEach((wp, wpId) => {
    const p = map.latLngToContainerPoint([wp.lat, wp.lng]);
    const dist = Math.hypot(p.x - containerPoint.x, p.y - containerPoint.y);
    if (dist < bestDist) {
      best = { wpId, wp, point: p };
      bestDist = dist;
    }
  });
  return best;
}

function metersToPixelsAtLatLng(lat, lng, meters) {
  if (!map) return 0;
  const latNum = Number(lat);
  const lngNum = Number(lng);
  const m = Number(meters);
  if (!isFinite(latNum) || !isFinite(lngNum) || !isFinite(m) || m <= 0) return 0;
  const metersPerDegLng = 111320 * Math.cos((latNum * Math.PI) / 180);
  if (!isFinite(metersPerDegLng) || metersPerDegLng === 0) return 0;
  const dLng = m / metersPerDegLng;
  const a = map.latLngToContainerPoint([latNum, lngNum]);
  const b = map.latLngToContainerPoint([latNum, lngNum + dLng]);
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function resolveOrbitCenter(anchor) {
  if (!anchor) return null;
  if (anchor.type === "wp") {
    if (anchor.wpId !== null && anchor.wpId !== undefined) {
      const wp = getWaypointById(anchor.wpId);
      if (wp) return { lat: wp.lat, lng: wp.lng };
    }
    return { lat: anchor.lat, lng: anchor.lng };
  }
  if (anchor.type === "home") {
    const gs = groundStations.find((g) => g.id === anchor.stationId);
    if (gs) return { lat: gs.lat, lng: gs.lng };
  }
  if (anchor.type === "drone") {
    const d = getDroneById(anchor.targetId);
    const l = d && d.getLatest && d.getLatest();
    if (l) return { lat: l.lat, lng: l.lng };
  }
  return null;
}

function resolveFlankAnchor(anchor) {
  if (!anchor) return null;
  if (anchor.type === "wp") {
    if (anchor.wpId !== null && anchor.wpId !== undefined) {
      const wp = getWaypointById(anchor.wpId);
      if (wp) return { lat: wp.lat, lng: wp.lng };
    }
    return { lat: anchor.lat, lng: anchor.lng };
  }
  if (anchor.type === "home") {
    const gs = groundStations.find((g) => g.id === anchor.stationId);
    if (gs) return { lat: gs.lat, lng: gs.lng };
  }
  return null;
}

function computeFlankSolution(anchorLatLng, approachBearing, diameterM, fromLatLng) {
  if (!anchorLatLng || !isFinite(approachBearing) || !isFinite(diameterM)) return null;
  if (!fromLatLng || !isFinite(fromLatLng.lat) || !isFinite(fromLatLng.lng)) return null;
  const bearing = ((approachBearing % 360) + 360) % 360;
  const d = Math.max(20, Number(diameterM) || 0);
  const baseBearing = bearingDeg(anchorLatLng.lat, anchorLatLng.lng, fromLatLng.lat, fromLatLng.lng);
  const secondBearingA = (baseBearing + 90 + 360) % 360;
  const secondBearingB = (baseBearing - 90 + 360) % 360;
  const secondPointA = destinationLatLng(anchorLatLng.lat, anchorLatLng.lng, secondBearingA, d);
  const secondPointB = destinationLatLng(anchorLatLng.lat, anchorLatLng.lng, secondBearingB, d);

  // Compute circle center from: target T, second point S, and tangent direction at T (approachBearing).
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371000;
  const lat0 = anchorLatLng.lat;
  const lng0 = anchorLatLng.lng;
  const cosLat = Math.cos(toRad(lat0));
  const toXY = (p) => ({
    x: (toRad(p.lng - lng0) * R) * cosLat,
    y: toRad(p.lat - lat0) * R,
  });
  const toLL = (p) => ({
    lat: lat0 + (p.y / R) * (180 / Math.PI),
    lng: lng0 + (p.x / (R * cosLat)) * (180 / Math.PI),
  });

  const T = { x: 0, y: 0 };
  const theta = toRad(bearing);
  const n = { x: Math.cos(theta), y: -Math.sin(theta) }; // normal to tangent (bearing 0 = +y)
  const bearingVec = { x: Math.sin(theta), y: Math.cos(theta) };
  const droneXY = toXY(fromLatLng);
  const dot = droneXY.x * bearingVec.x + droneXY.y * bearingVec.y;

  if (dot <= 0) {
    const offsetXY = { x: -bearingVec.x * d, y: -bearingVec.y * d };
    const entryPoint = toLL(offsetXY);
    const distToEntry = haversine2dMeters(fromLatLng.lat, fromLatLng.lng, entryPoint.lat, entryPoint.lng);
    const distToTarget = haversine2dMeters(entryPoint.lat, entryPoint.lng, anchorLatLng.lat, anchorLatLng.lng);
    return {
      pathType: "line",
      entryPoint,
      secondPoint: entryPoint,
      totalDistM: distToEntry + distToTarget,
      distToEntry,
      segmentLenM: distToTarget,
      direction: null,
    };
  }

  const buildGeom = (secondPoint) => {
    const S = toXY(secondPoint);
    const mid = { x: S.x / 2, y: S.y / 2 };
    const dVec = { x: -S.y, y: S.x }; // perpendicular to TS
    const det = n.x * dVec.y - n.y * dVec.x;
    let centerXY = null;
    if (Math.abs(det) > 1e-6) {
      const t = ((mid.x - T.x) * dVec.y - (mid.y - T.y) * dVec.x) / det;
      centerXY = { x: T.x + n.x * t, y: T.y + n.y * t };
    } else {
      centerXY = { x: n.x * (d / 2), y: n.y * (d / 2) };
    }

    const center = toLL(centerXY);
    const radiusM = Math.hypot(centerXY.x - T.x, centerXY.y - T.y);
    const entryPoint = secondPoint;
    const aEntry = Math.atan2(S.y - centerXY.y, S.x - centerXY.x);
    const aTarget = Math.atan2(T.y - centerXY.y, T.x - centerXY.x);
    return { center, radiusM, entryPoint, aEntry, aTarget, secondPoint };
  };

  const geomA = buildGeom(secondPointA);
  const geomB = buildGeom(secondPointB);

  const toBearingDeg = (rad) => ((90 - (rad * 180) / Math.PI + 360) % 360);
  const bearingError = (bearingA, bearingB) => {
    const diff = ((bearingA - bearingB + 540) % 360) - 180;
    return Math.abs(diff);
  };

  const options = [];
  [geomA, geomB].forEach((geom) => {
    const distToEntry = haversine2dMeters(fromLatLng.lat, fromLatLng.lng, geom.entryPoint.lat, geom.entryPoint.lng);
    ["CW", "CCW"].forEach((direction) => {
      const arcLen = arcLengthForDirection(geom.radiusM, geom.aEntry, geom.aTarget, direction);
      const totalDistM = distToEntry + arcLen;
      const tangentAngle = geom.aTarget + (direction === "CCW" ? Math.PI / 2 : -Math.PI / 2);
      const tangentBearing = toBearingDeg(tangentAngle);
      const alignErr = bearingError(tangentBearing, approachBearing);
      options.push({ ...geom, direction, totalDistM, distToEntry, arcLen, alignErr, tangentBearing });
    });
  });

  options.sort((a, b) => {
    if (a.alignErr !== b.alignErr) return a.alignErr - b.alignErr;
    return a.totalDistM - b.totalDistM;
  });
  if (!options[0]) return null;
  return { ...options[0], pathType: "arc" };
}

function arcLengthForDirection(radiusM, aStart, aEnd, direction) {
  if (!isFinite(radiusM) || radiusM <= 0) return 0;
  const twoPi = Math.PI * 2;
  const normalize = (v) => ((v % twoPi) + twoPi) % twoPi;
  const delta = direction === "CCW" ? normalize(aEnd - aStart) : normalize(aStart - aEnd);
  return delta * radiusM;
}

function drawFlankVisualization(anchorLatLng, approachBearing, diameterM, direction, approachSpeedKmh, fromLatLng) {
  if (!anchorLatLng || !map) return;
  const geom = computeFlankSolution(anchorLatLng, approachBearing, diameterM, fromLatLng);
  if (!geom) return;

  const chosenDir = geom.direction || direction || "CW";
  const t = latLngToScreen(anchorLatLng.lat, anchorLatLng.lng);
  const s = latLngToScreen(geom.entryPoint.lat, geom.entryPoint.lng);
  if (!t || !s) return;

  // Line from drone to the entry point
  if (fromLatLng) {
    const f = latLngToScreen(fromLatLng.lat, fromLatLng.lng);
    if (f) {
      ctx.save();
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = "rgba(255,255,255,0.65)";
      ctx.beginPath();
      ctx.moveTo(f.x, f.y);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
      ctx.restore();
    }
  }

  if (geom.pathType === "line") {
    ctx.save();
    ctx.setLineDash([]);
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = "rgba(120,220,255,0.8)";
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(t.x, t.y);
    ctx.stroke();
    ctx.restore();

    // Arrow head at target indicating approach bearing
      const tangentAngle = ((approachBearing - 90) * Math.PI) / 180;
    const arrowLen = Math.max(10, Math.min(18, Math.hypot(t.x - s.x, t.y - s.y) * 0.2));
    const arrowW = arrowLen * 0.6;
    ctx.save();
    ctx.translate(t.x, t.y);
    ctx.rotate(tangentAngle);
    ctx.fillStyle = "rgba(120,220,255,0.9)";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-arrowLen, arrowW / 2);
    ctx.lineTo(-arrowLen, -arrowW / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else {
    const c = geom.center ? latLngToScreen(geom.center.lat, geom.center.lng) : null;
    if (!c) return;
    const rPx = Math.hypot(t.x - c.x, t.y - c.y);
    const aStart = Math.atan2(s.y - c.y, s.x - c.x);
    const aEnd = Math.atan2(t.y - c.y, t.x - c.x);
    const ccw = chosenDir === "CCW";

    // Arc path
    ctx.save();
    ctx.setLineDash([4, 6]);
    ctx.lineWidth = 2.0;
    ctx.strokeStyle = "rgba(120,220,255,0.8)";
    ctx.beginPath();
    ctx.arc(c.x, c.y, rPx, aStart, aEnd, ccw);
    ctx.stroke();
    ctx.restore();

    // Arrow head at target indicating direction
    const tangentAngle = aEnd + (ccw ? -Math.PI / 2 : Math.PI / 2);
    const arrowLen = Math.max(10, Math.min(18, rPx * 0.08));
    const arrowW = arrowLen * 0.6;
    const ax = t.x;
    const ay = t.y;
    ctx.save();
    ctx.translate(ax, ay);
    ctx.rotate(tangentAngle);
    ctx.fillStyle = "rgba(120,220,255,0.9)";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-arrowLen, arrowW / 2);
    ctx.lineTo(-arrowLen, -arrowW / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Mark the entry point
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  const markR = geom.pathType === "line" ? 4 : Math.max(3, Math.min(10, (map.getZoom ? map.getZoom() : 12) * 0.35));
  ctx.beginPath();
  ctx.arc(s.x, s.y, markR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawOrbitVisualization(centerLatLng, radiusM, direction, orbitSpeedKmh = null, orbitPeriodMin = null, fromLatLng = null) {
  if (!ctx || !map || !centerLatLng) return;
  const cxcy = latLngToScreen(centerLatLng.lat, centerLatLng.lng);
  const rPx = metersToPixelsAtLatLng(centerLatLng.lat, centerLatLng.lng, radiusM);
  if (!isFinite(rPx) || rPx < 6) return;

  const stroke = SETTINGS.SELECTION_GLOW_COLOR || "rgba(120,220,255,1.0)";

  // Radius label (top of the circle) so it's visible even when the finger covers the slider.
  {
    const rLabel = `${Math.round(Number(radiusM) || 0)} m`;
    const sLabel =
      orbitSpeedKmh !== null && orbitSpeedKmh !== undefined && isFinite(Number(orbitSpeedKmh))
        ? `${Math.round(Number(orbitSpeedKmh))} km/h`
        : null;
    const x = cxcy.x;
    const y = cxcy.y - rPx - 14;
    ctx.save();
    ctx.font = "800 12px Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.65)";
    ctx.shadowBlur = 10;
    ctx.strokeStyle = "rgba(0,0,0,0.70)";
    ctx.lineWidth = 2;
    if (sLabel) ctx.strokeText(sLabel, x, y - 14);
    ctx.strokeText(rLabel, x, y);
    ctx.fillStyle = "rgba(255,255,255,0.98)";
    if (sLabel) ctx.fillText(sLabel, x, y - 14);
    ctx.fillText(rLabel, x, y);
    ctx.restore();
  }

  // Approach line (from current selected entity to the orbit circle)
  if (fromLatLng && isFinite(fromLatLng.lat) && isFinite(fromLatLng.lng)) {
    const fromP = latLngToScreen(fromLatLng.lat, fromLatLng.lng);
    const dx = fromP.x - cxcy.x;
    const dy = fromP.y - cxcy.y;
    const len = Math.hypot(dx, dy);
    if (len > 2) {
      const ux = dx / len;
      const uy = dy / len;
      const targetX = cxcy.x + ux * rPx;
      const targetY = cxcy.y + uy * rPx;
      const segLen = Math.hypot(targetX - fromP.x, targetY - fromP.y);
      if (segLen > 6) {
        ctx.save();
        ctx.setLineDash([6, 6]);
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = "rgba(255,255,255,0.65)";
        ctx.beginPath();
        ctx.moveTo(fromP.x, fromP.y);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  // Center mark
  ctx.save();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(cxcy.x, cxcy.y, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = stroke;
  ctx.shadowColor = stroke;
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(0,0,0,0.55)";
  ctx.stroke();
  ctx.restore();

  // Radius circle
  ctx.save();
  ctx.setLineDash([]);
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = "rgba(120,220,255,0.10)";
  ctx.beginPath();
  ctx.arc(cxcy.x, cxcy.y, rPx, 0, Math.PI * 2);
  ctx.stroke();

  // Animated orbit arc + arrow (angular velocity is based on orbit period).
  const periodMin = Number(orbitPeriodMin);
  if (isFinite(periodMin) && periodMin > 0) {
    const periodSec = periodMin * 60;
    const frequencyHz = 1 / periodSec;
    const omega = 2 * Math.PI * frequencyHz; // rad/sec (real)
    const omegaVis = omega * 60; // visual speed-up so motion is obvious
    const dirSign = direction === "CCW" ? -1 : 1;
    const tSec = performance.now() / 1000;
    const start = -Math.PI / 2 + dirSign * ((omegaVis * tSec) % (Math.PI * 2));
    const arcSpan = Math.PI * 1.7; // long trail (~306°), but not a full circle
    const end = start + dirSign * arcSpan;

    // Futuristic "comet" trail: more transparent farther from the arrowhead.
    // (Draw as multiple short arc segments with increasing alpha toward the head.)
    const trailRgb = { r: 120, g: 220, b: 255 }; // match orbit center glow color
    const segs = Math.max(28, Math.min(90, Math.round(Math.abs(arcSpan) * 18)));
    const spanAbs = Math.abs(arcSpan);
    for (let i = 0; i < segs; i++) {
      const t0 = i / segs;
      const t1 = (i + 1) / segs;
      const a0 = start + dirSign * spanAbs * t0;
      const a1 = start + dirSign * spanAbs * t1;
      const strength = Math.pow(t1, 2.2); // bias brightness toward the head
      const alpha = 0.06 + strength * 0.86;

      ctx.save();
      ctx.setLineDash([]);
      ctx.lineWidth = 3.6;
      ctx.lineCap = "round";
      ctx.strokeStyle = `rgba(${trailRgb.r},${trailRgb.g},${trailRgb.b},${alpha})`;
      ctx.shadowColor = `rgba(${trailRgb.r},${trailRgb.g},${trailRgb.b},${Math.min(1, alpha)})`;
      ctx.shadowBlur = 14 * strength + 2;
      ctx.beginPath();
      ctx.arc(cxcy.x, cxcy.y, rPx, a0, a1, dirSign < 0);
      ctx.stroke();
      ctx.restore();
    }

    // Arrowhead (stroked V) at the leading edge
    const tipX = cxcy.x + rPx * Math.cos(end);
    const tipY = cxcy.y + rPx * Math.sin(end);
    const tangent = end + dirSign * (Math.PI / 2);
    // Scale arrowhead with orbit radius in pixels (already reflects zoom).
    // Keep it proportional so it doesn't look huge on small orbits / too tiny on big orbits.
    const size = Math.max(8, Math.min(28, rPx * 0.22));
    const phi = Math.PI / 7; // tighter arrowhead
    const a1 = tangent + Math.PI - phi;
    const a2 = tangent + Math.PI + phi;
    const x1 = tipX + Math.cos(a1) * size;
    const y1 = tipY + Math.sin(a1) * size;
    const x2 = tipX + Math.cos(a2) * size;
    const y2 = tipY + Math.sin(a2) * size;

    ctx.setLineDash([]);
    ctx.lineWidth = 4.2;
    ctx.lineCap = "round";
    ctx.strokeStyle = `rgba(${trailRgb.r},${trailRgb.g},${trailRgb.b},1)`;
    ctx.shadowColor = `rgba(${trailRgb.r},${trailRgb.g},${trailRgb.b},1)`;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(tipX, tipY);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  ctx.restore();
}

function isOrbitAnimationWanted() {
  // While the orbit menu is open, always animate the preview (even if selection snapshot is transient).
  if (orbitMenuEl && pendingOrbit && isFinite(Number(pendingOrbit.orbitPeriodMin)) && Number(pendingOrbit.orbitPeriodMin) > 0) {
    return true;
  }
  const sel = getSelectedEntity();
  const key = getSelectionKey(sel);
  if (!sel || !key) return false;
  const preview = orbitPreview && orbitPreview.key === key ? orbitPreview.orbit : null;
  if (preview && preview.anchor && isFinite(Number(preview.orbitPeriodMin)) && Number(preview.orbitPeriodMin) > 0) return true;
  if (pinnedTeamId !== null) {
    const team = getTeamById(pinnedTeamId);
    if (!team) return false;
    for (const id of team.members) {
      const spec = orbitTargets.get(id);
      if (spec && spec.anchor && isFinite(Number(spec.orbitPeriodMin)) && Number(spec.orbitPeriodMin) > 0) return true;
    }
    return false;
  }
  if (pinnedDroneId !== null) {
    const spec = orbitTargets.get(pinnedDroneId);
    return !!(spec && spec.anchor && isFinite(Number(spec.orbitPeriodMin)) && Number(spec.orbitPeriodMin) > 0);
  }
  return false;
}

function ensureOrbitAnimationLoop() {
  if (!isOrbitAnimationWanted()) {
    orbitAnim.running = false;
    if (orbitAnim.raf) cancelAnimationFrame(orbitAnim.raf);
    orbitAnim.raf = 0;
    return;
  }
  if (orbitAnim.running) return;
  orbitAnim.running = true;
  orbitAnim.lastFrame = 0;

  const tick = (t) => {
    if (!orbitAnim.running) return;
    if (!isOrbitAnimationWanted()) {
      orbitAnim.running = false;
      orbitAnim.raf = 0;
      return;
    }
    // ~30fps cap
    if (!orbitAnim.lastFrame || t - orbitAnim.lastFrame >= 33) {
      orbitAnim.lastFrame = t;
      draw();
    }
    orbitAnim.raf = requestAnimationFrame(tick);
  };

  orbitAnim.raf = requestAnimationFrame(tick);
}

function renderCommandList() {
  const host = document.getElementById("commandList");
  if (!host) return;
  host.innerHTML = "";
  COMMAND_OPTIONS.forEach((cmd) => {
    const el = document.createElement("div");
    el.className = "cmd-chip";
    el.textContent = cmd;
    host.appendChild(el);
  });
}

function getSelectedEntity() {
  if (pinnedTeamId !== null) {
    const team = getTeamById(pinnedTeamId);
    if (!team) return null;
    const latest = getTeamSnapshot(team);
    return latest ? { type: "team", id: team.id, latest } : null;
  }
  if (pinnedDroneId !== null) {
    const drone = getDroneById(pinnedDroneId);
    const latest = drone && drone.getLatest && drone.getLatest();
    return drone && latest ? { type: "drone", id: drone.id, latest } : null;
  }
  return null;
}

function getSelectionKey(sel) {
  if (!sel) return null;
  return sel.type === "team" ? `team:${sel.id}` : `drone:${sel.id}`;
}

function setSequenceSelection(key, index) {
  sequenceSelected = { key, index: Math.max(0, index | 0) };
}

function getSequenceActiveIndex(key) {
  const v = sequenceActiveIndexByKey.get(key);
  return Number.isFinite(v) ? v : 0;
}

function setSequenceActiveIndex(key, index) {
  if (!key) return;
  sequenceActiveIndexByKey.set(key, Math.max(0, index | 0));
  updateCommandSequencePanel();
}

function isSequencePlaying(key) {
  return !!(key && sequencePlayingByKey.get(key));
}

function setSequencePlaying(key, playing) {
  if (!key) return;
  sequencePlayingByKey.set(key, !!playing);
  updateCommandSequencePanel();
}

function updateSequenceTransport(key) {
  const playBtn = document.getElementById("seqPlayBtn");
  if (!playBtn) return;
  const canControl = !!key;
  playBtn.disabled = !canControl;
  playBtn.style.opacity = canControl ? "1" : "0.45";
  const playing = canControl && isSequencePlaying(key);
  playBtn.dataset.state = playing ? "pause" : "play";
  playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
}

function getClosestHomeForSelection(sel) {
  if (!sel || !groundStations || groundStations.length === 0) return null;
  const latest = sel.latest;
  if (!latest) return null;
  let bestId = null;
  let bestDist = Infinity;
  groundStations.forEach((gs) => {
    const dist = haversine2dMeters(latest.lat, latest.lng, gs.lat, gs.lng);
    if (isFinite(dist) && dist < bestDist) {
      bestDist = dist;
      bestId = gs.id;
    }
  });
  return bestId;
}

function executeSelectedSequenceCommand() {
  const sel = getSelectedEntity();
  const key = getSelectionKey(sel);
  if (!sel || !key) return;

  const planned = groundControl ? groundControl.getPlanned(key) : [];
  if (!planned.length) return;

  const idx = sequenceSelected.key === key ? sequenceSelected.index : getSequenceActiveIndex(key);
  const bounded = Math.max(0, Math.min(planned.length - 1, idx | 0));
  const cmd = planned[bounded];
  if (!cmd || cmd === "Idle") return;

  // Commands that require additional context (target/waypoint) are not runnable from sequence yet.
  if (
    cmd === "Goto WP" ||
    cmd === "Follow drone" ||
    cmd.startsWith("Follow drone") ||
    cmd === "Search target" ||
    cmd === "Attack target" ||
    cmd === "Boid group"
  ) {
    window.alert(`"${cmd}" needs additional context and can't be executed from the sequence yet.`);
    return;
  }

  // Mark the played item (order does not change; only the marker moves).
  setSequenceActiveIndex(key, bounded);
  setSequencePlaying(key, true);

  // Map command label to behavior.
    const runLocal = (c) => {
      if (sel.type === "team") {
        const team = getTeamById(sel.id);
        if (team) issueTeamCommand(team, c, { fromSequence: true });
      } else {
        const d = getDroneById(sel.id);
        if (d) issueLocalCommand(d, c, { fromSequence: true });
      }
    };

  if (["Arm", "Disarm", "Takeoff", "Land", "Hold position"].includes(cmd)) {
    runLocal(cmd);
    return;
  }

  // Goto WP from sequence: "Goto WP #<id> (spd <n> km/h, alt <m> m)"
  if (cmd.startsWith("Goto WP #")) {
    const parsed = parseGotoWpSequenceCommand(cmd);
    if (!parsed) return;
    const { wpId, speedKmh: speed, altM: alt } = parsed;
    const wp = getWaypointById(wpId);
    if (!wp) {
      window.alert(`Waypoint #${wpId} was not found.`);
      return;
    }
    const payload = { wpId, lat: wp.lat, lng: wp.lng, speedKmh: speed, altM: alt };
    if (sel.type === "team") {
      const team = getTeamById(sel.id);
      if (!team) return;
      [...team.members].forEach((id) => {
        const d = getDroneById(id);
        if (d) issueGotoWaypointSingle(d, payload, { fromSequence: true, selectionKey: `drone:${id}` });
      });
    } else {
      const d = getDroneById(sel.id);
      if (d) issueGotoWaypointSingle(d, payload, { fromSequence: true, selectionKey: `drone:${d.id}` });
    }
    return;
  }

  if (cmd === "Return to Home" || cmd.startsWith("Return home")) {
    // If the sequence item specifies a home number and/or mode, honor it.
    // Examples:
    // - "Return home #2 (hover)"
    // - "Return home #1 (land)"
    // - "Return to Home" (fallback to closest)
    const m = String(cmd).match(/Return home\s*#\s*(\d+)\s*\(\s*(land|hover)\s*\)/i);
    const modeMatch = String(cmd).match(/\(\s*(land|hover)\s*\)/i);
    const parsedMode = modeMatch ? modeMatch[1].toLowerCase() : "land";
    const parsedHomeId = m ? Number(m[1]) - 1 : null;
    const homeId = Number.isFinite(parsedHomeId) ? parsedHomeId : getClosestHomeForSelection(sel);
    if (homeId === null || homeId === undefined) return;
    if (sel.type === "team") issueReturnHome({ teamId: sel.id, stationId: homeId, mode: parsedMode }, { fromSequence: true });
    else issueReturnHome({ droneId: sel.id, stationId: homeId, mode: parsedMode }, { fromSequence: true });
    return;
  }
}

function issueHoldPositionNoSequenceChangeSingle(droneId) {
  const drone = getDroneById(droneId);
  if (!drone) return;
  const latest = drone.getLatest && drone.getLatest();
  if (!latest) return;
  // Keep altitude; just switch command.
  const next = { ...latest, command: "Hold position", uptimeSec: latest.uptimeSec + 0.01 };
  drone.updateTelemetry(next);
  if (groundControl) groundControl.assignMission(drone.id, "Hold position");
}

function pauseSelectedEntity() {
  const sel = getSelectedEntity();
  const key = getSelectionKey(sel);
  if (!sel) return;
  if (key) setSequencePlaying(key, false);
  const inAir = isInAir(sel.latest);
  if (!inAir) return;
  if (sel.type === "team") {
    const team = getTeamById(sel.id);
    if (team) {
      [...team.members].forEach((id) => issueHoldPositionNoSequenceChangeSingle(id));
      // Keep planned sequence as-is on pause.
      tooltipMode = "info";
      updateStatusList();
      updateCommandSequencePanel();
      updateTooltip();
      draw();
    }
  } else {
    issueHoldPositionNoSequenceChangeSingle(sel.id);
    // Keep planned sequence as-is on pause.
    tooltipMode = "info";
    updateStatusList();
    updateCommandSequencePanel();
    updateTooltip();
    draw();
  }
}

function closeSequenceMenu() {
  if (sequenceMenuEl && sequenceMenuEl.parentNode) {
    sequenceMenuEl.parentNode.removeChild(sequenceMenuEl);
  }
  sequenceMenuEl = null;
  document.removeEventListener("pointerdown", handleSequenceMenuOutside, true);
}

function closeSequenceGotoWpMenu() {
  if (sequenceGotoWpMenuEl && sequenceGotoWpMenuEl.parentNode) {
    sequenceGotoWpMenuEl.parentNode.removeChild(sequenceGotoWpMenuEl);
  }
  sequenceGotoWpMenuEl = null;
  pendingSequenceGotoWp = null;
  document.removeEventListener("pointerdown", handleSequenceGotoWpOutside, true);
}

function closeSequenceGotoWpEditMenu() {
  if (sequenceGotoWpEditMenuEl && sequenceGotoWpEditMenuEl.parentNode) {
    sequenceGotoWpEditMenuEl.parentNode.removeChild(sequenceGotoWpEditMenuEl);
  }
  sequenceGotoWpEditMenuEl = null;
  pendingSequenceGotoWpEdit = null;
  document.removeEventListener("pointerdown", handleSequenceGotoWpEditOutside, true);
}

function handleSequenceMenuOutside(e) {
  if (!sequenceMenuEl) return;
  if (sequenceMenuEl.contains(e.target)) return;
  closeSequenceMenu();
}

function handleSequenceGotoWpOutside(e) {
  if (!sequenceGotoWpMenuEl) return;
  if (sequenceGotoWpMenuEl.contains(e.target)) return;
  closeSequenceGotoWpMenu();
}

function handleSequenceGotoWpEditOutside(e) {
  if (!sequenceGotoWpEditMenuEl) return;
  if (sequenceGotoWpEditMenuEl.contains(e.target)) return;
  closeSequenceGotoWpEditMenu();
}

function setSequenceGotoWpAtIndex(key, index, wpId, speedKmh, altM) {
  if (!groundControl || !key) return;
  const planned = groundControl.getPlanned(key);
  if (!planned || !planned.length) return;
  const i = Math.max(0, Math.min(planned.length - 1, Number(index) || 0));
  const cmd = `Goto WP #${wpId} (spd ${Math.round(speedKmh)} km/h, alt ${Math.round(altM)} m)`;
  const next = [...planned];
  next[i] = cmd;
  groundControl.setPlanned(key, next);
}

function openSequenceGotoWpEditMenu(anchorEl, key, index, parsed) {
  if (!anchorEl || !key || parsed === null || parsed === undefined) return;
  if (!groundControl) return;
  const { wpId, speedKmh, altM } = parsed;

  closeSequenceGotoWpEditMenu();
  const host = document.getElementById("app") || document.body;
  sequenceGotoWpEditMenuEl = document.createElement("div");
  sequenceGotoWpEditMenuEl.className = "relative-menu";
  host.appendChild(sequenceGotoWpEditMenuEl);
  sequenceGotoWpEditMenuEl.addEventListener("pointerdown", (ev) => ev.stopPropagation());
  enableMenuDrag(sequenceGotoWpEditMenuEl);

  pendingSequenceGotoWpEdit = { key, index, wpId };

  const initSpeed = Math.max(10, Math.min(100, Math.round(Number(speedKmh) || 60)));
  const initAlt = Math.max(5, Math.min(100, Math.round(Number(altM) || 30)));

  const wp = getWaypointById(wpId);
  const sel = getSelectedEntity();
  const origin = sel && sel.latest ? { lat: sel.latest.lat, lng: sel.latest.lng } : null;
  const distKm =
    origin && wp ? haversine2dMeters(origin.lat, origin.lng, wp.lat, wp.lng) / 1000 : null;

  const formatEta = (km, spdKmh) => {
    if (!isFinite(km) || !isFinite(spdKmh) || spdKmh <= 0) return "N/A";
    const totalSec = (km / spdKmh) * 3600;
    const m = Math.floor(totalSec / 60);
    const s = Math.max(0, Math.round(totalSec - m * 60));
    return `${m}m ${s.toString().padStart(2, "0")}s`;
  };

  const getEtaLabel = (spdKmh) => (distKm !== null && isFinite(distKm) ? formatEta(distKm, spdKmh) : "N/A");

  sequenceGotoWpEditMenuEl.innerHTML = `
    <div class="menu-head">
      <h4>WP #${wpId}</h4>
      <span class="menu-eta" data-edit-eta>${getEtaLabel(initSpeed)}</span>
    </div>
    <div class="speed-row">
      <span class="slider-label">Speed</span>
      <input type="range" min="10" max="100" value="${initSpeed}" step="1" data-edit-speed>
      <span class="slider-value" data-edit-speed-label>${initSpeed} km/h</span>
    </div>
    <div class="speed-row">
      <span class="slider-label">Altitude</span>
      <input type="range" min="5" max="100" value="${initAlt}" step="1" data-edit-alt>
      <span class="slider-value" data-edit-alt-label>${initAlt} m</span>
    </div>
  `;

  // Position to the right of the Commands Sequence panel, aligned with the row's Y.
  const hostRect = host.getBoundingClientRect();
  const rowRect = anchorEl.getBoundingClientRect();
  // Match the popover header row height to the sequence item height for clean alignment.
  const headEl = sequenceGotoWpEditMenuEl.querySelector(".menu-head");
  if (headEl) {
    const h = Math.max(28, Math.round(rowRect.height || 0));
    headEl.style.height = `${h}px`;
    headEl.style.minHeight = `${h}px`;
  }
  const panelEl = anchorEl.closest("aside.panel.left") || document.querySelector("aside.panel.left");
  const panelRect = panelEl ? panelEl.getBoundingClientRect() : null;
  const pad = 10;
  const menuW = sequenceGotoWpEditMenuEl.offsetWidth || 270;
  const menuH = sequenceGotoWpEditMenuEl.offsetHeight || 190;
  let left = panelRect ? panelRect.right - hostRect.left + pad : rowRect.right - hostRect.left + pad;
  let top = rowRect.top - hostRect.top;
  left = Math.max(pad, Math.min(hostRect.width - menuW - pad, left));
  top = Math.max(pad, Math.min(hostRect.height - menuH - pad, top));
  sequenceGotoWpEditMenuEl.style.left = `${left}px`;
  sequenceGotoWpEditMenuEl.style.top = `${top}px`;

  const speedEl = sequenceGotoWpEditMenuEl.querySelector("[data-edit-speed]");
  const speedLbl = sequenceGotoWpEditMenuEl.querySelector("[data-edit-speed-label]");
  const altEl = sequenceGotoWpEditMenuEl.querySelector("[data-edit-alt]");
  const altLbl = sequenceGotoWpEditMenuEl.querySelector("[data-edit-alt-label]");
  const etaEl = sequenceGotoWpEditMenuEl.querySelector("[data-edit-eta]");

  const apply = () => {
    const s = speedEl ? Math.round(Number(speedEl.value) || initSpeed) : initSpeed;
    const a = altEl ? Math.round(Number(altEl.value) || initAlt) : initAlt;
    if (etaEl) etaEl.textContent = getEtaLabel(s);
    setSequenceGotoWpAtIndex(key, index, wpId, s, a);
    updateCommandSequencePanel();
  };

  if (speedEl && speedLbl) {
    speedEl.addEventListener("input", () => {
      const s = Math.round(Number(speedEl.value) || initSpeed);
      speedLbl.textContent = `${s} km/h`;
      apply();
    });
  }
  if (altEl && altLbl) {
    altEl.addEventListener("input", () => {
      const a = Math.round(Number(altEl.value) || initAlt);
      altLbl.textContent = `${a} m`;
      apply();
    });
  }

  // Ensure initial values are normalized into the canonical command string.
  apply();
  document.addEventListener("pointerdown", handleSequenceGotoWpEditOutside, true);
}

function openSequenceGotoWpMenu(anchorEl) {
  const sel = getSelectedEntity();
  const key = getSelectionKey(sel);
  if (!sel || !key || !groundControl || !anchorEl) return;

  closeSequenceGotoWpMenu();
  closeSequenceGotoWpEditMenu();
  const host = document.getElementById("app") || document.body;
  sequenceGotoWpMenuEl = document.createElement("div");
  sequenceGotoWpMenuEl.className = "relative-menu";
  host.appendChild(sequenceGotoWpMenuEl);
  sequenceGotoWpMenuEl.addEventListener("pointerdown", (ev) => ev.stopPropagation());
  enableMenuDrag(sequenceGotoWpMenuEl);

  const hostRect = host.getBoundingClientRect();
  const aRect = anchorEl.getBoundingClientRect();
  const pad = 10;
  const menuW = 260;
  let left = aRect.left - hostRect.left + aRect.width / 2 - menuW / 2;
  let top = aRect.top - hostRect.top - 240 - pad;
  if (top < pad) top = aRect.bottom - hostRect.top + pad;
  left = Math.max(pad, Math.min(hostRect.width - menuW - pad, left));
  top = Math.max(pad, Math.min(hostRect.height - 240 - pad, top));
  sequenceGotoWpMenuEl.style.left = `${left}px`;
  sequenceGotoWpMenuEl.style.top = `${top}px`;

  const getOrigin = () => {
    if (!sel || !sel.latest) return null;
    return { lat: sel.latest.lat, lng: sel.latest.lng };
  };

  const origin = getOrigin();
  const wpItems = [...waypoints.values()].map((wp) => {
    const dKm = origin ? haversine2dMeters(origin.lat, origin.lng, wp.lat, wp.lng) / 1000 : null;
    return { wp, dKm };
  });
  wpItems.sort((a, b) => (a.dKm ?? 1e9) - (b.dKm ?? 1e9));

  const listHtml =
    wpItems.length === 0
      ? `<div class="sequence-empty">No waypoints yet. Long-press on the map to create one.</div>`
      : wpItems
          .slice(0, 30)
          .map(({ wp, dKm }) => {
            const km = dKm !== null && isFinite(dKm) ? `${dKm.toFixed(2)} km` : "";
            return `<button class="cmd-chip cmd-action" type="button" data-wp="${wp.id}">WP #${wp.id} <span class="menu-eta" style="margin-left:8px;">${km}</span></button>`;
          })
          .join("");

  sequenceGotoWpMenuEl.innerHTML = `
    <div class="menu-head">
      <h4>Goto WP</h4>
      <span class="menu-eta">Add to sequence</span>
    </div>
    <div class="command-list cmd-action-list column">${listHtml}</div>
    <div class="speed-row" data-goto-details style="display:none;">
      <span class="slider-label">Speed</span>
      <input type="range" min="10" max="100" value="60" step="1" data-wp-speed>
      <span class="slider-value" data-wp-speed-label>60 km/h</span>
    </div>
    <div class="speed-row" data-goto-details style="display:none;">
      <span class="slider-label">Altitude</span>
      <input type="range" min="5" max="100" value="30" step="1" data-wp-alt>
      <span class="slider-value" data-wp-alt-label>30 m</span>
    </div>
    <button class="cmd-chip cmd-action confirm-btn" data-add style="display:none;" type="button">Add</button>
  `;

  const speedEl = sequenceGotoWpMenuEl.querySelector("[data-wp-speed]");
  const speedLbl = sequenceGotoWpMenuEl.querySelector("[data-wp-speed-label]");
  const altEl = sequenceGotoWpMenuEl.querySelector("[data-wp-alt]");
  const altLbl = sequenceGotoWpMenuEl.querySelector("[data-wp-alt-label]");
  const addBtn = sequenceGotoWpMenuEl.querySelector("[data-add]");
  const details = sequenceGotoWpMenuEl.querySelectorAll("[data-goto-details]");

  const showDetails = () => {
    details.forEach((d) => (d.style.display = "flex"));
    if (addBtn) addBtn.style.display = "flex";
  };

  if (speedEl && speedLbl) {
    speedEl.addEventListener("input", () => {
      speedLbl.textContent = `${Math.round(Number(speedEl.value) || 60)} km/h`;
      if (pendingSequenceGotoWp) pendingSequenceGotoWp.speedKmh = Math.round(Number(speedEl.value) || 60);
    });
  }
  if (altEl && altLbl) {
    altEl.addEventListener("input", () => {
      altLbl.textContent = `${Math.round(Number(altEl.value) || 30)} m`;
      if (pendingSequenceGotoWp) pendingSequenceGotoWp.altM = Math.round(Number(altEl.value) || 30);
    });
  }

  sequenceGotoWpMenuEl.querySelectorAll("[data-wp]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = Number(btn.dataset.wp);
      if (!Number.isFinite(id)) return;
      pendingSequenceGotoWp = { key, wpId: id, speedKmh: 60, altM: 30 };
      showDetails();
    });
  });

  if (addBtn) {
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!pendingSequenceGotoWp) return;
      const { wpId, speedKmh, altM } = pendingSequenceGotoWp;
      groundControl.appendPlanned(key, `Goto WP #${wpId} (spd ${Math.round(speedKmh)} km/h, alt ${Math.round(altM)} m)`);
      closeSequenceGotoWpMenu();
      updateCommandSequencePanel();
    });
  }

  document.addEventListener("pointerdown", handleSequenceGotoWpOutside, true);
}

function openSequenceMenu(anchorEl) {
  const sel = getSelectedEntity();
  const key = getSelectionKey(sel);
  if (!sel || !key || !groundControl) return;

  closeSequenceMenu();
  closeSequenceGotoWpMenu();
  closeSequenceGotoWpEditMenu();
  const host = document.getElementById("app") || document.body;
  sequenceMenuEl = document.createElement("div");
  sequenceMenuEl.className = "relative-menu";
  const title = sel.type === "team" ? `Team #${sel.id + 1}` : `Drone #${sel.id + 1}`;

  const options = COMMAND_OPTIONS.filter((c) => c && c !== "Idle");
  const items = options
    .map((c) => `<button class="cmd-chip cmd-action" type="button" data-seq="${c}">${c}</button>`)
    .join("");

  sequenceMenuEl.innerHTML = `
    <div class="menu-head">
      <h4>Add command</h4>
      <span class="menu-eta">${title}</span>
    </div>
    <div class="command-list cmd-action-list column">${items}</div>
  `;
  sequenceMenuEl.addEventListener("pointerdown", (ev) => ev.stopPropagation());
  host.appendChild(sequenceMenuEl);
  enableMenuDrag(sequenceMenuEl);

  const hostRect = host.getBoundingClientRect();
  const aRect = anchorEl.getBoundingClientRect();
  const pad = 10;
  const menuW = sequenceMenuEl.offsetWidth || 220;
  const menuH = sequenceMenuEl.offsetHeight || 260;
  let left = aRect.left - hostRect.left + aRect.width / 2 - menuW / 2;
  let top = aRect.top - hostRect.top - menuH - pad;
  if (top < pad) top = aRect.bottom - hostRect.top + pad;
  left = Math.max(pad, Math.min(hostRect.width - menuW - pad, left));
  top = Math.max(pad, Math.min(hostRect.height - menuH - pad, top));
  sequenceMenuEl.style.left = `${left}px`;
  sequenceMenuEl.style.top = `${top}px`;

  sequenceMenuEl.querySelectorAll("[data-seq]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const cmd = btn.dataset.seq;
      if (!cmd) return;
      if (cmd === "Goto WP") {
        closeSequenceMenu();
        openSequenceGotoWpMenu(anchorEl);
        return;
      }
      groundControl.appendPlanned(key, cmd);
      closeSequenceMenu();
      updateCommandSequencePanel();
    });
  });

  document.addEventListener("pointerdown", handleSequenceMenuOutside, true);
}

function updateCommandSequencePanel() {
  const list = document.getElementById("sequenceList");
  const addBtn = document.getElementById("sequenceAddBtn");
  const playBtn = document.getElementById("seqPlayBtn");
  if (!list || !addBtn || !playBtn) return;
  if (LIVE_POSITION_MODE) {
    list.innerHTML = "";
    addBtn.disabled = true;
    addBtn.style.display = "none";
    const panel = document.querySelector("aside.panel.left");
    const transportEl = panel ? panel.querySelector(".sequence-transport") : null;
    if (transportEl) transportEl.style.display = "none";
    closeSequenceMenu();
    return;
  }

  const titleBtn = document.querySelector("aside.panel.left .panel-title");
  const labelEl = document.querySelector("aside.panel.left .label");
  const panel = document.querySelector("aside.panel.left");
  const transportEl = panel ? panel.querySelector(".sequence-transport") : null;
  const commsGs =
    activeGroundStationId !== null &&
    activeGroundStationId !== undefined &&
    (userGroundStationId === null || Number(activeGroundStationId) !== Number(userGroundStationId)) &&
    pinnedDroneId === null &&
    pinnedTeamId === null;
  if (commsGs) {
    const gs = groundStations.find((g) => g.id === Number(activeGroundStationId));
    const name = gs ? (gs.name || `Home #${gs.id + 1}`).trim() : "Unknown";
    if (titleBtn) titleBtn.textContent = `Comms: ${name}`;
    if (labelEl) labelEl.textContent = "COMMS";
    addBtn.disabled = true;
    addBtn.style.opacity = "0.45";
    addBtn.style.display = "none";
    if (transportEl) transportEl.style.display = "none";
    updateSequenceTransport(null);
    closeSequenceMenu();
    closeSequenceGotoWpMenu();
    closeSequenceGotoWpEditMenu();
    renderCommsPanel(gs, list);
    return;
  } else {
    if (titleBtn) titleBtn.textContent = "Commands Sequence";
    if (labelEl) labelEl.textContent = "SEQUENCE";
    addBtn.style.display = "";
    if (transportEl) transportEl.style.display = "";
    disableCommsKeyboardTracking();
    if (commsComposerEl && commsComposerEl.parentNode) {
      commsComposerEl.parentNode.removeChild(commsComposerEl);
    }
    commsComposerEl = null;
  }

  const sel = getSelectedEntity();
  const key = getSelectionKey(sel);
  list.innerHTML = "";

  if (!sel || !key) {
    closeSequenceGotoWpEditMenu();
    addBtn.disabled = true;
    addBtn.style.opacity = "0.45";
    updateSequenceTransport(null);
    const empty = document.createElement("div");
    empty.className = "sequence-empty";
    empty.textContent = "Select a drone or team to view/edit its command sequence.";
    list.appendChild(empty);
    return;
  }

  addBtn.disabled = false;
  addBtn.style.opacity = "1";

  const planned = groundControl ? groundControl.getPlanned(key) : [];
  updateSequenceTransport(planned.length ? key : null);

  // If the selection changed, close any "edit relation" popover attached to the old entity.
  if (pendingSequenceGotoWpEdit && pendingSequenceGotoWpEdit.key !== key) {
    closeSequenceGotoWpEditMenu();
  }

  const currentCmdRaw = (sel.latest && sel.latest.command) || "Idle";
  const currentRow = document.createElement("div");
  currentRow.className = "sequence-item sequence-current";
  currentRow.style.cursor = "default";
  const currentLeft = document.createElement("div");
  currentLeft.textContent = `Current: ${currentCmdRaw}`;
  const currentRight = document.createElement("div");
  currentRight.className = "seq-meta";
  currentRow.appendChild(currentLeft);
  currentRow.appendChild(currentRight);
  list.appendChild(currentRow);

  const activeIndex = Math.max(0, Math.min(planned.length ? planned.length - 1 : 0, getSequenceActiveIndex(key)));
  const playing = isSequencePlaying(key);

  const makeItem = (label, active) => {
    const row = document.createElement("div");
    row.className = `sequence-item${active ? " is-active" : ""}`;
    const left = document.createElement("div");
    left.textContent = label;
    const right = document.createElement("div");
    right.className = "seq-meta";
    row.appendChild(left);
    row.appendChild(right);
    return row;
  };

  if (!planned.length) {
    const empty = document.createElement("div");
    empty.className = "sequence-empty";
    empty.textContent = "No commands yet. Use + to append the first command.";
    list.appendChild(empty);
    return;
  }

  // Keep selection per entity; default to active command when switching entities.
  if (sequenceSelected.key !== key) {
    setSequenceSelection(key, activeIndex);
  }

  planned.forEach((cmd, idx) => {
    const isActive = idx === activeIndex;
    const row = makeItem(cmd, isActive);
    row.dataset.seqIndex = String(idx);
    row.dataset.seqCmd = cmd;
    row.classList.toggle("is-selected", sequenceSelected.index === idx);
    row.style.cursor = "pointer";

    const right = row.querySelector(".seq-meta");
    if (right) {
      if (isActive) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `seq-mini ${playing ? "pause" : "play"}`;
        btn.setAttribute("aria-label", playing ? "Pause" : "Play");
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (isSequencePlaying(key)) {
            pauseSelectedEntity();
          } else {
            setSequenceSelection(key, idx);
            executeSelectedSequenceCommand();
          }
        });
        right.appendChild(btn);
      } else {
        right.textContent = `#${idx + 1}`;
      }
    }

    row.addEventListener("click", () => {
      if (performance.now() < suppressSequenceClickUntil) return;
      setSequenceSelection(key, idx);
      updateCommandSequencePanel();
    });

    // Long-press on a "Goto WP #..." item to edit the drone↔WP relation (speed/alt).
    const SEQ_LONGPRESS_MS = 220;
    const SEQ_DRAG_CANCEL_PX = 10;
    let seqPressTimer = null;
    let seqPressStart = null;

    const clearSeqPress = () => {
      if (seqPressTimer) {
        clearTimeout(seqPressTimer);
        seqPressTimer = null;
      }
      seqPressStart = null;
    };

    row.addEventListener(
      "pointerdown",
      (ev) => {
        if (!cmd || !String(cmd).startsWith("Goto WP #")) return;
        if (typeof ev.button === "number" && ev.button !== 0) return;
        clearSeqPress();
        seqPressStart = { x: ev.clientX, y: ev.clientY, pointerId: ev.pointerId ?? null };
        seqPressTimer = setTimeout(() => {
          seqPressTimer = null;
          const parsed = parseGotoWpSequenceCommand(cmd);
          if (!parsed) return;
          suppressSequenceClickUntil = performance.now() + 650;
          setSequenceSelection(key, idx);
          openSequenceGotoWpEditMenu(row, key, idx, parsed);
        }, SEQ_LONGPRESS_MS);
      },
      true
    );

    row.addEventListener(
      "pointermove",
      (ev) => {
        if (!seqPressTimer || !seqPressStart) return;
        if (seqPressStart.pointerId !== null && ev.pointerId !== undefined && ev.pointerId !== seqPressStart.pointerId)
          return;
        const dx = (ev.clientX ?? 0) - seqPressStart.x;
        const dy = (ev.clientY ?? 0) - seqPressStart.y;
        if (Math.hypot(dx, dy) > SEQ_DRAG_CANCEL_PX) clearSeqPress();
      },
      true
    );

    row.addEventListener("pointerup", clearSeqPress, true);
    row.addEventListener("pointercancel", clearSeqPress, true);
    row.addEventListener("pointerleave", clearSeqPress, true);

    list.appendChild(row);
  });
}

function applyRuntimeModeUi() {
  document.body.classList.toggle("live-position-mode", LIVE_POSITION_MODE);
  const rightTitle = document.querySelector("aside.panel.right .panel-title");
  if (rightTitle && LIVE_POSITION_MODE) {
    rightTitle.textContent = "Live Drones";
  }
}

function setLiveSerialState(kind, label, detail) {
  const stateEl = document.getElementById("liveSerialState");
  const dotEl = document.getElementById("liveSerialDot");
  if (stateEl) stateEl.textContent = label;
  if (dotEl) {
    dotEl.classList.toggle("connected", kind === "connected");
    dotEl.classList.toggle("waiting", kind === "waiting");
  }
  if (detail) appendLiveDebug(detail, { replace: true });
}

function appendLiveDebug(message, { replace = false } = {}) {
  const debugEl = document.getElementById("liveSerialDebug");
  if (!debugEl) return;
  const line = `[${new Date().toLocaleTimeString()}] ${message}`;
  if (replace) {
    debugEl.textContent = line;
    return;
  }
  liveState.parseErrors.push({ message: line });
  debugEl.textContent = liveState.parseErrors
    .toArray()
    .slice(-5)
    .map((entry) => entry.message || String(entry.value || ""))
    .join("\n");
  debugEl.scrollTop = debugEl.scrollHeight;
}

function pickLiveDiagnosticFields(message) {
  if (!message || typeof message !== "object") return {};
  const keys = [
    "type",
    "event",
    "nodeId",
    "command",
    "commandId",
    "target",
    "sourceRole",
    "accepted",
    "reason",
    "state",
    "activityDetected",
    "searchMode",
    "assignedDrones",
    "gcMillis",
    "sequenceId",
    "frequencyMhz",
    "channelIndex",
    "radioProfileId",
    "defaultAssignmentRadioProfileId",
    "spreadingFactor",
    "bandwidthHz",
    "codingRate",
    "txPeriodMs",
    "telemetryAirtimeMs",
    "searchSharedDwellMs",
    "rssi",
    "snr",
    "missCount",
    "timingAccepted",
    "lastSequenceId",
    "nextTstGcMillis",
    "estimatedTstGcMillis",
    "listenStartGcMillis",
    "listenDeadlineGcMillis",
    "ackLatencyMs",
    "joinMode",
    "joinHeld",
    "telemetryPaused",
    "forcedJoinTxCount",
    "autoSharedRxActive",
    "autoSharedRxNodeId",
    "autoSharedRxRemainingMs",
    "autoSharedRxReason",
    "emptySharedRxActive",
    "emptySharedRxStrongRemainingMs",
    "emptySharedRxPollCount",
    "emptySharedRxNoPacketCount",
    "emptySharedRxJoinCount",
    "emptySharedRxOocrDeferredCount",
    "emptySharedRxReason",
    "telemetryCoverageMode",
    "assignedRxCoveragePct",
    "assignedPacketsReceived",
    "assignedSequenceGapEvents",
    "assignedSequenceGaps",
    "assignedMaxGap",
    "assignedSlotMisses",
    "nonAssignedPreemptions",
    "nextAssignedSlackMs",
  ];
  return Object.fromEntries(keys.filter((key) => message[key] !== undefined).map((key) => [key, message[key]]));
}

function pushLiveGcDiagnosticEntry(entry) {
  liveState.gcDiagnosticLog.push(entry);
  updateLiveGcDiagnosticControls();
}

function makeLiveDiagnosticBaseEntry({ source = "sgc-web-serial", direction = "local" } = {}) {
  return {
    pcTimeIso: new Date().toISOString(),
    pcElapsedMs: Date.now() - liveState.gcDiagnosticStartedAt,
    source,
    direction,
    baud: liveState.baudRate,
    port: liveState.portLabel,
    lineNumber: ++liveState.gcDiagnosticLineNumber,
  };
}

function recordLiveGcDiagnosticLine(rawLine, { parsed = null, parseError = null, direction = "gc_to_sgc" } = {}) {
  const line = String(rawLine || "").trim();
  if (!line) return;

  const entry = {
    ...makeLiveDiagnosticBaseEntry({ source: "sgc-web-serial", direction }),
    raw: line,
    isJson: Boolean(parsed),
    ...pickLiveDiagnosticFields(parsed),
  };
  if (parsed) entry.json = parsed;
  if (parseError) entry.parseError = parseError;

  pushLiveGcDiagnosticEntry(entry);
}

function recordLiveGcDiagnosticEvent(diagnosticEvent, detail = {}) {
  pushLiveGcDiagnosticEntry({
    ...makeLiveDiagnosticBaseEntry({ source: "sgc-ui", direction: "local" }),
    diagnosticEvent,
    ...detail,
  });
}

function makeLiveGcDiagnosticSnapshotEntry() {
  const assignments = Array.isArray(liveState.channelTable?.assignments)
      ? liveState.channelTable.assignments.map((assignment) => ({
          nodeId: assignment.nodeId,
          frequencyMhz: assignment.frequencyMhz,
          radioProfileId: assignment.radioProfileId,
          txPeriodMs: assignment.txPeriodMs,
          expectedUpdateMs: assignment.expectedUpdateMs ?? assignment.targetServiceMs,
          timingAccepted: assignment.timingAccepted,
          linkState: assignment.linkState,
          missCount: assignment.missCount,
          lastSequenceValid: assignment.lastSequenceValid,
        lastSequenceId: assignment.lastSequenceId,
      }))
    : [];
  const droneSummaries = drones.map((drone) => {
    const latest = drone.getLatest?.() || {};
    const now = Date.now();
    const freshness = getLiveFreshnessState(drone, now);
    return {
      nodeId: drone.id,
      label: getLiveDroneDisplayName(drone.id),
      lastReceivedAt: drone.lastReceivedAt,
      ageMs: drone.lastReceivedAt ? now - drone.lastReceivedAt : null,
      displayState: getLiveDisplayState(drone, freshness, now),
      sequenceId: latest.sequenceId,
      frequencyMhz: latest.frequencyMhz,
      radioProfileId: latest.radioProfileId,
      txPeriodMs: latest.txPeriodMs,
      expectedUpdateMs: latest.expectedUpdateMs,
      rssi: latest.rssi,
      snr: latest.snr,
    };
  });
  return {
    ...makeLiveDiagnosticBaseEntry({ source: "sgc-ui", direction: "local" }),
    diagnosticEvent: "export_snapshot",
    connected: liveState.connected,
    searchPending: liveState.searchPending,
    searchMode: liveState.searchMode,
    debugEnabled: liveState.debugEnabled,
    debugStateText: liveState.debugStateText,
    droneDebugConnected: liveState.droneDebugConnected,
    droneDebugStatus: liveState.droneDebugStatus,
    droneWifiHost: liveState.droneWifiHost,
    droneWifiStateText: liveState.droneWifiStateText,
    relayState: liveState.relayState,
    relayRole: liveState.relayRole,
    relayDebug: { ...liveState.relayDebug },
    gcStatus: liveState.gcStatus,
    assignments,
    drones: droneSummaries,
    pendingCommands: [...liveState.pendingCommands.entries()].map(([commandId, command]) => ({ commandId, ...command })),
    recentAssignmentEvents: liveState.assignmentEvents.toArray().slice(-8),
    recentSearchEvents: liveState.searchEvents.toArray().slice(-8),
    recentScannerEvents: liveState.scannerEvents.toArray().slice(-8),
    recentOrphanRecoveryEvents: liveState.orphanRecoveryEvents.toArray().slice(-8),
    linkStatuses: [...liveState.linkStatuses.entries()].map(([nodeId, status]) => ({ nodeId, ...status })),
    bindingStates: [...liveState.bindingStates.entries()].map(([nodeId, state]) => ({ nodeId, ...state })),
    bindingStallRecords: [...liveState.bindingStallRecords.entries()].map(([nodeId, state]) => ({ nodeId, ...state })),
    recoveryStates: [...liveState.recoveryStates.entries()].map(([nodeId, state]) => ({ nodeId, ...state })),
  };
}

function updateLiveGcDiagnosticControls() {
  const countEl = document.getElementById("liveGcLogCount");
  const downloadBtn = document.getElementById("liveGcLogDownloadBtn");
  const clearBtn = document.getElementById("liveGcLogClearBtn");
  const count = liveState.gcDiagnosticLog.count;
  if (countEl) countEl.textContent = String(count);
  if (downloadBtn) downloadBtn.disabled = count === 0;
  if (clearBtn) clearBtn.disabled = count === 0;
}

function exportLiveGcDiagnosticLog() {
  if (!liveState.gcDiagnosticLog.count) {
    appendLiveDebug("diagnostic log is empty");
    return;
  }
  const entries = [makeLiveGcDiagnosticSnapshotEntry(), ...liveState.gcDiagnosticLog.toArray()];
  const jsonl = `${entries.map((entry) => JSON.stringify(entry)).join("\n")}\n`;
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `sgc_gc_serial_${stamp}.jsonl`;
  const blob = new Blob([jsonl], { type: "application/x-ndjson" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  appendLiveDebug(`diagnostic log exported: ${filename}`);
}

function clearLiveGcDiagnosticLog() {
  liveState.gcDiagnosticLog.clear();
  liveState.gcDiagnosticLineNumber = 0;
  liveState.gcDiagnosticStartedAt = Date.now();
  updateLiveGcDiagnosticControls();
  appendLiveDebug("diagnostic log cleared");
}

window.downloadLiveGcLog = exportLiveGcDiagnosticLog;
window.clearLiveGcLog = clearLiveGcDiagnosticLog;
window.getLiveGcLog = () => liveState.gcDiagnosticLog.toArray();

function formatLiveAge(receivedAt = null, now = Date.now()) {
  if (!receivedAt) return "never";
  const ageMs = Math.max(0, now - receivedAt);
  if (ageMs < 1000) return `${Math.round(ageMs)} ms`;
  return `${(ageMs / 1000).toFixed(1)} s`;
}

function formatLiveAgeParts(receivedAt = null, now = Date.now()) {
  if (!receivedAt) return { value: "--", unit: "ms" };
  const ageMs = Math.max(0, now - receivedAt);
  if (ageMs < 1000) return { value: String(Math.round(ageMs)), unit: "ms" };
  return { value: (ageMs / 1000).toFixed(1), unit: "s" };
}

function getLiveUpdateRateHz(drone) {
  if (!drone || drone.history.length < 2) return null;
  const recent = drone.history
    .map((entry) => entry.receivedAt)
    .filter((receivedAt) => Number.isFinite(receivedAt))
    .slice(-4);
  if (recent.length < 2) return null;

  const intervals = [];
  for (let i = 1; i < recent.length; i += 1) {
    const intervalMs = recent[i] - recent[i - 1];
    if (intervalMs > 0) intervals.push(intervalMs);
  }
  if (!intervals.length) return null;

  const averageIntervalMs = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
  if (averageIntervalMs <= 0) return null;
  return 1000 / averageIntervalMs;
}

function getLiveRecentUpdateIntervalMs(drone) {
  if (!drone || drone.history.length < 2) return null;
  const recent = drone.history
    .map((entry) => entry.receivedAt)
    .filter((receivedAt) => Number.isFinite(receivedAt))
    .slice(-5);
  if (recent.length < 2) return null;

  const intervals = [];
  for (let i = 1; i < recent.length; i += 1) {
    const intervalMs = recent[i] - recent[i - 1];
    if (intervalMs > 0) intervals.push(intervalMs);
  }
  if (!intervals.length) return null;
  return intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
}

function firstPositiveNumber(...values) {
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number) && number > 0) return number;
  }
  return null;
}

function renderLiveTimingLine(host, drone, latest, now = Date.now()) {
  const freq = latest.frequencyMhz !== null && latest.frequencyMhz !== undefined ? `${Number(latest.frequencyMhz).toFixed(1)} MHz` : "N/A";
  const age = formatLiveAgeParts(drone.lastReceivedAt, now);
  const updateRateHz = getLiveUpdateRateHz(drone);

  host.className = "status-mission live-timing-line";
  host.innerHTML = "";

  const freqEl = document.createElement("span");
  freqEl.className = "live-timing-frequency";
  freqEl.textContent = freq;
  host.appendChild(freqEl);

  const separatorEl = document.createElement("span");
  separatorEl.className = "live-timing-separator";
  separatorEl.textContent = "|";
  host.appendChild(separatorEl);

  const ageValueEl = document.createElement("span");
  ageValueEl.className = "live-timing-age-value";
  ageValueEl.textContent = age.value;
  host.appendChild(ageValueEl);

  const ageUnitEl = document.createElement("span");
  ageUnitEl.className = "live-timing-age-unit";
  ageUnitEl.textContent = age.unit;
  host.appendChild(ageUnitEl);

  const agoEl = document.createElement("span");
  agoEl.className = "live-timing-ago";
  agoEl.textContent = "ago";
  host.appendChild(agoEl);

  const rateSeparatorEl = document.createElement("span");
  rateSeparatorEl.className = "live-timing-separator";
  rateSeparatorEl.textContent = "|";
  host.appendChild(rateSeparatorEl);

  const rateEl = document.createElement("span");
  rateEl.className = "live-timing-rate";
  const rateValueEl = document.createElement("span");
  rateValueEl.className = "live-timing-rate-value";
  rateValueEl.textContent = updateRateHz === null ? "--" : updateRateHz.toFixed(1);
  rateEl.appendChild(rateValueEl);

  const rateUnitEl = document.createElement("span");
  rateUnitEl.className = "live-timing-rate-unit";
  rateUnitEl.textContent = "Hz";
  rateEl.appendChild(rateUnitEl);

  host.appendChild(rateEl);
}

function renderLiveBindingLine(host, bindingState, now = Date.now()) {
  host.className = "status-mission live-timing-line live-binding-line";
  host.innerHTML = "";
  const label = getLiveBindingPhaseLabel(bindingState?.phase, bindingState);
  const failed = bindingState?.status === "failed";
  const mainEl = document.createElement("span");
  mainEl.className = "live-timing-frequency";
  mainEl.textContent = failed ? "Bind failed" : label;
  host.appendChild(mainEl);

  if (failed && bindingState?.reason) {
    const separatorEl = document.createElement("span");
    separatorEl.className = "live-timing-separator";
    separatorEl.textContent = "|";
    host.appendChild(separatorEl);

    const reasonEl = document.createElement("span");
    reasonEl.className = "live-binding-reason";
    reasonEl.textContent = String(bindingState.reason).replaceAll("_", " ");
    host.appendChild(reasonEl);
    return;
  }

  const lastEventAt = Number(bindingState?.lastEventAt);
  if (Number.isFinite(lastEventAt)) {
    const separatorEl = document.createElement("span");
    separatorEl.className = "live-timing-separator";
    separatorEl.textContent = "|";
    host.appendChild(separatorEl);

    const age = formatLiveAgeParts(lastEventAt, now);
    const ageValueEl = document.createElement("span");
    ageValueEl.className = "live-timing-age-value";
    ageValueEl.textContent = age.value;
    host.appendChild(ageValueEl);

    const ageUnitEl = document.createElement("span");
    ageUnitEl.className = "live-timing-age-unit";
    ageUnitEl.textContent = age.unit;
    host.appendChild(ageUnitEl);
  }
}

function renderLiveBridgeCardLine(host, linkStatus, now = Date.now(), displayStateOverride = null) {
  host.className = "status-mission live-timing-line";
  host.innerHTML = "";
  const rawState = normalizeLiveDisplayState(linkStatus?.state || "unknown");
  const displayState = rawState === "binding" && displayStateOverride
    ? normalizeLiveDisplayState(displayStateOverride)
    : rawState;
  const stateEl = document.createElement("span");
  stateEl.className = "live-timing-frequency";
  stateEl.textContent = formatLiveDisplayState(displayState);
  host.appendChild(stateEl);

  const separatorEl = document.createElement("span");
  separatorEl.className = "live-timing-separator";
  separatorEl.textContent = "|";
  host.appendChild(separatorEl);

  const sourceEl = document.createElement("span");
  sourceEl.className = "live-timing-ago";
  sourceEl.textContent = "bridge";
  host.appendChild(sourceEl);

  const receivedAt = Number(linkStatus?.receivedAt);
  if (Number.isFinite(receivedAt)) {
    const ageSeparatorEl = document.createElement("span");
    ageSeparatorEl.className = "live-timing-separator";
    ageSeparatorEl.textContent = "|";
    host.appendChild(ageSeparatorEl);

    const age = formatLiveAgeParts(receivedAt, now);
    const ageValueEl = document.createElement("span");
    ageValueEl.className = "live-timing-age-value";
    ageValueEl.textContent = age.value;
    host.appendChild(ageValueEl);

    const ageUnitEl = document.createElement("span");
    ageUnitEl.className = "live-timing-age-unit";
    ageUnitEl.textContent = age.unit;
    host.appendChild(ageUnitEl);
  }
}

function appendLiveRecoveryDetail(host, recoveryState, now = Date.now()) {
  if (!host || !recoveryState) return;
  const separatorEl = document.createElement("span");
  separatorEl.className = "live-timing-separator";
  separatorEl.textContent = "|";
  host.appendChild(separatorEl);

  const recoveryEl = document.createElement("span");
  recoveryEl.className = "live-recovery-detail";
  recoveryEl.textContent = recoveryState.label || "Recovery active";
  host.appendChild(recoveryEl);

  const updatedAt = Number(recoveryState.updatedAt);
  if (Number.isFinite(updatedAt)) {
    const age = formatLiveAgeParts(updatedAt, now);
    const ageEl = document.createElement("span");
    ageEl.className = "live-timing-ago";
    ageEl.textContent = `${age.value}${age.unit} ago`;
    host.appendChild(ageEl);
  }
}

function loadLiveDroneAliases() {
  try {
    const raw = window.localStorage?.getItem(LIVE_DRONE_ALIAS_STORAGE_KEY);
    if (!raw) return new Map();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return new Map();
    return new Map(
      Object.entries(parsed)
        .map(([nodeId, alias]) => [Number(nodeId), String(alias || "").trim()])
        .filter(([nodeId, alias]) => Number.isFinite(nodeId) && alias)
    );
  } catch {
    return new Map();
  }
}

function saveLiveDroneAliases() {
  try {
    const object = {};
    liveState.droneAliases.forEach((alias, nodeId) => {
      const clean = String(alias || "").trim();
      if (clean) object[String(nodeId)] = clean;
    });
    window.localStorage?.setItem(LIVE_DRONE_ALIAS_STORAGE_KEY, JSON.stringify(object));
  } catch {
    // Local aliases are optional; storage failures should not break the live map.
  }
}

function getLiveDroneAlias(nodeId) {
  return liveState.droneAliases.get(Number(nodeId)) || "";
}

function setLiveDroneAlias(nodeId, alias) {
  const id = Number(nodeId);
  if (!Number.isFinite(id)) return;
  const clean = String(alias || "").trim().slice(0, 28);
  if (clean) liveState.droneAliases.set(id, clean);
  else liveState.droneAliases.delete(id);
  saveLiveDroneAliases();
  publishLiveDronesState({ force: true });
  updateStatusList();
  updateTooltip();
  draw();
}

function getLiveDroneDisplayName(nodeId) {
  const remoteName = isLiveRemoteViewerMode() ? liveState.remoteDroneNames.get(Number(nodeId)) : "";
  if (remoteName) return remoteName;
  return getLiveDroneAlias(nodeId) || `Drone ${nodeId}`;
}

function getLiveDroneSecondaryName(nodeId) {
  const remoteName = isLiveRemoteViewerMode() ? liveState.remoteDroneNames.get(Number(nodeId)) : "";
  if (remoteName) return remoteName !== `Drone ${nodeId}` ? `Node ${nodeId}` : "";
  return getLiveDroneAlias(nodeId) ? `Node ${nodeId}` : "";
}

function escapeLiveText(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const LIVE_PROFILE_OPTIONS = {
  spreadingFactors: [7, 8, 9, 10, 11, 12],
  bandwidthHz: [125000, 250000, 500000],
  codingRates: [5, 6, 7, 8],
};

const LIVE_PROFILE_PRESETS = [
  {
    key: "fast",
    label: "Fast",
    radioProfileId: 0,
    description: "Highest update rate",
    profile: { spreadingFactor: 8, bandwidthHz: 500000, codingRate: 5 },
  },
  {
    key: "balanced",
    label: "Balanced",
    radioProfileId: 46,
    description: "More robust link",
    profile: { spreadingFactor: 10, bandwidthHz: 500000, codingRate: 6 },
  },
  {
    key: "robust",
    label: "Robust",
    radioProfileId: 55,
    description: "Range first",
    profile: { spreadingFactor: 11, bandwidthHz: 250000, codingRate: 7 },
  },
];

function normalizeLiveRadioProfile(profile = {}) {
  const spreadingFactor = LIVE_PROFILE_OPTIONS.spreadingFactors.includes(Number(profile.spreadingFactor))
    ? Number(profile.spreadingFactor)
    : 8;
  const bandwidthHz = LIVE_PROFILE_OPTIONS.bandwidthHz.includes(Number(profile.bandwidthHz))
    ? Number(profile.bandwidthHz)
    : 500000;
  const codingRate = LIVE_PROFILE_OPTIONS.codingRates.includes(Number(profile.codingRate))
    ? Number(profile.codingRate)
    : 5;
  return { spreadingFactor, bandwidthHz, codingRate };
}

function liveProfileFromGcStatus() {
  const status = liveState.gcStatus || {};
  const defaultProfileId = Number(status.defaultAssignmentRadioProfileId);
  if (Number.isFinite(defaultProfileId)) {
    const decoded = decodeLiveRadioProfileId(defaultProfileId);
    if (decoded) return decoded;
  }
  return normalizeLiveRadioProfile({
    spreadingFactor: status.spreadingFactor,
    bandwidthHz: status.bandwidthHz,
    codingRate: status.codingRate,
  });
}

function liveProfileIdFromGcStatus() {
  const status = liveState.gcStatus || {};
  const defaultProfileId = Number(status.defaultAssignmentRadioProfileId);
  if (Number.isFinite(defaultProfileId)) return defaultProfileId;
  const radioProfileId = Number(status.radioProfileId);
  if (Number.isFinite(radioProfileId)) return radioProfileId;
  return encodeLiveRadioProfileId(liveProfileFromGcStatus());
}

function syncLiveProfileDraftFromGcStatus({ force = false } = {}) {
  if (!force && (liveState.profilePickerOpen || liveState.profileApplyPending)) return;
  liveState.profileDraft = liveProfileFromGcStatus();
}

function liveDiscoveryProfileFromGcStatus() {
  const status = liveState.gcStatus || {};
  return normalizeLiveRadioProfile({
    spreadingFactor: status.discoverySpreadingFactor,
    bandwidthHz: status.discoveryBandwidthHz,
    codingRate: status.discoveryCodingRate,
  });
}

function ensureLiveProfileDraft() {
  if (!liveState.profileDraft) {
    liveState.profileDraft = liveProfileFromGcStatus();
  }
  return liveState.profileDraft;
}

function formatLiveRadioProfile(profile = {}) {
  const normalized = normalizeLiveRadioProfile(profile);
  return `SF${normalized.spreadingFactor}/BW${Math.round(normalized.bandwidthHz / 1000)}/CR4/${normalized.codingRate}`;
}

function findLiveProfilePresetById(profileId) {
  const id = Number(profileId);
  return LIVE_PROFILE_PRESETS.find((preset) => preset.radioProfileId === id) || null;
}

function findLiveProfilePresetByProfile(profile = {}) {
  const normalized = normalizeLiveRadioProfile(profile);
  return LIVE_PROFILE_PRESETS.find((preset) => {
    const presetProfile = normalizeLiveRadioProfile(preset.profile);
    return (
      presetProfile.spreadingFactor === normalized.spreadingFactor &&
      presetProfile.bandwidthHz === normalized.bandwidthHz &&
      presetProfile.codingRate === normalized.codingRate
    );
  }) || null;
}

function encodeLiveRadioProfileId(profile = {}) {
  const normalized = normalizeLiveRadioProfile(profile);
  const preset = findLiveProfilePresetByProfile(normalized);
  if (preset) return preset.radioProfileId;
  const sfIndex = normalized.spreadingFactor - 7;
  const bwIndex = LIVE_PROFILE_OPTIONS.bandwidthHz.indexOf(normalized.bandwidthHz);
  const crIndex = normalized.codingRate - 5;
  if (sfIndex < 0 || bwIndex < 0 || crIndex < 0) return 0;
  return 1 + sfIndex * 12 + bwIndex * 4 + crIndex;
}

function decodeLiveRadioProfileId(profileId) {
  const id = Number(profileId);
  if (!Number.isInteger(id) || id < 0) return null;
  const preset = findLiveProfilePresetById(id);
  if (preset) return normalizeLiveRadioProfile(preset.profile);
  const encoded = id - 1;
  if (encoded < 0 || encoded >= 72) return null;
  const sfIndex = Math.floor(encoded / 12);
  const rem = encoded % 12;
  const bwIndex = Math.floor(rem / 4);
  const crIndex = rem % 4;
  return normalizeLiveRadioProfile({
    spreadingFactor: 7 + sfIndex,
    bandwidthHz: LIVE_PROFILE_OPTIONS.bandwidthHz[bwIndex],
    codingRate: 5 + crIndex,
  });
}

function calculateLiveLoRaAirtimeMs(profile = {}, payloadBytes = 20) {
  const normalized = normalizeLiveRadioProfile(profile);
  const tsymMs = ((1 << normalized.spreadingFactor) / normalized.bandwidthHz) * 1000;
  const lowDataRateOptimization = normalized.spreadingFactor >= 11 && normalized.bandwidthHz <= 125000 ? 1 : 0;
  const explicitHeader = true;
  const phyCrc = true;
  const implicitHeader = explicitHeader ? 0 : 1;
  const crcEnabled = phyCrc ? 1 : 0;
  const numerator =
    8 * payloadBytes -
    4 * normalized.spreadingFactor +
    28 +
    16 * crcEnabled -
    20 * implicitHeader;
  const denominator = 4 * (normalized.spreadingFactor - 2 * lowDataRateOptimization);
  const payloadSymbolGroups = numerator <= 0 ? 0 : Math.ceil(numerator / denominator);
  const payloadSymbols = 8 + payloadSymbolGroups * normalized.codingRate;
  return (8 + 4.25 + payloadSymbols) * tsymMs;
}

function buildLiveSetRadioProfileCommandPayload(profile = {}, commandId = "sgc-profile-preview") {
  const normalized = normalizeLiveRadioProfile(profile);
  return {
    type: "command",
    command: "set_radio_profile",
    commandId,
    radioProfileId: encodeLiveRadioProfileId(normalized),
    spreadingFactor: normalized.spreadingFactor,
    bandwidthHz: normalized.bandwidthHz,
    codingRate: normalized.codingRate,
    persist: true,
  };
}

function getLiveKnownProfileForId(profileId) {
  const id = Number(profileId);
  if (!Number.isFinite(id)) return null;
  const tableProfiles = Array.isArray(liveState.channelTable?.radioProfiles) ? liveState.channelTable.radioProfiles : [];
  const tableProfile = tableProfiles.find((profile) => Number(profile.radioProfileId) === id);
  if (tableProfile) {
    return normalizeLiveRadioProfile(tableProfile);
  }
  return decodeLiveRadioProfileId(id);
}

function getLiveAssignmentForDrone(nodeId) {
  const assignments = Array.isArray(liveState.channelTable?.assignments) ? liveState.channelTable.assignments : [];
  return assignments.find((assignment) => Number(assignment.nodeId) === Number(nodeId)) || null;
}

function formatLiveDroneProfile(drone, latest = {}) {
  const assignment = getLiveAssignmentForDrone(drone.id);
  const profileId = latest.radioProfileId ?? assignment?.radioProfileId;
  const knownProfile = getLiveKnownProfileForId(profileId);
  const preset = findLiveProfilePresetById(profileId);
  if (knownProfile && preset) return `${preset.label} ${formatLiveRadioProfile(knownProfile)}`;
  if (knownProfile) return formatLiveRadioProfile(knownProfile);
  if (profileId !== null && profileId !== undefined) return `Profile ${profileId}`;
  return "N/A";
}

function getLiveExpectedUpdateMs(drone) {
  if (!drone) return null;
  const latest = drone.getLatest && drone.getLatest();
  const assignment = getLiveAssignmentForDrone(drone.id);
  return firstPositiveNumber(
    latest?.expectedUpdateMs,
    latest?.expected_update_ms,
    latest?.targetServiceMs,
    latest?.target_service_ms,
    assignment?.expectedUpdateMs,
    assignment?.expected_update_ms,
    assignment?.targetServiceMs,
    assignment?.target_service_ms,
    getLiveRecentUpdateIntervalMs(drone),
    latest?.txPeriodMs,
    latest?.tx_period_ms
  );
}

function getLiveFreshnessThresholds(drone) {
  const expectedUpdateMs = getLiveExpectedUpdateMs(drone);
  if (!Number.isFinite(expectedUpdateMs) || expectedUpdateMs <= 0) {
    return { ...LIVE_FRESHNESS_MS };
  }
  return {
    fresh: Math.max(LIVE_FRESHNESS_MS.fresh, expectedUpdateMs * LIVE_FRESHNESS_SCALE.fresh),
    late: Math.max(LIVE_FRESHNESS_MS.late, expectedUpdateMs * LIVE_FRESHNESS_SCALE.late),
    stale: Math.max(LIVE_FRESHNESS_MS.stale, expectedUpdateMs * LIVE_FRESHNESS_SCALE.stale),
  };
}

function getLiveFreshnessState(drone, now = Date.now()) {
  if (!drone || !drone.lastReceivedAt) return "offline";
  return getLiveFreshnessStateForAgeMs(Math.max(0, now - drone.lastReceivedAt), drone);
}

function getLiveFreshnessStateForAgeMs(ageMs, drone = null) {
  const numericAgeMs = Math.max(0, Number(ageMs) || 0);
  const thresholds = drone ? getLiveFreshnessThresholds(drone) : { ...LIVE_FRESHNESS_MS };
  if (numericAgeMs < thresholds.fresh) return "fresh";
  if (numericAgeMs < thresholds.late) return "late";
  if (numericAgeMs < thresholds.stale) return "stale";
  return "offline";
}

function isLiveDroneRelocking(nodeId, now = Date.now()) {
  const request = liveState.relockRequests.get(Number(nodeId));
  if (!request) return false;
  if (now >= request.expiresAt) {
    liveState.relockRequests.delete(Number(nodeId));
    return false;
  }
  return true;
}

function isLiveTerminalLinkState(state) {
  return ["weak", "off", "offline"].includes(normalizeLiveDisplayState(state));
}

function noteLiveTelemetryForLinkStatus(nodeId, previousReceivedAt = null, now = Date.now()) {
  const id = Number(nodeId);
  const linkStatus = liveState.linkStatuses.get(id);
  if (!linkStatus) return;
  liveState.linkStatuses.delete(id);
}

function hasRecentLiveTelemetryForNode(nodeId, now = Date.now()) {
  const id = Number(nodeId);
  if (!Number.isFinite(id)) return false;
  const drone = drones.find((d) => Number(d.id) === id);
  if (!drone) return false;
  return getLiveFreshnessState(drone, now) !== "offline";
}

function isLiveLocalTelemetrySource(message = {}, source = "serial") {
  const sourceRole = normalizeLiveUsbDeviceRole(message.sourceRole || message.source_role || message.source || "");
  if (sourceRole === "magic_ground_control") return false;
  if (sourceRole === "telemetry_ground_control") return true;
  return source === "serial";
}

function clearLiveTerminalLinkStatusForBinding(nodeId) {
  const id = Number(nodeId);
  if (!Number.isFinite(id)) return;
  const linkStatus = liveState.linkStatuses.get(id);
  const state = normalizeLiveDisplayState(linkStatus?.state);
  if (["weak", "off", "offline"].includes(state)) {
    liveState.linkStatuses.delete(id);
  }
}

function getLiveDisplayState(drone, freshness, now = Date.now()) {
  if (drone && liveState.bindingStates.has(Number(drone.id))) return "binding";
  if (drone && isLiveDroneRelocking(drone.id, now)) return "binding";
  if (drone) {
    const linkStatus = liveState.linkStatuses.get(Number(drone.id));
    const latest = drone.getLatest && drone.getLatest();
    const statusReceivedAt = Number(linkStatus?.receivedAt);
    const latestReceivedAt = Number(latest?.receivedAt);
    const state = normalizeLiveDisplayState(linkStatus?.state);
    if (linkStatus?.holdUntilRecovered && isLiveTerminalLinkState(state)) {
      if (freshness !== "offline") return freshness;
      return state;
    }
    if (state === "binding") {
      return isLiveDroneRelocking(drone.id, now) ? "binding" : freshness;
    }
    if (isLiveTerminalLinkState(state) && Number.isFinite(latestReceivedAt) && freshness !== "offline") {
      return freshness;
    }
    if (linkStatus && (!Number.isFinite(latestReceivedAt) || !Number.isFinite(statusReceivedAt) || statusReceivedAt >= latestReceivedAt)) {
      if (state === "online" || state === "fresh") {
        if (Number.isFinite(statusReceivedAt)) {
          return getLiveFreshnessStateForAgeMs(now - statusReceivedAt, drone);
        }
        return freshness;
      }
      if (["binding", "weak", "off", "offline"].includes(state)) return state;
    }
  }
  return freshness;
}

function formatLiveDisplayState(state) {
  if (state === "fresh") return "ONLINE";
  if (state === "binding" || state === "locking") return "BINDING";
  if (state === "weak") return "WEAK";
  if (state === "off") return "OFF";
  return String(state || "offline").toUpperCase();
}

function freshnessLedClass(state) {
  if (state === "fresh") return "green";
  if (state === "binding" || state === "locking") return "blue";
  if (state === "late" || state === "weak") return "yellow";
  if (state === "stale" || state === "offline") return "red";
  return "gray";
}

function getLiveBaudRate() {
  const input = document.getElementById("liveSerialBaud");
  const value = Number.parseInt(input ? input.value : "", 10);
  if (Number.isFinite(value) && value > 0) {
    liveState.baudRate = value;
    return value;
  }
  liveState.baudRate = 921600;
  if (input) input.value = "921600";
  return liveState.baudRate;
}

function getLiveAssignedCountForBindingState() {
  const status = liveState.gcStatus || {};
  const assignments = liveState.channelTable && Array.isArray(liveState.channelTable.assignments)
    ? liveState.channelTable.assignments
    : null;
  const counts = [];
  if (assignments) counts.push(assignments.length);
  if (liveState.serialTelemetrySeen) counts.push(getLiveSerialDroneCount());
  const assignedDrones = Number(status.assignedDrones);
  if (Number.isFinite(assignedDrones)) counts.push(assignedDrones);
  const assignedChannels = Number(status.assignedChannels);
  if (Number.isFinite(assignedChannels)) counts.push(assignedChannels);
  if (!counts.length) return null;
  return Math.max(...counts.map((count) => Math.max(0, Number(count) || 0)));
}

function getLiveActiveSharedBindProgressState() {
  let activeState = null;
  liveState.bindingStates.forEach((state) => {
    if (activeState) return;
    const origin = String(state?.origin || "shared_bind");
    const status = String(state?.status || "active");
    if (origin === "shared_bind" && status !== "failed") {
      activeState = state;
    }
  });
  return activeState;
}

function getLiveSearchButtonBindingState() {
  const status = liveState.gcStatus || {};
  const explicitBinding = Boolean(liveState.searchMode || liveState.searchPending);
  const sharedBindProgress = getLiveActiveSharedBindProgressState();
  const progressBinding =
    !explicitBinding &&
    !isLiveCommandReadOnlyMode() &&
    Boolean(sharedBindProgress);
  const allLostSharedBinding =
    !explicitBinding &&
    !progressBinding &&
    !isLiveCommandReadOnlyMode() &&
    liveState.connected &&
    status.allLostRecoveryActive === true &&
    status.allLostRecoveryPhase === "shared_bind";
  const autoSharedBinding =
    !explicitBinding &&
    !progressBinding &&
    !allLostSharedBinding &&
    !isLiveCommandReadOnlyMode() &&
    liveState.connected &&
    status.autoSharedRxActive === true;
  const operatorDiscoveryBinding =
    !progressBinding &&
    !allLostSharedBinding &&
    !autoSharedBinding &&
    !isLiveCommandReadOnlyMode() &&
    liveState.connected &&
    status.operatorDiscoveryActive === true;
  const assignedCount = getLiveAssignedCountForBindingState();
  const passiveBinding =
    !explicitBinding &&
    !progressBinding &&
    !allLostSharedBinding &&
    !autoSharedBinding &&
    !isLiveCommandReadOnlyMode() &&
    liveState.connected &&
    assignedCount === 0;
  return { explicitBinding, progressBinding, passiveBinding, allLostSharedBinding, autoSharedBinding, operatorDiscoveryBinding, assignedCount };
}

function applyLiveSearchButtonState(searchBtn) {
  if (!searchBtn) return;
  const { explicitBinding, progressBinding, passiveBinding, allLostSharedBinding, autoSharedBinding, operatorDiscoveryBinding } = getLiveSearchButtonBindingState();
  const active = explicitBinding || progressBinding || passiveBinding || allLostSharedBinding || autoSharedBinding || operatorDiscoveryBinding;
  const readOnlyReason = liveCommandReadOnlyMessage();
  searchBtn.textContent = operatorDiscoveryBinding ? "Discovering..." : active ? "Binding..." : "Bind";
  searchBtn.disabled =
    isLiveCommandReadOnlyMode() ||
    !liveState.connected ||
    explicitBinding ||
    progressBinding ||
    passiveBinding ||
    allLostSharedBinding ||
    autoSharedBinding ||
    operatorDiscoveryBinding;
  searchBtn.classList.toggle("is-active", active);
  searchBtn.title = readOnlyReason
    ? readOnlyReason
    : progressBinding
      ? "MaGC is binding a drone on the shared channel."
    : passiveBinding
      ? "GC has no assigned drones and is already listening for drones to bind."
      : allLostSharedBinding
        ? "All assigned drones are lost; GC is listening on the shared channel for drones to bind."
      : autoSharedBinding
        ? "MaGC is automatically listening on the shared channel for a lost drone to rejoin."
      : operatorDiscoveryBinding
        ? "MaGC is safely listening for new or rejoining drones without interrupting online drones."
      : explicitBinding
        ? "GC is binding/searching for drones."
        : "";
}

function syncLiveRelayInputsFromState() {
  const endpointEl = document.getElementById("liveRelayEndpoint");
  const sessionEl = document.getElementById("liveRelaySessionId");
  const tokenEl = document.getElementById("liveRelayPublishToken");
  if (endpointEl && endpointEl.value !== liveState.relayEndpoint) endpointEl.value = liveState.relayEndpoint;
  if (sessionEl && sessionEl.value !== liveState.relaySessionId) sessionEl.value = liveState.relaySessionId;
  if (tokenEl && tokenEl.value !== liveState.relayPublishToken) tokenEl.value = liveState.relayPublishToken;
}

function readLiveRelayInputs() {
  const endpointEl = document.getElementById("liveRelayEndpoint");
  liveState.relayEndpoint = String(endpointEl?.value || liveState.relayEndpoint || getDefaultLiveRelayEndpoint()).trim();
  liveState.relaySessionId = LIVE_RELAY_PUBLIC_SESSION_ID;
  liveState.relayPublishToken = "";
  saveLiveStorageValue(LIVE_RELAY_ENDPOINT_STORAGE_KEY, liveState.relayEndpoint);
}

function formatLiveRelayState() {
  if (!isLiveRelayMode()) return "Disabled";
  if (liveState.relayState === "connected") {
    if (isLiveRelayBroadcastMode()) {
      return Number.isFinite(Number(liveState.relayViewerCount))
        ? `Broadcasting (${liveState.relayViewerCount})`
        : "Broadcasting";
    }
    return liveState.relayPublisherConnected ? "Viewing live" : "Waiting for GC";
  }
  if (liveState.relayState === "connecting") return "Connecting";
  if (liveState.relayState === "reconnecting") return "Reconnecting";
  if (liveState.relayState === "error") return "Error";
  return "Disconnected";
}

function relayDebugNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function formatRelayDebugMs(value) {
  const ms = relayDebugNumber(value);
  if (ms === null) return "--";
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

function formatRelayDebugHz(intervalMs) {
  const ms = relayDebugNumber(intervalMs);
  if (ms === null || ms <= 0) return "-- Hz";
  return `${(1000 / ms).toFixed(1)} Hz`;
}

function getLiveRelayLastDronesStateAgeMs(now = Date.now()) {
  const debug = liveState.relayDebug || {};
  const workerReceivedAt = relayDebugNumber(debug.viewerLastDronesStateWorkerAt ?? debug.workerLastDronesStateAt);
  if (workerReceivedAt !== null) return Math.max(0, now - workerReceivedAt);
  return relayDebugNumber(debug.workerLastDronesStateAgeMs);
}

function getDronesStateMaxAgeMs(message) {
  const ages = Array.isArray(message?.drones)
    ? message.drones.map((drone) => relayDebugNumber(drone?.ageMs)).filter((ageMs) => ageMs !== null)
    : [];
  return ages.length ? Math.max(...ages) : null;
}

function getDronesStateCount(message) {
  return Array.isArray(message?.drones) ? message.drones.length : null;
}

function formatLiveRelayDebugSummary() {
  const debug = liveState.relayDebug || {};
  const now = Date.now();
  if (liveState.relayRole === "publisher") {
    if (!debug.publisherLastDronesStateSentAt) return "N/A";
    const sentAgeMs = Math.max(0, now - Number(debug.publisherLastDronesStateSentAt));
    return `pub ${formatRelayDebugHz(debug.publisherLastDronesStateIntervalMs)} / sent ${formatRelayDebugMs(sentAgeMs)} / data ${formatRelayDebugMs(debug.publisherLastDroneMaxAgeMs)}`;
  }
  if (liveState.relayRole === "viewer" || isLiveRemoteViewerMode()) {
    const lastAgeMs = getLiveRelayLastDronesStateAgeMs(now);
    if (!debug.viewerLastDronesStateReceivedAt && lastAgeMs === null) return "N/A";
    return `rx ${formatRelayDebugHz(debug.viewerLastDronesStateIntervalMs || debug.viewerWorkerDronesStateIntervalMs)} / last ${formatRelayDebugMs(lastAgeMs)} / lag ${formatRelayDebugMs(debug.viewerEndToEndMs)}`;
  }
  return "N/A";
}

function formatLiveBridgeRfSummary(status = liveState.gcStatus || {}) {
  if (!status?.bridgeMode) return "N/A";
  const handshake = String(status.bridgeHandshake || "");
  const ageMs = Number(status.backhaulLastPacketAgeMs);
  const transport = getLiveBridgeTransportLabel(status);
  if (!Number.isFinite(ageMs) || ageMs >= 0xFFFFFFFF) {
    if (handshake === "waiting_for_beacon") return "Waiting for GC beacon";
    return "No GC RF";
  }
  const live = status.bridgeControl === true && status.bridgeStale !== true && ageMs <= 3000;
  const rssi = Number(status.backhaulRssi);
  const snr = Number(status.backhaulSnr);
  const queueDepth = Number(status.bridgeCommandQueueDepth);
  const secondary = getLiveBridgeSecondaryStatus(status);
  const parts = [
    live ? `${transport} live` : (handshake === "beacon_seen" ? `${transport} beacon` : `${transport} stale`),
    secondary,
    `age ${formatRelayDebugMs(ageMs)}`,
  ];
  if (Number.isFinite(rssi) && rssi > -127) {
    parts.push(`${rssi.toFixed(0)} dBm`);
  }
  if (Number.isFinite(snr)) {
    parts.push(`${snr.toFixed(1)} dB`);
  }
  if (Number.isFinite(queueDepth) && queueDepth > 0) {
    parts.push(`q${queueDepth}`);
  }
  return parts.join(" | ");
}

function formatLiveBridgeRfDetails(status = liveState.gcStatus || {}) {
  if (!status?.bridgeMode) return "";
  const handshake = String(status.bridgeHandshake || "");
  const ageMs = Number(status.backhaulLastPacketAgeMs);
  const transport = getLiveBridgeTransportLabel(status);
  if (!Number.isFinite(ageMs) || ageMs >= 0xFFFFFFFF) {
    if (handshake === "waiting_for_beacon") {
      return "Bridge USB is connected and waiting for a GC bridge beacon over ESP-NOW or LoRa fallback.";
    }
    return "Bridge USB is connected, but no GC bridge downlink has been received.";
  }
  const queueDepth = Number(status.bridgeCommandQueueDepth);
  const ackStatus = status.bridgeLastAckStatus ? String(status.bridgeLastAckStatus) : "none";
  const ackReason = status.bridgeLastAckReason ? ` (${status.bridgeLastAckReason})` : "";
  const espnowAge = Number(status.espnowLastPacketAgeMs);
  const espnowSnapshotAge = Number(status.espnowLastSnapshotAgeMs);
  const loraAge = Number(status.loraLastPacketAgeMs);
  const secondary = getLiveBridgeSecondaryStatus(status);
  const fallbackReason = status.bridgeFallbackReason ? String(status.bridgeFallbackReason).replace(/_/g, " ") : "";
  return [
    status.bridgeControl === true && status.bridgeStale !== true
      ? `${transport} bridge link is live.`
      : (handshake === "beacon_seen" ? `${transport} beacon received; waiting for a control snapshot.` : "Bridge RF link is stale or control is unavailable."),
    secondary ? `${secondary}.` : "",
    fallbackReason ? `Fallback: ${fallbackReason}.` : "",
    `Last downlink age: ${formatRelayDebugMs(ageMs)}.`,
    Number.isFinite(espnowAge) && espnowAge < 0xFFFFFFFF ? `ESP-NOW age: ${formatRelayDebugMs(espnowAge)}.` : "",
    Number.isFinite(espnowSnapshotAge) && espnowSnapshotAge < 0xFFFFFFFF ? `ESP-NOW snapshot age: ${formatRelayDebugMs(espnowSnapshotAge)}.` : "",
    Number.isFinite(loraAge) && loraAge < 0xFFFFFFFF ? `LoRa age: ${formatRelayDebugMs(loraAge)}.` : "",
    Number.isFinite(queueDepth) ? `Command queue: ${queueDepth}.` : "",
    `Last ACK: ${ackStatus}${ackReason}.`,
  ].filter(Boolean).join(" ");
}

function formatLiveRelayDebugDetails() {
  const debug = liveState.relayDebug || {};
  const lastBroadcastAgeMs = getLiveRelayLastDronesStateAgeMs();
  if (liveState.relayRole === "publisher") {
    if (!debug.publisherLastSentAt) return liveState.relayLastError || "";
    return [
      `sent ${debug.publisherSentCount || 0}`,
      `drone rate ${formatRelayDebugHz(debug.publisherLastDronesStateIntervalMs)}`,
      `drones ${debug.publisherLastDronesCount ?? "--"}`,
      `payload age ${formatRelayDebugMs(debug.publisherLastDroneMaxAgeMs)}`,
    ].join(" | ");
  }
  if (liveState.relayRole === "viewer" || isLiveRemoteViewerMode()) {
    if (!debug.viewerLastReceivedAt) return liveState.relayLastError || "";
    return [
      `rx ${formatRelayDebugHz(debug.viewerLastDronesStateIntervalMs)}`,
      `last relay packet ${formatRelayDebugMs(lastBroadcastAgeMs)}`,
      `pub->CF ${formatRelayDebugMs(debug.viewerPublisherToWorkerMs)}`,
      `CF->viewer ${formatRelayDebugMs(debug.viewerWorkerToViewerMs)}`,
      `end-to-end ${formatRelayDebugMs(debug.viewerEndToEndMs)}`,
      `payload age ${formatRelayDebugMs(debug.viewerDroneMaxAgeMs)}`,
      `applied ${debug.viewerAppliedDroneCount ?? "--"}`,
      `dup ${debug.viewerDuplicateDroneCount ?? "--"}`,
    ].join(" | ");
  }
  return liveState.relayLastError || "";
}

function buildLiveRelayUrl(role) {
  const endpoint = liveState.relayEndpoint || getDefaultLiveRelayEndpoint();
  const baseUrl = new URL(endpoint, window.location.href);
  if (baseUrl.protocol === "http:") baseUrl.protocol = "ws:";
  if (baseUrl.protocol === "https:") baseUrl.protocol = "wss:";
  baseUrl.searchParams.set("role", role);
  baseUrl.searchParams.set("sessionId", LIVE_RELAY_PUBLIC_SESSION_ID);
  return baseUrl.toString();
}

function scheduleLiveRelayReconnect() {
  if (liveState.relayUserClosed || !isLiveRelayMode() || liveState.relayReconnectTimer) return;
  liveState.relayState = "reconnecting";
  renderLiveControls();
  liveState.relayReconnectTimer = window.setTimeout(() => {
    liveState.relayReconnectTimer = null;
    if (!liveState.relayUserClosed && isLiveRelayMode()) {
      connectLiveRelay({ auto: true });
    }
  }, LIVE_RELAY_RECONNECT_MS);
}

function clearLiveRelayReconnectTimer() {
  if (!liveState.relayReconnectTimer) return;
  window.clearTimeout(liveState.relayReconnectTimer);
  liveState.relayReconnectTimer = null;
}

function isLiveRelaySocketCurrent(socket) {
  return Boolean(socket && liveState.relaySocket === socket);
}

function isLiveRelaySocketOpeningOrOpen(socket) {
  const readyState = Number(socket?.readyState);
  return readyState === 0 || readyState === 1;
}

function isLiveRelayDesiredSocketActive(role) {
  return liveState.relayRole === role && isLiveRelaySocketOpeningOrOpen(liveState.relaySocket);
}

function appendStaleLiveRelayEventDebug(eventName) {
  appendLiveDebug(`relay: ignored stale socket ${eventName}`);
}

function closeLiveRelayConnection({ user = true, reason = "closed" } = {}) {
  if (user) liveState.relayUserClosed = true;
  clearLiveRelayReconnectTimer();
  stopLiveRelayScenePublishing();
  const socket = liveState.relaySocket;
  liveState.relaySocket = null;
  liveState.relayConnected = false;
  liveState.relayRole = null;
  liveState.relayViewerCount = null;
  liveState.relayPublisherConnected = false;
  liveState.relayState = "disconnected";
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close(1000, reason);
  } else if (socket && socket.readyState === WebSocket.CONNECTING) {
    socket.close();
  }
  renderLiveControls();
}

function isLiveRelayPublisherSocketOpen() {
  const socket = liveState.relaySocket;
  return liveState.relayRole === "publisher" && socket && socket.readyState === WebSocket.OPEN;
}

function makeLiveDronesStateMessage(now = Date.now()) {
  pruneLiveBindingStates(now);
  const publishedNodeIds = new Set();
  const liveDrones = drones
    .filter((drone) => drone && (drone.type === "live" || drone.type === "live-mock"))
    .map((drone) => {
      const latest = drone.getLatest && drone.getLatest();
      const bindingState = liveState.bindingStates.get(Number(drone.id));
      if (!latest || !Number.isFinite(Number(latest.lat)) || !Number.isFinite(Number(latest.lng))) {
        if (!bindingState) return null;
        const progress = getLiveBindingProgress(bindingState, now);
        publishedNodeIds.add(Number(drone.id));
        return {
          nodeId: Number(drone.id),
          name: getLiveDroneAlias(drone.id) || `Drone ${drone.id}`,
          frequencyMhz: bindingState.frequencyMhz ?? null,
          radioProfileId: bindingState.radioProfileId ?? null,
          rssi: bindingState.rssi ?? null,
          snr: bindingState.snr ?? null,
          ageMs: bindingState.lastEventAt ? Math.max(0, Math.round(now - bindingState.lastEventAt)) : null,
          displayState: "binding",
          bindPhase: bindingState.phase,
          bindProgress: progress,
          bindStatus: bindingState.status,
          bindReason: bindingState.reason,
          timingObservationCount: bindingState.timingObservationCount ?? null,
        };
      }
      const freshness = getLiveFreshnessState(drone, now);
      publishedNodeIds.add(Number(drone.id));
      const displayState = getLiveDisplayState(drone, freshness, now);
      const bindingFields = bindingState
        ? {
            bindPhase: bindingState.phase,
            bindProgress: getLiveBindingProgress(bindingState, now),
            bindStatus: bindingState.status,
            bindReason: bindingState.reason,
            timingObservationCount: bindingState.timingObservationCount ?? null,
          }
        : {};
      return {
        nodeId: Number(drone.id),
        name: getLiveDroneAlias(drone.id) || `Drone ${drone.id}`,
        lat: Number(latest.lat),
        lng: Number(latest.lng),
        alt: Number(latest.alt) || 0,
        heading: Number(latest.heading) || 0,
        headingSource: latest.headingSource || null,
        courseOverGround: latest.courseOverGround ?? null,
        yaw: latest.yaw ?? null,
        groundSpeed: latest.groundSpeed ?? null,
        satelliteCount: latest.satelliteCount ?? null,
        rssi: latest.rssi ?? null,
        snr: latest.snr ?? null,
        frequencyMhz: latest.frequencyMhz ?? null,
        radioProfileId: latest.radioProfileId ?? null,
        sequenceId: latest.sequenceId ?? null,
        txPeriodMs: latest.txPeriodMs ?? null,
        telemetryAirtimeMs: latest.telemetryAirtimeMs ?? null,
        expectedUpdateMs: latest.expectedUpdateMs ?? null,
        ageMs: drone.lastReceivedAt ? Math.max(0, Math.round(now - drone.lastReceivedAt)) : null,
        displayState,
        ...bindingFields,
      };
    })
    .filter(Boolean);

  liveState.bindingStates.forEach((bindingState, nodeId) => {
    const numericNodeId = Number(nodeId);
    if (publishedNodeIds.has(numericNodeId)) return;
    const progress = getLiveBindingProgress(bindingState, now);
    liveDrones.push({
      nodeId: numericNodeId,
      name: getLiveDroneAlias(numericNodeId) || `Drone ${numericNodeId}`,
      frequencyMhz: bindingState.frequencyMhz ?? null,
      radioProfileId: bindingState.radioProfileId ?? null,
      rssi: bindingState.rssi ?? null,
      snr: bindingState.snr ?? null,
      ageMs: bindingState.lastEventAt ? Math.max(0, Math.round(now - bindingState.lastEventAt)) : null,
      displayState: "binding",
      bindPhase: bindingState.phase,
      bindProgress: progress,
      bindStatus: bindingState.status,
      bindReason: bindingState.reason,
      timingObservationCount: bindingState.timingObservationCount ?? null,
    });
  });

  return {
    type: "drones_state",
    schemaVersion: 1,
    sentAt: now,
    ...buildLivePublisherSourceMetadata(now),
    drones: liveDrones,
  };
}

function makeLiveHomesStateMessage(now = Date.now()) {
  return {
    type: "homes_state",
    schemaVersion: 1,
    sentAt: now,
    homes: groundStations
      .filter((home) => home && Number.isFinite(Number(home.lat)) && Number.isFinite(Number(home.lng)))
      .map((home) => ({
        id: Number(home.id),
        name: (home.name || `Home #${Number(home.id) + 1}`).trim(),
        lat: Number(home.lat),
        lng: Number(home.lng),
      })),
  };
}

function publishLiveDronesState({ force = false, minIntervalMs = LIVE_RELAY_DRONES_STATE_INTERVAL_MS } = {}) {
  if (!isLiveRelayPublisherSocketOpen()) return;
  const now = Date.now();
  const intervalMs = Number.isFinite(Number(minIntervalMs)) ? Math.max(0, Number(minIntervalMs)) : LIVE_RELAY_DRONES_STATE_INTERVAL_MS;
  if (!force && now - liveState.relayLastDronesStatePublishedAt < intervalMs) return;
  if (publishLiveRelayMessage(makeLiveDronesStateMessage(now))) {
    liveState.relayLastDronesStatePublishedAt = now;
  }
}

function publishLiveHomesState() {
  if (!isLiveRelayPublisherSocketOpen()) return;
  publishLiveRelayMessage(makeLiveHomesStateMessage());
}

function publishLiveHomesStateSoon() {
  publishLiveHomesState();
}

function startLiveRelayScenePublishing() {
  stopLiveRelayScenePublishing();
  if (!isLiveRelayPublisherSocketOpen()) return;
  publishLiveDronesState({ force: true });
  publishLiveHomesState();
  liveState.relayDronesStateTimer = window.setInterval(publishLiveDronesState, LIVE_RELAY_DRONES_STATE_INTERVAL_MS);
  liveState.relayHomesStateTimer = window.setInterval(publishLiveHomesState, LIVE_RELAY_HOMES_STATE_INTERVAL_MS);
}

function ensureLiveRelayScenePublishing() {
  if (!isLiveRelayPublisherSocketOpen()) return false;
  if (!liveState.relayDronesStateTimer || !liveState.relayHomesStateTimer) {
    startLiveRelayScenePublishing();
  }
  return true;
}

function stopLiveRelayScenePublishing() {
  if (liveState.relayDronesStateTimer) {
    window.clearInterval(liveState.relayDronesStateTimer);
    liveState.relayDronesStateTimer = null;
  }
  if (liveState.relayHomesStateTimer) {
    window.clearInterval(liveState.relayHomesStateTimer);
    liveState.relayHomesStateTimer = null;
  }
  liveState.relayLastDronesStatePublishedAt = 0;
}

function recordLiveRelayPublish(message, sentAt = Date.now()) {
  const debug = liveState.relayDebug;
  debug.publisherSentCount += 1;
  debug.publisherLastIntervalMs = debug.publisherLastSentAt ? Math.max(0, sentAt - debug.publisherLastSentAt) : null;
  debug.publisherLastSentAt = sentAt;
  debug.publisherLastMessageType = message?.type || "";
  if (message?.type === "drones_state") {
    debug.publisherLastDronesStateIntervalMs = debug.publisherLastDronesStateSentAt
      ? Math.max(0, sentAt - debug.publisherLastDronesStateSentAt)
      : null;
    debug.publisherLastDronesStateSentAt = sentAt;
    debug.publisherLastDronesCount = getDronesStateCount(message);
    debug.publisherLastDroneMaxAgeMs = getDronesStateMaxAgeMs(message);
  }
}

function recordLiveRelayReceive(envelope) {
  const message = envelope?.message;
  const debug = liveState.relayDebug;
  const now = Date.now();
  const workerReceivedAt = relayDebugNumber(envelope?.receivedAt);
  const publisherSentAt = relayDebugNumber(message?.sentAt ?? envelope?.sentAt);

  debug.viewerReceivedCount += 1;
  debug.viewerLastReceivedAt = now;
  debug.workerMessageCount = relayDebugNumber(envelope?.workerMessageCount);
  debug.workerDronesStateCount = relayDebugNumber(envelope?.workerDronesStateCount);

  if (message?.type !== "drones_state") return;

  debug.viewerDronesStateCount += 1;
  debug.viewerLastDronesStateIntervalMs =
    debug.viewerLastDronesStateReceivedAt ? Math.max(0, now - debug.viewerLastDronesStateReceivedAt) : null;
  debug.viewerLastDronesStateReceivedAt = now;
  debug.viewerLastDronesStateWorkerAt = workerReceivedAt;
  debug.viewerLastDronesStatePublisherSentAt = publisherSentAt;
  debug.viewerPublisherToWorkerMs =
    relayDebugNumber(envelope?.publisherToWorkerMs) ??
    (workerReceivedAt !== null && publisherSentAt !== null ? Math.max(0, workerReceivedAt - publisherSentAt) : null);
  debug.viewerWorkerToViewerMs = workerReceivedAt !== null ? Math.max(0, now - workerReceivedAt) : null;
  debug.viewerEndToEndMs = publisherSentAt !== null ? Math.max(0, now - publisherSentAt) : null;
  debug.viewerWorkerDronesStateIntervalMs = relayDebugNumber(envelope?.workerDronesStateIntervalMs);
  debug.viewerDronesCount = getDronesStateCount(message);
  debug.viewerDroneMaxAgeMs = getDronesStateMaxAgeMs(message);
}

function handleLiveRelayEnvelope(raw) {
  let envelope;
  try {
    envelope = JSON.parse(raw);
  } catch (err) {
    liveState.relayLastError = `Relay parse error: ${err.message}`;
    appendLiveDebug(liveState.relayLastError);
    renderLiveControls();
    return;
  }

  if (envelope.kind === "sgc_message" && envelope.message && typeof envelope.message === "object") {
    if (liveState.relayRole === "publisher") return;
    recordLiveRelayReceive(envelope);
    handleLiveProtocolMessage(envelope.message, "live-endpoint");
    return;
  }

  if (envelope.kind === "relay_status") {
    liveState.relayViewerCount = Number.isFinite(Number(envelope.viewerCount)) ? Number(envelope.viewerCount) : null;
    liveState.relayPublisherConnected = envelope.publisherConnected !== false;
    liveState.relayDebug.workerMessageCount = relayDebugNumber(envelope.totalMessageCount);
    liveState.relayDebug.workerDronesStateCount = relayDebugNumber(envelope.dronesStateCount);
    liveState.relayDebug.viewerWorkerDronesStateIntervalMs = relayDebugNumber(envelope.lastDronesStateIntervalMs);
    liveState.relayDebug.viewerPublisherToWorkerMs = relayDebugNumber(envelope.lastPublisherToWorkerMs);
    liveState.relayDebug.viewerDronesCount = relayDebugNumber(envelope.lastDronesStateDroneCount);
    liveState.relayDebug.viewerDroneMaxAgeMs = relayDebugNumber(envelope.lastDronesStateMaxDroneAgeMs);
    liveState.relayDebug.workerLastDronesStateAt = relayDebugNumber(envelope.lastDronesStateAt);
    liveState.relayDebug.workerLastDronesStateAgeMs = relayDebugNumber(envelope.lastDronesStateAgeMs);
    liveState.relayDebug.workerPublisherIdleMs = relayDebugNumber(envelope.publisherIdleMs);
    liveState.relayLastError = "";
    renderLiveControls();
    renderLiveGcStatus();
    return;
  }

  if (envelope.kind === "relay_error") {
    liveState.relayLastError = envelope.message || envelope.code || "Relay error";
    appendLiveDebug(`relay: ${liveState.relayLastError}`);
    renderLiveControls();
  }
}

function publishLiveRelayMessage(message) {
  if (liveState.relayRole !== "publisher" || !message || !LIVE_RELAY_MESSAGE_TYPES.has(message.type)) return false;
  const socket = liveState.relaySocket;
  if (!socket || socket.readyState !== WebSocket.OPEN) return false;
  try {
    const sentAt = Date.now();
    socket.send(JSON.stringify({
      kind: "sgc_message",
      sessionId: LIVE_RELAY_PUBLIC_SESSION_ID,
      message,
      sentAt,
    }));
    recordLiveRelayPublish(message, sentAt);
    return true;
  } catch (err) {
    liveState.relayLastError = err.message || "Relay publish failed.";
    appendLiveDebug(`relay publish failed: ${liveState.relayLastError}`);
    renderLiveControls();
    return false;
  }
}

function connectLiveRelay({ auto = false } = {}) {
  if (!isLiveRelayMode()) return;
  if (!("WebSocket" in window)) {
    liveState.relayState = "error";
    liveState.relayLastError = "WebSocket is unavailable in this browser.";
    renderLiveControls();
    return;
  }
  readLiveRelayInputs();
  const role = getLiveRelayDesiredRole();
  if (isLiveRelayDesiredSocketActive(role)) return;

  closeLiveRelayConnection({ user: false, reason: "reconnect" });
  liveState.relayUserClosed = false;
  liveState.relayRole = role;
  liveState.relayState = auto ? "reconnecting" : "connecting";
  liveState.relayLastError = "";
  renderLiveControls();

  let socket;
  try {
    socket = new WebSocket(buildLiveRelayUrl(role));
  } catch (err) {
    liveState.relayState = "error";
    liveState.relayLastError = err.message || "Relay URL is invalid.";
    renderLiveControls();
    return;
  }

  liveState.relaySocket = socket;
  socket.addEventListener("open", () => {
    if (!isLiveRelaySocketCurrent(socket)) {
      appendStaleLiveRelayEventDebug("open");
      return;
    }
    liveState.relayConnected = true;
    liveState.relayState = "connected";
    liveState.relayReconnectAttempts = 0;
    liveState.relayLastError = "";
    appendLiveDebug(role === "publisher" ? "relay broadcasting connected" : "live endpoint connected");
    if (role === "publisher") startLiveRelayScenePublishing();
    renderLiveControls();
    updateStatusList();
  });
  socket.addEventListener("message", (event) => {
    if (!isLiveRelaySocketCurrent(socket)) return;
    handleLiveRelayEnvelope(String(event.data || ""));
  });
  socket.addEventListener("error", () => {
    if (!isLiveRelaySocketCurrent(socket)) {
      appendStaleLiveRelayEventDebug("error");
      return;
    }
    liveState.relayState = "error";
    liveState.relayLastError = "Relay socket error.";
    renderLiveControls();
  });
  socket.addEventListener("close", (event) => {
    if (!isLiveRelaySocketCurrent(socket)) {
      appendStaleLiveRelayEventDebug("close");
      return;
    }
    if (role === "publisher") stopLiveRelayScenePublishing();
    liveState.relaySocket = null;
    liveState.relayConnected = false;
    liveState.relayRole = null;
    liveState.relayViewerCount = null;
    liveState.relayPublisherConnected = false;
    if (!liveState.relayUserClosed) {
      liveState.relayLastError = event.reason || (event.code === 1000 ? "" : `Relay closed (${event.code}).`);
      scheduleLiveRelayReconnect();
    } else {
      liveState.relayState = "disconnected";
      renderLiveControls();
    }
    updateStatusList();
  });
}

function setLiveTelemetrySourceMode(mode) {
  const nextMode = normalizeLiveSourceMode(mode);
  if (liveState.telemetrySourceMode === nextMode) return;
  liveState.telemetrySourceMode = nextMode;
  closeLiveRelayConnection({ user: true, reason: "source changed" });
  syncLiveRelayInputsFromState();
  renderLiveControls();
  renderLiveGcStatus();
  updateStatusList();
}

function ensureLiveRelayForCurrentState() {
  if (!isLiveRelayMode()) return;
  const desiredRole = getLiveRelayDesiredRole();
  if (isLiveRelayDesiredSocketActive(desiredRole)) {
    if (desiredRole === "publisher") ensureLiveRelayScenePublishing();
    return;
  }
  liveState.relayUserClosed = false;
  connectLiveRelay({ auto: true });
}

function renderLiveControls() {
  const openBtn = document.getElementById("liveSerialOpenBtn");
  const closeBtn = document.getElementById("liveSerialCloseBtn");
  const baudInput = document.getElementById("liveSerialBaud");
  const resetBtn = document.getElementById("liveResetSessionBtn");
  const searchBtn = document.getElementById("liveSearchBtn");
  const sourceEl = document.getElementById("liveTelemetrySource");
  const relayFields = document.getElementById("liveRelayFields");
  const relayStateEl = document.getElementById("liveRelayState");
  const relayConnectBtn = document.getElementById("liveRelayConnectBtn");
  const relayDisconnectBtn = document.getElementById("liveRelayDisconnectBtn");
  const relayTokenField = document.getElementById("liveRelayTokenField");
  const debugPanel = document.getElementById("liveDebugPanel");
  const debugStateEl = document.getElementById("liveDebugState");
  const debugDroneStateEl = document.getElementById("liveDebugDroneState");
  const debugDroneWifiStateEl = document.getElementById("liveDebugDroneWifiState");
  const debugDroneWifiHostEl = document.getElementById("liveDebugDroneWifiHost");
  updateLiveGcDiagnosticControls();
  if (openBtn) openBtn.disabled = liveState.connected;
  if (closeBtn) closeBtn.disabled = !liveState.connected;
  if (baudInput) baudInput.disabled = liveState.connected;
  if (resetBtn) {
    resetBtn.textContent = liveState.freshSessionPending ? "Resetting..." : "Reset";
    resetBtn.disabled = isLiveCommandReadOnlyMode() || !liveState.connected || liveState.freshSessionPending || liveState.freshSessionConfirming;
    resetBtn.title = liveCommandReadOnlyMessage();
  }
  applyLiveSearchButtonState(searchBtn);
  syncLiveRelayInputsFromState();
  if (sourceEl) sourceEl.value = normalizeLiveSourceMode(liveState.telemetrySourceMode);
  if (relayFields) {
    const visible = isLiveRelayMode();
    relayFields.hidden = !visible;
    relayFields.classList.toggle("is-broadcast", isLiveRelayBroadcastMode());
  }
  if (relayTokenField) relayTokenField.hidden = !isLiveRelayBroadcastMode();
  if (relayStateEl) {
    relayStateEl.textContent = formatLiveRelayState();
    relayStateEl.title = liveState.relayLastError || formatLiveRelayDebugDetails() || "";
  }
  if (relayConnectBtn) {
    relayConnectBtn.textContent = liveState.relayState === "connecting" || liveState.relayState === "reconnecting"
      ? "Connecting..."
      : isLiveRelayBroadcastMode() ? "Broadcast" : "Connect";
    relayConnectBtn.disabled = !isLiveRelayMode() || liveState.relayConnected || liveState.relayState === "connecting" || liveState.relayState === "reconnecting";
  }
  if (relayDisconnectBtn) relayDisconnectBtn.disabled = !isLiveRelayMode() || (!liveState.relayConnected && liveState.relayState !== "reconnecting");
  if (debugPanel) debugPanel.hidden = !liveState.debugEnabled;
  if (debugStateEl) debugStateEl.textContent = liveState.debugStateText || "Idle";
  if (debugDroneStateEl) {
    debugDroneStateEl.textContent = liveState.droneDebugConnected
      ? `Connected ${liveState.droneDebugStatus?.joinMode || ""}`.trim()
      : "Disconnected";
  }
  if (debugDroneWifiStateEl) debugDroneWifiStateEl.textContent = liveState.droneWifiStateText || "Idle";
  if (debugDroneWifiHostEl && document.activeElement !== debugDroneWifiHostEl) {
    debugDroneWifiHostEl.value = liveState.droneWifiHost || "simple-mesh-7.local";
  }
  const telegcDebugBtns = [
    "liveDebugTeleGcStatusBtn",
    "liveDebugMaGcStatusBtn",
    "liveDebugMaGcBindBtn",
    "liveDebugMaGcCancelBtn",
  ];
  telegcDebugBtns.forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.disabled = !liveState.debugEnabled || isLiveCommandReadOnlyMode() || !liveState.connected;
  });
  const droneOpenBtn = document.getElementById("liveDebugDroneOpenBtn");
  const droneCloseBtn = document.getElementById("liveDebugDroneCloseBtn");
  const droneCommandBtns = [
    "liveDebugDroneHoldBtn",
    "liveDebugDroneJoinBtn",
    "liveDebugDroneRestartHoldBtn",
    "liveDebugDronePauseBtn",
    "liveDebugDroneRfLoss2Btn",
    "liveDebugDroneDelay20Btn",
    "liveDebugDroneDrop2Btn",
    "liveDebugDroneRebootHoldBtn",
  ];
  if (droneOpenBtn) droneOpenBtn.disabled = !liveState.debugEnabled || liveState.droneDebugConnected;
  if (droneCloseBtn) droneCloseBtn.disabled = !liveState.debugEnabled || !liveState.droneDebugConnected;
  droneCommandBtns.forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.disabled = !liveState.debugEnabled || !liveState.droneDebugConnected;
  });
  const pauseBtn = document.getElementById("liveDebugDronePauseBtn");
  if (pauseBtn) pauseBtn.textContent = liveState.droneDebugTelemetryPaused ? "Resume Telemetry" : "Pause Telemetry";
  [
    "liveDebugDroneWifiStatusBtn",
    "liveDebugDroneWifiHoldBtn",
    "liveDebugDroneWifiJoinBtn",
    "liveDebugDroneWifiRestartHoldBtn",
    "liveDebugDroneWifiPauseBtn",
    "liveDebugDroneWifiRfLoss2Btn",
    "liveDebugDroneWifiDelay20Btn",
    "liveDebugDroneWifiDrop2Btn",
    "liveDebugDroneWifiRebootHoldBtn",
  ].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.disabled = !liveState.debugEnabled || liveState.droneWifiBusy;
  });
  const wifiPauseBtn = document.getElementById("liveDebugDroneWifiPauseBtn");
  if (wifiPauseBtn) wifiPauseBtn.textContent = liveState.droneDebugTelemetryPaused ? "Resume Telemetry" : "Pause Telemetry";
}

function describeLiveSerialPort(port) {
  if (!port || typeof port.getInfo !== "function") return "Selected";
  const info = port.getInfo();
  const parts = [];
  if (info.usbVendorId !== undefined) parts.push(`VID 0x${info.usbVendorId.toString(16).padStart(4, "0")}`);
  if (info.usbProductId !== undefined) parts.push(`PID 0x${info.usbProductId.toString(16).padStart(4, "0")}`);
  return parts.length ? parts.join(" / ") : "Selected";
}

function getLiveSerialPortInfo(port) {
  if (!port || typeof port.getInfo !== "function") return {};
  try {
    return port.getInfo() || {};
  } catch {
    return {};
  }
}

function rememberLiveSerialPort(port) {
  liveState.lastSerialPort = port;
  liveState.lastSerialPortInfo = getLiveSerialPortInfo(port);
}

function liveSerialInfoMatches(a = {}, b = {}) {
  const hasUsbInfo = a.usbVendorId !== undefined || a.usbProductId !== undefined;
  if (!hasUsbInfo) return false;
  return a.usbVendorId === b.usbVendorId && a.usbProductId === b.usbProductId;
}

function clearLiveSerialReconnectTimer() {
  if (liveState.reconnectTimer) {
    window.clearTimeout(liveState.reconnectTimer);
    liveState.reconnectTimer = null;
  }
}

function selectLiveReconnectPort(ports) {
  if (!Array.isArray(ports) || !ports.length) return null;
  if (liveState.lastSerialPort && ports.includes(liveState.lastSerialPort)) {
    return liveState.lastSerialPort;
  }
  const matchingInfo = ports.filter((port) => {
    return liveSerialInfoMatches(liveState.lastSerialPortInfo || {}, getLiveSerialPortInfo(port));
  });
  if (matchingInfo.length === 1) return matchingInfo[0];
  if (ports.length === 1) return ports[0];
  return null;
}

function scheduleLiveSerialReconnect(reason, delayMs = LIVE_SERIAL_RECONNECT_INTERVAL_MS) {
  if (
    !LIVE_POSITION_AUTO_CONNECT ||
    liveState.userClosedSerial ||
    liveState.connected ||
    !("serial" in navigator) ||
    !navigator.serial.getPorts
  ) {
    return;
  }
  if (!liveState.reconnecting) {
    appendLiveDebug(`auto reconnect: ${reason}`);
  }
  liveState.reconnecting = true;
  setLiveSerialState("waiting", "Reconnecting", "Waiting for the GC ESP32 serial port.");
  if (liveState.reconnectTimer) return;
  liveState.reconnectTimer = window.setTimeout(tryLiveSerialReconnect, delayMs);
}

async function tryLiveSerialReconnect() {
  liveState.reconnectTimer = null;
  if (liveState.userClosedSerial || liveState.connected || !navigator.serial?.getPorts) {
    liveState.reconnecting = false;
    return;
  }

  try {
    const ports = await navigator.serial.getPorts();
    const selectedPort = selectLiveReconnectPort(ports);
    if (selectedPort) {
      await openLiveSerialPort({ port: selectedPort, auto: true });
    }
  } catch (err) {
    appendLiveDebug(`auto reconnect error: ${err.message || err}`);
  }

  if (!liveState.connected && !liveState.userClosedSerial) {
    scheduleLiveSerialReconnect("port not ready yet");
  }
}

function handleLiveSerialBrowserDisconnect(event) {
  const disconnectedPort = event?.port || event?.target;
  if (disconnectedPort && liveState.port && disconnectedPort !== liveState.port) return;
  if (liveState.userClosedSerial) return;
  markLiveSerialDisconnected("Selected port disconnected.");
}

function handleLiveSerialBrowserConnect() {
  if (liveState.reconnecting && !liveState.connected && !liveState.userClosedSerial) {
    clearLiveSerialReconnectTimer();
    scheduleLiveSerialReconnect("port returned", 0);
  }
}

function getLiveSerialDroneCount() {
  return drones.filter((drone) => drone.type === "live").length;
}

function getLiveAssignedDebug(status = {}, table = {}) {
  const tableAssignments = Array.isArray(table.assignments) ? table.assignments.length : null;
  const statusAssigned = Number.isFinite(Number(status.assignedDrones)) ? Number(status.assignedDrones) : null;
  const liveSerialDrones = getLiveSerialDroneCount();
  const allDrones = drones.length;

  if (liveState.serialTelemetrySeen) {
    return {
      count: liveSerialDrones,
      source: "serial-live-drones",
      liveSerialDrones,
      allDrones,
      tableAssignments,
      statusAssigned,
    };
  }
  if (tableAssignments !== null) {
    return {
      count: tableAssignments,
      source: "channel-table",
      liveSerialDrones,
      allDrones,
      tableAssignments,
      statusAssigned,
    };
  }
  if (statusAssigned !== null) {
    return {
      count: statusAssigned,
      source: "gc-status",
      liveSerialDrones,
      allDrones,
      tableAssignments,
      statusAssigned,
    };
  }
  return {
    count: allDrones,
    source: "local-drones",
    liveSerialDrones,
    allDrones,
    tableAssignments,
    statusAssigned,
  };
}

function formatGpsSourceLabel(latest = {}) {
  if (latest.gpsSimulated) return "GPS SIM";
  if (latest.gpsSource === "fc_gps") return "GPS FC";
  if (latest.gpsSource === "none") return "GPS NONE";
  return latest.gpsSource ? String(latest.gpsSource).toUpperCase() : "N/A";
}

function formatHeadingFusionLabel(latest = {}) {
  const source = latest.headingSource ? String(latest.headingSource).replace(/_/g, " ").toUpperCase() : "UNKNOWN";
  const weight = Number(latest.cogWeight);
  const bias = Number(latest.yawBiasDeg);
  const parts = [source];
  if (Number.isFinite(weight)) {
    parts.push(`CoG ${(weight * 100).toFixed(0)}%`);
  }
  if (latest.yawBiasValid && Number.isFinite(bias)) {
    parts.push(`bias ${bias.toFixed(1)} deg`);
  }
  return parts.join(" / ");
}

function liveFrequencyKey(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(1) : "";
}

function firstFiniteNumber(...values) {
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }
  return NaN;
}

function normalizeLiveChannelState(channel = {}, assigned = false) {
  if (assigned) return "assigned";
  const confidence = normalizeLiveActivityConfidence(channel.activityConfidence);
  if (Boolean(channel.cadError) && !Boolean(channel.activityDetected) && confidence !== "confirmed_drone") return "unknown";
  if (Boolean(channel.confirmedDrone) || confidence === "confirmed_drone") return "occupied";
  const cadExpired = isLiveCadSuspectExpired(channel);
  if (!cadExpired && (confidence === "cad_suspect" || String(channel.activitySource || "").toLowerCase() === "cad")) return "cad-suspect";
  const raw = channel.state !== undefined ? String(channel.state).toLowerCase() : "";
  if (raw === "free" || raw === "clear") return "free";
  if (raw === "cad-suspect" || raw === "cad_suspect") return cadExpired ? "free" : "cad-suspect";
  if (raw === "occupied" || raw === "noisy" || raw === "busy") {
    return !cadExpired && (confidence === "cad_suspect" || String(channel.activitySource || "").toLowerCase() === "cad")
      ? "cad-suspect"
      : "occupied";
  }
  if (raw === "assigned") return "assigned";
  if (raw === "reserved" || raw === "guard" || raw === "shared") return "reserved";
  if (Boolean(channel.activityDetected) || Boolean(channel.channelActivityDetected)) {
    return !cadExpired && (confidence === "cad_suspect" || String(channel.activitySource || "").toLowerCase() === "cad")
      ? "cad-suspect"
      : "occupied";
  }
  if (Boolean(channel.clear)) return "free";
  return raw || "unknown";
}

function normalizeLiveDetectedProfileIds(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((id) => Number(id)).filter((id) => Number.isFinite(id)))];
}

function normalizeLiveActivityConfidence(value) {
  const raw = value === undefined || value === null ? "" : String(value).toLowerCase();
  if (raw === "confirmed_drone" || raw === "confirmed" || raw === "decoded_telemetry") return "confirmed_drone";
  if (raw === "cad_suspect" || raw === "suspect" || raw === "cad") return "cad_suspect";
  if (raw === "scan_error" || raw === "error") return "scan_error";
  if (raw === "free" || raw === "none" || raw === "clear") return "free";
  return "";
}

function liveCadAgeMs(channel = {}, now = Date.now()) {
  const wireAge = Number(channel.cadAgeMs);
  if (Number.isFinite(wireAge) && wireAge >= 0) return wireAge;
  const updatedAt = Number(channel.cadUpdatedAt);
  if (Number.isFinite(updatedAt) && updatedAt > 0) return Math.max(0, now - updatedAt);
  return NaN;
}

function isLiveCadSuspectExpired(channel = {}, now = Date.now()) {
  if (Boolean(channel.confirmedDrone) || normalizeLiveActivityConfidence(channel.activityConfidence) === "confirmed_drone") return false;
  const confidence = normalizeLiveActivityConfidence(channel.activityConfidence);
  if (confidence !== "cad_suspect" && String(channel.activitySource || "").toLowerCase() !== "cad") return false;
  const age = liveCadAgeMs(channel, now);
  return Number.isFinite(age) && age > LIVE_CAD_SUSPECT_TTL_MS;
}

function liveActivityConfidenceRank(value) {
  const confidence = normalizeLiveActivityConfidence(value);
  if (confidence === "confirmed_drone") return 3;
  if (confidence === "cad_suspect") return 2;
  if (confidence === "scan_error") return 1;
  if (confidence === "free") return 0;
  return -1;
}

function strongerLiveActivityConfidence(a, b) {
  return liveActivityConfidenceRank(b) > liveActivityConfidenceRank(a)
    ? normalizeLiveActivityConfidence(b)
    : normalizeLiveActivityConfidence(a);
}

function getLiveRssiBarHeight(rssi) {
  const number = Number(rssi);
  if (!Number.isFinite(number)) return null;
  return 10 + clamp01((number + 120) / 90) * 34;
}

function getLiveChannelRows(table = {}) {
  const assignmentByKey = new Map();
  (Array.isArray(table.assignments) ? table.assignments : []).forEach((item) => {
    const key = liveFrequencyKey(item.frequencyMhz);
    if (key) assignmentByKey.set(key, item);
  });

  if (Array.isArray(table.channels) && table.channels.length) {
    return table.channels
      .map((channel) => {
        const key = liveFrequencyKey(channel.frequencyMhz);
        const assignment = assignmentByKey.get(key);
        const assigned = Boolean(channel.assigned) || Boolean(assignment);
        const confidence = normalizeLiveActivityConfidence(channel.activityConfidence);
        const cadExpired = isLiveCadSuspectExpired(channel);
        const state = normalizeLiveChannelState(channel, assigned);
        const displayRssi = assigned
          ? firstFiniteNumber(assignment?.rssi, channel.displayRssi, channel.rssi, channel.maxRssi, channel.medianRssi)
          : firstFiniteNumber(channel.displayRssi, channel.rssi, channel.maxRssi, channel.medianRssi);
        return {
          channelIndex: Number(channel.channelIndex),
          frequencyMhz: Number(channel.frequencyMhz),
          role: channel.role || "telemetry_candidate",
          clear: state === "free",
          assigned,
          activityDetected: !cadExpired && (Boolean(channel.activityDetected) || Boolean(channel.channelActivityDetected) || state === "occupied" || state === "cad-suspect"),
          activitySource: cadExpired ? "none" : channel.activitySource || "",
          activityConfidence: cadExpired ? "free" : confidence,
          cadStatus: channel.cadStatus || "",
          cadError: Boolean(channel.cadError),
          cadSampleCount: Number(channel.cadSampleCount),
          cadHitCount: Number(channel.cadHitCount),
          cadValidated: Boolean(channel.cadValidated),
          cadRejected: Boolean(channel.cadRejected),
          cadAgeMs: Number(channel.cadAgeMs),
          cadUpdatedAt: Date.now() - (Number.isFinite(Number(channel.cadAgeMs)) ? Math.max(0, Number(channel.cadAgeMs)) : 0),
          listenAttempted: Boolean(channel.listenAttempted),
          confirmedDrone: Boolean(channel.confirmedDrone),
          decodedNodeId: Number(channel.decodedNodeId),
          detectedProfileIds: normalizeLiveDetectedProfileIds(channel.detectedProfileIds),
          medianRssi: Number(channel.medianRssi),
          maxRssi: Number(channel.maxRssi),
          displayRssi,
          state,
        };
      })
      .filter((channel) => Number.isFinite(channel.frequencyMhz))
      .sort((a, b) => a.frequencyMhz - b.frequencyMhz);
  }

  const rows = [];
  const noisyKeys = new Set((Array.isArray(table.noisyFrequencyMhz) ? table.noisyFrequencyMhz : []).map(liveFrequencyKey));
  const addRow = (frequencyMhz, role, clear = false, state = "") => {
    const freq = Number(frequencyMhz);
    if (!Number.isFinite(freq)) return;
    const key = liveFrequencyKey(freq);
    const assignment = assignmentByKey.get(key);
    const assigned = Boolean(assignment);
    const normalizedState = assigned ? "assigned" : state || (noisyKeys.has(key) ? "cad-suspect" : clear ? "free" : "unknown");
    rows.push({
      channelIndex: Math.round((freq - 902.5) / 0.5),
      frequencyMhz: freq,
      role,
      clear: normalizedState === "free",
      assigned,
      activityDetected: normalizedState === "cad-suspect" || normalizedState === "occupied",
      activitySource: normalizedState === "cad-suspect" ? "cad" : "none",
      activityConfidence: normalizedState === "cad-suspect" ? "cad_suspect" : normalizedState === "free" ? "free" : "",
      cadStatus: normalizedState === "cad-suspect" ? "detected" : normalizedState === "free" ? "free" : "",
      cadError: false,
      cadSampleCount: NaN,
      cadHitCount: NaN,
      cadValidated: false,
      cadRejected: false,
      cadAgeMs: NaN,
      cadUpdatedAt: normalizedState === "cad-suspect" ? Date.now() : 0,
      listenAttempted: false,
      confirmedDrone: false,
      decodedNodeId: NaN,
      detectedProfileIds: [],
      medianRssi: NaN,
      maxRssi: NaN,
      displayRssi: firstFiniteNumber(assignment?.rssi),
      state: normalizedState,
    });
  };
  (Array.isArray(table.candidateFrequencyMhz) ? table.candidateFrequencyMhz : []).forEach((freq) => {
    const key = liveFrequencyKey(freq);
    const clear = Array.isArray(table.clearFrequencyMhz) && table.clearFrequencyMhz.map(liveFrequencyKey).includes(key);
    addRow(freq, "telemetry_candidate", clear, clear ? "free" : noisyKeys.has(key) ? "occupied" : "");
  });
  (Array.isArray(table.reservedFrequencyMhz) ? table.reservedFrequencyMhz : []).forEach((freq) => {
    addRow(freq, Math.abs(Number(freq) - 915.0) < 0.01 ? "shared" : "guard", false, "reserved");
  });
  return rows.sort((a, b) => a.frequencyMhz - b.frequencyMhz);
}

function getDefaultLiveScanChannels() {
  const rows = [];
  for (let index = 0; index <= 50; index++) {
    const frequencyMhz = 902.5 + index * 0.5;
    const role =
      index === 25
        ? "shared"
        : index === 24 || index === 26
          ? "guard"
          : "telemetry_candidate";
    rows.push({
      channelIndex: index,
      frequencyMhz,
      role,
      clear: false,
      assigned: false,
      activityDetected: false,
      activitySource: "none",
      activityConfidence: "",
      cadStatus: "",
      cadError: false,
      cadSampleCount: NaN,
      cadHitCount: NaN,
      cadValidated: false,
      cadRejected: false,
      cadAgeMs: NaN,
      cadUpdatedAt: 0,
      listenAttempted: false,
      confirmedDrone: false,
      decodedNodeId: NaN,
      detectedProfileIds: [],
      medianRssi: NaN,
      maxRssi: NaN,
      displayRssi: NaN,
      state: "pending",
    });
  }
  return rows;
}

function getLiveScanDisplayTable(table = {}, includeScanRows = false) {
  if (!liveState.scanAnimationVisible && !liveState.scanInProgress && !includeScanRows) {
    return table;
  }

  const rowsByKey = new Map();
  getDefaultLiveScanChannels().forEach((channel) => {
    rowsByKey.set(liveFrequencyKey(channel.frequencyMhz), channel);
  });

  liveState.scanRows.forEach((channel, key) => {
    if (isLiveCadSuspectExpired(channel)) {
      const expired = {
        ...channel,
        activityDetected: false,
        activitySource: "none",
        activityConfidence: "free",
        cadStatus: "free",
        clear: true,
        state: "free",
        detectedProfileIds: [],
        displayRssi: NaN,
        medianRssi: NaN,
        maxRssi: NaN,
      };
      liveState.scanRows.set(key, expired);
      rowsByKey.set(liveFrequencyKey(expired.frequencyMhz), expired);
      return;
    }
    rowsByKey.set(liveFrequencyKey(channel.frequencyMhz), channel);
  });

  getLiveChannelRows(table).forEach((channel) => {
    const key = liveFrequencyKey(channel.frequencyMhz);
    const existing = rowsByKey.get(key);
    if (existing) {
      const now = Date.now();
      const incomingConfidence = normalizeLiveActivityConfidence(channel.activityConfidence);
      const incomingCad = incomingConfidence === "cad_suspect" || channel.state === "cad-suspect";
      const incomingConfirmed = Boolean(channel.confirmedDrone) || incomingConfidence === "confirmed_drone";
      const incomingFree = !channel.assigned && !incomingConfirmed && (
        channel.state === "free" ||
        Boolean(channel.clear) ||
        (incomingConfidence === "free" && !Boolean(channel.activityDetected))
      );
      existing.assigned = existing.assigned || channel.assigned;
      if (incomingConfirmed) {
        existing.activityDetected = true;
        existing.activityConfidence = "confirmed_drone";
        existing.activitySource = channel.activitySource || "decoded_telemetry";
        existing.confirmedDrone = true;
        existing.state = "occupied";
        existing.clear = false;
      } else if (incomingFree) {
        existing.activityDetected = false;
        existing.activityConfidence = "free";
        existing.activitySource = "none";
        existing.cadStatus = "free";
        existing.cadError = false;
        existing.cadValidated = false;
        existing.cadRejected = Boolean(channel.cadRejected);
        existing.confirmedDrone = false;
        existing.decodedNodeId = NaN;
        existing.detectedProfileIds = [];
        existing.state = "free";
        existing.clear = true;
      } else if (incomingCad && !isLiveCadSuspectExpired(channel, now)) {
        existing.activityDetected = true;
        existing.activityConfidence = "cad_suspect";
        existing.activitySource = channel.activitySource || "cad";
        existing.cadStatus = channel.cadStatus || "detected";
        existing.cadError = false;
        existing.cadValidated = Boolean(channel.cadValidated);
        existing.cadRejected = Boolean(channel.cadRejected);
        existing.cadUpdatedAt = now - (Number.isFinite(Number(channel.cadAgeMs)) ? Math.max(0, Number(channel.cadAgeMs)) : 0);
        existing.state = "cad-suspect";
        existing.clear = false;
      } else if (channel.cadError) {
        existing.cadError = true;
        existing.state = "unknown";
        existing.clear = false;
      }
      existing.listenAttempted = Boolean(existing.listenAttempted) || Boolean(channel.listenAttempted);
      if (Number.isFinite(channel.decodedNodeId)) existing.decodedNodeId = channel.decodedNodeId;
      existing.detectedProfileIds = incomingFree
        ? []
        : normalizeLiveDetectedProfileIds([
            ...(existing.detectedProfileIds || []),
            ...(channel.detectedProfileIds || []),
          ]);
      if (Number.isFinite(channel.cadSampleCount)) existing.cadSampleCount = channel.cadSampleCount;
      if (Number.isFinite(channel.cadHitCount)) existing.cadHitCount = channel.cadHitCount;
      if (Number.isFinite(channel.cadAgeMs)) existing.cadAgeMs = channel.cadAgeMs;
      if (Number.isFinite(channel.displayRssi)) existing.displayRssi = channel.displayRssi;
      if (Number.isFinite(channel.medianRssi)) existing.medianRssi = channel.medianRssi;
      if (Number.isFinite(channel.maxRssi)) existing.maxRssi = channel.maxRssi;
      if (channel.assigned) {
        existing.state = "assigned";
      } else if (isLiveCadSuspectExpired(existing, now)) {
        existing.activityDetected = false;
        existing.activityConfidence = "free";
        existing.activitySource = "none";
        existing.cadStatus = "free";
        existing.state = "free";
      } else if (existing.cadError && !existing.activityDetected) {
        existing.state = "unknown";
      } else if (existing.activityConfidence === "cad_suspect") {
        existing.state = "cad-suspect";
      } else if (existing.activityDetected || channel.state === "occupied") {
        existing.state = "occupied";
      } else if (channel.state === "free") {
        existing.state = "free";
      }
      existing.clear = existing.state === "free";
      if (channel.role === "shared" || channel.role === "guard") {
        existing.role = channel.role;
      }
    } else if (channel.role === "shared" || channel.role === "guard" || channel.assigned) {
      rowsByKey.set(key, channel);
    }
  });

  return {
    ...table,
    channels: [...rowsByKey.values()].sort((a, b) => a.frequencyMhz - b.frequencyMhz),
  };
}

function showLiveScanAnimation() {
  liveState.scanAnimationVisible = true;
  if (liveState.scanAnimationHideTimer) {
    window.clearTimeout(liveState.scanAnimationHideTimer);
    liveState.scanAnimationHideTimer = null;
  }
}

function scheduleLiveScanAnimationHide() {
  liveState.scanAnimationVisible = true;
  if (liveState.scanAnimationHideTimer) {
    window.clearTimeout(liveState.scanAnimationHideTimer);
  }
  liveState.scanAnimationHideTimer = window.setTimeout(() => {
    if (liveState.scanInProgress) return;
    liveState.scanAnimationVisible = false;
    if (!liveState.spectrumPanelOpen) {
      liveState.scanRows.clear();
    }
    liveState.scanAnimationHideTimer = null;
    renderLiveGcStatus();
  }, LIVE_SCAN_ANIMATION_HOLD_MS);
}

function updateLiveScanRow(message) {
  const frequencyMhz = Number(message.frequencyMhz);
  if (!Number.isFinite(frequencyMhz)) return;
  const key = liveFrequencyKey(frequencyMhz);
  const existing = liveState.scanRows.get(key) || {};
  const previousProfiles = normalizeLiveDetectedProfileIds(existing.detectedProfileIds);
  const profileIds = normalizeLiveDetectedProfileIds(message.detectedProfileIds);
  const radioProfileId = Number(message.radioProfileId);
  const messageConfidence = normalizeLiveActivityConfidence(
    message.activityConfidence || (Boolean(message.confirmedDrone) ? "confirmed_drone" : Boolean(message.activityDetected) ? "cad_suspect" : Boolean(message.cadError) ? "scan_error" : "free")
  );
  const now = Date.now();
  const incomingConfirmed = Boolean(message.confirmedDrone) || messageConfidence === "confirmed_drone";
  const incomingCad = messageConfidence === "cad_suspect";
  const incomingFree = !incomingConfirmed && (
    messageConfidence === "free" ||
    message.state === "free" ||
    Boolean(message.clear) ||
    Boolean(message.cadRejected)
  );
  if (incomingCad && Number.isFinite(radioProfileId)) {
    profileIds.push(radioProfileId);
  }
  const cadUpdatedAt = incomingCad
    ? now - (Number.isFinite(Number(message.cadAgeMs)) ? Math.max(0, Number(message.cadAgeMs)) : 0)
    : Number(existing.cadUpdatedAt) || 0;
  const cadExpired = incomingCad && isLiveCadSuspectExpired({ ...message, cadUpdatedAt }, now);
  const detectedProfileIds = incomingFree || cadExpired
    ? []
    : normalizeLiveDetectedProfileIds([...previousProfiles, ...profileIds]);
  const cadError = Boolean(message.cadError);
  const activityConfidence = incomingConfirmed
    ? "confirmed_drone"
    : incomingCad && !cadExpired
      ? "cad_suspect"
      : cadError
        ? "scan_error"
        : "free";
  const activityDetected = incomingConfirmed || (incomingCad && !cadExpired);
  const state = incomingConfirmed
    ? "occupied"
    : incomingCad && !cadExpired
      ? "cad-suspect"
      : cadError
        ? "unknown"
        : "free";
  liveState.scanRows.set(key, {
    channelIndex: Number(message.channelIndex),
    frequencyMhz,
    role: "telemetry_candidate",
    clear: state === "free",
    assigned: false,
    activityDetected,
    activitySource: activityDetected ? (message.activitySource || (incomingConfirmed ? "decoded_telemetry" : "cad")) : "none",
    activityConfidence,
    cadStatus: activityDetected ? (message.cadStatus || "detected") : cadError ? "error" : "free",
    cadError,
    cadSampleCount: firstFiniteNumber(message.cadSampleCount, existing.cadSampleCount),
    cadHitCount: firstFiniteNumber(message.cadHitCount, existing.cadHitCount),
    cadValidated: Boolean(message.cadValidated),
    cadRejected: Boolean(message.cadRejected),
    cadAgeMs: firstFiniteNumber(message.cadAgeMs, incomingCad ? 0 : NaN),
    cadUpdatedAt,
    listenAttempted: Boolean(message.listenAttempted) || (!incomingFree && Boolean(existing.listenAttempted)),
    confirmedDrone: incomingConfirmed,
    decodedNodeId: incomingFree ? NaN : firstFiniteNumber(message.decodedNodeId, existing.decodedNodeId),
    detectedProfileIds,
    medianRssi: incomingFree ? NaN : firstFiniteNumber(message.medianRssi, existing.medianRssi),
    maxRssi: incomingFree ? NaN : firstFiniteNumber(message.maxRssi, existing.maxRssi),
    displayRssi: incomingFree ? NaN : firstFiniteNumber(message.displayRssi, message.rssi, message.maxRssi, message.medianRssi, existing.displayRssi),
    state,
  });
}

function getLiveChannelSummary(table = {}) {
  const status = liveState.gcStatus || {};
  const assignedDebug = getLiveAssignedDebug(status, table);
  let occupied = Number(table.occupiedChannels);
  if (!Number.isFinite(occupied)) occupied = Number(status.occupiedChannels);
  if (!Number.isFinite(occupied) && Array.isArray(table.noisyFrequencyMhz)) occupied = table.noisyFrequencyMhz.length;
  if (!Number.isFinite(occupied)) occupied = Number(status.noisyChannels);

  let free = Number(table.freeChannels);
  if (!Number.isFinite(free)) free = Number(status.freeChannels);
  if (!Number.isFinite(free) && Array.isArray(table.clearFrequencyMhz)) free = table.clearFrequencyMhz.length;
  if (!Number.isFinite(free)) free = Number(status.clearChannels);

  return {
    assigned: Number.isFinite(assignedDebug.count) ? assignedDebug.count : NaN,
    clear: free,
    noisy: occupied,
    free,
    occupied,
  };
}

function renderLiveSpectrumConfirm(host) {
  if (!liveState.spectrumRescanConfirming) return;

  const confirmEl = document.createElement("div");
  confirmEl.className = "live-confirm";
  const messageEl = document.createElement("div");
  messageEl.className = "live-confirm-message";
  messageEl.textContent = "Re-scanning channels may temporarily stale drone telemetry while the GC scans the spectrum. Continue?";
  confirmEl.appendChild(messageEl);

  const confirmActions = document.createElement("div");
  confirmActions.className = "live-confirm-actions";
  const cancelBtn = document.createElement("button");
  cancelBtn.className = "live-btn";
  cancelBtn.type = "button";
  cancelBtn.textContent = "Cancel";
  cancelBtn.addEventListener("click", cancelLiveSpectrumRescanConfirmation);
  const continueBtn = document.createElement("button");
  continueBtn.className = "live-btn live-danger-btn";
  continueBtn.type = "button";
  continueBtn.textContent = "Continue";
  continueBtn.disabled = liveState.spectrumRescanPending;
  continueBtn.addEventListener("click", startLiveSpectrumRescan);
  confirmActions.appendChild(cancelBtn);
  confirmActions.appendChild(continueBtn);
  confirmEl.appendChild(confirmActions);

  host.appendChild(confirmEl);
}

function renderLiveSpectrum(host, table = {}, { manual = false } = {}) {
  const visible = manual ? liveState.spectrumPanelOpen : (liveState.scanAnimationVisible || liveState.scanInProgress);
  if (!visible) return;

  const rows = getLiveChannelRows(getLiveScanDisplayTable(table, manual && liveState.scanRows.size > 0));

  const wrap = document.createElement("div");
  wrap.className = "live-spectrum";
  if (manual) wrap.classList.add("live-spectrum-panel");
  const header = document.createElement("div");
  header.className = "live-spectrum-header";
  const lastScan = liveState.channelScanEvents.latest();
  const scanText = liveState.scanInProgress
    ? `Scanning${liveState.scanProfileName ? ` ${liveState.scanProfileName}` : ""} ${liveState.scanRows.size}/${liveState.scanCandidateCount || 48}`
    : lastScan?.event === "scan_complete"
      ? manual ? "Latest scan" : "Scan complete"
      : "Spectrum";

  const titleEl = document.createElement("span");
  titleEl.textContent = scanText;
  header.appendChild(titleEl);

  if (manual) {
    const actions = document.createElement("div");
    actions.className = "live-spectrum-actions";
    const rescanBtn = document.createElement("button");
    rescanBtn.className = "live-btn live-spectrum-rescan-btn";
    rescanBtn.type = "button";
    const scanBusy = liveState.spectrumRescanPending || liveState.scanInProgress;
    rescanBtn.textContent = scanBusy ? "Scanning..." : "Re-scan";
    rescanBtn.disabled = !liveState.connected || scanBusy || liveState.spectrumRescanConfirming;
    rescanBtn.addEventListener("click", requestLiveSpectrumRescanConfirmation);
    const closeBtn = document.createElement("button");
    closeBtn.className = "live-profile-close live-spectrum-close";
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Close spectrum panel");
    closeBtn.title = "Close";
    closeBtn.addEventListener("click", closeLiveSpectrumPanel);
    actions.appendChild(rescanBtn);
    actions.appendChild(closeBtn);
    header.appendChild(actions);
  } else {
    const countEl = document.createElement("span");
    countEl.textContent = `${rows.length} channels`;
    header.appendChild(countEl);
  }
  wrap.appendChild(header);

  if (manual) {
    const summary = getLiveChannelSummary(table);
    const meta = [];
    if (Number.isFinite(summary.free) && Number.isFinite(summary.occupied)) {
      meta.push(`${summary.free} free / ${summary.occupied} occupied`);
    }
    if (Number.isFinite(summary.assigned)) {
      meta.push(`${summary.assigned} assigned`);
    }
    const lastUpdateAt = liveState.lastScanCompletedAt || liveState.channelTableReceivedAt;
    if (lastUpdateAt) {
      meta.push(`updated ${formatLiveAge(lastUpdateAt)} ago`);
    }
    const metaEl = document.createElement("div");
    metaEl.className = "live-spectrum-meta";
    metaEl.textContent = meta.length ? meta.join(" | ") : "No scan data yet";
    wrap.appendChild(metaEl);

    if (liveState.spectrumStatus) {
      const statusEl = document.createElement("div");
      statusEl.className = "live-spectrum-status";
      statusEl.textContent = liveState.spectrumStatus;
      wrap.appendChild(statusEl);
    }

    renderLiveSpectrumConfirm(wrap);
  }

  if (!rows.length) {
    const emptyEl = document.createElement("div");
    emptyEl.className = "live-spectrum-empty";
    emptyEl.textContent = "No scan data yet";
    wrap.appendChild(emptyEl);
    host.appendChild(wrap);
    return;
  }

  const bars = document.createElement("div");
  bars.className = "live-spectrum-bars";
  rows.forEach((channel) => {
    const bar = document.createElement("div");
    const roleClass = channel.assigned
      ? "assigned"
      : channel.role === "shared"
        ? "shared"
        : channel.role === "guard"
          ? "guard"
          : channel.cadError && !channel.activityDetected
            ? "unknown"
            : channel.confirmedDrone || channel.activityConfidence === "confirmed_drone"
              ? "confirmed"
          : channel.state === "free" || channel.clear
            ? "clear"
            : channel.state === "cad-suspect" || channel.activityConfidence === "cad_suspect"
              ? "cad-suspect"
            : channel.state === "occupied" || channel.activityDetected || channel.state === "noisy"
              ? "cad-suspect"
              : "unknown";
    bar.className = `live-spectrum-bar ${roleClass}`;
    const displayRssi = firstFiniteNumber(channel.displayRssi, channel.maxRssi, channel.medianRssi);
    const rssiHeight = getLiveRssiBarHeight(displayRssi);
    const height = (channel.assigned || roleClass === "cad-suspect" || roleClass === "confirmed") && rssiHeight !== null
      ? rssiHeight
      : channel.role === "shared"
        ? 28
        : channel.role === "guard"
          ? 18
          : 12;
    bar.style.height = `${height.toFixed(0)}px`;
    const rssiText = Number.isFinite(displayRssi) ? ` RSSI ${displayRssi} dBm` : "";
    const profileText = channel.detectedProfileIds?.length ? ` profiles ${channel.detectedProfileIds.join(",")}` : "";
    const cadSampleCount = Number(channel.cadSampleCount);
    const cadHitCount = Number(channel.cadHitCount);
    const cadText = Number.isFinite(cadSampleCount) && cadSampleCount > 0 && Number.isFinite(cadHitCount)
      ? ` CAD ${cadHitCount}/${cadSampleCount}${channel.cadRejected ? " rejected" : channel.cadValidated ? " validated" : ""}`
      : "";
    const cadAge = liveCadAgeMs(channel);
    const cadAgeText = Number.isFinite(cadAge) && channel.activityConfidence === "cad_suspect"
      ? ` age ${(cadAge / 1000).toFixed(1)}s`
      : "";
    const confidenceText = channel.activityConfidence ? ` ${channel.activityConfidence}` : "";
    const listenText = channel.listenAttempted ? " listened" : "";
    const nodeText = Number.isFinite(channel.decodedNodeId) ? ` node ${channel.decodedNodeId}` : "";
    bar.title = `${channel.frequencyMhz.toFixed(1)} MHz ${channel.role} ${channel.state}${confidenceText}${channel.assigned ? " assigned" : ""}${listenText}${nodeText}${profileText}${cadText}${cadAgeText}${rssiText}`;
    bars.appendChild(bar);
  });
  wrap.appendChild(bars);

  const legend = document.createElement("div");
  legend.className = "live-spectrum-legend";
  [
    ["shared", "Shared"],
    ["assigned", "Assigned"],
    ["clear", "Free"],
    ["cad-suspect", "CAD suspect"],
    ["confirmed", "Confirmed"],
  ].forEach(([key, label]) => {
    const item = document.createElement("span");
    item.className = `live-spectrum-legend-item ${key}`;
    item.textContent = label;
    legend.appendChild(item);
  });
  wrap.appendChild(legend);
  host.appendChild(wrap);
}

function toggleLiveProfilePicker() {
  if (!liveState.profilePickerOpen) {
    ensureLiveProfileDraft();
    liveState.spectrumPanelOpen = false;
    liveState.spectrumRescanConfirming = false;
  }
  liveState.profilePickerOpen = !liveState.profilePickerOpen;
  renderLiveGcStatus();
}

function closeLiveProfilePicker() {
  liveState.profilePickerOpen = false;
  renderLiveGcStatus();
}

function openLiveSpectrumPanel() {
  liveState.spectrumPanelOpen = true;
  liveState.spectrumRescanConfirming = false;
  liveState.profilePickerOpen = false;
  renderLiveGcStatus();
}

function closeLiveSpectrumPanel() {
  liveState.spectrumPanelOpen = false;
  liveState.spectrumRescanConfirming = false;
  if (!liveState.scanAnimationVisible && !liveState.scanInProgress) {
    liveState.scanRows.clear();
  }
  renderLiveGcStatus();
}

function requestLiveSpectrumRescanConfirmation() {
  if (liveState.spectrumRescanPending) return;
  if (!liveState.connected) {
    liveState.spectrumStatus = "Connect GC serial before re-scanning.";
    appendLiveDebug("channel rescan unavailable: connect GC serial first");
    renderLiveGcStatus();
    return;
  }
  liveState.spectrumPanelOpen = true;
  liveState.spectrumRescanConfirming = true;
  liveState.spectrumStatus = "";
  renderLiveGcStatus();
}

function cancelLiveSpectrumRescanConfirmation() {
  liveState.spectrumRescanConfirming = false;
  renderLiveGcStatus();
}

async function requestLiveDroneRelock(nodeId) {
  const id = Number(nodeId);
  if (!Number.isFinite(id) || id <= 0) return;
  recordLiveGcDiagnosticEvent("ui_rebind_requested", { nodeId: id });
  if (isLiveCommandReadOnlyMode()) {
    const reason = isLiveBridgeMode() ? "bridge_mode" : "remote_view_only";
    recordLiveGcDiagnosticEvent("ui_rebind_rejected", { nodeId: id, reason });
    appendLiveDebug(`re-bind unavailable: ${liveCommandReadOnlyMessage()}`);
    return;
  }
  if (!liveState.connected) {
    recordLiveGcDiagnosticEvent("ui_rebind_rejected", { nodeId: id, reason: "serial_disconnected" });
    appendLiveDebug(`re-bind unavailable: connect GC serial first for node ${id}`);
    return;
  }

  const expiresAt = Date.now() + LIVE_RELOCK_TIMEOUT_MS;
  liveState.relockRequests.set(id, { expiresAt, commandId: null });
  upsertLiveBindingState(
    id,
    "telemetry_bind",
    {
      event: "manual_rebind_requested",
      phaseExpectedMs: LIVE_RELOCK_TIMEOUT_MS,
      reason: "operator_requested",
    },
    { origin: "manual_rebind" }
  );
  clearLiveRecoveryState(id);
  updateStatusList();

  const commandId = await sendLiveSerialCommand("relock_drone", { nodeId: id });
  const request = liveState.relockRequests.get(id);
  if (!commandId) {
    liveState.relockRequests.delete(id);
    clearLiveBindingState(id);
    updateStatusList();
    return;
  }
  if (request) {
    request.commandId = commandId;
  }

  window.setTimeout(() => {
    const current = liveState.relockRequests.get(id);
    if (!current || current.commandId !== commandId) return;
    liveState.relockRequests.delete(id);
    const bindingState = getLiveBindingState(id);
    if (bindingState?.origin === "manual_rebind") {
      clearLiveBindingState(id);
      upsertLiveRecoveryState(id, { event: "manual_relock_expired", reason: "command_timeout" });
    }
    if (liveState.pendingCommands.has(commandId)) {
      liveState.pendingCommands.delete(commandId);
      recordLiveGcDiagnosticEvent("ui_command_timeout", { command: "relock_drone", commandId, nodeId: id });
      appendLiveDebug(`command timeout: re-bind node ${id}`);
    }
    updateStatusList();
  }, LIVE_RELOCK_TIMEOUT_MS);
}

async function startLiveSearchMode() {
  recordLiveGcDiagnosticEvent("ui_bind_requested", {
    searchPending: liveState.searchPending,
    searchMode: liveState.searchMode,
    assignedDrones: Number(liveState.gcStatus?.assignedDrones),
  });
  if (liveState.searchPending || liveState.searchMode) return;
  if (isLiveCommandReadOnlyMode()) {
    recordLiveGcDiagnosticEvent("ui_bind_rejected", { reason: isLiveBridgeMode() ? "bridge_mode" : "remote_view_only" });
    appendLiveDebug(`bind unavailable: ${liveCommandReadOnlyMessage()}`);
    renderLiveControls();
    return;
  }
  if (!liveState.connected) {
    recordLiveGcDiagnosticEvent("ui_bind_rejected", { reason: "serial_disconnected" });
    appendLiveDebug("bind unavailable: connect GC serial first");
    renderLiveControls();
    return;
  }
  liveState.searchPending = true;
  renderLiveControls();
  const commandId = await sendLiveSerialCommand("start_search");
  if (commandId) {
    window.setTimeout(() => {
      if (!liveState.pendingCommands.has(commandId)) return;
      liveState.pendingCommands.delete(commandId);
      liveState.searchPending = false;
      recordLiveGcDiagnosticEvent("ui_command_timeout", { command: "start_search", commandId });
      appendLiveDebug("command timeout: bind");
      renderLiveControls();
    }, 6000);
  } else {
    liveState.searchPending = false;
    renderLiveControls();
  }
}

async function startLiveSpectrumRescan() {
  if (liveState.spectrumRescanPending) return;
  if (isLiveCommandReadOnlyMode()) {
    liveState.spectrumRescanConfirming = false;
    liveState.spectrumStatus = liveCommandReadOnlyMessage();
    appendLiveDebug(`channel rescan unavailable: ${liveCommandReadOnlyMessage()}`);
    renderLiveGcStatus();
    return;
  }
  if (!liveState.connected) {
    liveState.spectrumRescanConfirming = false;
    liveState.spectrumStatus = "Connect GC serial before re-scanning.";
    appendLiveDebug("channel rescan unavailable: connect GC serial first");
    renderLiveGcStatus();
    return;
  }
  liveState.spectrumRescanConfirming = false;
  liveState.spectrumRescanPending = true;
  liveState.spectrumPanelOpen = true;
  liveState.spectrumStatus = "Sending re-scan command...";
  renderLiveGcStatus();
  const commandId = await sendLiveSerialCommand("rescan_channels", {
    persist: true,
  });
  if (commandId) {
    window.setTimeout(() => {
      if (!liveState.pendingCommands.has(commandId)) return;
      liveState.pendingCommands.delete(commandId);
      liveState.spectrumRescanPending = false;
      liveState.spectrumStatus = "Re-scan command timed out. The GC firmware may need to be updated.";
      recordLiveGcDiagnosticEvent("ui_command_timeout", { command: "rescan_channels", commandId });
      appendLiveDebug("command timeout: rescan_channels");
      renderLiveGcStatus();
    }, 12000);
  } else {
    liveState.spectrumRescanPending = false;
    liveState.spectrumStatus = "Re-scan command could not be sent.";
    renderLiveGcStatus();
  }
}

async function applyLiveProfileDraft() {
  if (liveState.profileApplyPending) return;
  if (isLiveCommandReadOnlyMode()) {
    appendLiveDebug(`profile update unavailable: ${liveCommandReadOnlyMessage()}`);
    renderLiveGcStatus();
    return;
  }
  if (!liveState.connected) {
    appendLiveDebug("profile update unavailable: connect GC serial first");
    renderLiveGcStatus();
    return;
  }
  const draft = normalizeLiveRadioProfile(ensureLiveProfileDraft());
  liveState.profileApplyPending = true;
  renderLiveGcStatus();
  const commandId = await sendLiveSerialCommand("set_radio_profile", {
    radioProfileId: encodeLiveRadioProfileId(draft),
    spreadingFactor: draft.spreadingFactor,
    bandwidthHz: draft.bandwidthHz,
    codingRate: draft.codingRate,
    persist: true,
  });
  if (commandId) {
    liveState.profilePickerOpen = false;
    renderLiveGcStatus();
    window.setTimeout(() => {
      if (!liveState.pendingCommands.has(commandId)) return;
      liveState.pendingCommands.delete(commandId);
      liveState.profileApplyPending = false;
      appendLiveDebug("command timeout: set_radio_profile");
      renderLiveGcStatus();
    }, 6000);
  } else {
    liveState.profileApplyPending = false;
    renderLiveGcStatus();
  }
}

function updateLiveProfileDraft(field, value) {
  const draft = ensureLiveProfileDraft();
  liveState.profileDraft = normalizeLiveRadioProfile({
    ...draft,
    [field]: Number(value),
  });
  renderLiveGcStatus();
}

function setLiveProfileMode(simpleMode) {
  liveState.profileSimpleMode = !!simpleMode;
  renderLiveGcStatus();
}

function selectLiveProfilePreset(presetKey) {
  const preset = LIVE_PROFILE_PRESETS.find((item) => item.key === presetKey);
  if (!preset) return;
  liveState.profileDraft = normalizeLiveRadioProfile(preset.profile);
  liveState.profileSimpleMode = true;
  renderLiveGcStatus();
}

function makeLiveProfileSegment(label, field, options, value, formatter) {
  const wrap = document.createElement("div");
  wrap.className = "live-profile-field";

  const labelEl = document.createElement("span");
  labelEl.textContent = label;
  wrap.appendChild(labelEl);

  const group = document.createElement("div");
  group.className = "live-profile-segments";
  if (field === "codingRate") {
    group.classList.add("live-profile-segments-cr");
  }
  group.setAttribute("role", "radiogroup");
  group.setAttribute("aria-label", label);

  options.forEach((option) => {
    const item = document.createElement("button");
    item.className = "live-profile-segment";
    item.type = "button";
    item.textContent = formatter ? formatter(option) : String(option);
    const selected = Number(option) === Number(value);
    item.classList.toggle("is-selected", selected);
    item.setAttribute("role", "radio");
    item.setAttribute("aria-checked", selected ? "true" : "false");
    item.addEventListener("click", () => updateLiveProfileDraft(field, option));
    group.appendChild(item);
  });
  wrap.appendChild(group);

  return wrap;
}

function renderLiveProfileModeToggle(panel) {
  const mode = document.createElement("div");
  mode.className = "live-profile-mode";

  const switchLabel = document.createElement("label");
  switchLabel.className = "live-profile-switch";

  const text = document.createElement("span");
  text.className = "live-profile-switch-label";
  text.textContent = "Advanced";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = !liveState.profileSimpleMode;
  input.setAttribute("role", "switch");
  input.setAttribute("aria-label", "Advanced profile mode");
  input.addEventListener("change", () => setLiveProfileMode(!input.checked));

  const track = document.createElement("span");
  track.className = "live-profile-switch-track";

  const thumb = document.createElement("span");
  thumb.className = "live-profile-switch-thumb";
  track.appendChild(thumb);

  switchLabel.appendChild(text);
  switchLabel.appendChild(input);
  switchLabel.appendChild(track);
  mode.appendChild(switchLabel);
  panel.appendChild(mode);
}

function renderLiveProfilePresets(panel, draft) {
  const presets = document.createElement("div");
  presets.className = "live-profile-presets";
  const selectedId = encodeLiveRadioProfileId(draft);
  LIVE_PROFILE_PRESETS.forEach((preset) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "live-profile-preset";
    btn.classList.toggle("is-selected", preset.radioProfileId === selectedId);
    btn.addEventListener("click", () => selectLiveProfilePreset(preset.key));
    btn.textContent = preset.label;
    presets.appendChild(btn);
  });
  panel.appendChild(presets);
}

function renderLiveProfilePicker(host) {
  if (!liveState.profilePickerOpen) return;

  const draft = ensureLiveProfileDraft();
  const airtimeMs = calculateLiveLoRaAirtimeMs(draft, 20);
  const commandPreview = buildLiveSetRadioProfileCommandPayload(draft);

  const panel = document.createElement("div");
  panel.className = "live-profile-picker";

  const header = document.createElement("div");
  header.className = "live-profile-header";
  const title = document.createElement("div");
  title.textContent = "Radio Profile";
  const closeBtn = document.createElement("button");
  closeBtn.className = "live-profile-close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close profile picker");
  closeBtn.title = "Close";
  closeBtn.addEventListener("click", closeLiveProfilePicker);
  header.appendChild(title);
  header.appendChild(closeBtn);
  panel.appendChild(header);

  renderLiveProfileModeToggle(panel);

  if (liveState.profileSimpleMode) {
    renderLiveProfilePresets(panel, draft);
  } else {
    const controls = document.createElement("div");
    controls.className = "live-profile-controls";
    controls.appendChild(makeLiveProfileSegment("SF", "spreadingFactor", LIVE_PROFILE_OPTIONS.spreadingFactors, draft.spreadingFactor));
    controls.appendChild(makeLiveProfileSegment("BW", "bandwidthHz", LIVE_PROFILE_OPTIONS.bandwidthHz, draft.bandwidthHz, (hz) => `${Math.round(hz / 1000)}`));
    controls.appendChild(makeLiveProfileSegment("CR", "codingRate", LIVE_PROFILE_OPTIONS.codingRates, draft.codingRate, (cr) => `4/${cr}`));
    panel.appendChild(controls);
  }

  const preview = document.createElement("div");
  preview.className = "live-profile-preview";
  const preset = findLiveProfilePresetByProfile(draft);
  if (liveState.profileSimpleMode && preset) {
    preview.innerHTML = `
      <span>Future assignments only</span>
      <strong>${preset.label} ${formatLiveRadioProfile(draft)}</strong>
      <span>Airtime ${airtimeMs.toFixed(1)} ms</span>
    `;
  } else {
    preview.innerHTML = `
      <span>Future assignments only</span>
      <strong>${preset ? `${preset.label} ` : ""}${formatLiveRadioProfile(draft)}</strong>
      <span>Airtime ${airtimeMs.toFixed(1)} ms</span>
    `;
  }
  panel.appendChild(preview);

  const actions = document.createElement("div");
  actions.className = "live-profile-actions";
  const status = document.createElement("span");
  status.textContent = isLiveCommandReadOnlyMode()
    ? (isLiveBridgeMode() ? "Bridge control unavailable" : "Remote view only")
    : isLiveBridgeMode() ? "Bridge command link" : liveState.connected ? "Applies to new joins" : "Connect GC to apply";
  const applyBtn = document.createElement("button");
  applyBtn.className = "live-btn";
  applyBtn.type = "button";
  applyBtn.disabled = isLiveCommandReadOnlyMode() || !liveState.connected || liveState.profileApplyPending;
  applyBtn.textContent = liveState.profileApplyPending ? "Applying..." : "Apply";
  applyBtn.dataset.commandPreview = JSON.stringify(commandPreview);
  applyBtn.addEventListener("click", applyLiveProfileDraft);
  actions.appendChild(status);
  actions.appendChild(applyBtn);
  panel.appendChild(actions);

  host.appendChild(panel);
}

function renderLiveGcStatus() {
  const host = document.getElementById("liveGcStatus");
  if (!host) return;
  host.innerHTML = "";
  const status = liveState.gcStatus || {};
  const table = liveState.channelTable || {};
  const assignedDebug = getLiveAssignedDebug(status, table);
  const channelSummary = getLiveChannelSummary(table);
  const occupied = Number.isFinite(channelSummary.occupied) ? channelSummary.occupied : 0;
  const free = Number.isFinite(channelSummary.free) ? channelSummary.free : null;
  const usbRoleWarning = getLiveUsbRoleWarning(status);
  const autoSharedRemainingMs = Number(status.autoSharedRxRemainingMs);
  const autoSharedValue = status.autoSharedRxActive
    ? `node ${status.autoSharedRxNodeId || "any"} / ${Number.isFinite(autoSharedRemainingMs) ? Math.ceil(autoSharedRemainingMs / 1000) : "?"}s`
    : "Idle";
  const operatorDiscoveryRemainingMs = Number(status.operatorDiscoveryRemainingMs);
  const operatorDiscoveryValue = status.operatorDiscoveryActive
    ? `${Number.isFinite(operatorDiscoveryRemainingMs) ? Math.ceil(operatorDiscoveryRemainingMs / 1000) : "?"}s / joins ${status.operatorDiscoveryJoinCount ?? 0}`
    : "Idle";
  const operatorDiscoveryTitle = `reason ${status.operatorDiscoveryReason || "-"}, polls ${status.operatorDiscoveryPollCount ?? 0}, no-packet ${status.operatorDiscoveryNoPacketCount ?? 0}`;
  const emptySharedRemainingMs = Number(status.emptySharedRxStrongRemainingMs);
  const emptySharedValue = status.emptySharedRxActive
    ? `${Number.isFinite(emptySharedRemainingMs) ? Math.ceil(emptySharedRemainingMs / 1000) : "?"}s strong / joins ${status.emptySharedRxJoinCount ?? 0}`
    : "Idle";
  const emptySharedTitle = `reason ${status.emptySharedRxReason || "-"}, polls ${status.emptySharedRxPollCount ?? 0}, no-packet ${status.emptySharedRxNoPacketCount ?? 0}, OOCR defers ${status.emptySharedRxOocrDeferredCount ?? 0}`;
  const shortLossRemainingMs = Number(status.shortLossGuardRemainingMs);
  const shortLossValue = status.shortLossGuardActive
    ? `node ${status.shortLossGuardNodeId || "?"} / miss ${status.shortLossGuardMissCount || 0} / ${Number.isFinite(shortLossRemainingMs) ? Math.ceil(shortLossRemainingMs / 1000) : "?"}s`
    : "Idle";
  const coveragePct = Number(status.assignedRxCoveragePct);
  const coverageValue = status.telemetryCoverageMode
    ? `${status.telemetryCoverageMode} / ${Number.isFinite(coveragePct) ? `${coveragePct}%` : "n/a"} / gaps ${status.assignedSequenceGaps ?? 0}`
    : "N/A";
  const latestPostBindEvent = liveState.scannerEvents
    .toArray()
    .reverse()
    .find((event) => String(event?.event || "").startsWith("post_bind_"));
  const latestPostBindAgeMs = latestPostBindEvent ? Math.max(0, Date.now() - Number(latestPostBindEvent.loggedAt || Date.now())) : null;
  const postBindValue = latestPostBindEvent
    ? `node ${latestPostBindEvent.nodeId || "?"} / ${String(latestPostBindEvent.event || "").replace("post_bind_", "").replaceAll("_", " ")}`
    : "Idle";
  const sourceValue = isLiveRemoteViewerMode()
    ? formatLiveRemotePublisherSource()
    : formatLiveLocalSourceValue(status);
  const items = [
    { label: "Source", value: sourceValue },
    ...(usbRoleWarning ? [{ label: "Warning", value: usbRoleWarning, severity: "warning" }] : []),
    { label: "Relay", value: formatLiveRelayDebugSummary() },
    ...(isLiveRemoteViewerMode() && liveState.remotePublisherStatus?.publisherSource === "bridge"
      ? [{
          label: "Bridge",
          value: formatLiveRemotePublisherBridgeSummary(),
          title: formatLiveRemotePublisherBridgeDetails(),
        }]
      : []),
    ...(isLiveBridgeMode() ? [{ label: "Bridge", value: formatLiveBridgeRfSummary(status), title: formatLiveBridgeRfDetails(status) }] : []),
    { label: "Profile", value: liveState.gcStatus ? formatLiveRadioProfile(liveProfileFromGcStatus()) : "N/A", action: "profile" },
    { label: "Discovery", value: status.discoverySpreadingFactor ? formatLiveRadioProfile(liveDiscoveryProfileFromGcStatus()) : "N/A" },
    { label: "Assigned", value: Number.isFinite(assignedDebug.count) ? String(assignedDebug.count) : "N/A" },
    { label: "Channels", value: free !== null ? `${free} free / ${occupied} occupied` : "N/A", action: "channels" },
    ...(liveState.debugEnabled || status.autoSharedRxActive
      ? [{ label: "Auto RX", value: autoSharedValue, title: status.autoSharedRxReason || "" }]
      : []),
    ...(liveState.debugEnabled || status.operatorDiscoveryActive
      ? [{ label: "Safe bind", value: operatorDiscoveryValue, title: operatorDiscoveryTitle }]
      : []),
    ...(liveState.debugEnabled || status.emptySharedRxActive
      ? [{ label: "Empty RX", value: emptySharedValue, title: emptySharedTitle }]
      : []),
    ...(liveState.debugEnabled || status.shortLossGuardActive
      ? [{ label: "Short loss", value: shortLossValue, title: "Assigned-channel continuity guard for short packet-loss bursts" }]
      : []),
    ...(liveState.debugEnabled || status.assignedSequenceGaps > 0 || status.nonAssignedPreemptions > 0
      ? [{
          label: "Coverage",
          value: coverageValue,
          title: `packets ${status.assignedPacketsReceived ?? 0}, gap events ${status.assignedSequenceGapEvents ?? 0}, max gap ${status.assignedMaxGap ?? 0}, slot misses ${status.assignedSlotMisses ?? 0}, preemptions ${status.nonAssignedPreemptions ?? 0}, slack ${status.nextAssignedSlackMs ?? "?"} ms`,
        }]
      : []),
    ...(liveState.debugEnabled && latestPostBindEvent
      ? [{ label: "Post-bind", value: postBindValue, title: `Source ${latestPostBindEvent.sourceRole || "unknown"} / age ${latestPostBindAgeMs} ms` }]
      : []),
    { label: "Bind", value: "", action: "search" },
  ];

  const grid = document.createElement("div");
  grid.className = "live-gc-grid";
  items.forEach(({ label, value, action, title, severity }) => {
    const item = document.createElement("div");
    item.className = "live-gc-item";
    if (severity === "warning") item.classList.add("live-gc-item-warning");
    if (title) item.title = title;
    if (action === "profile" || action === "channels") {
      item.classList.add("live-gc-item-action");
      item.setAttribute("role", "button");
      item.tabIndex = 0;
      item.setAttribute("aria-expanded", action === "profile"
        ? liveState.profilePickerOpen ? "true" : "false"
        : liveState.spectrumPanelOpen ? "true" : "false");
      item.title = action === "profile"
        ? "Choose the default profile for future drone assignments"
        : "Open the latest spectrum scan";
      item.addEventListener("click", action === "profile" ? toggleLiveProfilePicker : openLiveSpectrumPanel);
      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (action === "profile") {
            toggleLiveProfilePicker();
          } else {
            openLiveSpectrumPanel();
          }
        }
      });
    }
    const labelEl = document.createElement("div");
    labelEl.className = "live-gc-label";
    labelEl.textContent = label;
    const valueEl = document.createElement("div");
    valueEl.className = "live-gc-value";
    if (action === "search") {
      item.classList.add("live-gc-search-item");
      const searchBtn = document.createElement("button");
      searchBtn.className = "live-btn live-search-btn live-gc-search-btn";
      searchBtn.id = "liveSearchBtn";
      searchBtn.type = "button";
      searchBtn.addEventListener("click", startLiveSearchMode);
      applyLiveSearchButtonState(searchBtn);
      valueEl.appendChild(searchBtn);
    } else {
      valueEl.textContent = value;
    }
    if (action !== "search") item.appendChild(labelEl);
    item.appendChild(valueEl);
    grid.appendChild(item);
  });
  host.appendChild(grid);

  renderLiveProfilePicker(host);

  if (liveState.spectrumPanelOpen) {
    renderLiveSpectrum(host, table, { manual: true });
  } else {
    renderLiveSpectrum(host, table);
  }

  if (liveState.freshSessionConfirming) {
    const confirmEl = document.createElement("div");
    confirmEl.className = "live-confirm";
    const messageEl = document.createElement("div");
    messageEl.className = "live-confirm-message";
    messageEl.textContent = "This will delete previous channel assignments and start a fresh session. Drones will need to rejoin. Continue?";
    confirmEl.appendChild(messageEl);

    const confirmActions = document.createElement("div");
    confirmActions.className = "live-confirm-actions";
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "live-btn";
    cancelBtn.type = "button";
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", cancelFreshSessionConfirmation);
    const continueBtn = document.createElement("button");
    continueBtn.className = "live-btn live-danger-btn";
    continueBtn.type = "button";
    continueBtn.textContent = "Continue";
    continueBtn.disabled = liveState.freshSessionPending;
    continueBtn.addEventListener("click", startFreshSession);
    confirmActions.appendChild(cancelBtn);
    confirmActions.appendChild(continueBtn);
    confirmEl.appendChild(confirmActions);
    host.appendChild(confirmEl);
  }

  if (liveState.assignmentEvents.count) {
    const event = liveState.assignmentEvents.latest();
    const eventEl = document.createElement("div");
    eventEl.className = "live-meta";
    eventEl.textContent = `Last assignment: ${event.event || "event"}${event.nodeId !== undefined ? ` node ${event.nodeId}` : ""}`;
    host.appendChild(eventEl);
  }
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function isIntegerNumber(value) {
  return Number.isInteger(value);
}

const liveProtocolSchemas = {
  drones_state: {
    type: "string",
    schemaVersion: "integer",
    sentAt: "integer",
    drones: "array",
  },
  homes_state: {
    type: "string",
    schemaVersion: "integer",
    sentAt: "integer",
    homes: "array",
  },
  drone_telemetry: {
    type: "string",
    nodeId: "integer",
    lat: "number",
    lng: "number",
    alt: "number",
    heading: "number",
    headingSource: "string",
    courseOverGround: "number",
    yaw: "number",
    yawHeading: "number",
    yawBiasDeg: "number",
    yawBiasValid: "boolean",
    yawBiasSamples: "integer",
    cogWeight: "number",
    cogTrusted: "boolean",
    groundSpeed: "number",
    satelliteCount: "integer",
    rssi: "number",
    snr: "number",
    frequencyMhz: "number",
    sequenceId: "integer",
    gcMillis: "integer",
  },
  gc_status: {
    type: "string",
    nodeId: "integer",
    sharedFrequencyMhz: "number",
    spreadingFactor: "integer",
    bandwidthHz: "integer",
    codingRate: "integer",
    txPowerDbm: "number",
    telemetryAirtimeMs: "number",
    txPeriodMs: "number",
    assignedDrones: "integer",
    clearChannels: "integer",
    scanMode: "string",
    autoSharedRxActive: "boolean",
    autoSharedRxNodeId: "integer",
    autoSharedRxRemainingMs: "integer",
    autoSharedRxReason: "string",
    emptySharedRxActive: "boolean",
    emptySharedRxStrongRemainingMs: "integer",
    emptySharedRxPollCount: "integer",
    emptySharedRxNoPacketCount: "integer",
    emptySharedRxJoinCount: "integer",
    emptySharedRxOocrDeferredCount: "integer",
    emptySharedRxReason: "string",
    shortLossGuardActive: "boolean",
    shortLossGuardNodeId: "integer",
    shortLossGuardMissCount: "integer",
    shortLossGuardRemainingMs: "integer",
    telemetryCoverageMode: "string",
    assignedRxCoveragePct: "integer",
    assignedPacketsReceived: "integer",
    assignedSequenceGapEvents: "integer",
    assignedSequenceGaps: "integer",
    assignedMaxGap: "integer",
    assignedSlotMisses: "integer",
    nonAssignedPreemptions: "integer",
    nextAssignedSlackMs: "integer",
    operatorSharedRxActive: "boolean",
    operatorDiscoveryActive: "boolean",
    operatorDiscoveryRemainingMs: "integer",
    operatorDiscoveryPollCount: "integer",
    operatorDiscoveryNoPacketCount: "integer",
    operatorDiscoveryJoinCount: "integer",
    operatorDiscoveryReason: "string",
    sharedJoinRequestCount: "integer",
    lastSharedJoinNodeId: "integer",
    gcMillis: "integer",
  },
  assignment_event: {
    type: "string",
    event: "string",
    gcMillis: "integer",
  },
  bind_progress_event: {
    type: "string",
    event: "string",
    nodeId: "integer",
    phase: "string",
    status: "string",
    phaseElapsedMs: "integer",
    phaseExpectedMs: "integer",
    gcMillis: "integer",
  },
  command_ack: {
    type: "string",
    commandId: "string",
    command: "string",
    accepted: "boolean",
    gcMillis: "integer",
  },
  session_event: {
    type: "string",
    event: "string",
    gcMillis: "integer",
  },
  channel_scan_event: {
    type: "string",
    event: "string",
    gcMillis: "integer",
  },
  scanner_event: {
    type: "string",
    event: "string",
    gcMillis: "integer",
  },
  search_event: {
    type: "string",
    event: "string",
    gcMillis: "integer",
  },
  orphan_recovery_event: {
    type: "string",
    event: "string",
    gcMillis: "integer",
  },
  telemetry_rebind_event: {
    type: "string",
    event: "string",
    gcMillis: "integer",
  },
  drone_link_status: {
    type: "string",
    nodeId: "integer",
    state: "string",
    activityDetected: "boolean",
    txPeriodMs: "integer",
    gcMillis: "integer",
  },
  assignments: {
    type: "string",
    assignments: "array",
    gcMillis: "integer",
  },
  channel_table: {
    type: "string",
    sharedFrequencyMhz: "number",
    reservedFrequencyMhz: "array",
    candidateFrequencyMhz: "array",
    clearFrequencyMhz: "array",
    noisyFrequencyMhz: "array",
    assignments: "array",
    gcMillis: "integer",
  },
};

function matchesLiveType(value, type) {
  if (type === "array") return Array.isArray(value);
  if (type === "integer") return isIntegerNumber(value);
  if (type === "number") return isFiniteNumber(value);
  return typeof value === type;
}

function validateLiveProtocolMessage(message) {
  if (!message || typeof message !== "object" || Array.isArray(message)) {
    return ["JSON root must be an object."];
  }
  const type = message.type;
  if (typeof type !== "string") return ["Field type must be a string."];
  const schema = liveProtocolSchemas[type];
  if (!schema) return [];
  const issues = [];
  Object.entries(schema).forEach(([field, fieldType]) => {
    if (!(field in message)) {
      issues.push(`Missing ${field}.`);
      return;
    }
    if (!matchesLiveType(message[field], fieldType)) {
      issues.push(`${field} must be ${fieldType}.`);
    }
  });
  return issues;
}

function getOrCreateLiveDrone(nodeId) {
  let drone = getDroneById(nodeId);
  if (drone) {
    drone.type = "live";
    return drone;
  }
  drone = new Drone(nodeId, { type: "live" });
  drones.push(drone);
  drones.sort((a, b) => a.id - b.id);
  return drone;
}

function clampLiveBindingProgress(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(1, numeric));
}

function normalizeLiveDisplayState(state) {
  const normalized = String(state || "").toLowerCase();
  return normalized === "locking" ? "binding" : normalized;
}

function isLiveBindingStateName(state) {
  const normalized = normalizeLiveDisplayState(state);
  return normalized === "binding";
}

function getLiveBindingPhaseLabel(phase, state = null) {
  if (state?.status === "completing") return "Completing bind";
  if (phase === "timing") {
    const rawCount = Number(state?.timingObservationCount);
    const count = Math.max(1, Math.min(LIVE_BINDING_TIMING_REQUIRED_OBSERVATIONS, Number.isFinite(rawCount) ? rawCount : 1));
    return `Timing ${count}/${LIVE_BINDING_TIMING_REQUIRED_OBSERVATIONS}`;
  }
  return LIVE_BINDING_PHASES[phase]?.label || "Binding";
}

function getMostRecentLiveBindingNodeId() {
  let bestNodeId = null;
  let bestTime = -Infinity;
  liveState.bindingStates.forEach((state, nodeId) => {
    const lastEventAt = Number(state.lastEventAt);
    if (Number.isFinite(lastEventAt) && lastEventAt > bestTime) {
      bestTime = lastEventAt;
      bestNodeId = Number(nodeId);
    }
  });
  return Number.isFinite(bestNodeId) ? bestNodeId : null;
}

function getLiveBindingNodeIdFromMessage(message = {}) {
  const nodeId = Number(message.nodeId);
  if (Number.isFinite(nodeId) && nodeId > 0) return nodeId;
  const recipientNodeId = Number(message.recipientNodeId);
  if (Number.isFinite(recipientNodeId) && recipientNodeId > 0 && recipientNodeId < 255) return recipientNodeId;
  return getMostRecentLiveBindingNodeId();
}

function getLiveBindingPhaseExpectedMs(phase, message = {}, nodeId = null) {
  const status = liveState.gcStatus || {};
  const assignment = Number.isFinite(Number(nodeId)) ? getLiveAssignmentForDrone(Number(nodeId)) : null;
  if (phase === "discovery") {
    return firstPositiveNumber(message.phaseExpectedMs, message.listenMs, status.discoveryJoinRequestAirtimeMs, LIVE_BINDING_PHASES.discovery.fallbackMs);
  }
  if (phase === "quiet") {
    return firstPositiveNumber(message.phaseExpectedMs, message.silenceAirtimeMs, status.discoverySilenceAirtimeMs, status.discoveryJoinRequestAirtimeMs, LIVE_BINDING_PHASES.quiet.fallbackMs);
  }
  if (phase === "assign") {
    return firstPositiveNumber(message.phaseExpectedMs, message.listenMs, status.discoveryJoinAssignAirtimeMs, LIVE_BINDING_PHASES.assign.fallbackMs);
  }
  if (phase === "ack") {
    return firstPositiveNumber(message.phaseExpectedMs, message.listenMs, status.joinAckTimeoutMs, status.discoveryJoinAckTimeoutMs, LIVE_BINDING_PHASES.ack.fallbackMs);
  }
  if (phase === "timing") {
    const explicitExpectedMs = firstPositiveNumber(message.phaseExpectedMs, message.listenMs);
    if (explicitExpectedMs) return explicitExpectedMs;
    const periodMs = firstPositiveNumber(
      message.txPeriodMs,
      message.expectedUpdateMs,
      message.targetServiceMs,
      assignment?.txPeriodMs,
      assignment?.expectedUpdateMs,
      assignment?.targetServiceMs,
      status.txPeriodMs
    );
    if (periodMs) {
      return Math.min(
        LIVE_BINDING_TIMING_LOCK_MAX_MS,
        periodMs * LIVE_BINDING_TIMING_LOCK_PERIODS + LIVE_BINDING_TIMING_LOCK_GUARD_MS
      );
    }
    return LIVE_BINDING_PHASES.timing.fallbackMs;
  }
  return firstPositiveNumber(
    message.phaseExpectedMs,
    message.listenMs,
    message.txPeriodMs,
    assignment?.txPeriodMs,
    assignment?.expectedUpdateMs,
    assignment?.targetServiceMs,
    status.txPeriodMs,
    LIVE_BINDING_DEFAULT_PHASE_MS
  );
}

function getLiveBindingProgress(state, now = Date.now()) {
  if (!state) return 0;
  if (state.status === "failed") return clampLiveBindingProgress(state.progress);
  if (state.status === "completing") {
    const startedAt = Number(state.completionStartedAt ?? state.phaseStartedAt) || now;
    const startProgress = clampLiveBindingProgress(
      state.completionStartProgress ?? state.progress ?? LIVE_BINDING_COMPLETION_START_PROGRESS
    );
    const elapsed = Math.max(0, now - startedAt);
    const completionProgress = Math.min(1, elapsed / LIVE_BINDING_COMPLETION_MS);
    return clampLiveBindingProgress(startProgress + (1 - startProgress) * completionProgress);
  }
  const phase = LIVE_BINDING_PHASES[state.phase] || LIVE_BINDING_PHASES.discovery;
  const expectedMs = Math.max(1, Number(state.phaseExpectedMs) || LIVE_BINDING_DEFAULT_PHASE_MS);
  const elapsed = Math.max(0, now - (Number(state.phaseStartedAt) || now));
  if (state.phase === "timing") {
    const timingProgress = Math.min(1, elapsed / expectedMs);
    const timingInterpolated = phase.start + (LIVE_BINDING_TIMING_PROGRESS_END - phase.start) * timingProgress;
    const waitingElapsed = Math.max(0, elapsed - expectedMs);
    const waitingProgress = Math.min(1, waitingElapsed / LIVE_BINDING_WAITING_CRAWL_MS);
    const waitingInterpolated = LIVE_BINDING_TIMING_PROGRESS_END +
      (LIVE_BINDING_WAITING_PROGRESS_END - LIVE_BINDING_TIMING_PROGRESS_END) * waitingProgress;
    const interpolated = elapsed <= expectedMs ? timingInterpolated : waitingInterpolated;
    return clampLiveBindingProgress(
      Math.min(LIVE_BINDING_WAITING_PROGRESS_END, Math.max(Number(state.progress) || 0, interpolated))
    );
  }
  const phaseProgress = Math.min(0.96, elapsed / expectedMs);
  const start = Number(phase.start) || 0;
  const end = Number(phase.end) || 0.98;
  const interpolated = start + (end - start) * phaseProgress;
  return clampLiveBindingProgress(
    Math.min(LIVE_BINDING_WAITING_PROGRESS_END, Math.max(Number(state.progress) || 0, interpolated))
  );
}

function setLiveBindingRingProgress(overlay, state, now = Date.now()) {
  if (!overlay || !state) return;
  const progress = getLiveBindingProgress(state, now);
  const phaseLabel = getLiveBindingPhaseLabel(state.phase, state);
  const percent = Math.round(progress * 100);
  overlay.title = `${phaseLabel} ${percent}%`;
  const ring = overlay.querySelector(".live-bind-progress");
  if (ring) {
    ring.style.setProperty("--binding-progress", `${(progress * 360).toFixed(3)}deg`);
  }
  const percentEl = overlay.querySelector(".live-bind-progress-percent");
  if (percentEl) {
    percentEl.textContent = `${percent}%`;
  }
}

function hasActiveLiveBindingStates() {
  let active = false;
  liveState.bindingStates.forEach((state) => {
    if (state?.status !== "failed") active = true;
  });
  return active;
}

function isLiveDroneFreshForBindingCompletion(nodeId, now = Date.now()) {
  const drone = getDroneById(Number(nodeId));
  return getLiveFreshnessState(drone, now) === "fresh";
}

function checkLiveBindingStalls(now = Date.now()) {
  liveState.bindingStates.forEach((state, nodeId) => {
    if (!state || state.status === "failed" || state.status === "completing") return;
    const phase = String(state.phase || "discovery");
    const phaseStartedAt = Number(state.phaseStartedAt) || now;
    const expectedMs = Math.max(1, Number(state.phaseExpectedMs) || getLiveBindingPhaseExpectedMs(phase, state, nodeId));
    const elapsedMs = Math.max(0, now - phaseStartedAt);
    if (elapsedMs <= expectedMs + LIVE_BINDING_STALL_GRACE_MS) {
      const previous = liveState.bindingStallRecords.get(nodeId);
      if (previous && previous.phase !== phase) liveState.bindingStallRecords.delete(nodeId);
      return;
    }
    const previous = liveState.bindingStallRecords.get(nodeId);
    if (
      previous &&
      previous.phase === phase &&
      now - Number(previous.loggedAt || 0) < LIVE_BINDING_STALL_REPEAT_MS
    ) {
      return;
    }
    const progress = getLiveBindingProgress(state, now);
    const percent = Math.round(progress * 100);
    const detail = {
      nodeId,
      phase,
      progress,
      percent,
      elapsedMs,
      expectedMs,
      reason: phase === "telemetry_bind" && percent >= 82 ? "telemetry_bind_84_percent_region" : "phase_timeout",
    };
    liveState.bindingStallRecords.set(nodeId, { ...detail, loggedAt: now });
    recordLiveGcDiagnosticEvent("bind_progress_stalled", detail);
    appendLiveDebug(`bind stalled: node ${nodeId} ${phase} ${percent}%`);
  });
}

function updateLiveBindingProgressDom(now = Date.now()) {
  const completedNodeIds = [];
  checkLiveBindingStalls(now);
  document.querySelectorAll(".live-bind-progress-overlay[data-node-id]").forEach((overlay) => {
    const nodeId = Number(overlay.dataset.nodeId);
    const state = liveState.bindingStates.get(nodeId);
    if (!state) {
      overlay.remove();
      return;
    }
    setLiveBindingRingProgress(overlay, state, now);
    if (
      state.status === "completing" &&
      now - (Number(state.completionStartedAt ?? state.phaseStartedAt) || now) >= LIVE_BINDING_COMPLETION_MS + LIVE_BINDING_COMPLETION_HOLD_MS
    ) {
      if (isLiveDroneFreshForBindingCompletion(nodeId, now)) {
        completedNodeIds.push(nodeId);
      }
    }
  });
  if (completedNodeIds.length) {
    completedNodeIds.forEach((nodeId) => liveState.bindingStates.delete(nodeId));
    updateStatusList();
    publishLiveDronesState({ force: true, minIntervalMs: 0 });
  }
  if (!hasActiveLiveBindingStates()) {
    stopLiveBindingAnimationTimer();
  }
}

function startLiveBindingAnimationTimer() {
  if (liveState.bindingAnimationTimer || !hasActiveLiveBindingStates()) return;
  liveState.bindingAnimationTimer = window.setInterval(() => {
    updateLiveBindingProgressDom(Date.now());
  }, LIVE_BINDING_ANIMATION_INTERVAL_MS);
}

function stopLiveBindingAnimationTimer() {
  if (!liveState.bindingAnimationTimer) return;
  window.clearInterval(liveState.bindingAnimationTimer);
  liveState.bindingAnimationTimer = null;
}

function syncLiveBindingAnimationTimer() {
  if (hasActiveLiveBindingStates()) {
    startLiveBindingAnimationTimer();
  } else {
    stopLiveBindingAnimationTimer();
  }
}

function upsertLiveBindingState(
  nodeId,
  phase,
  message = {},
  { status = "active", reason = null, progress = null, origin = null } = {}
) {
  const id = Number(nodeId);
  if (!Number.isFinite(id) || id <= 0) return null;
  const now = Date.now();
  getOrCreateLiveDrone(id);
  const current = liveState.bindingStates.get(id) || {};
  if (current.status === "completing") {
    return current;
  }
  const nextPhase = phase || current.phase || "discovery";
  const nextStatus = status || current.status || "active";
  const samePhase = current.phase === nextPhase && current.status === nextStatus;
  const phaseExpectedMs = getLiveBindingPhaseExpectedMs(nextPhase, message, id);
  const rawPhaseElapsedMs = Number(message.phaseElapsedMs);
  const phaseElapsedMs = Number.isFinite(rawPhaseElapsedMs) && rawPhaseElapsedMs >= 0
    ? Math.min(rawPhaseElapsedMs, phaseExpectedMs || LIVE_BINDING_DEFAULT_PHASE_MS)
    : null;
  const currentProgress = current.phase ? getLiveBindingProgress(current, now) : 0;
  const computedProgress = progress !== null && progress !== undefined
    ? clampLiveBindingProgress(progress)
    : nextStatus === "failed"
      ? currentProgress
      : currentProgress;
  const next = {
    ...current,
    nodeId: id,
    phase: nextPhase,
    phaseStartedAt: phaseElapsedMs !== null
      ? now - phaseElapsedMs
      : samePhase && Number.isFinite(Number(current.phaseStartedAt)) ? current.phaseStartedAt : now,
    phaseExpectedMs,
    progress: computedProgress,
    status: nextStatus,
    origin: origin || current.origin || "shared_bind",
    reason: reason ?? message.reason ?? current.reason ?? null,
    frequencyMhz: message.frequencyMhz ?? current.frequencyMhz ?? null,
    channelIndex: message.channelIndex ?? current.channelIndex ?? null,
    radioProfileId: message.radioProfileId ?? current.radioProfileId ?? null,
    rssi: message.rssi ?? current.rssi ?? null,
    snr: message.snr ?? current.snr ?? null,
    timingObservationCount: message.timingObservationCount ?? current.timingObservationCount ?? null,
    lastEventAt: now,
    sourceEvent: message.event || current.sourceEvent || null,
  };
  liveState.bindingStates.set(id, next);
  liveState.recoveryStates.delete(id);
  syncLiveBindingAnimationTimer();
  return next;
}

function clearLiveBindingState(nodeId) {
  const id = Number(nodeId);
  if (!Number.isFinite(id)) return;
  liveState.bindingStates.delete(id);
  syncLiveBindingAnimationTimer();
}

function getLiveBindingState(nodeId) {
  return liveState.bindingStates.get(Number(nodeId)) || null;
}

function hasLiveBindingState(nodeId) {
  return Boolean(getLiveBindingState(nodeId));
}

function getLiveRecoveryLabel(message = {}) {
  const event = String(message.event || "").toLowerCase();
  if (event === "assigned_acquire_listen") return "Acquiring assigned telemetry";
  if (event === "auto_relock_scheduled") return "Auto recovery scheduled";
  if (event === "auto_relock_listen") return "Auto recovery listening";
  if (event === "auto_relock_backoff") return "Auto recovery waiting";
  if (event === "auto_relock_exhausted") return "Auto recovery exhausted";
  if (event === "cad_recovery_probe") return "Checking assigned channel";
  if (event === "cad_recovery_queued") return "Recovery queued";
  if (event === "telemetry_rebind_request") return "MaGC assisted re-bind requested";
  if (event === "accepted") return "MaGC assisted re-bind accepted";
  if (event === "listen_started") return "MaGC listening for telemetry";
  if (event === "packet_seen") return "Recovery packet seen";
  if (event === "timing_hint_sent") return "Recovery timing hint sent";
  if (event === "failed") return "Recovery failed";
  if (event === "cancelled") return "Recovery cancelled";
  if (event === "binding") return "Re-bind active";
  if (event === "offline") return "Waiting for signal";
  if (event === "off") return "No signal detected";
  if (event === "weak") return "Weak link recovery";
  return event ? event.replaceAll("_", " ") : "Recovery active";
}

function upsertLiveRecoveryState(nodeId, message = {}, { label = null, reason = null } = {}) {
  const id = Number(nodeId);
  if (!Number.isFinite(id) || id <= 0) return null;
  const now = Date.now();
  getOrCreateLiveDrone(id);
  const current = liveState.recoveryStates.get(id) || {};
  const next = {
    ...current,
    nodeId: id,
    event: message.event || current.event || null,
    label: label || getLiveRecoveryLabel(message),
    reason: reason ?? message.reason ?? message.resultReason ?? current.reason ?? null,
    frequencyMhz: message.frequencyMhz ?? current.frequencyMhz ?? null,
    channelIndex: message.channelIndex ?? current.channelIndex ?? null,
    radioProfileId: message.radioProfileId ?? current.radioProfileId ?? null,
    rssi: message.rssi ?? current.rssi ?? null,
    snr: message.snr ?? current.snr ?? null,
    updatedAt: now,
  };
  liveState.recoveryStates.set(id, next);
  return next;
}

function clearLiveRecoveryState(nodeId) {
  const id = Number(nodeId);
  if (!Number.isFinite(id)) return;
  liveState.recoveryStates.delete(id);
}

function pruneLiveRecoveryStates(now = Date.now()) {
  let changed = false;
  liveState.recoveryStates.forEach((state, nodeId) => {
    const updatedAt = Number(state.updatedAt);
    if (!Number.isFinite(updatedAt) || now - updatedAt > LIVE_RECOVERY_STATE_TTL_MS) {
      liveState.recoveryStates.delete(nodeId);
      changed = true;
    }
  });
  return changed;
}

function isLiveAssignmentTimingLocked(assignment) {
  if (!assignment) return false;
  return assignment.timingAccepted === true || String(assignment.periodConfidence || "").toLowerCase() === "locked";
}

function syncLiveBindingStatesFromAssignments(assignments = []) {
  if (!Array.isArray(assignments)) return;
  assignments.forEach((assignment) => {
    const nodeId = Number(assignment?.nodeId);
    if (!Number.isFinite(nodeId) || !liveState.bindingStates.has(nodeId)) return;
    if (isLiveAssignmentTimingLocked(assignment)) {
      completeLiveBindingState(nodeId);
    }
  });
}

function completeLiveBindingState(nodeId) {
  const id = Number(nodeId);
  if (!Number.isFinite(id)) return;
  const current = liveState.bindingStates.get(id);
  if (!current) return;
  if (current.status === "completing") return;
  const now = Date.now();
  const startProgress = Math.min(LIVE_BINDING_WAITING_PROGRESS_END, getLiveBindingProgress(current, now));
  liveState.bindingStates.set(id, {
    ...current,
    phase: "timing",
    status: "completing",
    phaseStartedAt: now,
    phaseExpectedMs: LIVE_BINDING_COMPLETION_MS,
    completionStartedAt: now,
    completionStartProgress: startProgress,
    progress: startProgress,
    lastEventAt: now,
  });
  syncLiveBindingAnimationTimer();
  updateStatusList();
  publishLiveDronesState({ force: true, minIntervalMs: 0 });
}

function clearAllLiveBindingStates() {
  liveState.bindingStates.clear();
  syncLiveBindingAnimationTimer();
}

function pruneLiveBindingStates(now = Date.now()) {
  let changed = false;
  liveState.bindingStates.forEach((state, nodeId) => {
    const lastEventAt = Number(state.lastEventAt);
    const ttl = state.status === "failed" ? LIVE_BINDING_FAILED_TTL_MS : LIVE_BINDING_TTL_MS;
    if (!Number.isFinite(lastEventAt) || now - lastEventAt > ttl) {
      liveState.bindingStates.delete(nodeId);
      changed = true;
    }
  });
  if (changed) syncLiveBindingAnimationTimer();
  return changed;
}

function refreshLiveBindingUi(source = "serial", { publish = true } = {}) {
  updateStatusList();
  renderLiveGcStatus();
  syncLiveBindingAnimationTimer();
  if (source === "serial" && publish) {
    ensureLiveRelayForCurrentState();
    publishLiveDronesState({ force: true, minIntervalMs: 0 });
  }
}

function applyLiveBindingPhaseFromMessage(message, phase, source = "serial", options = {}) {
  const nodeId = getLiveBindingNodeIdFromMessage(message);
  if (!Number.isFinite(Number(nodeId))) return;
  upsertLiveBindingState(nodeId, phase, message, options);
  refreshLiveBindingUi(source);
}

function updateExistingLiveBindingPhase(message, phase, source = "serial", options = {}) {
  const nodeId = getLiveBindingNodeIdFromMessage(message);
  if (!Number.isFinite(Number(nodeId)) || !hasLiveBindingState(nodeId)) return false;
  upsertLiveBindingState(nodeId, phase, message, options);
  refreshLiveBindingUi(source);
  return true;
}

function handleLiveAssignmentEventForBinding(message, source = "serial") {
  const event = String(message.event || "");
  const phaseByEvent = {
    join_request_received: "quiet",
    assign_created: "quiet",
    assign_reused: "quiet",
    silence_sent: "assign",
    assign_sent: "ack",
    join_ack_received: "telemetry_bind",
    late_join_ack_received: "telemetry_bind",
    assignment_active: "telemetry_bind",
    assignment_completed: "telemetry_bind",
    post_bind_acquire_started: "telemetry_bind",
    post_bind_first_telemetry: "timing",
    post_bind_acquire_timeout: "telemetry_bind",
    telemetry_period_observed: "timing",
  };
  const createBindingEvents = new Set([
    "join_request_received",
    "assign_created",
    "assign_reused",
    "silence_sent",
    "assign_sent",
    "join_ack_received",
    "assignment_completed",
    "post_bind_acquire_started",
    "post_bind_first_telemetry",
    "telemetry_period_observed",
  ]);
  const failureEvents = new Set([
    "join_request_malformed",
    "join_assign_build_failed",
    "join_ack_malformed",
    "join_ack_mismatch",
    "join_ack_timeout",
    "join_ack_retries_exhausted",
    "join_ack_not_received",
    "telemetry_period_rejected",
  ]);

  if (event === "assignment_removed" || event === "assignment_expired") {
    const nodeId = getLiveBindingNodeIdFromMessage(message);
    if (Number.isFinite(Number(nodeId))) {
      clearLiveBindingState(nodeId);
      refreshLiveBindingUi(source);
    }
    return;
  }
  const terminalClearEvents = new Set([
    "join_request_received",
    "assign_created",
    "assign_reused",
    "silence_sent",
    "assign_sent",
    "join_ack_received",
    "late_join_ack_received",
    "assignment_completed",
    "post_bind_acquire_started",
    "post_bind_first_telemetry",
  ]);
  if (terminalClearEvents.has(event)) {
    const nodeId = getLiveBindingNodeIdFromMessage(message);
    if (Number.isFinite(Number(nodeId))) {
      clearLiveRecoveryState(nodeId);
      clearLiveTerminalLinkStatusForBinding(nodeId);
    }
  }
  if (event === "telemetry_period_locked") {
    const nodeId = getLiveBindingNodeIdFromMessage(message);
    if (Number.isFinite(Number(nodeId))) {
      clearLiveRecoveryState(nodeId);
      clearLiveTerminalLinkStatusForBinding(nodeId);
      upsertLiveBindingState(nodeId, "timing", message, {
        status: "active",
        reason: "waiting_for_telegc_telemetry",
      });
      refreshLiveBindingUi(source);
    }
    return;
  }
  if (failureEvents.has(event)) {
    const nodeId = getLiveBindingNodeIdFromMessage(message);
    if (Number.isFinite(Number(nodeId)) && hasLiveBindingState(nodeId)) {
      upsertLiveBindingState(nodeId, liveState.bindingStates.get(nodeId)?.phase || "ack", message, {
        status: "failed",
        reason: message.reason || event,
      });
      refreshLiveBindingUi(source);
    }
    return;
  }
  const phase = phaseByEvent[event];
  if (!phase) return;
  if (createBindingEvents.has(event)) {
    applyLiveBindingPhaseFromMessage(message, phase, source, { origin: "shared_bind" });
  } else {
    updateExistingLiveBindingPhase(message, phase, source);
  }
}

function handleLiveBindProgressEvent(message, source = "serial") {
  const nodeId = getLiveBindingNodeIdFromMessage(message);
  if (!Number.isFinite(Number(nodeId))) return;
  const phase = String(message.phase || "").trim().toLowerCase() || "telemetry_bind";
  const status = String(message.status || "").trim().toLowerCase();
  const event = String(message.event || "").trim().toLowerCase();

  if ((status === "complete" || phase === "complete") && event === "telemetry_live" && isLiveLocalTelemetrySource(message, source)) {
    completeLiveBindingState(nodeId);
    clearLiveRecoveryState(nodeId);
    clearLiveTerminalLinkStatusForBinding(nodeId);
    refreshLiveBindingUi(source);
    return;
  }
  if (status === "complete" || phase === "complete") {
    upsertLiveBindingState(nodeId, "timing", message, {
      status: "active",
      reason: "waiting_for_telegc_telemetry",
    });
    refreshLiveBindingUi(source);
    return;
  }

  if (status === "failed") {
    upsertLiveBindingState(nodeId, liveState.bindingStates.get(nodeId)?.phase || phase || "ack", message, {
      status: "failed",
      reason: message.reason || message.event || "bind_failed",
    });
    refreshLiveBindingUi(source);
    return;
  }

  upsertLiveBindingState(nodeId, phase, message, { status: "active", origin: "shared_bind" });
  refreshLiveBindingUi(source);
}

function handleLiveSearchEventForBinding(message, source = "serial") {
  if (message.event === "join_detected" || message.event === "auto_shared_rx_join_detected") {
    const origin = liveState.gcStatus?.autoSharedRxActive || String(message.event || "").startsWith("auto_")
      ? "auto_shared_rebind"
      : "shared_bind";
    applyLiveBindingPhaseFromMessage(message, "quiet", source, { origin });
  } else if (message.event === "assignment_completed") {
    updateExistingLiveBindingPhase(message, "telemetry_bind", source);
  } else if (message.event === "auto_shared_rx_started" || message.event === "auto_shared_rx_active") {
    const nodeId = Number(message.nodeId);
    if (Number.isFinite(nodeId) && nodeId > 0) {
      upsertLiveRecoveryState(nodeId, message, {
        label: "Automatic shared re-bind listening",
        reason: message.reason || "auto_shared_rx",
      });
    }
  } else if (message.event === "auto_shared_rx_complete") {
    const nodeId = Number(message.nodeId);
    if (Number.isFinite(nodeId) && nodeId > 0 && message.reason !== "join_handled") {
      upsertLiveRecoveryState(nodeId, message, {
        label: "Automatic shared re-bind complete",
        reason: message.reason || "auto_shared_rx_complete",
      });
    }
  }
}

function handleLiveScannerEventForBinding(message, source = "serial") {
  if (message.event === "post_bind_acquire_started" || message.event === "post_bind_first_telemetry") {
    const nodeId = getLiveBindingNodeIdFromMessage(message);
    if (Number.isFinite(Number(nodeId))) {
      clearLiveTerminalLinkStatusForBinding(nodeId);
      clearLiveRecoveryState(nodeId);
    }
    updateExistingLiveBindingPhase(message, message.event === "post_bind_first_telemetry" ? "timing" : "telemetry_bind", source);
  } else if (message.event === "post_ack_lock_listen" || message.event === "assigned_acquire_listen") {
    if (!updateExistingLiveBindingPhase(message, "telemetry_bind", source)) {
      const nodeId = getLiveBindingNodeIdFromMessage(message);
      if (Number.isFinite(Number(nodeId))) upsertLiveRecoveryState(nodeId, message);
    }
  } else if (message.event === "manual_relock_listen" || message.event === "auto_relock_listen") {
    const nodeId = getLiveBindingNodeIdFromMessage(message);
    if (!updateExistingLiveBindingPhase(message, "telemetry_bind", source) && Number.isFinite(Number(nodeId))) {
      upsertLiveRecoveryState(nodeId, message);
    }
  } else if (
    message.event === "cad_recovery_queued" ||
    message.event === "cad_recovery_probe" ||
    message.event === "auto_relock_scheduled" ||
    message.event === "auto_relock_backoff" ||
    message.event === "auto_relock_exhausted" ||
    message.event === "stale_slot_skipped" ||
    message.event === "telemetry_missed"
  ) {
    const nodeId = getLiveBindingNodeIdFromMessage(message);
    if (Number.isFinite(Number(nodeId))) upsertLiveRecoveryState(nodeId, message);
  } else if (message.event === "post_bind_acquire_timeout") {
    const nodeId = getLiveBindingNodeIdFromMessage(message);
    if (Number.isFinite(Number(nodeId)) && hasLiveBindingState(nodeId)) {
      upsertLiveBindingState(nodeId, liveState.bindingStates.get(nodeId)?.phase || "telemetry_bind", message, {
        status: "active",
        reason: message.reason || "post_bind_acquire_timeout",
      });
      upsertLiveRecoveryState(nodeId, message, {
        label: "Post-bind acquire timed out",
        reason: message.reason || "post_bind_acquire_timeout",
      });
      refreshLiveBindingUi(source);
    } else if (Number.isFinite(Number(nodeId))) {
      upsertLiveRecoveryState(nodeId, message, { reason: message.reason || message.event });
    }
  } else if (message.event === "post_ack_lock_expired" || message.event === "manual_relock_expired") {
    const nodeId = getLiveBindingNodeIdFromMessage(message);
    if (Number.isFinite(Number(nodeId)) && hasLiveBindingState(nodeId)) {
      upsertLiveBindingState(nodeId, liveState.bindingStates.get(nodeId)?.phase || "telemetry_bind", message, {
        status: "failed",
        reason: message.reason || message.event,
      });
      refreshLiveBindingUi(source);
    } else if (Number.isFinite(Number(nodeId))) {
      upsertLiveRecoveryState(nodeId, message, { reason: message.reason || message.event });
    }
  }
}

function handleLiveLinkStatusForBinding(message, source = "serial") {
  const nodeId = Number(message.nodeId);
  if (!Number.isFinite(nodeId)) return;
  const state = normalizeLiveDisplayState(message.state);
  if (state === "binding") {
    if (liveState.bindingStates.has(nodeId)) {
      upsertLiveBindingState(nodeId, "telemetry_bind", message);
      refreshLiveBindingUi(source);
    } else {
      upsertLiveRecoveryState(nodeId, { ...message, event: "binding" });
    }
  } else if (["weak", "off", "offline"].includes(state)) {
    const bindingState = getLiveBindingState(nodeId);
    if (bindingState && bindingState.status !== "failed") {
      upsertLiveRecoveryState(nodeId, { ...message, event: state }, {
        reason: message.reason || "link_status_during_bind",
      });
      return;
    }
    if (!(bindingState?.origin === "manual_rebind" && isLiveDroneRelocking(nodeId))) clearLiveBindingState(nodeId);
    upsertLiveRecoveryState(nodeId, { ...message, event: state });
  } else if (state === "online" || state === "fresh") {
    clearLiveRecoveryState(nodeId);
  }
}

function applyLiveDronesState(message, source = "live-endpoint") {
  const isSerialSceneState = source === "serial";
  const sceneSource = String(message?.source || "").toLowerCase();
  const isBridgeSerialScene =
    isSerialSceneState &&
    (sceneSource === "lora_bridge" || sceneSource === "espnow_bridge" || sceneSource === "bridge");
  if ((source === "live-endpoint" || isSerialSceneState) && !liveState.serialTelemetrySeen) {
    stopLivePositionMock({ clearDrones: true, clearStatus: true });
    liveState.serialTelemetrySeen = true;
  }
  if (isSerialSceneState) {
    liveState.serialTelemetrySeen = true;
    liveState.searchPending = false;
    liveState.searchMode = false;
  }

  const now = Date.now();
  if (source === "live-endpoint") {
    liveState.remotePublisherStatus = normalizeLivePublisherSourceMetadata(message, now);
  }
  const seenNodeIds = new Set();
  const remoteNames = new Map();
  const entries = Array.isArray(message.drones) ? message.drones : [];
  let appliedDroneCount = 0;
  let duplicateDroneCount = 0;

  entries.forEach((entry) => {
    const nodeId = Number(entry?.nodeId);
    const lat = Number(entry?.lat);
    const lng = Number(entry?.lng);
    if (!Number.isFinite(nodeId)) return;
    const displayState = normalizeLiveDisplayState(entry.displayState);
    const bindPhaseName = String(entry.bindPhase || "").trim().toLowerCase();
    const hasPosition = Number.isFinite(lat) && Number.isFinite(lng);
    const ageMs = Number(entry.ageMs);
    const hasSequence = entry.sequenceId !== undefined && entry.sequenceId !== null;
    const freshBridgeTelemetrySnapshot =
      isBridgeSerialScene &&
      hasPosition &&
      hasSequence &&
      displayState === "binding" &&
      !entry.bindPhase &&
      Number.isFinite(ageMs) &&
      ageMs < LIVE_FRESHNESS_MS.fresh;
    const isBindCompleteSnapshot =
      bindPhaseName === "complete" ||
      entry.timingAccepted === true ||
      freshBridgeTelemetrySnapshot ||
      (hasPosition && ["online", "fresh"].includes(displayState));
    const isBindingSnapshot = !isBindCompleteSnapshot && (isLiveBindingStateName(displayState) || entry.bindPhase);
    const isBridgeCardSnapshot =
      isBridgeSerialScene &&
      !hasPosition &&
      ["online", "fresh", "binding", "weak", "off", "offline", "unknown"].includes(displayState);
    if (!hasPosition && !isBindingSnapshot && !isBridgeCardSnapshot) return;

    const cleanName = String(entry.name || "").trim().slice(0, 28);
    if (cleanName) remoteNames.set(nodeId, cleanName);
    seenNodeIds.add(nodeId);

    const drone = getOrCreateLiveDrone(nodeId);
    const receivedAt = Number.isFinite(ageMs) ? now - Math.max(0, ageMs) : now;
    if (isBindCompleteSnapshot) {
      if (liveState.bindingStates.has(nodeId)) {
        completeLiveBindingState(nodeId);
      }
    } else if (isBindingSnapshot) {
      upsertLiveBindingState(
        nodeId,
        entry.bindPhase || "telemetry_bind",
        {
          ...entry,
          event: "relay_binding_snapshot",
          frequencyMhz: entry.frequencyMhz,
          radioProfileId: entry.radioProfileId,
          rssi: entry.rssi,
          snr: entry.snr,
        },
        {
          status: entry.bindStatus || "active",
          reason: entry.bindReason || null,
          progress: Number.isFinite(Number(entry.bindProgress)) ? Number(entry.bindProgress) : null,
        }
      );
    } else {
      clearLiveBindingState(nodeId);
    }
    if (["online", "fresh", "binding", "weak", "off", "offline", "unknown"].includes(displayState)) {
      liveState.linkStatuses.set(nodeId, {
        type: "drone_link_status",
        nodeId,
        state: displayState,
        receivedAt,
        holdUntilRecovered: ["weak", "off", "offline"].includes(displayState),
        frequencyMhz: entry.frequencyMhz ?? null,
        radioProfileId: entry.radioProfileId ?? null,
        txPeriodMs: entry.txPeriodMs ?? null,
        rssi: entry.rssi ?? null,
        snr: entry.snr ?? null,
        satelliteCount: entry.satelliteCount ?? null,
        bridgeCardOnly: !hasPosition,
      });
    } else {
      liveState.linkStatuses.delete(nodeId);
    }

    if (!hasPosition) return;

    const latest = drone.getLatest && drone.getLatest();
    const incomingSequenceId = Number(entry.sequenceId);
    const latestSequenceId = Number(latest?.sequenceId);
    const duplicateSequence =
      Number.isFinite(incomingSequenceId) &&
      Number.isFinite(latestSequenceId) &&
      incomingSequenceId === latestSequenceId;
    if (duplicateSequence && !isBridgeSerialScene) {
      duplicateDroneCount += 1;
      return;
    }

    drone.updateTelemetry(
      {
        uptimeSec: receivedAt / 1000,
        lat,
        lng,
        alt: Number(entry.alt) || 0,
        heading: Number(entry.heading) || 0,
        headingSource: entry.headingSource || null,
        courseOverGround: entry.courseOverGround ?? null,
        yaw: entry.yaw ?? null,
        groundSpeed: entry.groundSpeed ?? null,
        satelliteCount: entry.satelliteCount ?? null,
        rssi: entry.rssi ?? null,
        snr: entry.snr ?? null,
        frequencyMhz: entry.frequencyMhz ?? null,
        radioProfileId: entry.radioProfileId ?? null,
        txPeriodMs: entry.txPeriodMs ?? null,
        telemetryAirtimeMs: entry.telemetryAirtimeMs ?? null,
        expectedUpdateMs: entry.expectedUpdateMs ?? null,
        sequenceId: entry.sequenceId ?? null,
        command: "Live endpoint",
        armed: true,
      },
      receivedAt
    );
    queueLiveDroneFollowCenter(drone);
    appliedDroneCount += 1;
  });

  if (source === "live-endpoint") {
    liveState.relayDebug.viewerAppliedDroneCount = appliedDroneCount;
    liveState.relayDebug.viewerDuplicateDroneCount = duplicateDroneCount;
    renderLiveGcStatus();
  }
  liveState.remoteDroneNames = remoteNames;
  const before = drones.length;
  drones = drones.filter((drone) => {
    if (drone.type === "live" && !seenNodeIds.has(Number(drone.id))) {
      liveState.linkStatuses.delete(Number(drone.id));
      liveState.bindingStates.delete(Number(drone.id));
      liveState.recoveryStates.delete(Number(drone.id));
      liveState.relockRequests.delete(Number(drone.id));
      liveState.deleteRequests.delete(Number(drone.id));
      return false;
    }
    return true;
  });
  if (pinnedDroneId !== null && !getDroneById(pinnedDroneId)) pinnedDroneId = null;
  if (hoveredDroneId !== null && !getDroneById(hoveredDroneId)) hoveredDroneId = null;
  syncLiveDroneFollowState();
  if (before !== drones.length || entries.length) {
    updateStatusList();
    updateTooltip();
    draw();
  }
  if (isSerialSceneState) {
    ensureLiveRelayForCurrentState();
    publishLiveDronesState({ minIntervalMs: LIVE_RELAY_DRONES_STATE_DATA_MIN_INTERVAL_MS });
  }
}

function applyLiveHomesState(message, source = "live-endpoint") {
  if (source === "live-endpoint") {
    pendingUserHomePlacement = false;
    liveState.homePlacementActive = false;
    gsRelocate = null;
    closeGroundStationMenu(false);
    closeGroundStationNameMenu();
    closeUserHomePrompt();
    closeLiveMapMenu();
  }

  const entries = Array.isArray(message.homes) ? message.homes : [];
  groundStations = entries
    .map((entry, index) => {
      const id = Number.isFinite(Number(entry?.id)) ? Number(entry.id) : index;
      const lat = Number(entry?.lat);
      const lng = Number(entry?.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      const name = String(entry.name || `Home #${id + 1}`).trim() || `Home #${id + 1}`;
      return new GroundStation(id, lat, lng, 0, name);
    })
    .filter(Boolean);
  userGroundStationId = groundStations.length ? groundStations[0].id : null;
  if (activeGroundStationId !== null && !groundStations.some((home) => Number(home.id) === Number(activeGroundStationId))) {
    activeGroundStationId = null;
  }
  renderLiveHomeTool();
  updateStatusList();
  draw();
}

function applyLiveTelemetry(message, source = "serial") {
  if ((source === "serial" || source === "live-endpoint") && !liveState.serialTelemetrySeen) {
    stopLivePositionMock({ clearDrones: true, clearStatus: true });
  }
  if (source === "serial") {
    liveState.serialTelemetrySeen = true;
  }

  const drone = getOrCreateLiveDrone(message.nodeId);
  const latest = drone.getLatest && drone.getLatest();
  const incomingSequenceId = Number(message.sequenceId);
  const latestSequenceId = Number(latest?.sequenceId);
  if (Number.isFinite(incomingSequenceId) && Number.isFinite(latestSequenceId) && incomingSequenceId === latestSequenceId) {
    return;
  }

  const now = Date.now();
  const previousReceivedAt = Number(drone.lastReceivedAt);
  const nodeId = Number(message.nodeId);
  if (source === "serial") {
    liveState.searchPending = false;
    liveState.searchMode = false;
  }
  const telemetryTimingAccepted =
    message.timingAccepted === true ||
    String(message.periodConfidence || "").toLowerCase() === "locked";
  clearLiveAssignmentTelemetryWatchdog(message.nodeId);
  if (liveState.bindingStates.has(nodeId)) {
    if (isLiveLocalTelemetrySource(message, source)) {
      completeLiveBindingState(nodeId);
      recordLiveGcDiagnosticEvent("post_bind_first_telegc_telemetry", {
        nodeId,
        sourceRole: message.sourceRole || "",
        sequenceId: message.sequenceId ?? null,
        gcMillis: message.gcMillis ?? null,
      });
    } else if (telemetryTimingAccepted) {
      upsertLiveBindingState(nodeId, "timing", {
        ...message,
        event: "drone_telemetry_remote",
        timingObservationCount: firstPositiveNumber(message.timingObservationCount, 1),
      }, {
        status: "active",
        reason: "waiting_for_telegc_telemetry",
      });
    } else {
      upsertLiveBindingState(nodeId, "timing", {
        ...message,
        event: "drone_telemetry",
        timingObservationCount: firstPositiveNumber(message.timingObservationCount, 1),
      });
    }
  }
  liveState.relockRequests.delete(nodeId);
  clearLiveRecoveryState(nodeId);
  noteLiveTelemetryForLinkStatus(message.nodeId, previousReceivedAt, now);
  drone.updateTelemetry(
    {
      uptimeSec: message.gcMillis ? message.gcMillis / 1000 : 0,
      lat: message.lat,
      lng: message.lng,
      alt: message.alt,
      heading: message.heading,
      headingSource: message.headingSource,
      courseOverGround: message.courseOverGround,
      yaw: message.yaw,
      yawHeading: message.yawHeading,
      yawBiasDeg: message.yawBiasDeg,
      yawBiasValid: message.yawBiasValid,
      yawBiasSamples: message.yawBiasSamples,
      cogWeight: message.cogWeight,
      cogTrusted: message.cogTrusted,
      groundSpeed: message.groundSpeed,
      satelliteCount: message.satelliteCount,
      gpsSource: message.gpsSource,
      gpsSimulated: message.gpsSimulated,
      gpsFixQuality: message.gpsFixQuality,
      rssi: message.rssi,
      snr: message.snr,
      frequencyMhz: message.frequencyMhz,
      radioProfileId: message.radioProfileId,
      txPeriodMs: message.txPeriodMs,
      telemetryAirtimeMs: message.telemetryAirtimeMs,
      expectedUpdateMs: message.expectedUpdateMs ?? message.targetServiceMs,
      sequenceId: message.sequenceId,
      gcMillis: message.gcMillis,
      command: "Live telemetry",
      armed: true,
    },
    now
  );
  queueLiveDroneFollowCenter(drone);
  updateStatusList();
  renderLiveControls();
  draw();
  if (source === "serial") {
    ensureLiveRelayForCurrentState();
    publishLiveDronesState({ minIntervalMs: LIVE_RELAY_DRONES_STATE_DATA_MIN_INTERVAL_MS });
  }
}

function clearLiveSerialDrones({ clearAssignments = false } = {}) {
  const before = drones.length;
  drones = drones.filter((drone) => drone.type !== "live");
  if (pinnedDroneId !== null && !getDroneById(pinnedDroneId)) pinnedDroneId = null;
  if (hoveredDroneId !== null && !getDroneById(hoveredDroneId)) hoveredDroneId = null;
  syncLiveDroneFollowState();
  liveState.serialTelemetrySeen = false;
  liveState.relockRequests.clear();
  liveState.linkStatuses.clear();
  liveState.recoveryStates.clear();
  clearAllLiveBindingStates();
  liveState.deleteRequests.clear();
  clearAllLiveAssignmentTelemetryWatchdogs();
  if (clearAssignments) {
    liveState.assignmentEvents.clear();
    if (liveState.channelTable) {
      liveState.channelTable = {
        ...liveState.channelTable,
        assignments: [],
      };
    }
  }
  if (drones.length !== before) {
    updateStatusList();
    draw();
  }
}

function removeLiveDroneLocally(nodeId, { clearAssignment = false } = {}) {
  const id = Number(nodeId);
  if (!Number.isFinite(id)) return;
  const before = drones.length;
  drones = drones.filter((drone) => Number(drone.id) !== id);
  liveState.relockRequests.delete(id);
  liveState.linkStatuses.delete(id);
  liveState.bindingStates.delete(id);
  liveState.recoveryStates.delete(id);
  liveState.deleteRequests.delete(id);
  if (clearAssignment && liveState.channelTable && Array.isArray(liveState.channelTable.assignments)) {
    liveState.channelTable = {
      ...liveState.channelTable,
      assignments: liveState.channelTable.assignments.filter((assignment) => Number(assignment.nodeId) !== id),
    };
  }
  if (pinnedDroneId === id) {
    pinnedDroneId = null;
    stopLiveDroneFollow();
  }
  if (hoveredDroneId === id) hoveredDroneId = null;
  if (before !== drones.length) {
    updateStatusList();
    renderLiveGcStatus();
    draw();
  }
}

function clearLiveAssignmentTelemetryWatchdog(nodeId) {
  const id = Number(nodeId);
  if (!Number.isFinite(id)) return;
  const timer = liveState.assignmentTelemetryWatchdogs.get(id);
  if (timer) {
    window.clearTimeout(timer);
    liveState.assignmentTelemetryWatchdogs.delete(id);
  }
}

function clearAllLiveAssignmentTelemetryWatchdogs() {
  liveState.assignmentTelemetryWatchdogs.forEach((timer) => window.clearTimeout(timer));
  liveState.assignmentTelemetryWatchdogs.clear();
}

function scheduleLiveAssignmentTelemetryWatchdog(message) {
  const nodeId = Number(message?.nodeId);
  if (!Number.isFinite(nodeId) || isLiveRemoteViewerMode()) return;
  clearLiveAssignmentTelemetryWatchdog(nodeId);
  const startedAt = Date.now();
  const timer = window.setTimeout(async () => {
    liveState.assignmentTelemetryWatchdogs.delete(nodeId);
    const drone = getDroneById(nodeId);
    if (drone?.lastReceivedAt && drone.lastReceivedAt >= startedAt) return;
    if (!liveState.connected) return;
    recordLiveGcDiagnosticEvent("assignment_watchdog_no_telemetry", {
      nodeId,
      action: "status_refresh",
    });
    appendLiveDebug(`assignment watchdog: no telemetry after ACK for node ${nodeId}; requesting status`);
    await sendLiveSerialCommand("get_status");
    await sendLiveSerialCommand("get_channel_table");
  }, 2200);
  liveState.assignmentTelemetryWatchdogs.set(nodeId, timer);
}

function handleLiveProtocolMessage(message, source = "serial") {
  const issues = validateLiveProtocolMessage(message);
  if (issues.length) {
    appendLiveDebug(`protocol invalid: ${issues.join(" ")}`);
    return;
  }
  liveState.lastJsonAt = Date.now();
  if (message.type === "drones_state") {
    applyLiveDronesState(message, source);
  } else if (message.type === "homes_state") {
    applyLiveHomesState(message, source);
  } else if (message.type === "drone_telemetry") {
    applyLiveTelemetry(message, source);
  } else if (message.type === "gc_status") {
    liveState.gcStatus = message;
    rememberLiveUsbDeviceRole(message.nodeRole || message.node_role);
    syncLiveProfileDraftFromGcStatus();
    liveState.searchMode = !!message.searchMode;
    if (!liveState.searchMode || !!message.operatorDiscoveryActive) liveState.searchPending = false;
    if (message.bridgeMode) {
      liveState.pendingCommands.forEach((pending, commandId) => {
        if (["get_status", "get_channel_table", "get_assignments", "ping"].includes(pending?.command)) {
          liveState.pendingCommands.delete(commandId);
        }
      });
    }
    renderLiveControls();
    renderLiveGcStatus();
  } else if (message.type === "inter_gc_status") {
    liveState.interGcStatus = { ...message, receivedAt: Date.now() };
    const previousRole = liveState.usbDeviceRole;
    rememberLiveUsbDeviceRole(message.nodeRole || message.role || message.source);
    if (liveState.usbDeviceRole === "magic_ground_control" && previousRole !== liveState.usbDeviceRole) {
      appendLiveDebug("USB role warning: MaGC is connected; connect TeleGC to this computer for SGC.");
    }
    renderLiveControls();
    renderLiveGcStatus();
  } else if (message.type === "assignment_event") {
    liveState.assignmentEvents.push(message);
    handleLiveAssignmentEventForBinding(message, source);
    if (message.event === "tx_period_ack_sent") {
      scheduleLiveAssignmentTelemetryWatchdog(message);
    }
    renderLiveGcStatus();
  } else if (message.type === "bind_progress_event") {
    handleLiveBindProgressEvent(message, source);
    renderLiveGcStatus();
  } else if (message.type === "command_ack") {
    liveState.lastCommandAck = message;
    if (message.commandId && liveState.pendingCommands.has(message.commandId)) {
      const pending = liveState.pendingCommands.get(message.commandId);
      const ackLatencyMs = Math.max(0, Date.now() - Number(pending.sentAt || Date.now()));
      message.ackLatencyMs = ackLatencyMs;
      recordLiveGcDiagnosticEvent("command_ack_matched", {
        commandId: message.commandId,
        command: message.command,
        target: message.target || pending.target || "",
        sourceRole: message.sourceRole || "",
        accepted: message.accepted === true,
        ackLatencyMs,
      });
      liveState.pendingCommands.delete(message.commandId);
      if (pending.command === "clear_all_assignments") {
        if (message.accepted) {
          liveState.freshSessionPending = false;
          liveState.freshSessionRetryCount = 0;
          clearLiveFreshSessionRetryTimer();
          clearLiveSerialDrones({ clearAssignments: true });
        } else if (!scheduleFreshSessionRetry(message)) {
          liveState.freshSessionPending = false;
          clearLiveFreshSessionRetryTimer();
        }
      } else if (pending.command === "rescan_channels") {
        liveState.spectrumRescanPending = false;
        liveState.spectrumRescanConfirming = false;
        if (message.accepted) {
          liveState.spectrumPanelOpen = true;
          liveState.spectrumStatus = "Re-scan accepted by GC.";
        } else {
          const reason = message.reason || message.message || "unknown reason";
          liveState.spectrumStatus = reason === "unknown_command"
            ? "GC firmware does not support re-scan yet. Flash the updated GC firmware."
            : `Re-scan rejected: ${reason}`;
        }
      } else if (pending.command === "relock_drone") {
        const nodeId = Number(message.nodeId ?? pending.nodeId);
        if (Number.isFinite(nodeId)) {
          if (message.accepted) {
            const current = liveState.relockRequests.get(nodeId);
            liveState.relockRequests.set(nodeId, {
              expiresAt: current?.expiresAt || Date.now() + LIVE_RELOCK_TIMEOUT_MS,
              commandId: message.commandId,
            });
          } else {
            liveState.relockRequests.delete(nodeId);
            const bindingState = getLiveBindingState(nodeId);
            if (bindingState?.origin === "manual_rebind") {
              clearLiveBindingState(nodeId);
              upsertLiveRecoveryState(nodeId, {
                event: "manual_relock_rejected",
                reason: message.reason || message.message || "command_rejected",
              });
            }
          }
        }
      } else if (pending.command === "start_search") {
        liveState.searchPending = false;
        const ackText = `${message.message || ""} ${message.reason || ""}`.toLowerCase();
        if (message.accepted && !ackText.includes("operator discovery")) liveState.searchMode = true;
      } else if (pending.command === "cancel_search") {
        liveState.searchPending = false;
        if (message.accepted) liveState.searchMode = false;
      } else if (pending.command === "set_radio_profile") {
        liveState.profileApplyPending = false;
        if (message.accepted) {
          const acceptedProfileId = Number(pending.radioProfileId);
          const acceptedProfile = decodeLiveRadioProfileId(acceptedProfileId);
          if (acceptedProfile) {
            liveState.profileDraft = acceptedProfile;
            liveState.gcStatus = {
              ...(liveState.gcStatus || {}),
              defaultAssignmentRadioProfileId: acceptedProfileId,
              ...(isLiveBridgeMode() ? {} : {
                radioProfileId: acceptedProfileId,
                spreadingFactor: acceptedProfile.spreadingFactor,
                bandwidthHz: acceptedProfile.bandwidthHz,
                codingRate: acceptedProfile.codingRate,
              }),
            };
          }
          closeLiveProfilePicker();
        }
      } else if (pending.command === "clear_assignment") {
        const nodeId = Number(message.nodeId ?? pending.nodeId);
        liveState.deleteRequests.delete(nodeId);
        if (message.accepted && Number.isFinite(nodeId)) {
          removeLiveDroneLocally(nodeId, { clearAssignment: true });
        }
      }
    }
    const commandLabel =
      message.command === "relock_drone" ? "re-bind" :
      message.command === "start_search" ? "bind" :
      message.command === "cancel_search" ? "cancel bind" :
      (message.command || "command");
    appendLiveDebug(`${message.accepted ? "command ok" : "command rejected"}: ${commandLabel} ${message.message || message.reason || ""}`);
    renderLiveControls();
    renderLiveGcStatus();
  } else if (message.type === "session_event") {
    liveState.sessionEvents.push(message);
    if (message.event === "assignments_cleared") {
      clearLiveSerialDrones({ clearAssignments: true });
    }
    if (message.event === "fresh_session_complete" || message.event === "fresh_session_failed") {
      liveState.freshSessionPending = false;
      liveState.freshSessionRetryCount = 0;
      clearLiveFreshSessionRetryTimer();
    }
    appendLiveDebug(`session: ${message.event}${message.reason ? ` (${message.reason})` : ""}`);
    renderLiveControls();
    renderLiveGcStatus();
  } else if (message.type === "channel_scan_event") {
    liveState.channelScanEvents.push(message);
    if (message.event === "scan_started") {
      liveState.scanRows.clear();
      liveState.scanCandidateCount = Number(message.candidateChannels) || 48;
      liveState.scanProfileName = "";
      liveState.scanInProgress = true;
      liveState.lastScanCompletedAt = null;
      liveState.spectrumStatus = "Scanning channels across profiles...";
      showLiveScanAnimation();
    } else if (message.event === "profile_scan_started") {
      liveState.scanProfileName = message.profileName ? String(message.profileName).toUpperCase() : `P${message.radioProfileId}`;
      liveState.spectrumStatus = `Scanning ${liveState.scanProfileName} profile...`;
      showLiveScanAnimation();
    } else if (message.event === "channel_scanned") {
      updateLiveScanRow(message);
      showLiveScanAnimation();
    } else if (message.event === "noisy_rescan_started") {
      liveState.spectrumStatus = `Rechecking ${Number(message.candidateChannels) || 0} occupied channels...`;
      showLiveScanAnimation();
      appendLiveDebug(`scan recheck: ${Number(message.candidateChannels) || 0} occupied channels`);
    } else if (message.event === "scan_complete") {
      liveState.scanInProgress = false;
      liveState.scanProfileName = "";
      liveState.lastScanCompletedAt = Date.now();
      liveState.spectrumRescanPending = false;
      const free = Number(message.freeChannels ?? message.clearChannels);
      const occupied = Number(message.occupiedChannels ?? message.noisyChannels);
      liveState.spectrumStatus = Number.isFinite(free) && Number.isFinite(occupied)
        ? `Scan complete: ${free} free / ${occupied} occupied.`
        : "Scan complete.";
      scheduleLiveScanAnimationHide();
    }
    renderLiveGcStatus();
  } else if (message.type === "channel_table") {
    liveState.channelTable = message;
    liveState.channelTableReceivedAt = Date.now();
    syncLiveBindingStatesFromAssignments(message.assignments);
    updateStatusList();
    renderLiveGcStatus();
  } else if (message.type === "assignments") {
    liveState.channelTable = { ...(liveState.channelTable || {}), assignments: message.assignments || [] };
    syncLiveBindingStatesFromAssignments(message.assignments);
    updateStatusList();
    renderLiveGcStatus();
  } else if (message.type === "scanner_event") {
    liveState.scannerEvents.push(message);
    handleLiveScannerEventForBinding(message, source);
    if (String(message.event || "").startsWith("post_bind_")) {
      recordLiveGcDiagnosticEvent(message.event, {
        nodeId: message.nodeId ?? null,
        sourceRole: message.sourceRole || "",
        reason: message.reason || "",
        postBindAcquireElapsedMs: message.postBindAcquireElapsedMs ?? null,
        gcMillis: message.gcMillis ?? null,
      });
    }
    if (
      message.event === "telemetry_missed" ||
      message.event === "stale_slot_skipped" ||
      message.event === "assigned_acquire_listen" ||
      message.event === "rx_candidate_skipped" ||
      message.event === "owed_rx_selected" ||
      message.event === "owed_rx_cleared" ||
      message.event === "owed_rx_missed" ||
      message.event === "cad_recovery_queued" ||
      message.event === "cad_recovery_probe" ||
      message.event === "auto_relock_scheduled" ||
      message.event === "auto_relock_listen" ||
      message.event === "auto_relock_backoff" ||
      message.event === "auto_relock_exhausted"
    ) {
      const reasonText = message.reason ? ` (${message.reason})` : "";
      const eventLabel = String(message.event || "").replaceAll("relock", "rebind").replaceAll("_", " ");
      appendLiveDebug(`scanner: ${eventLabel}${message.nodeId !== undefined ? ` node ${message.nodeId}` : ""}${reasonText}`);
    }
  } else if (message.type === "search_event") {
    liveState.searchEvents.push(message);
    handleLiveSearchEventForBinding(message, source);
    if (String(message.event || "").startsWith("auto_shared_rx_")) {
      const autoActive = message.event !== "auto_shared_rx_complete";
      liveState.gcStatus = {
        ...(liveState.gcStatus || {}),
        autoSharedRxActive: autoActive,
        autoSharedRxNodeId: autoActive ? (message.nodeId ?? liveState.gcStatus?.autoSharedRxNodeId ?? 0) : 0,
        autoSharedRxReason: autoActive ? (message.reason || liveState.gcStatus?.autoSharedRxReason || "") : "",
      };
      recordLiveGcDiagnosticEvent(message.event, {
        nodeId: message.nodeId ?? null,
        reason: message.reason || "",
        autoSharedRxActive: autoActive,
        gcMillis: message.gcMillis ?? null,
      });
    }
    liveState.searchPending = false;
    if (typeof message.searchMode === "boolean") {
      liveState.searchMode = message.searchMode;
    } else if (message.event === "assignment_completed") {
      liveState.searchMode = false;
    } else if (["search_started", "join_detected", "search_telemetry_round"].includes(message.event)) {
      liveState.searchMode = true;
    } else if (["search_complete", "search_timeout"].includes(message.event)) {
      liveState.searchMode = false;
    }
    appendLiveDebug(`bind: ${String(message.event || "").replaceAll("_", " ")}${message.nodeId !== undefined ? ` node ${message.nodeId}` : ""}`);
    renderLiveControls();
    renderLiveGcStatus();
  } else if (message.type === "orphan_recovery_event") {
    liveState.orphanRecoveryEvents.push(message);
    if (message.event === "started") {
      liveState.spectrumStatus = "Confirming CAD-suspect channels...";
    } else if (message.event === "confirmation_listen") {
      liveState.spectrumStatus = `Listening on channel ${message.channelIndex ?? "?"} for drone telemetry...`;
    } else if (message.event === "confirmed_drone") {
      liveState.spectrumStatus = `Confirmed drone telemetry on channel ${message.channelIndex ?? "?"}.`;
    } else if (message.event === "complete" || message.event === "background_oocr_complete") {
      liveState.spectrumStatus = `Recovery complete: ${Number(message.recoveredCount) || 0} recovered.`;
    }
    if ([
      "started",
      "background_oocr_started",
      "background_oocr_channel_scanned",
      "background_oocr_paused",
      "background_oocr_complete",
      "confirmation_listen",
      "candidate_listen",
      "packet_seen",
      "confirmed_drone",
      "assignment_recovered",
      "candidate_failed",
      "complete",
    ].includes(message.event)) {
      const nodeText = message.nodeId !== undefined ? ` node ${message.nodeId}` : "";
      const channelText = message.channelIndex !== undefined ? ` ch ${message.channelIndex}` : "";
      const reasonText = message.reason ? ` (${message.reason})` : "";
      appendLiveDebug(`orphan recovery: ${message.event}${nodeText}${channelText}${reasonText}`);
    }
    renderLiveGcStatus();
  } else if (message.type === "telemetry_rebind_event") {
    liveState.scannerEvents.push(message);
    const recoveryNodeId = Number(message.nodeId);
    if (Number.isFinite(recoveryNodeId)) {
      upsertLiveRecoveryState(recoveryNodeId, message);
      if (message.event === "timing_hint_sent" && hasLiveBindingState(recoveryNodeId)) {
        updateExistingLiveBindingPhase(message, "telemetry_bind", source);
      }
      if (message.event === "cancelled") clearLiveRecoveryState(recoveryNodeId);
    }
    const nodeText = message.nodeId !== undefined ? ` node ${message.nodeId}` : "";
    const requestText = message.requestId !== undefined ? ` req ${message.requestId}` : "";
    const reasonText = message.reason ? ` (${message.reason})` : message.resultReason ? ` (${message.resultReason})` : "";
    const eventText = String(message.event || "event").replaceAll("_", " ");
    const prefix = String(message.event || "").startsWith("short_loss_") ? "short loss" : "assisted re-bind";
    appendLiveDebug(`${prefix}: ${eventText}${nodeText}${requestText}${reasonText}`);
    renderLiveGcStatus();
  } else if (message.type === "drone_link_status") {
    const nodeId = Number(message.nodeId);
    if (Number.isFinite(nodeId)) {
      const state = normalizeLiveDisplayState(message.state);
      if (isLiveTerminalLinkState(state) && hasRecentLiveTelemetryForNode(nodeId)) {
        recordLiveGcDiagnosticEvent("terminal_link_status_ignored_recent_telemetry", {
          nodeId,
          state,
          sourceRole: message.sourceRole || "",
          reason: message.reason || "",
          gcMillis: message.gcMillis ?? null,
        });
        renderLiveGcStatus();
        return;
      }
      const drone = drones.find((d) => d.id === nodeId);
      const latest = drone && typeof drone.getLatest === "function" ? drone.getLatest() : null;
      const latestGcMillis = Number(latest?.gcMillis);
      const statusGcMillis = Number(message.gcMillis);
      if (Number.isFinite(latestGcMillis) && Number.isFinite(statusGcMillis) && statusGcMillis <= latestGcMillis) {
        return;
      }
      handleLiveLinkStatusForBinding(message, source);
      liveState.linkStatuses.set(nodeId, { ...message, receivedAt: Date.now() });
      if (message.state === "weak" || message.state === "off" || message.state === "offline") {
        liveState.relockRequests.delete(nodeId);
      }
      updateStatusList();
      draw();
    }
  } else if (message.type === "warning" || message.type === "error") {
    appendLiveDebug(`${message.type}: ${message.code || "unknown"} ${message.message || ""}`);
  }
}

function processLiveSerialLine(line) {
  const trimmed = String(line || "").trim();
  if (!trimmed) return;
  liveState.lastMessageAt = Date.now();
  renderLiveControls();

  if (!trimmed.startsWith("{")) {
    recordLiveGcDiagnosticLine(trimmed);
    return;
  }

  try {
    const parsed = JSON.parse(trimmed);
    recordLiveGcDiagnosticLine(trimmed, { parsed });
    handleLiveProtocolMessage(parsed, "serial");
  } catch (err) {
    recordLiveGcDiagnosticLine(trimmed, { parseError: err.message });
    appendLiveDebug(`parse error: ${err.message}`);
  }
}

function processLiveSerialChunk(chunk) {
  liveState.lineBuffer += chunk;
  const lines = liveState.lineBuffer.split(/\r\n|\n|\r/);
  liveState.lineBuffer = lines.pop() ?? "";
  lines.forEach(processLiveSerialLine);
}

async function sendLiveSerialCommand(command, fields = {}) {
  if (isLiveRemoteViewerMode()) {
    appendLiveDebug("command rejected locally: remote live endpoint is read-only");
    renderLiveControls();
    renderLiveGcStatus();
    updateStatusList();
    return null;
  }
  const readOnlyBridgeCommands = new Set(["ping", "get_status", "get_channel_table", "get_assignments"]);
  if (isLiveBridgeMode() && !isLiveBridgeControlAvailable() && !readOnlyBridgeCommands.has(command)) {
    if (command === "clear_all_assignments") liveState.freshSessionPending = false;
    if (command === "rescan_channels") liveState.spectrumRescanPending = false;
    if (command === "start_search") liveState.searchPending = false;
    if (command === "set_radio_profile") liveState.profileApplyPending = false;
    if (command === "clear_assignment" && Number.isFinite(Number(fields.nodeId))) {
      liveState.deleteRequests.delete(Number(fields.nodeId));
    }
    if (command === "relock_drone" && Number.isFinite(Number(fields.nodeId))) {
      liveState.relockRequests.delete(Number(fields.nodeId));
    }
    appendLiveDebug(`command rejected locally: ${liveCommandReadOnlyMessage()}`);
    renderLiveControls();
    renderLiveGcStatus();
    updateStatusList();
    return null;
  }
  if (!liveState.connected || !liveState.port?.writable) {
    if (command === "clear_all_assignments") liveState.freshSessionPending = false;
    if (command === "rescan_channels") liveState.spectrumRescanPending = false;
    if (command === "start_search") liveState.searchPending = false;
    if (command === "set_radio_profile") liveState.profileApplyPending = false;
    if (command === "clear_assignment" && Number.isFinite(Number(fields.nodeId))) {
      liveState.deleteRequests.delete(Number(fields.nodeId));
    }
    if (command === "relock_drone" && Number.isFinite(Number(fields.nodeId))) {
      liveState.relockRequests.delete(Number(fields.nodeId));
    }
    appendLiveDebug("command rejected locally: serial port is not connected");
    renderLiveControls();
    renderLiveGcStatus();
    updateStatusList();
    return null;
  }
  const commandId = `sgc-${String(++liveState.commandSeq).padStart(4, "0")}`;
  const payload = {
    type: "command",
    command,
    commandId,
    ...fields,
  };
  const target = fields.target ? String(fields.target).trim().toLowerCase() : "";
  const direction = target === "magc"
    ? "sgc_to_magc"
    : target === "telegc"
      ? "sgc_to_telegc"
      : "sgc_to_gc";
  liveState.pendingCommands.set(commandId, { command, sentAt: Date.now(), target, direction, ...fields });
  try {
    const writer = liveState.port.writable.getWriter();
    try {
      const encodedPayload = JSON.stringify(payload);
      recordLiveGcDiagnosticLine(encodedPayload, { parsed: payload, direction });
      await writer.write(new TextEncoder().encode(`${encodedPayload}\n`));
    } finally {
      writer.releaseLock();
    }
    appendLiveDebug(`command sent: ${command}`);
    renderLiveGcStatus();
    return commandId;
  } catch (err) {
    liveState.pendingCommands.delete(commandId);
    if (command === "clear_all_assignments") liveState.freshSessionPending = false;
    if (command === "rescan_channels") liveState.spectrumRescanPending = false;
    if (command === "start_search") liveState.searchPending = false;
    if (command === "set_radio_profile") liveState.profileApplyPending = false;
    if (command === "clear_assignment" && Number.isFinite(Number(fields.nodeId))) {
      liveState.deleteRequests.delete(Number(fields.nodeId));
    }
    if (command === "relock_drone" && Number.isFinite(Number(fields.nodeId))) {
      liveState.relockRequests.delete(Number(fields.nodeId));
    }
    appendLiveDebug(`command send failed: ${err.message || err}`);
    renderLiveControls();
    renderLiveGcStatus();
    updateStatusList();
    return null;
  }
}

async function requestLiveGcSnapshot() {
  if (!liveState.connected) return;
  await sendLiveSerialCommand("get_status");
  await sendLiveSerialCommand("get_channel_table");
}

function requestFreshSessionConfirmation() {
  if (liveState.freshSessionPending) return;
  if (isLiveCommandReadOnlyMode()) {
    appendLiveDebug(`fresh session unavailable: ${liveCommandReadOnlyMessage()}`);
    renderLiveControls();
    renderLiveGcStatus();
    return;
  }
  if (!liveState.connected) {
    appendLiveDebug("fresh session unavailable: connect GC serial first");
    renderLiveControls();
    renderLiveGcStatus();
    return;
  }
  liveState.freshSessionConfirming = true;
  appendLiveDebug("fresh session confirmation opened");
  renderLiveControls();
  renderLiveGcStatus();
}

function cancelFreshSessionConfirmation() {
  liveState.freshSessionConfirming = false;
  appendLiveDebug("fresh session cancelled");
  renderLiveControls();
  renderLiveGcStatus();
}

function isTransientLiveFreshSessionForwardFailure(message = {}) {
  const reason = String(message.reason || message.message || "").toLowerCase();
  return reason === "inter_gc_forward_failed" ||
    reason === "magc_link_unavailable" ||
    reason === "timeout" ||
    reason === "command_timeout" ||
    reason.includes("failed to forward") ||
    reason.includes("magc link is not available") ||
    reason.includes("timeout");
}

function clearLiveFreshSessionRetryTimer() {
  if (liveState.freshSessionRetryTimer) {
    window.clearTimeout(liveState.freshSessionRetryTimer);
    liveState.freshSessionRetryTimer = null;
  }
}

function armLiveFreshSessionCommandTimeout(commandId) {
  if (!commandId) return;
  window.setTimeout(() => {
    if (!liveState.pendingCommands.has(commandId)) return;
    liveState.pendingCommands.delete(commandId);
    recordLiveGcDiagnosticEvent("ui_command_timeout", { command: "clear_all_assignments", commandId });
    if (!scheduleFreshSessionRetry({ reason: "command_timeout" })) {
      liveState.freshSessionPending = false;
      clearLiveFreshSessionRetryTimer();
      appendLiveDebug("command timeout: clear_all_assignments");
    }
    renderLiveControls();
    renderLiveGcStatus();
  }, 8000);
}

async function sendFreshSessionClearCommand() {
  const commandId = await sendLiveSerialCommand("clear_all_assignments", {
    target: "magc",
    persist: true,
    reason: "start_fresh_session",
  });
  if (commandId) {
    armLiveFreshSessionCommandTimeout(commandId);
  } else {
    liveState.freshSessionPending = false;
    clearLiveFreshSessionRetryTimer();
    renderLiveControls();
    renderLiveGcStatus();
  }
}

function scheduleFreshSessionRetry(message = {}) {
  if (!liveState.freshSessionPending) return false;
  if (!isTransientLiveFreshSessionForwardFailure(message)) return false;
  if (liveState.freshSessionRetryCount >= LIVE_FRESH_SESSION_RETRY_MAX) return false;
  liveState.freshSessionRetryCount += 1;
  const retryCount = liveState.freshSessionRetryCount;
  const delayMs = LIVE_FRESH_SESSION_RETRY_DELAY_MS * retryCount;
  clearLiveFreshSessionRetryTimer();
  appendLiveDebug(`reset retry ${retryCount}/${LIVE_FRESH_SESSION_RETRY_MAX}: MaGC link busy`);
  liveState.freshSessionRetryTimer = window.setTimeout(() => {
    liveState.freshSessionRetryTimer = null;
    if (!liveState.freshSessionPending) return;
    sendFreshSessionClearCommand();
  }, delayMs);
  return true;
}

async function startFreshSession() {
  if (liveState.freshSessionPending) return;
  if (isLiveCommandReadOnlyMode()) {
    liveState.freshSessionConfirming = false;
    appendLiveDebug(`fresh session unavailable: ${liveCommandReadOnlyMessage()}`);
    renderLiveControls();
    renderLiveGcStatus();
    return;
  }
  if (!liveState.connected) {
    liveState.freshSessionConfirming = false;
    appendLiveDebug("fresh session unavailable: connect GC serial first");
    renderLiveControls();
    renderLiveGcStatus();
    return;
  }
  liveState.freshSessionConfirming = false;
  liveState.freshSessionPending = true;
  liveState.freshSessionRetryCount = 0;
  clearLiveFreshSessionRetryTimer();
  renderLiveControls();
  renderLiveGcStatus();
  await sendFreshSessionClearCommand();
}

async function readLiveSerialLoop() {
  const decoder = new TextDecoder();
  while (liveState.port?.readable && liveState.keepReading) {
    liveState.reader = liveState.port.readable.getReader();
    try {
      while (liveState.keepReading) {
        const { value, done } = await liveState.reader.read();
        if (done) break;
        if (value) processLiveSerialChunk(decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      if (liveState.keepReading) {
        appendLiveDebug(`reader error: ${err.message}`);
        markLiveSerialDisconnected("Serial reader stopped.");
      }
    } finally {
      try {
        liveState.reader?.releaseLock();
      } catch {
        // ignore
      }
      liveState.reader = null;
    }
  }
}

function markLiveSerialDisconnected(reason) {
  recordLiveGcDiagnosticEvent("serial_disconnected", { reason });
  liveState.keepReading = false;
  liveState.connected = false;
  liveState.port = null;
  liveState.reader = null;
  liveState.lineBuffer = "";
  liveState.interGcStatus = null;
  liveState.usbDeviceRole = null;
  liveState.portLabel = liveState.lastSerialPort ? describeLiveSerialPort(liveState.lastSerialPort) : "None";
  setLiveSerialState("error", "Disconnected", reason);
  renderLiveControls();
  renderLiveGcStatus();
  scheduleLiveSerialReconnect(reason);
  ensureLiveRelayForCurrentState();
}

async function openLiveSerialPort({ port = null, auto = false } = {}) {
  recordLiveGcDiagnosticEvent("serial_open_requested", { auto });
  if (!("serial" in navigator)) {
    recordLiveGcDiagnosticEvent("serial_open_rejected", { reason: "web_serial_unavailable" });
    setLiveSerialState("error", "Unsupported", "Web Serial is unavailable in this browser.");
    return;
  }
  if (!auto) {
    liveState.userClosedSerial = false;
    liveState.reconnecting = false;
    clearLiveSerialReconnectTimer();
  }
  try {
    const baudRate = getLiveBaudRate();
    const selectedPort = port || await (async () => {
      setLiveSerialState("waiting", "Selecting", "Choose the GC ESP32 serial port.");
      return navigator.serial.requestPort();
    })();
    rememberLiveSerialPort(selectedPort);
    liveState.portLabel = describeLiveSerialPort(selectedPort);
    setLiveSerialState("waiting", "Opening", `Opening at ${baudRate} baud.`);
    await selectedPort.open({ baudRate });
    liveState.port = selectedPort;
    liveState.connected = true;
    liveState.keepReading = true;
    liveState.reconnecting = false;
    liveState.userClosedSerial = false;
    clearLiveSerialReconnectTimer();
    liveState.lineBuffer = "";
    liveState.gcStatus = null;
    liveState.interGcStatus = null;
    liveState.usbDeviceRole = null;
    liveState.baudRate = baudRate;
    setLiveSerialState(
      "connected",
      "Connected",
      `${auto ? "Auto-connected. " : ""}Reading USB serial at ${baudRate} baud.`
    );
    recordLiveGcDiagnosticEvent("serial_opened", {
      auto,
      baudRate,
      port: liveState.portLabel,
      portInfo: liveState.lastSerialPortInfo,
    });
    renderLiveControls();
    readLiveSerialLoop();
    window.setTimeout(requestLiveGcSnapshot, 150);
    ensureLiveRelayForCurrentState();
  } catch (err) {
    liveState.connected = false;
    liveState.keepReading = false;
    const detail = err.message && err.message.includes("Failed to open serial port")
      ? "Failed to open serial port. Another app may already own it."
      : err.message || "Serial open failed.";
    setLiveSerialState("error", "Disconnected", auto ? `Auto-connect failed: ${detail}` : detail);
    recordLiveGcDiagnosticEvent("serial_open_failed", { auto, reason: detail });
    renderLiveControls();
    if (auto && !liveState.userClosedSerial) {
      scheduleLiveSerialReconnect("auto-connect failed");
    }
  }
}

async function autoConnectRememberedLiveSerialPort() {
  if (!LIVE_POSITION_AUTO_CONNECT || liveState.connected || !("serial" in navigator) || !navigator.serial.getPorts) {
    return;
  }
  try {
    const ports = await navigator.serial.getPorts();
    if (!ports.length) {
      appendLiveDebug("Auto-connect: no remembered serial port. Use Open once to grant COM18.");
      return;
    }
    const espPorts = ports.filter((port) => {
      const info = typeof port.getInfo === "function" ? port.getInfo() : {};
      return info.usbVendorId === 0x303a && info.usbProductId === 0x1001;
    });
    const candidates = espPorts.length ? espPorts : ports;
    if (candidates.length !== 1) {
      appendLiveDebug(`Auto-connect skipped: ${candidates.length} remembered serial ports. Use Open to choose COM18.`);
      return;
    }
    await openLiveSerialPort({ port: candidates[0], auto: true });
  } catch (err) {
    appendLiveDebug(`Auto-connect error: ${err.message || err}`);
  }
}

async function closeLiveSerialPort() {
  recordLiveGcDiagnosticEvent("serial_close_requested");
  liveState.userClosedSerial = true;
  liveState.reconnecting = false;
  clearLiveSerialReconnectTimer();
  liveState.keepReading = false;
  try {
    if (liveState.reader) await liveState.reader.cancel();
  } catch (err) {
    appendLiveDebug(`reader cancel warning: ${err.message}`);
  }
  try {
    if (liveState.port) await liveState.port.close();
  } catch (err) {
    appendLiveDebug(`close warning: ${err.message}`);
  }
  liveState.port = null;
  liveState.reader = null;
  liveState.connected = false;
  liveState.portLabel = "None";
  liveState.lineBuffer = "";
  liveState.interGcStatus = null;
  liveState.usbDeviceRole = null;
  setLiveSerialState("waiting", "Disconnected", "Ready to open the GC ESP32 serial port.");
  renderLiveControls();
  renderLiveGcStatus();
  ensureLiveRelayForCurrentState();
}

function setLiveDebugState(message) {
  liveState.debugStateText = message || "Idle";
  renderLiveControls();
}

async function sendLiveTargetDebugCommand(target, command, fields = {}) {
  const commandId = await sendLiveSerialCommand(command, { target, ...fields });
  setLiveDebugState(commandId ? `${target} ${command}` : "Command rejected");
  return commandId;
}

function processLiveDroneDebugLine(rawLine, { direction = "drone_to_sgc" } = {}) {
  const line = String(rawLine || "").trim();
  if (!line) return;
  let parsed = null;
  try {
    parsed = JSON.parse(line);
  } catch (err) {
    recordLiveGcDiagnosticLine(line, {
      parseError: err.message,
      direction,
    });
    appendLiveDebug(`drone parse error: ${err.message}`);
    return;
  }
  recordLiveGcDiagnosticLine(line, {
    parsed,
    direction,
  });
  if (parsed.type === "drone_debug_status") {
    liveState.droneDebugStatus = { ...parsed, receivedAt: Date.now() };
    liveState.droneDebugTelemetryPaused = parsed.telemetryPaused === true;
  } else if (parsed.type === "drone_debug_event") {
    appendLiveDebug(`drone debug: ${String(parsed.event || "event").replaceAll("_", " ")}`);
    if (parsed.telemetryPaused !== undefined) {
      liveState.droneDebugTelemetryPaused = parsed.telemetryPaused === true;
    }
  } else if (parsed.type === "command_ack" && parsed.commandId && liveState.droneDebugPendingCommands.has(parsed.commandId)) {
    const pending = liveState.droneDebugPendingCommands.get(parsed.commandId);
    liveState.droneDebugPendingCommands.delete(parsed.commandId);
    const ackLatencyMs = Math.max(0, Date.now() - Number(pending.sentAt || Date.now()));
    recordLiveGcDiagnosticEvent("drone_command_ack_matched", {
      commandId: parsed.commandId,
      command: parsed.command,
      accepted: parsed.accepted === true,
      ackLatencyMs,
      sourceRole: parsed.sourceRole || "drone",
      target: "drone",
    });
    appendLiveDebug(`${parsed.accepted ? "drone ok" : "drone rejected"}: ${parsed.command || pending.command}`);
  }
  renderLiveControls();
}

function processLiveDroneDebugChunk(chunk) {
  liveState.droneDebugLineBuffer += chunk;
  const lines = liveState.droneDebugLineBuffer.split(/\r\n|\n|\r/);
  liveState.droneDebugLineBuffer = lines.pop() ?? "";
  lines.forEach(processLiveDroneDebugLine);
}

async function readLiveDroneDebugLoop() {
  const decoder = new TextDecoder();
  while (liveState.droneDebugPort?.readable && liveState.droneDebugKeepReading) {
    liveState.droneDebugReader = liveState.droneDebugPort.readable.getReader();
    try {
      while (liveState.droneDebugKeepReading) {
        const { value, done } = await liveState.droneDebugReader.read();
        if (done) break;
        if (value) processLiveDroneDebugChunk(decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      if (liveState.droneDebugKeepReading) {
        appendLiveDebug(`drone reader error: ${err.message || err}`);
      }
    } finally {
      try {
        liveState.droneDebugReader?.releaseLock();
      } catch {
        // ignore
      }
      liveState.droneDebugReader = null;
    }
  }
}

async function openLiveDroneDebugSerialPort() {
  if (!liveState.debugEnabled) return;
  if (!("serial" in navigator)) {
    appendLiveDebug("drone serial unavailable: Web Serial unsupported");
    return;
  }
  try {
    const baudRate = getLiveBaudRate();
    const port = await navigator.serial.requestPort();
    liveState.droneDebugPortLabel = describeLiveSerialPort(port);
    await port.open({ baudRate });
    liveState.droneDebugPort = port;
    liveState.droneDebugConnected = true;
    liveState.droneDebugKeepReading = true;
    liveState.droneDebugLineBuffer = "";
    recordLiveGcDiagnosticEvent("drone_serial_opened", {
      baudRate,
      port: liveState.droneDebugPortLabel,
      portInfo: getLiveSerialPortInfo(port),
    });
    appendLiveDebug(`drone serial opened: ${liveState.droneDebugPortLabel}`);
    renderLiveControls();
    readLiveDroneDebugLoop();
    window.setTimeout(() => sendLiveDroneDebugCommand("get_status"), 150);
  } catch (err) {
    appendLiveDebug(`drone serial open failed: ${err.message || err}`);
    recordLiveGcDiagnosticEvent("drone_serial_open_failed", { reason: err.message || String(err) });
    liveState.droneDebugConnected = false;
    renderLiveControls();
  }
}

async function closeLiveDroneDebugSerialPort() {
  liveState.droneDebugKeepReading = false;
  try {
    if (liveState.droneDebugReader) await liveState.droneDebugReader.cancel();
  } catch (err) {
    appendLiveDebug(`drone reader cancel warning: ${err.message || err}`);
  }
  try {
    if (liveState.droneDebugPort) await liveState.droneDebugPort.close();
  } catch (err) {
    appendLiveDebug(`drone close warning: ${err.message || err}`);
  }
  liveState.droneDebugPort = null;
  liveState.droneDebugReader = null;
  liveState.droneDebugConnected = false;
  liveState.droneDebugLineBuffer = "";
  liveState.droneDebugStatus = null;
  recordLiveGcDiagnosticEvent("drone_serial_closed");
  renderLiveControls();
}

async function sendLiveDroneDebugCommand(command, fields = {}) {
  if (!liveState.droneDebugConnected || !liveState.droneDebugPort?.writable) {
    appendLiveDebug("drone command rejected locally: drone serial is not connected");
    return null;
  }
  const commandId = `sgc-drone-${String(++liveState.droneDebugCommandSeq).padStart(4, "0")}`;
  const payload = {
    type: "command",
    command,
    commandId,
    ...fields,
  };
  liveState.droneDebugPendingCommands.set(commandId, { command, sentAt: Date.now(), ...fields });
  try {
    const writer = liveState.droneDebugPort.writable.getWriter();
    try {
      const encodedPayload = JSON.stringify(payload);
      recordLiveGcDiagnosticLine(encodedPayload, { parsed: payload, direction: "sgc_to_drone" });
      await writer.write(new TextEncoder().encode(`${encodedPayload}\n`));
    } finally {
      writer.releaseLock();
    }
    appendLiveDebug(`drone command sent: ${command}`);
    return commandId;
  } catch (err) {
    liveState.droneDebugPendingCommands.delete(commandId);
    appendLiveDebug(`drone command failed: ${err.message || err}`);
    return null;
  }
}

function normalizeLiveDroneWifiBaseUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw.includes("://") ? raw : `http://${raw}`);
    if (!url.port) url.port = "8080";
    url.pathname = "";
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

function readLiveDroneWifiHost() {
  const input = document.getElementById("liveDebugDroneWifiHost");
  const host = String(input?.value || liveState.droneWifiHost || "simple-mesh-7.local").trim();
  liveState.droneWifiHost = host || "simple-mesh-7.local";
  try {
    window.localStorage?.setItem(LIVE_DRONE_WIFI_HOST_STORAGE_KEY, liveState.droneWifiHost);
  } catch {
    // Wi-Fi debug host persistence is optional.
  }
  return liveState.droneWifiHost;
}

function processLiveDroneWifiResponse(text) {
  String(text || "")
    .split(/\r\n|\n|\r/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => processLiveDroneDebugLine(line, { direction: "drone_wifi_to_sgc" }));
}

async function sendLiveDroneWifiDebugCommand(command, fields = {}) {
  if (!liveState.debugEnabled) return null;
  const host = readLiveDroneWifiHost();
  const baseUrl = normalizeLiveDroneWifiBaseUrl(host);
  if (!baseUrl) {
    appendLiveDebug("drone Wi-Fi host is invalid");
    return null;
  }
  const commandId = `sgc-drone-wifi-${String(++liveState.droneDebugCommandSeq).padStart(4, "0")}`;
  const payload = {
    type: "command",
    command,
    commandId,
    ...fields,
  };
  const encodedPayload = JSON.stringify(payload);
  liveState.droneDebugPendingCommands.set(commandId, { command, sentAt: Date.now(), transport: "wifi", ...fields });
  liveState.droneWifiBusy = true;
  liveState.droneWifiStateText = "Sending...";
  renderLiveControls();
  recordLiveGcDiagnosticLine(encodedPayload, { parsed: payload, direction: "sgc_to_drone_wifi" });
  try {
    const response = await fetch(`${baseUrl}/debug/command`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: encodedPayload,
    });
    const text = await response.text();
    processLiveDroneWifiResponse(text);
    liveState.droneWifiStateText = response.ok ? "OK" : `HTTP ${response.status}`;
    appendLiveDebug(`drone Wi-Fi ${response.ok ? "ok" : "rejected"}: ${command}`);
    return commandId;
  } catch (err) {
    liveState.droneDebugPendingCommands.delete(commandId);
    liveState.droneWifiStateText = "Failed";
    appendLiveDebug(`drone Wi-Fi command failed: ${err.message || err}`);
    recordLiveGcDiagnosticEvent("drone_wifi_command_failed", {
      commandId,
      command,
      host,
      reason: err.message || String(err),
    });
    return null;
  } finally {
    liveState.droneWifiBusy = false;
    renderLiveControls();
  }
}

function stopLivePositionMock({ clearDrones = false, clearStatus = false } = {}) {
  liveState.mockTimers.forEach((timerId) => clearTimeout(timerId));
  liveState.mockTimers = [];
  liveState.mockActive = false;
  if (clearStatus && liveState.gcStatus?.scanMode === "mock_live_position") {
    liveState.gcStatus = null;
  }
  if (clearDrones) {
    drones = [];
    pinnedDroneId = null;
    hoveredDroneId = null;
    stopLiveDroneFollow();
  }
  renderLiveControls();
  updateStatusList();
  draw();
}

function scheduleLiveMockTick(drone, rng) {
  const timerId = setTimeout(() => {
    liveState.mockTimers = liveState.mockTimers.filter((id) => id !== timerId);
    if (!liveState.mockActive) return;
    const latest = drone.getLatest();
    if (!latest) return;
    const delayHint = rng();
    const speed = Math.max(1.5, (latest.groundSpeed || 4.2) + (rng() - 0.5) * 0.8);
    const heading = (latest.heading + (rng() - 0.5) * 14 + 360) % 360;
    const moved = destinationLatLng(latest.lat, latest.lng, heading, speed * 0.32);
    const yaw = (heading - 3 + (rng() - 0.5) * 2 + 360) % 360;
    drone.updateTelemetry({
      uptimeSec: (latest.uptimeSec || 0) + 0.32,
      lat: moved.lat,
      lng: moved.lng,
      alt: Math.max(0, latest.alt + (rng() - 0.5) * 0.5),
      heading,
      headingSource: "course_over_ground",
      courseOverGround: heading,
      yaw,
      groundSpeed: speed,
      satelliteCount: Math.max(7, Math.min(18, Math.round((latest.satelliteCount || 12) + (rng() - 0.5) * 2))),
      rssi: Math.max(-118, Math.min(-55, (latest.rssi || -82) + (rng() - 0.5) * 2)),
      snr: Math.max(-6, Math.min(14, (latest.snr || 9) + (rng() - 0.5) * 0.8)),
      frequencyMhz: latest.frequencyMhz,
      radioProfileId: latest.radioProfileId ?? 0,
      txPeriodMs: latest.txPeriodMs ?? 27,
      telemetryAirtimeMs: latest.telemetryAirtimeMs ?? 25.7,
      expectedUpdateMs: latest.expectedUpdateMs ?? 320,
      sequenceId: (latest.sequenceId || 0) + 1,
      gcMillis: Math.round((latest.gcMillis || 0) + 320),
      command: "Mock live telemetry",
      armed: true,
    });
    queueLiveDroneFollowCenter(drone);
    updateStatusList();
    draw();
    const nextDelay = delayHint < 0.03 ? 5600 : delayHint < 0.12 ? 1800 : 220 + rng() * 260;
    scheduleLiveMockTick(drone, rng);
  }, 220 + rng() * 260);
  liveState.mockTimers.push(timerId);
}

function startLivePositionMock() {
  stopLivePositionMock({ clearDrones: true });
  liveState.mockActive = true;
  liveState.mockEnabled = true;
  liveState.serialTelemetrySeen = false;
  liveState.gcStatus = {
    type: "gc_status",
    nodeId: 0,
    radioProfileId: 0,
    sharedFrequencyMhz: 915.0,
    spreadingFactor: 8,
    bandwidthHz: 500000,
    codingRate: 5,
    discoverySpreadingFactor: 11,
    discoveryBandwidthHz: 250000,
    discoveryCodingRate: 8,
    discoverySilenceAirtimeMs: 231.4,
    discoveryJoinRequestAirtimeMs: 231.4,
    discoveryJoinAssignAirtimeMs: 297.0,
    discoveryJoinAckAirtimeMs: 231.4,
    txPowerDbm: 22,
    telemetryAirtimeMs: 25.7,
    txPeriodMs: 100,
    assignedDrones: 5,
    clearChannels: 48,
    scanMode: "mock_live_position",
    gcMillis: 0,
  };

  const rng = makeRng(0x51A7E11);
  const center = { lat: 32.0596637, lng: 34.8503487 };
  for (let i = 1; i <= 5; i++) {
    const d = new Drone(i, { type: "live-mock" });
    const heading = (70 + i * 37) % 360;
    d.updateTelemetry({
      uptimeSec: 0,
      lat: center.lat + (rng() - 0.5) * 0.006,
      lng: center.lng + (rng() - 0.5) * 0.006,
      alt: 10 + i * 2,
      heading,
      headingSource: "course_over_ground",
      courseOverGround: heading,
      yaw: (heading - 3 + 360) % 360,
      groundSpeed: 3.4 + i * 0.35,
      satelliteCount: 10 + i,
      rssi: -78 - i * 2,
      snr: 10.5 - i * 0.4,
      frequencyMhz: 916.0 + i * 0.5,
      radioProfileId: 0,
      txPeriodMs: 100,
      telemetryAirtimeMs: 25.7,
      expectedUpdateMs: 320,
      sequenceId: 1,
      gcMillis: 0,
      command: "Mock live telemetry",
      armed: true,
    });
    drones.push(d);
    scheduleLiveMockTick(d, rng);
  }
  renderLiveControls();
  renderLiveGcStatus();
  updateStatusList();
  if (map && drones.length) {
    const bounds = L.latLngBounds(drones.map((d) => [d.current.lat, d.current.lng]));
    map.fitBounds(bounds, { padding: [80, 80], maxZoom: 15, animate: false });
  }
  draw();
}

function toggleLiveMock() {
  if (liveState.mockActive) {
    liveState.mockEnabled = false;
    stopLivePositionMock({ clearDrones: true });
  } else {
    startLivePositionMock();
  }
}

function renderLiveHomeTool() {
  if (!LIVE_POSITION_MODE) return;
  let button = document.getElementById("liveHomeToolBtn");
  if (button && button.parentNode) button.parentNode.removeChild(button);
}

function closeLiveMapMenu() {
  if (liveMapMenuEl && liveMapMenuEl.parentNode) {
    liveMapMenuEl.parentNode.removeChild(liveMapMenuEl);
  }
  liveMapMenuEl = null;
  pendingLiveMapPlacement = null;
  document.removeEventListener("pointerdown", handleLiveMapMenuOutsideClick, true);
}

function closeDistanceMeasurementMenu() {
  if (distanceMeasurementMenuEl && distanceMeasurementMenuEl.parentNode) {
    distanceMeasurementMenuEl.parentNode.removeChild(distanceMeasurementMenuEl);
  }
  distanceMeasurementMenuEl = null;
  document.removeEventListener("pointerdown", handleDistanceMeasurementMenuOutsideClick, true);
}

function handleDistanceMeasurementMenuOutsideClick(event) {
  if (!distanceMeasurementMenuEl) return;
  if (distanceMeasurementMenuEl.contains(event.target)) return;
  closeDistanceMeasurementMenu();
}

function showDistanceMeasurementHelper() {
  const host = document.getElementById("app") || document.body;
  if (!distanceMeasurementHelperEl) {
    distanceMeasurementHelperEl = document.createElement("div");
    distanceMeasurementHelperEl.className = "distance-measure-helper";
    distanceMeasurementHelperEl.textContent = "Choose endpoint for distance measurement";
  }
  if (!distanceMeasurementHelperEl.parentNode) {
    host.appendChild(distanceMeasurementHelperEl);
  }
  window.addEventListener("keydown", handleDistanceMeasurementKeydown, true);
}

function hideDistanceMeasurementHelper() {
  if (distanceMeasurementHelperEl && distanceMeasurementHelperEl.parentNode) {
    distanceMeasurementHelperEl.parentNode.removeChild(distanceMeasurementHelperEl);
  }
  window.removeEventListener("keydown", handleDistanceMeasurementKeydown, true);
}

function handleDistanceMeasurementKeydown(event) {
  if (!pendingDistanceMeasurement || event.key !== "Escape") return;
  event.preventDefault();
  event.stopPropagation();
  cancelPendingDistanceMeasurement();
  suppressMapClickUntil = performance.now() + 300;
  longPressSuppressUntil = performance.now() + 300;
}

function cancelPendingDistanceMeasurement() {
  pendingDistanceMeasurement = null;
  hideDistanceMeasurementHelper();
  forceRedraw();
}

function startDistanceMeasurement(latlng) {
  if (!LIVE_POSITION_MODE || !latlng) return;
  const startLat = Number(latlng.lat);
  const startLng = Number(latlng.lng);
  if (!isFinite(startLat) || !isFinite(startLng)) return;
  closeDistanceMeasurementMenu();
  pendingDistanceMeasurement = { startLat, startLng };
  showDistanceMeasurementHelper();
  forceRedraw();
}

function updatePendingDistanceMeasurementPreview(latlng) {
  if (!pendingDistanceMeasurement || !latlng) return;
  const previewLat = Number(latlng.lat);
  const previewLng = Number(latlng.lng);
  if (!isFinite(previewLat) || !isFinite(previewLng)) return;
  pendingDistanceMeasurement.previewLat = previewLat;
  pendingDistanceMeasurement.previewLng = previewLng;
  draw();
}

function completeDistanceMeasurement(latlng) {
  if (!pendingDistanceMeasurement || !latlng) return false;
  const endLat = Number(latlng.lat);
  const endLng = Number(latlng.lng);
  if (!isFinite(endLat) || !isFinite(endLng)) return false;
  distanceMeasurements.push({
    id: nextDistanceMeasurementId++,
    startLat: pendingDistanceMeasurement.startLat,
    startLng: pendingDistanceMeasurement.startLng,
    endLat,
    endLng,
    createdAt: Date.now(),
  });
  pendingDistanceMeasurement = null;
  hideDistanceMeasurementHelper();
  suppressMapClickUntil = performance.now() + 250;
  longPressSuppressUntil = performance.now() + 250;
  forceRedraw();
  return true;
}

function deleteDistanceMeasurement(id) {
  const numericId = Number(id);
  distanceMeasurements = distanceMeasurements.filter((measurement) => measurement.id !== numericId);
  closeDistanceMeasurementMenu();
  forceRedraw();
}

function pointToSegmentDistancePx(point, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 <= 0.0001) {
    return Math.hypot(point.x - a.x, point.y - a.y);
  }
  const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / len2));
  const x = a.x + dx * t;
  const y = a.y + dy * t;
  return Math.hypot(point.x - x, point.y - y);
}

function pointInRotatedRect(point, rect) {
  if (!rect) return false;
  const cos = Math.cos(-rect.angle);
  const sin = Math.sin(-rect.angle);
  const dx = point.x - rect.cx;
  const dy = point.y - rect.cy;
  const localX = dx * cos - dy * sin;
  const localY = dx * sin + dy * cos;
  return Math.abs(localX) <= rect.width / 2 && Math.abs(localY) <= rect.height / 2;
}

function findDistanceMeasurementHit(containerPoint) {
  if (!containerPoint || !distanceMeasurementHitRegions.length) return null;
  for (let i = distanceMeasurementHitRegions.length - 1; i >= 0; i--) {
    const hit = distanceMeasurementHitRegions[i];
    if (!hit || !hit.measurement) continue;
    if (hit.labelRect && pointInRotatedRect(containerPoint, hit.labelRect)) {
      return hit.measurement;
    }
    if (hit.start && hit.end && pointToSegmentDistancePx(containerPoint, hit.start, hit.end) <= 12) {
      return hit.measurement;
    }
  }
  return null;
}

function openDistanceMeasurementMenu(measurement, containerPoint) {
  if (!measurement || !containerPoint || !map) return;
  const host = document.getElementById("app") || document.body;
  closeLiveMapMenu();
  closeDistanceMeasurementMenu();
  closeGroundStationMenu(false);
  closeGroundStationNameMenu();
  closeLiveDroneActionSheet();

  distanceMeasurementMenuEl = document.createElement("div");
  distanceMeasurementMenuEl.className = "relative-menu distance-measure-menu";
  distanceMeasurementMenuEl.addEventListener("pointerdown", (event) => event.stopPropagation());
  host.appendChild(distanceMeasurementMenuEl);
  enableMenuDrag(distanceMeasurementMenuEl);

  distanceMeasurementMenuEl.innerHTML = `
    <div class="menu-head">
      <h4>Distance</h4>
    </div>
    <div class="command-list cmd-action-list column" style="margin-top:2px;">
      <button class="cmd-chip cmd-action danger" data-action="delete-distance-measurement" type="button">Delete</button>
    </div>
  `;

  const mapRect = map.getContainer().getBoundingClientRect();
  const menuW = distanceMeasurementMenuEl.offsetWidth || 240;
  const menuH = distanceMeasurementMenuEl.offsetHeight || 110;
  const pad = 10;
  const left = Math.max(pad, Math.min(window.innerWidth - menuW - pad, mapRect.left + containerPoint.x + 12));
  const top = Math.max(pad, Math.min(window.innerHeight - menuH - pad, mapRect.top + containerPoint.y - 10));
  distanceMeasurementMenuEl.style.left = `${left}px`;
  distanceMeasurementMenuEl.style.top = `${top}px`;

  const deleteBtn = distanceMeasurementMenuEl.querySelector("[data-action='delete-distance-measurement']");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteDistanceMeasurement(measurement.id);
      suppressMapClickUntil = performance.now() + 350;
      longPressSuppressUntil = performance.now() + 350;
    });
  }

  document.addEventListener("pointerdown", handleDistanceMeasurementMenuOutsideClick, true);
}

function handleLiveMapMenuOutsideClick(event) {
  if (!liveMapMenuEl) return;
  if (liveMapMenuEl.contains(event.target)) return;
  closeLiveMapMenu();
}

function openLiveMapMenu(latlng, containerPoint) {
  if (!LIVE_POSITION_MODE || !map || !latlng || !containerPoint) return;
  const lat = Number(latlng.lat);
  const lng = Number(latlng.lng);
  if (!isFinite(lat) || !isFinite(lng)) return;

  const host = document.getElementById("app") || document.body;
  activeGroundStationId = null;
  cancelPendingDistanceMeasurement();
  closeLiveMapMenu();
  closeDistanceMeasurementMenu();
  closeLiveDroneActionSheet();
  closeUserHomePrompt();
  closeGroundStationMenu(false);
  closeGroundStationNameMenu();
  closeWaypointMenu(false, true);
  closeOrbitMenu(false, true);
  closeHomeMenu(false);
  closeFollowMenu(false);
  closeRelationMenu(false);
  closeSequenceMenu();

  pendingLiveMapPlacement = { lat, lng };
  liveMapMenuEl = document.createElement("div");
  liveMapMenuEl.className = "relative-menu";
  liveMapMenuEl.addEventListener("pointerdown", (event) => event.stopPropagation());
  host.appendChild(liveMapMenuEl);
  enableMenuDrag(liveMapMenuEl);

  liveMapMenuEl.innerHTML = `
    <div class="menu-head">
      <h4>Map</h4>
      <span class="menu-eta">${lat.toFixed(5)}, ${lng.toFixed(5)}</span>
    </div>
    <div class="command-list cmd-action-list column" style="margin-top:2px;">
      <button class="cmd-chip cmd-action" data-action="set-live-home" type="button" ${
        isLiveRemoteViewerMode() ? "disabled" : ""
      }>Set HOME here</button>
      <button class="cmd-chip cmd-action" data-action="measure-distance" type="button">Measure distance</button>
    </div>
  `;

  const mapRect = map.getContainer().getBoundingClientRect();
  liveMapMenuEl.style.left = `${mapRect.left + containerPoint.x + 12}px`;
  liveMapMenuEl.style.top = `${mapRect.top + containerPoint.y - 10}px`;

  const setHome = liveMapMenuEl.querySelector("[data-action='set-live-home']");
  if (setHome) {
    setHome.addEventListener("click", (event) => {
      event.stopPropagation();
      if (isLiveRemoteViewerMode()) return;
      const placement = pendingLiveMapPlacement;
      if (!placement) return;
      closeLiveMapMenu();
      addUserHomeAtLatLng(placement);
      suppressMapClickUntil = performance.now() + 450;
      longPressSuppressUntil = performance.now() + 450;
    });
  }

  const measureDistance = liveMapMenuEl.querySelector("[data-action='measure-distance']");
  if (measureDistance) {
    measureDistance.addEventListener("click", (event) => {
      event.stopPropagation();
      const placement = pendingLiveMapPlacement;
      if (!placement) return;
      closeLiveMapMenu();
      startDistanceMeasurement(placement);
      suppressMapClickUntil = performance.now() + 250;
      longPressSuppressUntil = performance.now() + 250;
    });
  }

  document.addEventListener("pointerdown", handleLiveMapMenuOutsideClick, true);
}

function closeLiveDroneActionSheet() {
  const sheet = liveState.droneActionSheet;
  if (sheet && sheet.parentNode) sheet.parentNode.removeChild(sheet);
  liveState.droneActionSheet = null;
  document.removeEventListener("pointerdown", handleLiveDroneActionSheetOutsideClick, true);
}

function handleLiveDroneActionSheetOutsideClick(event) {
  const sheet = liveState.droneActionSheet;
  if (!sheet) return;
  if (sheet.contains(event.target)) return;
  closeLiveDroneActionSheet();
}

function canDeleteLiveDrone(drone) {
  if (!drone) return false;
  const freshness = getLiveFreshnessState(drone);
  return getLiveDisplayState(drone, freshness) !== "fresh";
}

async function requestLiveDroneDelete(nodeId) {
  const id = Number(nodeId);
  const drone = getDroneById(id);
  if (!Number.isFinite(id) || !drone || !canDeleteLiveDrone(drone)) return;
  if (isLiveCommandReadOnlyMode()) {
    appendLiveDebug(`delete unavailable: ${liveCommandReadOnlyMessage()} node ${id}`);
    return;
  }
  if (!liveState.connected) {
    appendLiveDebug(`delete unavailable: connect GC serial first for node ${id}`);
    return;
  }
  const name = getLiveDroneDisplayName(id);
  if (!window.confirm(`Delete ${name}'s persisted assignment and remove it from this session?`)) return;
  liveState.deleteRequests.set(id, { sentAt: Date.now() });
  updateStatusList();
  const commandId = await sendLiveSerialCommand("clear_assignment", { nodeId: id });
  if (commandId) {
    liveState.deleteRequests.set(id, { sentAt: Date.now(), commandId });
    window.setTimeout(() => {
      const pending = liveState.deleteRequests.get(id);
      if (!pending || pending.commandId !== commandId) return;
      liveState.deleteRequests.delete(id);
      if (liveState.pendingCommands.has(commandId)) {
        liveState.pendingCommands.delete(commandId);
        appendLiveDebug(`command timeout: clear_assignment node ${id}`);
      }
      updateStatusList();
    }, 8000);
  } else {
    liveState.deleteRequests.delete(id);
    updateStatusList();
  }
}

function openLiveDroneActionSheet(drone, anchor = null) {
  if (!drone) return;
  closeLiveDroneActionSheet();
  const host = document.getElementById("app") || document.body;
  const sheet = document.createElement("div");
  sheet.className = "live-drone-actions";
  sheet.addEventListener("pointerdown", (event) => event.stopPropagation());

  const title = document.createElement("div");
  title.className = "live-drone-actions-title";
  const secondary = getLiveDroneSecondaryName(drone.id);
  const titleName = document.createElement("strong");
  titleName.textContent = getLiveDroneDisplayName(drone.id);
  title.appendChild(titleName);
  if (secondary) {
    const secondaryEl = document.createElement("span");
    secondaryEl.textContent = secondary;
    title.appendChild(secondaryEl);
  }
  sheet.appendChild(title);

  const actions = document.createElement("div");
  actions.className = "live-drone-actions-grid";

  const renameBtn = document.createElement("button");
  renameBtn.className = "live-btn";
  renameBtn.type = "button";
  renameBtn.textContent = "Rename";
  renameBtn.disabled = isLiveRemoteViewerMode();
  renameBtn.title = isLiveRemoteViewerMode() ? "Remote live endpoint is read-only." : "";
  renameBtn.addEventListener("click", () => {
    if (isLiveRemoteViewerMode()) return;
    const next = window.prompt("Drone name", getLiveDroneAlias(drone.id) || `Drone ${drone.id}`);
    if (next !== null) setLiveDroneAlias(drone.id, next);
    closeLiveDroneActionSheet();
  });
  actions.appendChild(renameBtn);

  const relockBtn = document.createElement("button");
  relockBtn.className = "live-btn";
  relockBtn.type = "button";
  relockBtn.textContent = "Re-bind";
  relockBtn.disabled = isLiveCommandReadOnlyMode();
  relockBtn.title = liveCommandReadOnlyMessage();
  relockBtn.addEventListener("click", () => {
    requestLiveDroneRelock(drone.id);
    closeLiveDroneActionSheet();
  });
  actions.appendChild(relockBtn);

  if (canDeleteLiveDrone(drone)) {
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "live-btn live-danger-btn";
    deleteBtn.type = "button";
    deleteBtn.textContent = liveState.deleteRequests.has(Number(drone.id)) ? "Deleting..." : "Delete";
    deleteBtn.disabled = isLiveCommandReadOnlyMode() || liveState.deleteRequests.has(Number(drone.id));
    deleteBtn.title = liveCommandReadOnlyMessage();
    deleteBtn.addEventListener("click", () => {
      requestLiveDroneDelete(drone.id);
      closeLiveDroneActionSheet();
    });
    actions.appendChild(deleteBtn);
  }

  sheet.appendChild(actions);
  host.appendChild(sheet);
  liveState.droneActionSheet = sheet;

  if (anchor && Number.isFinite(anchor.x) && Number.isFinite(anchor.y)) {
    const rect = host.getBoundingClientRect();
    const w = sheet.offsetWidth || 260;
    sheet.style.left = `${Math.max(10, Math.min(rect.width - w - 10, anchor.x - w / 2))}px`;
    sheet.style.transform = "none";
  }

  setTimeout(() => document.addEventListener("pointerdown", handleLiveDroneActionSheetOutsideClick, true), 0);
}

function attachLiveDroneLongPress(row, drone) {
  let timer = null;
  let start = null;
  const clear = () => {
    if (timer) {
      window.clearTimeout(timer);
      timer = null;
    }
    start = null;
  };
  row.addEventListener("pointerdown", (event) => {
    if (typeof event.button === "number" && event.button !== 0) return;
    clear();
    start = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
    timer = window.setTimeout(() => {
      timer = null;
      suppressStatusClickUntil = performance.now() + 650;
      openLiveDroneActionSheet(drone, { x: event.clientX, y: event.clientY });
    }, LIVE_DRONE_ACTION_LONGPRESS_MS);
  }, true);
  row.addEventListener("pointermove", (event) => {
    if (!timer || !start) return;
    if (event.pointerId !== undefined && start.pointerId !== undefined && event.pointerId !== start.pointerId) return;
    if (Math.hypot((event.clientX || 0) - start.x, (event.clientY || 0) - start.y) > 10) clear();
  }, true);
  row.addEventListener("pointerup", clear, true);
  row.addEventListener("pointercancel", clear, true);
  row.addEventListener("pointerleave", clear, true);
}

function getLiveEmptyStatusMessage() {
  if (isLiveRemoteViewerMode()) {
    if (liveState.relayConnected) return "Waiting for live endpoint telemetry.";
    return "Connect Live Endpoint to receive telemetry.";
  }
  if (isLiveRelayBroadcastMode() && liveState.relayConnected && !liveState.connected) {
    return "Open USB serial to broadcast telemetry.";
  }
  return liveState.connected ? "Waiting for drone telemetry." : "Open USB serial to receive telemetry.";
}

function initLivePositionUi() {
  if (!LIVE_POSITION_MODE) return;
  const openBtn = document.getElementById("liveSerialOpenBtn");
  const closeBtn = document.getElementById("liveSerialCloseBtn");
  const resetBtn = document.getElementById("liveResetSessionBtn");
  const searchBtn = document.getElementById("liveSearchBtn");
  const sourceEl = document.getElementById("liveTelemetrySource");
  const relayConnectBtn = document.getElementById("liveRelayConnectBtn");
  const relayDisconnectBtn = document.getElementById("liveRelayDisconnectBtn");
  const endpointEl = document.getElementById("liveRelayEndpoint");
  const sessionEl = document.getElementById("liveRelaySessionId");
  const tokenEl = document.getElementById("liveRelayPublishToken");
  const logDownloadBtn = document.getElementById("liveGcLogDownloadBtn");
  const logClearBtn = document.getElementById("liveGcLogClearBtn");
  const droneWifiHostEl = document.getElementById("liveDebugDroneWifiHost");
  document.body.classList.toggle("live-debug-enabled", liveState.debugEnabled);
  openBtn?.addEventListener("click", () => openLiveSerialPort());
  closeBtn?.addEventListener("click", closeLiveSerialPort);
  resetBtn?.addEventListener("click", requestFreshSessionConfirmation);
  searchBtn?.addEventListener("click", startLiveSearchMode);
  logDownloadBtn?.addEventListener("click", exportLiveGcDiagnosticLog);
  logClearBtn?.addEventListener("click", clearLiveGcDiagnosticLog);
  sourceEl?.addEventListener("change", () => setLiveTelemetrySourceMode(sourceEl.value));
  relayConnectBtn?.addEventListener("click", () => connectLiveRelay());
  relayDisconnectBtn?.addEventListener("click", () => closeLiveRelayConnection({ user: true }));
  document.getElementById("liveDebugTeleGcStatusBtn")?.addEventListener("click", () => sendLiveTargetDebugCommand("telegc", "get_status"));
  document.getElementById("liveDebugMaGcStatusBtn")?.addEventListener("click", () => sendLiveTargetDebugCommand("magc", "get_status"));
  document.getElementById("liveDebugMaGcBindBtn")?.addEventListener("click", () => sendLiveTargetDebugCommand("magc", "start_search"));
  document.getElementById("liveDebugMaGcCancelBtn")?.addEventListener("click", () => sendLiveTargetDebugCommand("magc", "cancel_search"));
  document.getElementById("liveDebugDroneOpenBtn")?.addEventListener("click", openLiveDroneDebugSerialPort);
  document.getElementById("liveDebugDroneCloseBtn")?.addEventListener("click", closeLiveDroneDebugSerialPort);
  document.getElementById("liveDebugDroneHoldBtn")?.addEventListener("click", () => sendLiveDroneDebugCommand("debug_join_control", { joinMode: "hold" }));
  document.getElementById("liveDebugDroneJoinBtn")?.addEventListener("click", () => sendLiveDroneDebugCommand("debug_send_join_request"));
  document.getElementById("liveDebugDroneRestartHoldBtn")?.addEventListener("click", () => sendLiveDroneDebugCommand("debug_restart_join", { hold: true }));
  document.getElementById("liveDebugDronePauseBtn")?.addEventListener("click", () => {
    sendLiveDroneDebugCommand("debug_pause_telemetry", { enabled: !liveState.droneDebugTelemetryPaused });
  });
  document.getElementById("liveDebugDroneRfLoss2Btn")?.addEventListener("click", () => {
    sendLiveDroneDebugCommand("debug_simulate_rf_loss", { cycles: 2 });
  });
  document.getElementById("liveDebugDroneDelay20Btn")?.addEventListener("click", () => {
    sendLiveDroneDebugCommand("debug_delay_next_telemetry", { delayMs: 20 });
  });
  document.getElementById("liveDebugDroneDrop2Btn")?.addEventListener("click", () => {
    sendLiveDroneDebugCommand("debug_drop_telemetry", { cycles: 2 });
  });
  document.getElementById("liveDebugDroneRebootHoldBtn")?.addEventListener("click", () => {
    sendLiveDroneDebugCommand("debug_reboot", { bootJoinMode: "hold", delayMs: 250 });
  });
  droneWifiHostEl?.addEventListener("input", readLiveDroneWifiHost);
  droneWifiHostEl?.addEventListener("change", readLiveDroneWifiHost);
  document.getElementById("liveDebugDroneWifiStatusBtn")?.addEventListener("click", () => {
    sendLiveDroneWifiDebugCommand("get_status");
  });
  document.getElementById("liveDebugDroneWifiHoldBtn")?.addEventListener("click", () => {
    sendLiveDroneWifiDebugCommand("debug_join_control", { joinMode: "hold" });
  });
  document.getElementById("liveDebugDroneWifiJoinBtn")?.addEventListener("click", () => {
    sendLiveDroneWifiDebugCommand("debug_send_join_request");
  });
  document.getElementById("liveDebugDroneWifiRestartHoldBtn")?.addEventListener("click", () => {
    sendLiveDroneWifiDebugCommand("debug_restart_join", { hold: true });
  });
  document.getElementById("liveDebugDroneWifiPauseBtn")?.addEventListener("click", () => {
    sendLiveDroneWifiDebugCommand("debug_pause_telemetry", { enabled: !liveState.droneDebugTelemetryPaused });
  });
  document.getElementById("liveDebugDroneWifiRfLoss2Btn")?.addEventListener("click", () => {
    sendLiveDroneWifiDebugCommand("debug_simulate_rf_loss", { cycles: 2 });
  });
  document.getElementById("liveDebugDroneWifiDelay20Btn")?.addEventListener("click", () => {
    sendLiveDroneWifiDebugCommand("debug_delay_next_telemetry", { delayMs: 20 });
  });
  document.getElementById("liveDebugDroneWifiDrop2Btn")?.addEventListener("click", () => {
    sendLiveDroneWifiDebugCommand("debug_drop_telemetry", { cycles: 2 });
  });
  document.getElementById("liveDebugDroneWifiRebootHoldBtn")?.addEventListener("click", () => {
    sendLiveDroneWifiDebugCommand("debug_reboot", { bootJoinMode: "hold", delayMs: 250 });
  });
  endpointEl?.addEventListener("input", () => {
    liveState.relayEndpoint = String(endpointEl.value || "").trim();
  });
  endpointEl?.addEventListener("change", readLiveRelayInputs);
  sessionEl?.addEventListener("input", () => {
    liveState.relaySessionId = String(sessionEl.value || "").trim();
  });
  sessionEl?.addEventListener("change", readLiveRelayInputs);
  tokenEl?.addEventListener("input", () => {
    liveState.relayPublishToken = String(tokenEl.value || "").trim();
  });
  syncLiveRelayInputsFromState();
  renderLiveHomeTool();
  if ("serial" in navigator) {
    navigator.serial.addEventListener?.("disconnect", handleLiveSerialBrowserDisconnect);
    navigator.serial.addEventListener?.("connect", handleLiveSerialBrowserConnect);
    setLiveSerialState("waiting", "Disconnected", "Web Serial is available.");
    window.setTimeout(autoConnectRememberedLiveSerialPort, 250);
  } else {
    setLiveSerialState("error", "Unsupported", "Use desktop Chrome or Edge for USB serial.");
    if (openBtn) openBtn.disabled = true;
  }
  window.setTimeout(ensureLiveRelayForCurrentState, 500);
  renderLiveControls();
  renderLiveGcStatus();
}

function renderLiveStatusList() {
  const host = document.getElementById("statusList");
  if (!host) return;
  host.innerHTML = "";
  const now = Date.now();
  const prunedBindings = pruneLiveBindingStates(now);
  const prunedRecoveries = pruneLiveRecoveryStates(now);
  const sorted = [...drones]
    .filter((drone) => {
      if (!drone) return false;
      const latest = drone.getLatest && drone.getLatest();
      const id = Number(drone.id);
      return latest || liveState.bindingStates.has(id) || liveState.linkStatuses.has(id) || liveState.recoveryStates.has(id);
    })
    .sort((a, b) => a.id - b.id);

  if (!sorted.length) {
    const empty = document.createElement("div");
    empty.className = "status-entry live-entry";
    empty.textContent = getLiveEmptyStatusMessage();
    host.appendChild(empty);
    return;
  }

  sorted.forEach((d) => {
    const latest = d.getLatest();
    const bindingState = liveState.bindingStates.get(Number(d.id));
    const recoveryState = liveState.recoveryStates.get(Number(d.id));
    const linkStatus = liveState.linkStatuses.get(Number(d.id));
    const freshness = latest ? getLiveFreshnessState(d, now) : "offline";
    const displayState = getLiveDisplayState(d, freshness, now);
    const row = document.createElement("div");
    row.className = `status-entry live-entry ${displayState}`;
    if (bindingState?.status === "failed") row.classList.add("binding-failed");
    row.dataset.droneId = String(d.id);
    if (pinnedDroneId === d.id) row.classList.add("is-active");

    const led = document.createElement("div");
    led.className = `status-led ${freshnessLedClass(displayState)}`;
    row.appendChild(led);

    const main = document.createElement("div");
    main.className = "live-entry-main";
    const label = document.createElement("div");
    label.className = "status-label";
    label.textContent = getLiveDroneDisplayName(d.id);
    const secondaryName = getLiveDroneSecondaryName(d.id);
    if (secondaryName) {
      const secondary = document.createElement("span");
      secondary.className = "live-drone-secondary";
      secondary.textContent = secondaryName;
      label.appendChild(secondary);
    }
    const detail = document.createElement("div");
    if (latest) {
      renderLiveTimingLine(detail, d, latest, now);
      if (recoveryState && displayState !== "binding") appendLiveRecoveryDetail(detail, recoveryState, now);
    } else if (bindingState) {
      renderLiveBindingLine(detail, bindingState, now);
    } else if (recoveryState) {
      renderLiveBridgeCardLine(detail, linkStatus || { state: displayState, receivedAt: recoveryState.updatedAt }, now, displayState);
      appendLiveRecoveryDetail(detail, recoveryState, now);
    } else {
      renderLiveBridgeCardLine(detail, linkStatus, now, displayState);
    }
    const grid = document.createElement("div");
    grid.className = "live-entry-grid";
    const speed = Number(latest?.groundSpeed);
    const displayLatest = latest || {
      frequencyMhz: bindingState?.frequencyMhz ?? linkStatus?.frequencyMhz ?? recoveryState?.frequencyMhz ?? null,
      radioProfileId: bindingState?.radioProfileId ?? linkStatus?.radioProfileId ?? recoveryState?.radioProfileId ?? null,
      rssi: bindingState?.rssi ?? linkStatus?.rssi ?? recoveryState?.rssi ?? null,
      snr: bindingState?.snr ?? linkStatus?.snr ?? recoveryState?.snr ?? null,
      satelliteCount: bindingState?.satelliteCount ?? linkStatus?.satelliteCount ?? null,
    };
    const fields = [
      ["Alt", latest ? `${Number(latest.alt || 0).toFixed(1)} m` : "N/A"],
      ["Speed", Number.isFinite(speed) ? `${(speed * 3.6).toFixed(0)} km/h` : "N/A"],
      ["Profile", formatLiveDroneProfile(d, displayLatest)],
      ["RSSI", displayLatest.rssi !== null && displayLatest.rssi !== undefined ? `${Number(displayLatest.rssi).toFixed(0)} dBm` : "N/A"],
      ["SNR", displayLatest.snr !== null && displayLatest.snr !== undefined ? `${Number(displayLatest.snr).toFixed(1)} dB` : "N/A"],
      ["Sats", displayLatest.satelliteCount !== null && displayLatest.satelliteCount !== undefined ? String(displayLatest.satelliteCount) : "N/A"],
    ];
    fields.forEach(([name, value]) => {
      const item = document.createElement("div");
      item.innerHTML = `${name} <strong>${value}</strong>`;
      grid.appendChild(item);
    });
    main.appendChild(label);
    main.appendChild(detail);
    main.appendChild(grid);
    row.appendChild(main);

    const actionableBadge = !isLiveCommandReadOnlyMode() && (displayState === "offline" || displayState === "weak");
    const badge = document.createElement(actionableBadge ? "button" : "div");
    badge.className = `live-freshness ${displayState}`;
    const badgeText = document.createElement("span");
    badgeText.textContent = formatLiveDisplayState(displayState);
    badge.appendChild(badgeText);
    if (actionableBadge) {
      badge.type = "button";
      badge.classList.add("live-freshness-action");
      badge.title = "Try to re-bind this drone's telemetry timing";
      badge.addEventListener("click", (event) => {
        event.stopPropagation();
        requestLiveDroneRelock(d.id);
      });
    }
    const statusStack = document.createElement("div");
    statusStack.className = "live-entry-status-stack";
    statusStack.appendChild(badge);

    if (displayState === "binding" && bindingState) {
      const overlay = document.createElement("div");
      overlay.className = "live-bind-progress-overlay";
      overlay.dataset.nodeId = String(d.id);
      const ring = document.createElement("span");
      ring.className = "live-bind-progress";
      overlay.appendChild(ring);
      const percentEl = document.createElement("span");
      percentEl.className = "live-bind-progress-percent";
      overlay.appendChild(percentEl);
      setLiveBindingRingProgress(overlay, bindingState, now);
      statusStack.appendChild(overlay);
    }
    row.appendChild(statusStack);

    row.addEventListener("click", () => {
      if (performance.now() < suppressStatusClickUntil) return;
      if (pinnedDroneId === d.id) {
        stopLiveDroneFollow();
        setPinnedDrone(null);
      } else {
        focusDroneById(d.id);
        startLiveDroneFollow(d.id, { resumeDelayMs: 650 });
      }
    });
    attachLiveDroneLongPress(row, d);
    host.appendChild(row);
  });
  syncLiveBindingAnimationTimer();
  if (prunedBindings || prunedRecoveries) {
    publishLiveDronesState({ force: true, minIntervalMs: 0 });
  }
}

function updateStatusList() {
  const host = document.getElementById("statusList");
  if (!host) return;
  if (LIVE_POSITION_MODE) {
    renderLiveStatusList();
    return;
  }
  host.innerHTML = "";
  // Keep the "Remove from Team" menu open across status refreshes (we re-render every 1s).
  // Close only if the referenced drone/team is no longer valid.
  if (pendingStatusMember && statusMemberMenuEl) {
    const t = getTeamById(pendingStatusMember.teamId);
    if (!t || !t.members.has(pendingStatusMember.droneId)) {
      closeStatusMemberMenu();
    }
  }
  const teamMap = new Map();
  teams.filter((t) => t.members.size >= 2).forEach((t) => {
    const members = [...t.members]
      .map((id) => getDroneById(id))
      .filter(Boolean)
      .sort((a, b) => a.id - b.id);
    teamMap.set(t.id, members);
  });

  const orphanDrones = [...drones].filter((d) => !getTeamForDrone(d.id)).sort((a, b) => a.id - b.id);

  const renderRow = (d, container) => {
    const latest = d.getLatest && d.getLatest();
    if (!latest) return;
    const assigned = groundControl ? groundControl.getAssigned(d.id) : null;
    const performing = latest.command || "Idle";
    const match = assigned ? assigned.command === performing : true;
    const ledClass = match ? "green" : "red";

    const row = document.createElement("div");
    row.className = "status-entry";
    row.dataset.droneId = String(d.id);
    const team = getTeamForDrone(d.id);
    if ((pinnedDroneId === d.id) || (team && pinnedTeamId === team.id)) {
      row.classList.add("is-active");
    }

    const led = document.createElement("div");
    led.className = `status-led ${ledClass}`;
    row.appendChild(led);

    const textWrap = document.createElement("div");
    const label = document.createElement("div");
    label.className = "status-label";
    label.textContent = `Drone #${d.id + 1}`;
    const mission = document.createElement("div");
    mission.className = "status-mission";
    mission.textContent = match
      ? `Mission: ${performing}`
      : `Given: ${assigned ? assigned.command : "N/A"} | Doing: ${performing}`;
    textWrap.appendChild(label);
    textWrap.appendChild(mission);

    row.appendChild(textWrap);
    const battery = document.createElement("div");
    battery.className = "status-battery";
    battery.innerHTML = renderBatteryBars(latest.battery);
    row.appendChild(battery);

    row.style.cursor = "pointer";

    // Long-press on a status entry: focus and open commands (instead of info tooltip).
    const STATUS_LONGPRESS_MS = 220;
    const STATUS_DRAG_CANCEL_PX = 10;
    let statusPressTimer = null;
    let statusPressStart = null;

    const clearStatusPress = () => {
      if (statusPressTimer) {
        clearTimeout(statusPressTimer);
        statusPressTimer = null;
      }
      statusPressStart = null;
    };

    row.addEventListener(
      "pointerdown",
      (ev) => {
        if (typeof ev.button === "number" && ev.button !== 0) return;
        clearStatusPress();
        statusPressStart = { x: ev.clientX, y: ev.clientY, pointerId: ev.pointerId ?? null };
        statusPressTimer = setTimeout(() => {
          statusPressTimer = null;
          suppressStatusClickUntil = performance.now() + 650;
          if (team) {
            openStatusMemberMenu(d.id, team.id, label);
          } else {
            focusDroneById(d.id);
            tooltipMode = "commands";
            updateTooltip();
          }
        }, STATUS_LONGPRESS_MS);
      },
      true
    );

    row.addEventListener(
      "pointermove",
      (ev) => {
        if (!statusPressTimer || !statusPressStart) return;
        if (statusPressStart.pointerId !== null && ev.pointerId !== undefined && ev.pointerId !== statusPressStart.pointerId)
          return;
        const dx = (ev.clientX ?? 0) - statusPressStart.x;
        const dy = (ev.clientY ?? 0) - statusPressStart.y;
        if (Math.hypot(dx, dy) > STATUS_DRAG_CANCEL_PX) clearStatusPress();
      },
      true
    );

    row.addEventListener("pointerup", clearStatusPress, true);
    row.addEventListener("pointercancel", clearStatusPress, true);
    row.addEventListener("pointerleave", clearStatusPress, true);

    row.addEventListener("click", () => {
      if (performance.now() < suppressStatusClickUntil) return;
      if (team) {
        if (pinnedTeamId === team.id) {
          clearSelection();
          updateStatusList();
          updateTooltip();
          draw();
        } else {
          setPinnedTeam(team.id);
        }
      } else {
        if (pinnedDroneId === d.id) {
          setPinnedDrone(null);
          if (tooltipEl) tooltipEl.style.display = "none";
        } else {
          focusDroneById(d.id);
        }
      }
    });
    container.appendChild(row);
  };

  // Render teams
  teamMap.forEach((members, teamId) => {
    const header = document.createElement("div");
    header.className = "status-team-header";
    header.dataset.teamId = String(teamId);
    if (pinnedTeamId === teamId) header.classList.add("is-active");
    header.textContent = `Team #${teamId + 1} (${members.length})`;

    const body = document.createElement("div");
    body.className = "status-team-body";
    body.style.display = pinnedTeamId === teamId ? "flex" : "none";

    // Long-press on a team header: select + open commands.
    const STATUS_LONGPRESS_MS = 220;
    const STATUS_DRAG_CANCEL_PX = 10;
    let teamPressTimer = null;
    let teamPressStart = null;
    const clearTeamPress = () => {
      if (teamPressTimer) {
        clearTimeout(teamPressTimer);
        teamPressTimer = null;
      }
      teamPressStart = null;
    };
    header.addEventListener(
      "pointerdown",
      (ev) => {
        if (typeof ev.button === "number" && ev.button !== 0) return;
        clearTeamPress();
        teamPressStart = { x: ev.clientX, y: ev.clientY, pointerId: ev.pointerId ?? null };
        teamPressTimer = setTimeout(() => {
          teamPressTimer = null;
          suppressStatusClickUntil = performance.now() + 650;
          setPinnedTeam(teamId);
          tooltipMode = "commands";
          updateTooltip();
        }, STATUS_LONGPRESS_MS);
      },
      true
    );
    header.addEventListener(
      "pointermove",
      (ev) => {
        if (!teamPressTimer || !teamPressStart) return;
        if (teamPressStart.pointerId !== null && ev.pointerId !== undefined && ev.pointerId !== teamPressStart.pointerId) return;
        const dx = (ev.clientX ?? 0) - teamPressStart.x;
        const dy = (ev.clientY ?? 0) - teamPressStart.y;
        if (Math.hypot(dx, dy) > STATUS_DRAG_CANCEL_PX) clearTeamPress();
      },
      true
    );
    header.addEventListener("pointerup", clearTeamPress, true);
    header.addEventListener("pointercancel", clearTeamPress, true);
    header.addEventListener("pointerleave", clearTeamPress, true);

    header.addEventListener("click", () => {
      if (performance.now() < suppressStatusClickUntil) return;
      if (pinnedTeamId === teamId) {
        clearSelection();
        updateStatusList();
        updateTooltip();
        draw();
        return;
      }
      setPinnedTeam(teamId);
    });

    members.forEach((d) => renderRow(d, body));
    host.appendChild(header);
    host.appendChild(body);
  });

  orphanDrones.forEach((d) => renderRow(d, host));

  // If the per-member menu is open, re-anchor it to the rendered label element.
  if (pendingStatusMember && statusMemberMenuEl && typeof statusMemberMenuEl._reposition === "function") {
    const labelEl = document.querySelector(`[data-drone-id="${pendingStatusMember.droneId}"] .status-label`);
    if (labelEl) statusMemberMenuEl._reposition(labelEl);
  }
}

function ensureTooltipEl() {
  if (tooltipEl) return tooltipEl;
  const host = document.getElementById("app") || document.body;
  const el = document.createElement("div");
  el.className = "drone-tooltip";
  el.style.display = "none";
  host.appendChild(el);
  tooltipEl = el;
  enableMenuDrag(tooltipEl, {
    onMove: (left, top) => {
      const sel = getSelectedEntity();
      const key = getSelectionKey(sel);
      if (key && (pinnedDroneId !== null || pinnedTeamId !== null)) {
        tooltipPinnedPos = { left, top };
        tooltipPinnedForKey = key;
      }
    },
  });
  return tooltipEl;
}

function renderLiveTooltip(el, target, latest) {
  const now = Date.now();
  const freshness = getLiveFreshnessState(target, now);
  const displayState = getLiveDisplayState(target, freshness, now);
  const age = formatLiveAge(target.lastReceivedAt, now);
  const speed = Number(latest.groundSpeed);
  const freq = latest.frequencyMhz !== null && latest.frequencyMhz !== undefined ? `${Number(latest.frequencyMhz).toFixed(1)} MHz` : "N/A";
  const secondary = getLiveDroneSecondaryName(target.id);
  const displayName = escapeLiveText(getLiveDroneDisplayName(target.id));
  const secondaryText = secondary ? ` (${escapeLiveText(secondary)})` : "";
  el.innerHTML = `
    <div class="row battery-row"><strong>${displayName}${secondaryText}</strong><span class="live-freshness ${displayState}">${formatLiveDisplayState(displayState)}</span></div>
    <div class="row"><span>Age</span><strong>${age}</strong></div>
    <div class="row"><span>Altitude</span><strong>${Number(latest.alt || 0).toFixed(1)} m</strong></div>
    <div class="row"><span>Speed</span><strong>${Number.isFinite(speed) ? `${(speed * 3.6).toFixed(0)} km/h` : "N/A"}</strong></div>
    <div class="row"><span>CoG / Yaw</span><strong>${latest.courseOverGround !== null && latest.courseOverGround !== undefined ? Number(latest.courseOverGround).toFixed(0) : "N/A"} / ${latest.yaw !== null && latest.yaw !== undefined ? Number(latest.yaw).toFixed(0) : "N/A"}</strong></div>
    <div class="row"><span>RSSI / SNR</span><strong>${latest.rssi !== null && latest.rssi !== undefined ? Number(latest.rssi).toFixed(0) : "N/A"} / ${latest.snr !== null && latest.snr !== undefined ? Number(latest.snr).toFixed(1) : "N/A"}</strong></div>
    <div class="row"><span>Sats</span><strong>${latest.satelliteCount ?? "N/A"}</strong></div>
    <div class="row"><span>Channel</span><strong>${freq}</strong></div>
    <div class="row"><span>Seq</span><strong>${latest.sequenceId ?? "N/A"}</strong></div>
  `;
  el.onclick = null;
}

function updateTooltip() {
  if (!map) return;
  // If a relative menu (e.g., Goto WP) is open, keep the drone tooltip hidden.
  if (waypointMenuEl || followMenuEl || homeMenuEl || relationMenuEl || orbitMenuEl || flankMenuEl || performance.now() < tooltipSuppressUntil) {
    if (tooltipEl) tooltipEl.style.display = "none";
    return;
  }
  const el = ensureTooltipEl();
  const targetTeam = pinnedTeamId !== null ? getTeamById(pinnedTeamId) : null;
  const teamSnapshot = targetTeam ? getTeamSnapshot(targetTeam) : null;
  const target =
    (teamSnapshot && { id: targetTeam.id, team: targetTeam, latest: teamSnapshot }) ||
    (pinnedDroneId !== null && getDroneById(pinnedDroneId)) ||
    (hoveredDroneId !== null && getDroneById(hoveredDroneId)) ||
    null;

  if (!target) {
    el.style.display = "none";
    tooltipMode = "info";
    return;
  }

  const latest =
    target.team && target.latest
      ? target.latest
      : target.getLatest && target.getLatest();
  if (!latest) {
    el.style.display = "none";
    return;
  }

  if (LIVE_POSITION_MODE) {
    if (target.team) {
      el.style.display = "none";
      return;
    }
    const pt = map.latLngToContainerPoint([latest.lat, latest.lng]);
    el.style.left = `${pt.x + 14}px`;
    el.style.top = `${pt.y - 10}px`;
    el.style.display = "block";
    tooltipMode = "info";
    renderLiveTooltip(el, target, latest);
    return;
  }

  const selKey = getSelectionKey(getSelectedEntity());
  const canPin = (pinnedDroneId !== null || pinnedTeamId !== null) && selKey;
  if (canPin && tooltipPinnedPos && tooltipPinnedForKey === selKey) {
    el.style.left = `${tooltipPinnedPos.left}px`;
    el.style.top = `${tooltipPinnedPos.top}px`;
  } else {
    const pt = map.latLngToContainerPoint([latest.lat, latest.lng]);
    el.style.left = `${pt.x + 14}px`;
    el.style.top = `${pt.y - 10}px`;
    if (!canPin) {
      tooltipPinnedPos = null;
      tooltipPinnedForKey = null;
    }
  }
  el.style.display = "block";

  const isTeam = !!target.team;
  const assigned = !isTeam && groundControl ? groundControl.getAssigned(target.id) : null;
  const performing = latest.command || "Idle";
  const match = assigned ? assigned.command === performing : true;
  const missionLine = match
    ? `<div class="mission-line"><span class="mission-led green"></span><span>Mission: ${performing}</span></div>`
    : `<div class="mission-line"><span class="mission-led red"></span><span>Given: ${assigned ? assigned.command : "N/A"} | Doing: ${performing}</span></div>`;

  const eta =
    target && typeof target.getEstimatedTimeRemainingMinutes === "function"
      ? target.getEstimatedTimeRemainingMinutes()
      : null;
  const etaText = eta === null ? "N/A" : formatMinutes(eta);
  const uptimeText = formatDuration(latest.uptimeSec);
  const cooldownMs = target && typeof target.getCooldownRemaining === "function" ? target.getCooldownRemaining() : 0;
  const cooldownPct = Math.min(100, Math.max(0, ((3000 - cooldownMs) / 3000) * 100));

  if (tooltipMode === "assign-team") {
    if (isTeam || !pinnedDroneId) {
      tooltipMode = "info";
      updateTooltip();
      return;
    }
    const existingTeams = teams
      .filter((t) => t && t.members && t.members.size >= 2)
      .map((t) => ({ id: t.id, n: t.members.size }))
      .sort((a, b) => a.id - b.id);

    const entries =
      existingTeams.length > 0
        ? existingTeams
            .map(
              (t) =>
                `<button class="cmd-chip cmd-action" type="button" data-team="${t.id}">Team #${
                  t.id + 1
                } (${t.n})</button>`
            )
            .join("")
        : `<div class="status-mission" style="padding:4px 2px;">No teams yet. Create one by long-press/right-click to add drones.</div>`;

    el.innerHTML = `
      <div class="row battery-row"><strong>Drone #${target.id + 1}</strong><span class="tooltip-hint">Assign to team</span></div>
      <div class="command-list cmd-action-list column">${entries}</div>
    `;

    el.querySelectorAll("[data-team]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const teamId = Number(btn.dataset.team);
        if (!Number.isFinite(teamId)) return;
        const team = getTeamById(teamId);
        if (!team) return;
        const t = ensureTeam([...team.members, target.id]);
        tooltipMode = "info";
        if (t) setPinnedTeam(t.id, true);
        else setPinnedDrone(target.id);
        if (tooltipEl) tooltipEl.style.display = "none";
        updateStatusList();
        updateTooltip();
        forceRedraw();
      });
    });
    return;
  }

  if (tooltipMode === "commands") {
    if (cooldownMs > 0) {
      const remainSec = (cooldownMs / 1000).toFixed(1);
      el.innerHTML = `
        <div class="row battery-row"><strong>Drone #${target.id + 1}</strong><span class="tooltip-hint">Commands</span></div>
        <div class="row cooldown-row"><span>Re-arm</span><div class="cooldown-bar"><div class="cooldown-fill" style="width:${cooldownPct}%;"></div></div><span>${remainSec}s</span></div>
      `;
      return;
    }

    const cmds = isTeam ? getLocalCommands(target.team, latest) : getLocalCommands(target, latest);
    if (!isTeam) cmds.push("Assign to Team");
    const cmdButtons = cmds
      .map((c) => `<button class="cmd-chip cmd-action" type="button" data-cmd="${c}">${c}</button>`)
      .join("");
    el.innerHTML = `
      <div class="row battery-row"><strong>${isTeam ? `Team #${target.team.id + 1}` : `Drone #${target.id + 1}`}</strong><span class="tooltip-hint">Commands</span></div>
      <div class="command-list cmd-action-list column">${cmdButtons}</div>
      `;
    el.querySelectorAll(".cmd-action").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const cmd = btn.dataset.cmd;
        if (cmd === "Assign to Team") {
          tooltipMode = "assign-team";
          updateTooltip();
          return;
        }
        if (cmd === "Return to Home") {
          // Open the same RTH-style menu (land/hover + confirm), but with a home picker list.
          const anchor = map.latLngToContainerPoint([latest.lat, latest.lng]);
          openHomePickerMenu(anchor);
          return;
        }
        if (cmd) {
          if (isTeam) issueTeamCommand(target.team, cmd);
          else issueLocalCommand(target, cmd);
        }
      });
    });
    return;
  }

  el.innerHTML = `
    <div class="row battery-row">
      <strong>${isTeam ? `Team #${target.team.id + 1}` : `Drone #${target.id + 1}`}</strong>
      <span class="inline-indicators" style="display:inline-flex;align-items:center;gap:10px;">
        ${renderRssiBars(latest.rssi)}
        ${renderBatteryBars(latest.battery)}
      </span>
    </div>
    <div class="row"><span>Altitude</span><strong>${Math.round(latest.alt)} m</strong></div>
    ${cooldownMs > 0 ? `<div class="row cooldown-row"><span>Re-arm</span><div class="cooldown-bar"><div class="cooldown-fill" style="width:${cooldownPct}%;"></div></div></div>` : ""}
    <div class="row"><span>Uptime</span><strong>${uptimeText}</strong></div>
    <div class="row"><span>Air time left</span><strong>${etaText}</strong></div>
    ${missionLine}
  `;

  el.onclick = (e) => {
    e.stopPropagation();
    if (performance.now() < menuDragSuppressUntil) return;
    tooltipMode = "commands";
    updateTooltip();
  };
}

function setupHoverHandlers() {
  if (!map) return;

  map.on("mousemove", (e) => {
    lastPointer = e.containerPoint;
    if (pendingDistanceMeasurement && e && e.latlng) {
      updatePendingDistanceMeasurementPreview(e.latlng);
    }
    // Bearing is controlled only by the flank knob (no hover updates).
    if (pinnedDroneId !== null) {
      updateTooltip();
      return;
    }
    const nearest = findNearestDrone(e.containerPoint, getHoverRadius());
    hoveredDroneId = nearest ? nearest.id : null;
    updateTooltip();
  });

  map.on("click", handleMapClick);
  map.on("dblclick", handleMapDoubleClick);

  map.on("mouseout", () => {
    if (pinnedDroneId === null) {
      hoveredDroneId = null;
      updateTooltip();
    }
  });

  map.on("contextmenu", handleContextMenu);
  map.on("dragstart", () => {
    isMapDragging = true;
    suppressMapClickUntil = performance.now() + 500;
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  });
  map.on("dragend", () => {
    isMapDragging = false;
    suppressMapClickUntil = performance.now() + 250;
  });
  map.on("zoomstart", () => {
    suppressMapClickUntil = performance.now() + 650;
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  });
  map.on("zoomend", () => {
    suppressMapClickUntil = performance.now() + 250;
  });

  // Long-press (mobile) to open follow menu
  const container = map.getContainer();
  const DRAG_CANCEL_PX = 10;
  let longPressPointerId = null;
  let longPressStartClient = null;

  const updateWaypointMenuHeader = () => {
    if (!waypointMenuEl || !pendingWaypoint) return;
    if (waypointMenuEl.dataset.mode === "edit") {
      const title = waypointMenuEl.querySelector(".menu-head h4");
      if (title && pendingWaypoint.wpId !== null && pendingWaypoint.wpId !== undefined) {
        title.textContent = `WP #${pendingWaypoint.wpId}`;
      }
      return;
    }
    const sel = getSelectedEntity();
    let latest = sel && sel.latest ? sel.latest : null;
    if (!latest && waypointDroneId !== null && waypointDroneId !== undefined) {
      const d = getDroneById(waypointDroneId);
      latest = d && d.getLatest && d.getLatest();
    }
    const title = waypointMenuEl.querySelector(".menu-head h4");
    const etaSpan = waypointMenuEl.querySelector(".menu-eta");
    if (!latest || !isFinite(latest.lat) || !isFinite(latest.lng)) return;
    const distKm = haversine2dMeters(latest.lat, latest.lng, pendingWaypoint.lat, pendingWaypoint.lng) / 1000;
    if (title && isFinite(distKm)) title.textContent = `${distKm.toFixed(2)} km`;
    if (etaSpan && waypointMenuEl.dataset.mode === "goto" && isFinite(distKm)) {
      const speed = Math.max(1, Number(pendingWaypoint.speedKmh) || 60);
      const totalSec = (distKm / speed) * 3600;
      const m = Math.floor(totalSec / 60);
      const s = Math.max(0, Math.round(totalSec - m * 60));
      etaSpan.textContent = `${m}m ${s.toString().padStart(2, "0")}s`;
    }
  };

  const tryStartWaypointDrag = (ev) => {
    if (!map || !ev) return false;
    if (isZooming || isMapDragging) return false;
    if (performance.now() < suppressMapClickUntil) return false;
    if (!pendingWaypoint || !waypointMenuEl || !["goto", "edit"].includes(waypointMenuEl.dataset.mode)) return false;
    const pt = map.mouseEventToContainerPoint(ev);
    if (!isContainerPointOnPendingWaypointPin(pt)) return false;

    waypointDrag = { type: "pending", pointerId: ev.pointerId ?? null };
    suppressMapClickUntil = performance.now() + 400;
    suppressNextMapClick = true;
    longPressSuppressUntil = performance.now() + 400;
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }

    // Prevent Leaflet from panning while dragging the pin.
    const hadDragging = !!(map.dragging && map.dragging.enabled && map.dragging.enabled());
    if (hadDragging) map.dragging.disable();

    const move = (e2) => {
      if (!waypointDrag) return;
      if (waypointDrag.pointerId !== null && e2.pointerId !== undefined && e2.pointerId !== waypointDrag.pointerId) return;
      const ll = map.mouseEventToLatLng(e2);
      if (!ll || !pendingWaypoint) return;
      pendingWaypoint.lat = ll.lat;
      pendingWaypoint.lng = ll.lng;
      if (pendingWaypoint.wpId !== null && pendingWaypoint.wpId !== undefined) {
        updateWaypointPosition(pendingWaypoint.wpId, pendingWaypoint.lat, pendingWaypoint.lng);
      }
      updateWaypointMenuHeader();
      draw();
      e2.preventDefault?.();
    };
    const up = (e2) => {
      if (!waypointDrag) return;
      if (waypointDrag.pointerId !== null && e2.pointerId !== undefined && e2.pointerId !== waypointDrag.pointerId) return;
      waypointDrag = null;
      if (hadDragging) map.dragging.enable();
      window.removeEventListener("pointermove", move, true);
      window.removeEventListener("pointerup", up, true);
      window.removeEventListener("pointercancel", up, true);
      suppressMapClickUntil = performance.now() + 300;
      suppressNextMapClick = true;
      e2.preventDefault?.();
    };

    window.addEventListener("pointermove", move, true);
    window.addEventListener("pointerup", up, true);
    window.addEventListener("pointercancel", up, true);
    ev.preventDefault?.();
    return true;
  };

  const startLongPress = (ev) => {
    if (tryStartWaypointDrag(ev)) return;
    if (performance.now() < longPressSuppressUntil) return;
    if (isZooming || isMapDragging) return;
    if (ev.pointerType === "touch" && ev.isPrimary === false) return;
    if (typeof ev.button === "number" && ev.button !== 0) return;

    if (longPressTimer) clearTimeout(longPressTimer);
    const point = map.mouseEventToContainerPoint(ev);
    longPressPointerId = ev.pointerId ?? null;
    longPressStartClient = { x: ev.clientX, y: ev.clientY };
    const delayMs = flankMenuEl ? 500 : 220;
    longPressTimer = setTimeout(() => {
      longPressTimer = null;
      longPressPointerId = null;
      longPressStartClient = null;
      attemptActionLongPress(point);
      suppressNextMapClick = true;
      longPressSuppressUntil = performance.now() + 500;
    }, delayMs);
  };
  const clearLongPress = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    longPressPointerId = null;
    longPressStartClient = null;
  };
  const cancelOnMove = (ev) => {
    if (!longPressTimer) return;
    if (isZooming || isMapDragging) {
      clearLongPress();
      return;
    }
    if (longPressPointerId !== null && ev.pointerId !== undefined && ev.pointerId !== longPressPointerId) return;
    if (!longPressStartClient) return;
    const dx = (ev.clientX ?? 0) - longPressStartClient.x;
    const dy = (ev.clientY ?? 0) - longPressStartClient.y;
    if (Math.hypot(dx, dy) > DRAG_CANCEL_PX) {
      clearLongPress();
    }
  };
  container.addEventListener("pointerdown", startLongPress, true);
  container.addEventListener("pointermove", cancelOnMove, true);
  container.addEventListener("pointerup", clearLongPress, true);
  container.addEventListener("pointercancel", clearLongPress, true);
  container.addEventListener("pointerleave", clearLongPress, true);
}

function handleMapClick(e) {
  if (performance.now() < suppressMapClickUntil) return;
  if (isZooming || isMapDragging) return;
  if (pendingDistanceMeasurement && e && e.latlng) {
    completeDistanceMeasurement(e.latlng);
    return;
  }
  // If we're asking the user to place their Home, the next click places it.
  if (pendingUserHomePlacement) {
    addUserHomeAtLatLng(e.latlng);
    return;
  }
  if (gsMenuEl && gsRelocate && activeGroundStationId !== null && activeGroundStationId !== undefined) {
    const stationId = Number(activeGroundStationId);
    if (Number(gsRelocate.stationId) === stationId) {
      const gs = groundStations.find((g) => Number(g.id) === stationId);
      if (gs) {
        gs.updatePosition({ lat: e.latlng.lat, lng: e.latlng.lng });
        publishLiveHomesStateSoon();
      }
      gsRelocate = null;
      closeGroundStationMenu();
      updateTooltip();
      draw();
      return;
    }
  }
  // A completed long-press opens a menu; the release may still produce a click.
  // Suppress that click before live-mode selection/deselection can close the menu.
  if (suppressNextMapClick) {
    suppressNextMapClick = false;
    return;
  }
  if (performance.now() < longPressSuppressUntil) return;
  if (LIVE_POSITION_MODE) {
    const nearest = findNearestDrone(e.containerPoint, getHoverRadius());
    if (nearest) {
      if (pinnedDroneId === nearest.id) {
        setPinnedDrone(null);
        if (tooltipEl) tooltipEl.style.display = "none";
      } else {
        focusDroneById(nearest.id);
      }
    } else {
      closeGroundStationMenu(true);
      activeGroundStationId = null;
      setPinnedDrone(null);
      hoveredDroneId = null;
      if (tooltipEl) tooltipEl.style.display = "none";
      updateStatusList();
      draw();
    }
    return;
  }
  if (pendingEmptyMapClickTimer) {
    clearTimeout(pendingEmptyMapClickTimer);
    pendingEmptyMapClickTimer = null;
  }
  // If we're currently relocating a waypoint ("Change WP"), the next click places it.
  if (waypointMenuEl && waypointMenuEl.dataset.mode === "edit" && waypointRelocate && pendingWaypoint && pendingWaypoint.wpId !== null && pendingWaypoint.wpId !== undefined) {
    const wpId = pendingWaypoint.wpId;
    if (Number(waypointRelocate.wpId) === Number(wpId)) {
      updateWaypointPosition(wpId, e.latlng.lat, e.latlng.lng);
      pendingWaypoint.lat = e.latlng.lat;
      pendingWaypoint.lng = e.latlng.lng;
      waypointRelocate = null;
      // After placing a new WP location, close the menu and deselect the WP.
      closeWaypointMenu(true, true);
      updateTooltip();
      draw();
      return;
    }
  }
  // If we're currently relocating a ground station, the next click places it.
  if (gsMenuEl && gsRelocate && activeGroundStationId !== null && activeGroundStationId !== undefined) {
    const stationId = Number(activeGroundStationId);
    if (Number(gsRelocate.stationId) === stationId) {
      const gs = groundStations.find((g) => g.id === stationId);
      if (gs) {
        gs.updatePosition({ lat: e.latlng.lat, lng: e.latlng.lng });
        publishLiveHomesStateSoon();
      }
      gsRelocate = null;
      closeGroundStationMenu();
      updateTooltip();
      draw();
      return;
    }
  }
  // Flank bearing is controlled only by the knob (no map click behavior).
  // A completed long-press should not also trigger a click action when the finger/mouse is released.
  if (suppressNextMapClick) {
    suppressNextMapClick = false;
    return;
  }
  if (performance.now() < longPressSuppressUntil) return;
  // If an orbit menu is open, a plain click should only close it (no re-open elsewhere).
  if (orbitMenuEl) {
    closeOrbitMenu(true);
    return;
  }
  closeSequenceMenu();
  closeRelationMenu(false);
  const hitWp = findNearestWaypoint(e.containerPoint, 16);
  const nearest = findNearestDrone(e.containerPoint, getHoverRadius());
  const nearGs = findNearestGroundStation(e.containerPoint, getHoverRadius());

  // Close follow menu on any plain map click.
  if (followMenuEl) closeFollowMenu();
  if (homeMenuEl) closeHomeMenu();

  if (hitWp) {
    if (waypointMenuEl) closeWaypointMenu(false, true);
    // If nothing is selected, a single click on a WP does nothing.
    // (Editing requires a long-press on the WP.)
    if (pinnedTeamId === null && pinnedDroneId === null) return;
    if (pinnedTeamId !== null) {
      openWaypointMenu({ lat: hitWp.wp.lat, lng: hitWp.wp.lng }, e.containerPoint, null, hitWp.wpId);
      return;
    }
    const targetId = pinnedDroneId;
    openWaypointMenu({ lat: hitWp.wp.lat, lng: hitWp.wp.lng }, e.containerPoint, targetId, hitWp.wpId);
    return;
  }

  if (nearest) {
    // If the user clicks the already-selected single drone, open its local actions menu.
    if (pinnedTeamId === null && pinnedDroneId !== null && nearest.id === pinnedDroneId) {
      tooltipSuppressUntil = 0;
      closeSequenceMenu();
      closeWaypointMenu(false, true);
      closeHomeMenu(false);
      closeFollowMenu(false);
      closeRelationMenu(false);
      closeOrbitMenu(false, true);
      tooltipMode = "commands";
      updateTooltip();
      return;
    }

    closeWaypointMenu();
    setPinnedDrone(nearest.id);
    return;
  }

  if (nearGs) {
    closeWaypointMenu();
    if (pinnedDroneId !== null || pinnedTeamId !== null) {
      openHomeMenu(e.latlng, e.containerPoint, nearGs);
    } else {
      // When nothing is selected, allow selecting a GS (for GS menu).
      openGroundStationMenu(nearGs, e.containerPoint);
    }
    return;
  }

  // Empty-map single click: delay slightly to allow double-click zoom without deselecting/closing menus.
  pendingEmptyMapClickTimer = setTimeout(() => {
    pendingEmptyMapClickTimer = null;
    closeSequenceMenu();
    closeRelationMenu(false);
    if (followMenuEl) closeFollowMenu();
    if (homeMenuEl) closeHomeMenu();
    if (gsMenuEl) closeGroundStationMenu(true);
    if (flankMenuEl) closeFlankMenu(true);
    closeWaypointMenu();
    activeGroundStationId = null;
    setPinnedDrone(null);
    updateCommandSequencePanel();
    updateTooltip();
    draw();
  }, 240);
}

function handleMapDoubleClick(e) {
  // Cancel any pending "empty map click" action so double-click is pure zoom.
  if (pendingEmptyMapClickTimer) {
    clearTimeout(pendingEmptyMapClickTimer);
    pendingEmptyMapClickTimer = null;
  }
  suppressMapClickUntil = performance.now() + 450;
  longPressSuppressUntil = performance.now() + 450;
  try {
    e.originalEvent?.preventDefault?.();
    e.originalEvent?.stopPropagation?.();
  } catch (_) {
    // ignore
  }
  if (!map || !e || !e.latlng) return;
  const nextZoom = Math.min(map.getMaxZoom ? map.getMaxZoom() : 19, (map.getZoom() || 0) + 1);
  // Center and zoom exactly at the double-clicked location.
  map.setView(e.latlng, nextZoom, { animate: true });
}

function formatDuration(seconds) {
  if (seconds === null || seconds === undefined || !isFinite(seconds)) return "N/A";
  const s = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (hrs > 0) return `${hrs}h ${mins.toString().padStart(2, "0")}m`;
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
}

function formatMinutes(mins) {
  if (mins === null || mins === undefined || !isFinite(mins)) return "N/A";
  if (mins < 1) return `${mins.toFixed(1)}m`;
  return `${Math.round(mins)}m`;
}

function getCommsKeyboardInset() {
  if (typeof window === "undefined") return 0;
  const vv = window.visualViewport;
  if (!vv) return 0;
  const inset = window.innerHeight - vv.height - vv.offsetTop;
  return Math.max(0, inset);
}

function updateVisualViewportVars() {
  if (typeof window === "undefined") return;
  const root = document && document.documentElement ? document.documentElement : null;
  if (!root) return;
  const vv = window.visualViewport;
  if (!vv) {
    root.style.setProperty("--vv-top", "0px");
    root.style.setProperty("--vv-left", "0px");
    root.style.setProperty("--vv-width", "100vw");
    root.style.setProperty("--vv-height", "100vh");
    return;
  }
  // Some mobile browsers "pan" the visual viewport after the keyboard opens (offsetTop changes),
  // which makes the whole app look like it shifts. When the keyboard is open, keep the app pinned
  // to the top-left and only adapt its size.
  const kbInset = getCommsKeyboardInset();
  const keyboardOpen = kbInset > 40 || commsKeyboardActive || globalKeyboardActive;
  root.style.setProperty("--vv-top", keyboardOpen ? "0px" : `${Math.max(0, vv.offsetTop)}px`);
  root.style.setProperty("--vv-left", keyboardOpen ? "0px" : `${Math.max(0, vv.offsetLeft)}px`);
  root.style.setProperty("--vv-width", `${Math.max(0, vv.width)}px`);
  root.style.setProperty("--vv-height", `${Math.max(0, vv.height)}px`);
}

function lockPageScroll() {
  if (pageScrollLock.active) return;
  if (typeof window === "undefined") return;
  const body = document && document.body ? document.body : null;
  if (!body) return;
  pageScrollLock = { active: true, x: window.scrollX || 0, y: window.scrollY || 0 };
  body.style.position = "fixed";
  body.style.left = "0";
  body.style.right = "0";
  body.style.top = `-${pageScrollLock.y}px`;
  body.style.width = "100%";
}

function unlockPageScroll() {
  if (!pageScrollLock.active) return;
  if (typeof window === "undefined") return;
  const body = document && document.body ? document.body : null;
  if (!body) return;
  const { x, y } = pageScrollLock;
  pageScrollLock = { active: false, x: 0, y: 0 };
  body.style.position = "";
  body.style.left = "";
  body.style.right = "";
  body.style.top = "";
  body.style.width = "";
  window.scrollTo(x, y);
}

function isTextInputElement(el) {
  if (!el || !(el instanceof Element)) return false;
  if (el.isContentEditable) return true;
  const tag = el.tagName ? el.tagName.toLowerCase() : "";
  if (tag === "textarea") return true;
  if (tag !== "input") return false;
  const type = (el.getAttribute("type") || "text").toLowerCase();
  // Treat most "typing" inputs as keyboard-triggering; exclude sliders.
  if (type === "range" || type === "checkbox" || type === "radio" || type === "button" || type === "submit") return false;
  return true;
}

function setGlobalKeyboardActive(active) {
  globalKeyboardActive = !!active;
  if (!globalKeyboardActive) {
    unlockPageScroll();
    updateVisualViewportVars();
    return;
  }
  if (isMobileLike()) lockPageScroll();
  updateVisualViewportVars();
}

function updateCommsKeyboardInset() {
  if (!commsKeyboardActive) return;
  const inset = getCommsKeyboardInset();
  document.documentElement.style.setProperty("--comms-keyboard-inset", `${inset}px`);
}

function setCommsKeyboardActive(active) {
  commsKeyboardActive = !!active;
  if (!commsKeyboardActive) {
    document.documentElement.style.setProperty("--comms-keyboard-inset", "0px");
    setGlobalKeyboardActive(false);
    return;
  }
  setGlobalKeyboardActive(true);
  updateCommsKeyboardInset();
  updateVisualViewportVars();
}

function enableCommsKeyboardTracking() {
  if (commsKeyboardTracking) return;
  const vv = window.visualViewport;
  if (!vv) return;
  commsKeyboardTracking = true;
  vv.addEventListener("resize", updateCommsKeyboardInset);
  vv.addEventListener("scroll", updateCommsKeyboardInset);
  vv.addEventListener("resize", updateVisualViewportVars);
  vv.addEventListener("scroll", updateVisualViewportVars);
  updateCommsKeyboardInset();
  updateVisualViewportVars();
}

function disableCommsKeyboardTracking() {
  if (!commsKeyboardTracking) return;
  const vv = window.visualViewport;
  if (vv) {
    vv.removeEventListener("resize", updateCommsKeyboardInset);
    vv.removeEventListener("scroll", updateCommsKeyboardInset);
    vv.removeEventListener("resize", updateVisualViewportVars);
    vv.removeEventListener("scroll", updateVisualViewportVars);
  }
  commsKeyboardTracking = false;
  commsKeyboardActive = false;
  document.documentElement.style.setProperty("--comms-keyboard-inset", "0px");
}

function getCommsLog(stationId) {
  const id = Number(stationId);
  if (!commsLogsByStationId.has(id)) {
    commsLogsByStationId.set(id, { messages: new RingLog() });
  }
  return commsLogsByStationId.get(id);
}

function renderCommsPanel(gs, listEl) {
  if (!gs || !listEl) return;
  const log = getCommsLog(gs.id);
  const prevInput = commsComposerEl ? commsComposerEl.querySelector("[data-comms-input]") : null;
  const prevValue = prevInput ? prevInput.value : "";
  const restoreFocus = !!(prevInput && document.activeElement === prevInput);
  listEl.innerHTML = "";
  listEl.style.paddingBottom = "8px";

  const thread = document.createElement("div");
  thread.className = "comms-thread";
  listEl.appendChild(thread);

  const messages = log.messages.toArray();
  if (!messages.length) {
    const empty = document.createElement("div");
    empty.className = "sequence-empty";
    empty.textContent = `No comms messages with ${(gs.name || `Home #${gs.id + 1}`).trim()} yet.`;
    thread.appendChild(empty);
  } else {
    messages.forEach((m) => {
      const row = document.createElement("div");
      row.className = `comms-msg ${m.from === "us" ? "from-us" : "from-gs"}`;
      row.textContent = m.text;
      thread.appendChild(row);
    });
  }

  const host = document.getElementById("app") || document.body;
  const panelContent = document.querySelector("aside.panel.left .panel-content");
  if (!panelContent) return;

  if (!commsComposerEl) {
    commsComposerEl = document.createElement("div");
    commsComposerEl.className = "comms-composer";
    commsComposerEl.addEventListener("pointerdown", (ev) => ev.stopPropagation());
  }

  if (!commsComposerEl.parentNode) {
    // Place composer at the bottom of the left panel, under the list.
    panelContent.appendChild(commsComposerEl);
  }

  // Keep the composer DOM stable (avoid recreating the input on each render).
  if (!commsComposerInputEl || !commsComposerSendEl) {
    commsComposerEl.innerHTML = `
      <input class="comms-input" type="text" placeholder="Type message…" data-comms-input>
      <button class="cmd-chip cmd-action comms-send" type="button" data-comms-send aria-label="Send">
        <svg class="paper-plane" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M3 4 L21 12 L3 20 Z M3 9 L11.5 12 L3 15 Z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    `;
    commsComposerInputEl = commsComposerEl.querySelector("[data-comms-input]");
    commsComposerSendEl = commsComposerEl.querySelector("[data-comms-send]");
  }

  const input = commsComposerInputEl || commsComposerEl.querySelector("[data-comms-input]");
  const send = commsComposerSendEl || commsComposerEl.querySelector("[data-comms-send]");
  if (input) input.placeholder = "Type message...";
  if (input) input.value = prevValue;
  if (restoreFocus && input) {
    try {
      input.focus();
      const end = input.value.length;
      input.setSelectionRange(end, end);
    } catch {
      // ignore
    }
  }
  enableCommsKeyboardTracking();

  const sendMsg = () => {
    const text = (input && input.value ? input.value : "").trim();
    if (!text) return;
    log.messages.push({ from: "us", text, ts: Date.now() });
    if (input) input.value = "";
    renderCommsPanel(gs, listEl);
    // Keep the composer focused so the mobile keyboard stays open.
    if (input) {
      setTimeout(() => {
        try {
          input.focus();
          const end = input.value.length;
          input.setSelectionRange(end, end);
        } catch {
          // ignore
        }
      }, 0);
    }
    // Optional lightweight simulated acknowledgement
    setTimeout(() => {
      const ack = `ACK: ${text.slice(0, 28)}${text.length > 28 ? "…" : ""}`;
      const log2 = getCommsLog(gs.id);
      log2.messages.push({ from: "gs", text: ack, ts: Date.now() });
      if (
        activeGroundStationId !== null &&
        Number(activeGroundStationId) === Number(gs.id) &&
        (userGroundStationId === null || Number(gs.id) !== Number(userGroundStationId))
      ) {
        updateCommandSequencePanel();
      }
    }, 650);
  };

  if (send) {
    // Prevent the send button from stealing focus (keeps keyboard open on mobile).
    send.onpointerdown = (e) => {
      e.preventDefault();
    };
    send.onclick = (e) => {
      e.stopPropagation();
      sendMsg();
    };
  }
  if (input) {
    input.onkeydown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMsg();
      }
    };
    input.onfocus = () => {
      setCommsKeyboardActive(true);
    };
    input.onblur = () => {
      // Blur can happen briefly during UI refresh; don't unlock immediately.
      setTimeout(() => {
        const stillOpen = getCommsKeyboardInset() > 40;
        const stillFocused = document.activeElement === input;
        if (!stillOpen && !stillFocused) setCommsKeyboardActive(false);
      }, 180);
    };
  }

  // Scroll to bottom
  try {
    listEl.scrollTop = listEl.scrollHeight;
  } catch {
    // ignore
  }
}

function isInAir(latest) {
  if (!latest) return false;
  // Prefer explicit rescue/landing state if present.
  if (latest.rescuePhase) {
    if (latest.rescuePhase === "RESCUE_COMPLETE") return false;
    // Landing/abort phases are treated as "in air" for command gating.
    return true;
  }
  return (latest.alt ?? 0) > 2;
}

function getLocalCommands(droneOrTeam, latest) {
  const state = latest || (droneOrTeam && droneOrTeam.getLatest && droneOrTeam.getLatest && droneOrTeam.getLatest());
  if (!state) return [];
  const cooldownMs =
    droneOrTeam && typeof droneOrTeam.getCooldownRemaining === "function" ? droneOrTeam.getCooldownRemaining() : 0;
  if (cooldownMs > 0) return [];
  const cmds = [];
  const inAir = isInAir(state);
  const performing = (state.command || "").toLowerCase();

  if (state.armed) {
    cmds.push("Disarm");
    if (!inAir) {
      cmds.push("Takeoff");
    } else {
      cmds.push("Land");
      if (performing !== "hold position") cmds.push("Hold position");
    }
  } else {
    cmds.push("Arm");
  }

  if (groundStations && groundStations.length > 0) {
    cmds.push("Return to Home");
  }

  return cmds;
}

function issueLocalCommand(drone, cmd, options = {}) {
  const latest = drone && drone.getLatest && drone.getLatest();
  if (!latest) return;
  const next = { ...latest, command: cmd, uptimeSec: latest.uptimeSec + 0.01 };

  if (cmd === "Arm") next.armed = true;
  if (cmd === "Disarm") {
    // Confirm mid-air disarm
    if (isInAir(latest)) {
      const ok = window.confirm("Are you sure you want to disarm in mid-air?");
      if (!ok) return;
    }
    next.armed = false;
    next.alt = 0;
    drone.setCooldown(3000);
  }
  if (cmd === "Takeoff") {
    next.armed = true;
    if (!isInAir(next)) next.alt = Math.max(next.alt, 5);
  }
  if (cmd === "Land") {
    next.alt = Math.max(0, next.alt - 5);
  }

  // Changing mission clears any stored *goto-WP relationship* for this drone (the waypoint entity remains).
  waypointTargets.delete(drone.id);
  followTargets.delete(drone.id);
  homeTargets.delete(drone.id);
  orbitTargets.delete(drone.id);

  drone.updateTelemetry(next);
  if (groundControl) groundControl.assignMission(drone.id, cmd);
  if (!options.fromSequence) {
    const key = options.selectionKey || `drone:${drone.id}`;
    appendPlannedForKey(key, cmd);
  }
  tooltipMode = "info";
  updateStatusList();
  updateTooltip();
  draw();
}

function issueTeamCommand(team, cmd, options = {}) {
  if (!team) return;
  // Apply to each member but record in the team's sequence once.
  [...team.members].forEach((id) => {
    const d = getDroneById(id);
    if (d) issueLocalCommand(d, cmd, { ...options, fromSequence: true, selectionKey: `drone:${d.id}` });
  });
  if (!options.fromSequence) {
    const key = options.selectionKey || `team:${team.id}`;
    appendPlannedForKey(key, cmd);
  }
  setPinnedTeam(team.id);
}

function issueGotoWaypointSingle(drone, wp, options = {}) {
  if (!drone || !wp) return;
  const latest = drone.getLatest && drone.getLatest();
  if (!latest) return;
  const speed = Math.max(10, Math.min(100, Math.round(wp.speedKmh || 60)));
  const alt = Math.max(5, Math.min(100, Math.round(wp.altM ?? 30)));
  let wpId = wp.wpId ?? null;
  if (wpId !== null && wpId !== undefined) {
    wpId = Number(wpId);
    if (waypoints.has(wpId)) {
      // If the user dragged the pin, keep the waypoint object in sync.
      updateWaypointPosition(wpId, wp.lat, wp.lng);
    } else {
      wpId = null;
    }
  }
  if (wpId === null || wpId === undefined) {
    wpId = createWaypoint(wp.lat, wp.lng).id;
  }

  const cmd = `Goto WP #${wpId} (spd ${speed} km/h, alt ${alt} m)`;
  const next = { ...latest, command: cmd, uptimeSec: latest.uptimeSec + 0.01, alt };
  drone.updateTelemetry(next);
  waypointTargets.set(drone.id, { wpId, speedKmh: speed, altM: alt });
  followTargets.delete(drone.id);
  homeTargets.delete(drone.id);
  orbitTargets.delete(drone.id);
  if (groundControl) groundControl.assignMission(drone.id, cmd);
  if (!options.fromSequence) {
    const key = options.selectionKey || `drone:${drone.id}`;
    appendPlannedForKey(key, cmd);
  }
}

function parseGotoWpSequenceCommand(cmd) {
  if (!cmd) return null;
  const m = String(cmd).match(/Goto\s+WP\s*#\s*(\d+).*?spd\s*(\d+)\s*km\/h.*?alt\s*(\d+)\s*m/i);
  if (!m) return null;
  const wpId = Number(m[1]);
  const speedKmh = Number(m[2]);
  const altM = Number(m[3]);
  if (!Number.isFinite(wpId)) return null;
  return {
    wpId,
    speedKmh: Number.isFinite(speedKmh) ? speedKmh : 60,
    altM: Number.isFinite(altM) ? altM : 30,
  };
}

function issueGotoWaypoint(drone, wp) {
  if (!drone) {
    const fallbackId = waypointDroneId;
    if (fallbackId !== null && fallbackId !== undefined) {
      drone = getDroneById(fallbackId);
    }
  }
  if (!drone || !wp) return;
  issueGotoWaypointSingle(drone, wp);
  closeWaypointMenu();
  tooltipMode = "info";
  pinnedDroneId = null;
  pinnedTeamId = null;
  updateStatusList();
  updateTooltip();
  draw();
}

function issueReturnHomeSingle(droneId, stationId, mode = "land", options = {}) {
  const drone = getDroneById(droneId);
  if (!drone) return;
  const latest = drone.getLatest && drone.getLatest();
  if (!latest) return;
  const cmd = `Return home (${mode})`;
  const next = { ...latest, command: cmd, uptimeSec: latest.uptimeSec + 0.01 };
  drone.updateTelemetry(next);
  if (groundControl) groundControl.assignMission(drone.id, cmd);
  if (!options.fromSequence) {
    const key = options.selectionKey || `drone:${drone.id}`;
    const label = `Return home #${stationId + 1} (${mode})`;
    appendPlannedForKey(key, label);
  }
  homeTargets.set(drone.id, stationId);
  waypointTargets.delete(drone.id);
  followTargets.delete(drone.id);
  orbitTargets.delete(drone.id);
}

function issueReturnHome(payload, options = {}) {
  if (!payload) return;
  const mode = payload.mode === "hover" ? "hover" : "land";
  if (payload.teamId !== undefined && payload.teamId !== null) {
    const team = getTeamById(payload.teamId);
    if (team) {
      [...team.members].forEach((id) =>
        issueReturnHomeSingle(id, payload.stationId, mode, { ...options, fromSequence: true, selectionKey: `drone:${id}` })
      );
      if (!options.fromSequence) {
        const key = options.selectionKey || `team:${team.id}`;
        appendPlannedForKey(key, `Return home #${payload.stationId + 1} (${mode})`);
      }
    }
  } else if (payload.droneId !== undefined && payload.droneId !== null) {
    issueReturnHomeSingle(payload.droneId, payload.stationId, mode, options);
  }
  closeHomeMenu();
  tooltipMode = "info";
  pinnedDroneId = null;
  pinnedTeamId = null;
  hoveredDroneId = null;
  tooltipSuppressUntil = performance.now() + 1200;
  if (tooltipEl) tooltipEl.style.display = "none";
  updateStatusList();
  updateCommandSequencePanel();
  updateTooltip();
  draw();
}

function closeWaypointMenu(suppressNextOpen = false, keepSelection = false) {
  const hadMenu = !!waypointMenuEl;
  if (waypointMenuEl && waypointMenuEl.parentNode) {
    waypointMenuEl.parentNode.removeChild(waypointMenuEl);
  }
  waypointMenuEl = null;
  pendingWaypoint = null;
  waypointDroneId = null;
  waypointTeamId = null;
  waypointRelocate = null;
  activeWaypointId = null;
  closeSequenceMenu();
  document.removeEventListener("pointerdown", handleWaypointOutsideClick, true);
  // Clear hover so tooltip doesn't resurrect automatically after suppression expires.
  hoveredDroneId = null;
  if (tooltipEl) tooltipEl.style.display = "none";
  // Deselect only when we actually closed an open waypoint menu and caller wants it.
  if (hadMenu && !keepSelection) {
    pinnedDroneId = null;
    pinnedTeamId = null;
    updateCommandSequencePanel();
  }
  if (suppressNextOpen) {
    const now = performance.now();
    waypointCloseSuppressUntil = now + 550; // avoid immediate reopen on same click
    tooltipSuppressUntil = now + 550; // also block tooltip reopen for a short window
  }
}

function closeOrbitMenu(suppressNextOpen = false, keepSelection = false) {
  const hadMenu = !!orbitMenuEl;
  if (orbitMenuEl && orbitMenuEl.parentNode) {
    orbitMenuEl.parentNode.removeChild(orbitMenuEl);
  }
  orbitMenuEl = null;
  pendingOrbit = null;
  orbitPreview = null;
  orbitDroneId = null;
  orbitTeamId = null;
  closeSequenceMenu();
  document.removeEventListener("pointerdown", handleOrbitOutsideClick, true);
  hoveredDroneId = null;
  if (tooltipEl) tooltipEl.style.display = "none";
  if (hadMenu && !keepSelection) {
    pinnedDroneId = null;
    pinnedTeamId = null;
    updateCommandSequencePanel();
  }
  if (suppressNextOpen) {
    const now = performance.now();
    orbitCloseSuppressUntil = now + 550;
    tooltipSuppressUntil = now + 550;
  }
}

function closeFlankMenu(suppressNextOpen = false, keepSelection = false) {
  const hadMenu = !!flankMenuEl;
  if (flankMenuEl && flankMenuEl.parentNode) {
    flankMenuEl.parentNode.removeChild(flankMenuEl);
  }
  flankMenuEl = null;
  pendingFlank = null;
  closeSequenceMenu();
  document.removeEventListener("pointerdown", handleFlankOutsideClick, true);
  hoveredDroneId = null;
  if (tooltipEl) tooltipEl.style.display = "none";
  if (hadMenu && !keepSelection) {
    pinnedDroneId = null;
    pinnedTeamId = null;
    updateCommandSequencePanel();
  }
  if (suppressNextOpen) {
    const now = performance.now();
    flankCloseSuppressUntil = now + 550;
    tooltipSuppressUntil = now + 550;
  }
}

function closeFollowMenu(suppress = true) {
  if (followMenuEl && followMenuEl.parentNode) {
    followMenuEl.parentNode.removeChild(followMenuEl);
  }
  followMenuEl = null;
  pendingFollow = null;
  if (suppress) {
    tooltipSuppressUntil = performance.now() + 400;
  }
}

function handleOrbitOutsideClick(e) {
  if (!orbitMenuEl) return;
  if (orbitMenuEl.contains(e.target)) return;
  closeOrbitMenu(true);
}

function handleFlankOutsideClick(e) {
  if (!flankMenuEl) return;
  if (flankMenuEl.contains(e.target)) return;
  // Outside clicks should not close the flank menu; use Cancel or long-press to exit.
  return;
}

function openOrbitMenu(anchor, containerPoint) {
  if (!map) return;
  if (!anchor || !containerPoint) return;

  const sel = getSelectedEntity();
  const key = getSelectionKey(sel);
  if (!sel || !key) return;
  if (performance.now() < orbitCloseSuppressUntil) return;

  tooltipMode = "info";
  tooltipSuppressUntil = performance.now() + 550;
  if (tooltipEl) tooltipEl.style.display = "none";
  closeWaypointMenu(false, true);
  closeFollowMenu(false);
  closeHomeMenu(false);
  closeRelationMenu(false);

  const selectedTeam = sel.type === "team" ? getTeamById(sel.id) : null;
  const drone = sel.type === "drone" ? getDroneById(sel.id) : null;
  if (!selectedTeam && !drone) return;

  orbitTeamId = selectedTeam ? selectedTeam.id : null;
  orbitDroneId = selectedTeam ? null : drone.id;
  if (orbitTeamId !== null) {
    pinnedTeamId = orbitTeamId;
    pinnedDroneId = null;
  } else {
    pinnedDroneId = orbitDroneId;
    pinnedTeamId = null;
  }

  const resolveCenterLatLng = () => {
    if (anchor.type === "wp") {
      if (anchor.wpId !== null && anchor.wpId !== undefined) {
        const wp = getWaypointById(anchor.wpId);
        if (wp) return { lat: wp.lat, lng: wp.lng };
      }
      return { lat: anchor.lat, lng: anchor.lng };
    }
    if (anchor.type === "home") {
      const gs = groundStations.find((g) => g.id === anchor.stationId);
      if (gs) return { lat: gs.lat, lng: gs.lng };
    }
    if (anchor.type === "drone") {
      const d = getDroneById(anchor.targetId);
      const l = d && d.getLatest && d.getLatest();
      if (l) return { lat: l.lat, lng: l.lng };
    }
    return null;
  };

  const center = resolveCenterLatLng();
  if (!center) return;

  const altNow = Number(sel.latest && sel.latest.alt);
  pendingOrbit = {
    ...(orbitTeamId !== null ? { teamId: orbitTeamId } : { droneId: orbitDroneId }),
    anchor,
    approachSpeedKmh: 60,
    radiusM: 500,
    orbitPeriodMin: 5,
    altitudeM: isFinite(altNow) ? Math.max(0, Math.round(altNow)) : 30,
    direction: "CW",
  };
  orbitPreview = { key, orbit: pendingOrbit };
  // Immediately render the default orbit (before the user touches the sliders).
  draw();

  const distKm = haversine2dMeters(sel.latest.lat, sel.latest.lng, center.lat, center.lng) / 1000;
  const distLabel = isFinite(distKm) ? `${distKm.toFixed(2)} km` : "Orbit";
  const formatEta = (km, speed) => {
    if (!isFinite(km) || !isFinite(speed) || speed <= 0) return "";
    const totalSec = (km / speed) * 3600;
    const m = Math.floor(totalSec / 60);
    const s = Math.max(0, Math.round(totalSec - m * 60));
    return `${m}m ${s.toString().padStart(2, "0")}s`;
  };
  const etaLabel = formatEta(distKm, pendingOrbit.approachSpeedKmh);

  const host = document.getElementById("app") || document.body;
  if (orbitMenuEl && orbitMenuEl.parentNode) {
    orbitMenuEl.parentNode.removeChild(orbitMenuEl);
  }
  orbitMenuEl = document.createElement("div");
  orbitMenuEl.className = "relative-menu orbit-menu";
  orbitMenuEl.addEventListener("pointerdown", (ev) => ev.stopPropagation());
  host.appendChild(orbitMenuEl);
  enableMenuDrag(orbitMenuEl);

  const mapRect = map.getContainer().getBoundingClientRect();
  orbitMenuEl.style.left = `${mapRect.left + containerPoint.x + 12}px`;
  orbitMenuEl.style.top = `${mapRect.top + containerPoint.y - 10}px`;

  const showApproachSpeed = anchor.type === "wp" || anchor.type === "home";
  const calcOrbitSpeedKmh = () => {
    const r = Math.max(10, Math.min(1000, Number(pendingOrbit.radiusM) || 0));
    const periodMin = Math.max(0.5, Number(pendingOrbit.orbitPeriodMin) || 0);
    const periodSec = periodMin * 60;
    const speedMps = (2 * Math.PI * r) / Math.max(1, periodSec);
    return Math.max(0, speedMps * 3.6);
  };
  const speedKmhLabel = () => `${Math.round(calcOrbitSpeedKmh())} km/h`;
  const periodBoundsForRadius = () => {
    const r = Math.max(10, Math.min(1000, Number(pendingOrbit.radiusM) || 10));
    const circ = 2 * Math.PI * r;
    const minSec = circ / (100 / 3.6); // 100 km/h
    const maxSec = circ / (5 / 3.6); // 5 km/h
    const minMin = Math.max(1, Math.ceil(minSec / 60));
    const maxMin = Math.max(minMin + 1, Math.ceil(maxSec / 60));
    return { minMin, maxMin };
  };

  orbitMenuEl.innerHTML = `
    <div class="menu-head">
      <h4>${distLabel}</h4>
      <span class="menu-eta">${etaLabel}</span>
    </div>
    <div class="label" style="margin-top:8px;">Radius</div>
    <div class="speed-row">
      <input type="range" min="10" max="1000" value="${pendingOrbit.radiusM}" step="10" data-orbit-radius>
      <span data-orbit-radius-label>${pendingOrbit.radiusM} m</span>
    </div>
    <div class="label" style="margin-top:8px;">Orbit Period</div>
    <div class="speed-row">
      <input type="range" min="1" max="60" value="${pendingOrbit.orbitPeriodMin}" step="1" data-orbit-period>
      <span data-orbit-period-label>${pendingOrbit.orbitPeriodMin} min/orbit</span>
    </div>
    <div class="alt-readout" style="justify-content:flex-start; opacity:0.85;">
      Speed: <span style="margin-left:6px; font-weight:900;" data-orbit-speed>${speedKmhLabel()}</span>
    </div>
    ${showApproachSpeed ? `
      <div class="label" style="margin-top:8px;">Approach speed</div>
      <div class="speed-row">
        <input type="range" min="10" max="100" value="${pendingOrbit.approachSpeedKmh}" step="1" data-orbit-approach>
        <span data-orbit-approach-label>${pendingOrbit.approachSpeedKmh} km/h</span>
      </div>
    ` : ""}
    <div class="label" style="margin-top:8px;">Altitude</div>
    <div class="speed-row">
      <input type="range" min="0" max="200" value="${pendingOrbit.altitudeM}" step="1" data-orbit-alt>
      <span data-orbit-alt-label>${pendingOrbit.altitudeM} m</span>
    </div>
    <div class="label" style="margin-top:8px;">Direction</div>
    <div class="segmented">
      <button type="button" class="seg-btn is-active" data-orbit-dir="CW">CW</button>
      <button type="button" class="seg-btn" data-orbit-dir="CCW">CCW</button>
    </div>
    <button class="cmd-chip cmd-action" type="button" data-action="orbit-add" style="margin-top:8px;">Add Orbit</button>
  `;

  const setLbl = (selQ, text) => {
    const el = orbitMenuEl.querySelector(selQ);
    if (el) el.textContent = text;
  };
  const setOrbitSpeed = () => setLbl("[data-orbit-speed]", speedKmhLabel());
  const setOrbitPeriodBounds = () => {
    const slider = orbitMenuEl.querySelector("[data-orbit-period]");
    if (!slider) return;
    const { minMin, maxMin } = periodBoundsForRadius();
    slider.min = String(minMin);
    slider.max = String(maxMin);
    const cur = Math.max(minMin, Math.min(maxMin, Math.round(Number(pendingOrbit.orbitPeriodMin) || minMin)));
    pendingOrbit.orbitPeriodMin = cur;
    slider.value = String(cur);
    setLbl("[data-orbit-period-label]", `${cur} min/orbit`);
    setOrbitSpeed();
  };
  setOrbitPeriodBounds();

  const updateEta = () => {
    const eta = orbitMenuEl.querySelector(".menu-eta");
    if (!eta) return;
    const center2 = resolveCenterLatLng();
    if (!center2) return;
    const latest = getSelectedEntity()?.latest;
    if (!latest) return;
    const km = haversine2dMeters(latest.lat, latest.lng, center2.lat, center2.lng) / 1000;
    eta.textContent = showApproachSpeed ? formatEta(km, pendingOrbit.approachSpeedKmh) : "";
  };

  const approach = orbitMenuEl.querySelector("[data-orbit-approach]");
  if (approach) {
    approach.addEventListener("input", (e) => {
      const v = Math.max(10, Math.min(100, Number(e.target.value) || 60));
      pendingOrbit.approachSpeedKmh = Math.round(v);
      setLbl("[data-orbit-approach-label]", `${pendingOrbit.approachSpeedKmh} km/h`);
      updateEta();
      orbitPreview = { key, orbit: pendingOrbit };
      draw();
    });
  }

  const radius = orbitMenuEl.querySelector("[data-orbit-radius]");
  if (radius) {
    radius.addEventListener("input", (e) => {
      const v = Math.max(10, Math.min(1000, Number(e.target.value) || 80));
      pendingOrbit.radiusM = Math.round(v / 10) * 10;
      setLbl("[data-orbit-radius-label]", `${pendingOrbit.radiusM} m`);
      orbitPreview = { key, orbit: pendingOrbit };
      setOrbitPeriodBounds();
      setOrbitSpeed();
      draw();
    });
  }

  const period = orbitMenuEl.querySelector("[data-orbit-period]");
  if (period) {
    period.addEventListener("input", (e) => {
      const min = Number(period.min) || 1;
      const max = Number(period.max) || 60;
      const v = Math.max(min, Math.min(max, Number(e.target.value) || min));
      pendingOrbit.orbitPeriodMin = Math.round(v);
      setLbl("[data-orbit-period-label]", `${pendingOrbit.orbitPeriodMin} min/orbit`);
      orbitPreview = { key, orbit: pendingOrbit };
      setOrbitSpeed();
      draw();
    });
  }

  const alt = orbitMenuEl.querySelector("[data-orbit-alt]");
  if (alt) {
    alt.addEventListener("input", (e) => {
      const v = Math.max(0, Math.min(200, Number(e.target.value) || 0));
      pendingOrbit.altitudeM = Math.round(v);
      setLbl("[data-orbit-alt-label]", `${pendingOrbit.altitudeM} m`);
      orbitPreview = { key, orbit: pendingOrbit };
      draw();
    });
  }

  orbitMenuEl.querySelectorAll("[data-orbit-dir]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const dir = btn.dataset.orbitDir === "CCW" ? "CCW" : "CW";
      pendingOrbit.direction = dir;
      orbitMenuEl.querySelectorAll("[data-orbit-dir]").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      orbitPreview = { key, orbit: pendingOrbit };
      draw();
    });
  });

  const add = orbitMenuEl.querySelector("[data-action='orbit-add']");
  if (add) {
    add.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!pendingOrbit || !groundControl) return;
      const sel2 = getSelectedEntity();
      const key2 = getSelectionKey(sel2);
      if (!key2) return;
      addOrbitToSequence(key2, pendingOrbit);
      closeOrbitMenu();
      tooltipMode = "info";
      pinnedDroneId = null;
      pinnedTeamId = null;
      hoveredDroneId = null;
      tooltipSuppressUntil = performance.now() + 1200;
      if (tooltipEl) tooltipEl.style.display = "none";
      updateStatusList();
      updateCommandSequencePanel();
      updateTooltip();
      draw();
    });
  }

  document.addEventListener("pointerdown", handleOrbitOutsideClick, true);
  // Ensure orbit is visible right after the menu is shown.
  draw();
}

function openFlankMenu(anchor, containerPoint) {
  if (!map) return;
  if (!anchor || !containerPoint) return;

  const sel = getSelectedEntity();
  const key = getSelectionKey(sel);
  if (!sel || !key) return;
  if (performance.now() < flankCloseSuppressUntil) return;

  tooltipMode = "info";
  tooltipSuppressUntil = performance.now() + 550;
  if (tooltipEl) tooltipEl.style.display = "none";
  closeWaypointMenu(false, true);
  closeFollowMenu(false);
  closeHomeMenu(false);
  closeRelationMenu(false);
  closeOrbitMenu(false, true);

  const selectedTeam = sel.type === "team" ? getTeamById(sel.id) : null;
  const drone = sel.type === "drone" ? getDroneById(sel.id) : null;
  if (!selectedTeam && !drone) return;

  if (selectedTeam) {
    pinnedTeamId = selectedTeam.id;
    pinnedDroneId = null;
  } else {
    pinnedDroneId = drone.id;
    pinnedTeamId = null;
  }

  const anchorLatLng = resolveFlankAnchor(anchor);
  if (!anchorLatLng) return;

  const altNow = Number(sel.latest && sel.latest.alt);
  const fromLatLng = sel && sel.latest ? { lat: sel.latest.lat, lng: sel.latest.lng } : null;
  const approachBearing =
    sel && sel.latest ? bearingDeg(anchorLatLng.lat, anchorLatLng.lng, sel.latest.lat, sel.latest.lng) : 0;
  const initialSolution = fromLatLng ? computeFlankSolution(anchorLatLng, approachBearing, 500, fromLatLng) : null;
  const autoDir = initialSolution && initialSolution.direction ? initialSolution.direction : "CW";

  pendingFlank = {
    ...(selectedTeam ? { teamId: selectedTeam.id } : { droneId: drone.id }),
    anchor,
    approachSpeedKmh: 60,
    diameterM: 500,
    altitudeM: isFinite(altNow) ? Math.max(0, Math.round(altNow)) : 30,
    direction: autoDir,
    approachBearingDeg: approachBearing,
    directionLocked: false,
  };

  const host = document.getElementById("app") || document.body;
  if (flankMenuEl && flankMenuEl.parentNode) {
    flankMenuEl.parentNode.removeChild(flankMenuEl);
  }
  flankMenuEl = document.createElement("div");
  flankMenuEl.className = "relative-menu flank-menu";
  flankMenuEl.addEventListener("pointerdown", (ev) => ev.stopPropagation());
  host.appendChild(flankMenuEl);
  enableMenuDrag(flankMenuEl);

  const mapRect = map.getContainer().getBoundingClientRect();
  flankMenuEl.style.left = `${mapRect.left + containerPoint.x + 12}px`;
  flankMenuEl.style.top = `${mapRect.top + containerPoint.y - 10}px`;

  const formatEta = (sec) => {
    if (!isFinite(sec) || sec <= 0) return "";
    const m = Math.floor(sec / 60);
    const s = Math.max(0, Math.round(sec - m * 60));
    return `${m}m ${s.toString().padStart(2, "0")}s`;
  };

  const calcPathMeters = () => {
    if (!sel || !sel.latest) return null;
    const from = { lat: sel.latest.lat, lng: sel.latest.lng };
    let dir = pendingFlank.direction;
    const geom = computeFlankSolution(anchorLatLng, pendingFlank.approachBearingDeg, pendingFlank.diameterM, from);
    if (!geom) return null;
    dir = geom.direction || dir;
    pendingFlank.direction = dir;
    const distToEntry =
      geom.distToEntry ?? haversine2dMeters(sel.latest.lat, sel.latest.lng, geom.entryPoint.lat, geom.entryPoint.lng);
    const arcLen =
      geom.pathType === "line"
        ? geom.segmentLenM ?? haversine2dMeters(geom.entryPoint.lat, geom.entryPoint.lng, anchorLatLng.lat, anchorLatLng.lng)
        : arcLengthForDirection(geom.radiusM, geom.aEntry, geom.aTarget, dir);
    return distToEntry + arcLen;
  };

  const calcEtaSec = () => {
    const distM = calcPathMeters();
    if (!isFinite(distM) || distM <= 0) return null;
    const speedMps = Math.max(1, pendingFlank.approachSpeedKmh / 3.6);
    return distM / speedMps;
  };

  const updateEta = () => {
    const etaEl = flankMenuEl.querySelector(".menu-eta");
    const titleEl = flankMenuEl.querySelector(".menu-head h4");
    if (!etaEl || !titleEl) return;
    const distM = calcPathMeters();
    if (!isFinite(distM)) {
      etaEl.textContent = "";
      titleEl.textContent = "Flank";
      return;
    }
    const km = distM / 1000;
    titleEl.textContent = `${km.toFixed(km >= 10 ? 1 : 2)} km`;
    const sec = calcEtaSec();
    etaEl.textContent = formatEta(sec);
  };

  flankMenuEl.innerHTML = `
    <div class="menu-head">
      <h4>${(() => {
        const distM = calcPathMeters();
        if (!isFinite(distM)) return "Flank";
        const km = distM / 1000;
        return `${km.toFixed(km >= 10 ? 1 : 2)} km`;
      })()}</h4>
      <span class="menu-eta">${formatEta(calcEtaSec())}</span>
    </div>
    <div class="label" style="margin-top:8px;">Distance (diameter)</div>
    <div class="speed-row">
      <input type="range" min="100" max="2000" value="${pendingFlank.diameterM}" step="10" data-flank-diameter>
      <span data-flank-diameter-label>${pendingFlank.diameterM} m</span>
    </div>
    <div class="label" style="margin-top:8px;">Approach speed</div>
    <div class="speed-row">
      <input type="range" min="10" max="100" value="${pendingFlank.approachSpeedKmh}" step="1" data-flank-speed>
      <span data-flank-speed-label>${pendingFlank.approachSpeedKmh} km/h</span>
    </div>
    <div class="label" style="margin-top:8px;">Altitude</div>
    <div class="speed-row">
      <input type="range" min="0" max="200" value="${pendingFlank.altitudeM}" step="1" data-flank-alt>
      <span data-flank-alt-label>${pendingFlank.altitudeM} m</span>
    </div>
    <div class="label" style="margin-top:8px;">Bearing</div>
    <div class="flank-knob-wrap">
      <div class="flank-knob" data-flank-knob data-no-drag="1">
        <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          <circle class="flank-knob-ring" cx="50" cy="50" r="40" />
          <line class="flank-knob-tick" x1="50" y1="10" x2="50" y2="20" />
          <line class="flank-knob-handle" x1="50" y1="50" x2="50" y2="14" />
          <circle class="flank-knob-dot" cx="50" cy="50" r="4" />
        </svg>
        <div class="flank-knob-value" data-flank-bearing-label>${Math.round(pendingFlank.approachBearingDeg)}°</div>
      </div>
    </div>
    <div style="display:flex; gap:8px; margin-top:8px;">
      <button class="cmd-chip cmd-action" type="button" data-action="flank-add" style="flex:1;">Add Flank</button>
    </div>
  `;

  const setLbl = (selQ, val) => {
    const el = flankMenuEl.querySelector(selQ);
    if (el) el.textContent = val;
  };

  const diam = flankMenuEl.querySelector("[data-flank-diameter]");
  if (diam) {
    diam.addEventListener("input", (e) => {
      const v = Math.max(100, Math.min(2000, Number(e.target.value) || 500));
      pendingFlank.diameterM = Math.round(v / 10) * 10;
      setLbl("[data-flank-diameter-label]", `${pendingFlank.diameterM} m`);
      updateEta();
      draw();
    });
  }

  const spd = flankMenuEl.querySelector("[data-flank-speed]");
  if (spd) {
    spd.addEventListener("input", (e) => {
      const v = Math.max(10, Math.min(100, Number(e.target.value) || 60));
      pendingFlank.approachSpeedKmh = Math.round(v);
      setLbl("[data-flank-speed-label]", `${pendingFlank.approachSpeedKmh} km/h`);
      updateEta();
      draw();
    });
  }

  const alt = flankMenuEl.querySelector("[data-flank-alt]");
  if (alt) {
    alt.addEventListener("input", (e) => {
      const v = Math.max(0, Math.min(200, Number(e.target.value) || 0));
      pendingFlank.altitudeM = Math.round(v);
      setLbl("[data-flank-alt-label]", `${pendingFlank.altitudeM} m`);
    });
  }

  const knob = flankMenuEl.querySelector("[data-flank-knob]");
  if (knob) {
    const getClientPoint = (ev) => {
      if (ev.touches && ev.touches[0]) {
        return { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
      }
      return { x: ev.clientX ?? 0, y: ev.clientY ?? 0 };
    };
    const getBearingFromPointer = (ev) => {
      const p = getClientPoint(ev);
      const rect = knob.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = p.x - cx;
      const dy = p.y - cy;
      // Bearing: 0° = North, 90° = East
      const rad = Math.atan2(dx, -dy);
      const deg = (rad * 180) / Math.PI;
      return (deg + 360) % 360;
    };

    const setBearing = (deg) => {
      const norm = ((deg % 360) + 360) % 360;
      pendingFlank.approachBearingDeg = norm;
      updateFlankBearingUI();
      updateEta();
      draw();
    };

    const onMove = (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      setBearing(getBearingFromPointer(ev));
    };

    knob.addEventListener("pointerdown", (ev) => {
      if (typeof ev.button === "number" && ev.button !== 0) return;
      ev.preventDefault();
      ev.stopPropagation();
      try {
        knob.setPointerCapture(ev.pointerId);
      } catch {
        // ignore
      }
      onMove(ev);
      const move = (e) => onMove(e);
      const up = (e) => {
        try {
          knob.releasePointerCapture(ev.pointerId);
        } catch {
          // ignore
        }
        window.removeEventListener("pointermove", move, true);
        window.removeEventListener("pointerup", up, true);
        window.removeEventListener("pointercancel", up, true);
      };
      window.addEventListener("pointermove", move, true);
      window.addEventListener("pointerup", up, true);
      window.addEventListener("pointercancel", up, true);
    });

    knob.addEventListener("click", (ev) => {
      if (typeof ev.button === "number" && ev.button !== 0) return;
      ev.preventDefault();
      ev.stopPropagation();
      setBearing(getBearingFromPointer(ev));
    });

    knob.addEventListener("mousedown", (ev) => {
      if (typeof ev.button === "number" && ev.button !== 0) return;
      ev.preventDefault();
      ev.stopPropagation();
      setBearing(getBearingFromPointer(ev));
    });

    knob.addEventListener(
      "touchstart",
      (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        setBearing(getBearingFromPointer(ev));
        const move = (e) => {
          e.preventDefault();
          e.stopPropagation();
          setBearing(getBearingFromPointer(e));
        };
        const up = (e) => {
          e.preventDefault();
          e.stopPropagation();
          window.removeEventListener("touchmove", move, true);
          window.removeEventListener("touchend", up, true);
          window.removeEventListener("touchcancel", up, true);
        };
        window.addEventListener("touchmove", move, { passive: false, capture: true });
        window.addEventListener("touchend", up, { capture: true });
        window.addEventListener("touchcancel", up, { capture: true });
      },
      { passive: false }
    );
    knob.addEventListener(
      "touchmove",
      (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        setBearing(getBearingFromPointer(ev));
      },
      { passive: false }
    );
  }

  const unlock = flankMenuEl.querySelector("[data-action='flank-unlock']");
  if (unlock) {
    unlock.addEventListener("click", (e) => {
      e.stopPropagation();
      pendingFlank.directionLocked = false;
      updateFlankDirectionHint();
      draw();
    });
  }

  const add = flankMenuEl.querySelector("[data-action='flank-add']");
  if (add) {
    add.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!pendingFlank || !groundControl) return;
      const key2 = getSelectionKey(getSelectedEntity());
      if (!key2) return;
      addFlankToSequence(key2, pendingFlank);
      closeFlankMenu();
      tooltipMode = "info";
      pinnedDroneId = null;
      pinnedTeamId = null;
      hoveredDroneId = null;
      tooltipSuppressUntil = performance.now() + 1200;
      if (tooltipEl) tooltipEl.style.display = "none";
      updateStatusList();
      updateCommandSequencePanel();
      updateTooltip();
      draw();
    });
  }

  document.addEventListener("pointerdown", handleFlankOutsideClick, true);
  updateFlankBearingUI();
  draw();
}

function updateFlankEtaDisplay() {
  if (!flankMenuEl || !pendingFlank) return;
  const sel = getSelectedEntity();
  if (!sel || !sel.latest) return;
  const anchor = resolveFlankAnchor(pendingFlank.anchor);
  if (!anchor) return;
  const from = { lat: sel.latest.lat, lng: sel.latest.lng };
  const geom = computeFlankSolution(anchor, pendingFlank.approachBearingDeg, pendingFlank.diameterM, from);
  if (!geom) return;
  pendingFlank.direction = geom.direction || pendingFlank.direction;
  const distToEntry =
    geom.distToEntry ?? haversine2dMeters(from.lat, from.lng, geom.entryPoint.lat, geom.entryPoint.lng);
  const arcLen =
    geom.pathType === "line"
      ? geom.segmentLenM ?? haversine2dMeters(geom.entryPoint.lat, geom.entryPoint.lng, anchor.lat, anchor.lng)
      : arcLengthForDirection(geom.radiusM, geom.aEntry, geom.aTarget, geom.direction || "CW");
  const totalM = distToEntry + arcLen;
  const etaEl = flankMenuEl.querySelector(".menu-eta");
  const titleEl = flankMenuEl.querySelector(".menu-head h4");
  if (etaEl) {
    const speedMps = Math.max(1, pendingFlank.approachSpeedKmh / 3.6);
    const sec = totalM / speedMps;
    etaEl.textContent = formatEta(sec);
  }
  if (titleEl) {
    const km = totalM / 1000;
    titleEl.textContent = `${km.toFixed(km >= 10 ? 1 : 2)} km`;
  }
}

function updateFlankDirectionHint() {
  return;
}

function updateFlankBearingUI() {
  if (!flankMenuEl || !pendingFlank) return;
  const label = flankMenuEl.querySelector("[data-flank-bearing-label]");
  if (label) label.textContent = `${Math.round(pendingFlank.approachBearingDeg)}°`;
  const handle = flankMenuEl.querySelector(".flank-knob-handle");
  const tick = flankMenuEl.querySelector(".flank-knob-tick");
  if (handle || tick) {
    const deg = Math.round(pendingFlank.approachBearingDeg) % 360;
    const rot = `rotate(${deg} 50 50)`;
    if (handle) handle.setAttribute("transform", rot);
    if (tick) tick.setAttribute("transform", rot);
  }
}

function addOrbitToSequence(key, orbit) {
  if (!key || !orbit || !groundControl) return;
  const a = orbit.anchor;
  if (!a || !a.type) return;

  const speed = Math.max(10, Math.min(100, Math.round(orbit.approachSpeedKmh || 60)));
  const radius = Math.max(10, Math.min(1000, Math.round(orbit.radiusM || 80)));
  const periodMin = Math.max(1, Math.min(60, Math.round(orbit.orbitPeriodMin || 5)));
  const alt = Math.max(0, Math.min(200, Math.round(orbit.altitudeM || 0)));
  const dir = orbit.direction === "CCW" ? "CCW" : "CW";

  const orbitSpeedKmh = Math.max(0, ((2 * Math.PI * radius) / (periodMin * 60)) * 3.6);
  const orbitSpeedLabel = Math.round(orbitSpeedKmh);

  let pre = "Goto WP";
  let around = "Waypoint";
  if (a.type === "home") {
    pre = `Goto home #${a.stationId + 1} (spd ${speed} km/h)`;
    around = `Home #${a.stationId + 1}`;
  } else if (a.type === "drone") {
    pre = `Follow drone #${a.targetId + 1}`;
    around = `Drone #${a.targetId + 1}`;
  } else if (a.type === "wp") {
    let wpId = a.wpId;
    if (wpId === null || wpId === undefined) {
      const wp = createWaypoint(a.lat, a.lng, { name: "Orbit center" });
      wpId = wp ? wp.id : null;
    }
    if (wpId !== null && wpId !== undefined) {
      pre = `Goto WP #${wpId} (spd ${speed} km/h, alt ${alt} m)`;
      around = `WP #${wpId}`;
      orbit.anchor = { type: "wp", wpId };
    } else {
      pre = `Goto WP (spd ${speed} km/h, alt ${alt} m)`;
      around = "Waypoint";
    }
  } else {
    pre = `Goto WP (spd ${speed} km/h, alt ${alt} m)`;
    around = "Waypoint";
  }

  const orbitCmd = `Orbit (around ${around}, r ${radius} m, alt ${alt} m, ${periodMin} min/orbit, spd ${orbitSpeedLabel} km/h, ${dir})`;
  groundControl.appendPlanned(key, pre);
  groundControl.appendPlanned(key, orbitCmd);

  // Persist a lightweight visualization for the selected entity so it appears when selected.
  const spec = { anchor: a, radiusM: radius, orbitPeriodMin: periodMin, orbitSpeedKmh: orbitSpeedLabel, altitudeM: alt, direction: dir, approachSpeedKmh: speed };
  if (key.startsWith("team:")) {
    const teamId = Number(key.slice("team:".length));
    const team = getTeamById(teamId);
    if (team) [...team.members].forEach((id) => orbitTargets.set(id, spec));
  } else if (key.startsWith("drone:")) {
    const droneId = Number(key.slice("drone:".length));
    if (Number.isFinite(droneId)) orbitTargets.set(droneId, spec);
  }
}

function closeRelationMenu(suppress = true) {
  if (relationMenuEl && relationMenuEl.parentNode) {
    relationMenuEl.parentNode.removeChild(relationMenuEl);
  }
  relationMenuEl = null;
  pendingRelation = null;
  if (suppress) {
    tooltipSuppressUntil = performance.now() + 400;
  }
}

function closeHomeMenu(suppress = true) {
  if (homeMenuEl && homeMenuEl.parentNode) {
    homeMenuEl.parentNode.removeChild(homeMenuEl);
  }
  homeMenuEl = null;
  pendingHome = null;
  if (suppress) {
    tooltipSuppressUntil = performance.now() + 400;
  }
}

function closeStatusMemberMenu() {
  if (statusMemberMenuEl && statusMemberMenuEl.parentNode) {
    statusMemberMenuEl.parentNode.removeChild(statusMemberMenuEl);
  }
  statusMemberMenuEl = null;
  pendingStatusMember = null;
  document.removeEventListener("pointerdown", handleStatusMemberOutsideClick, true);
}

function handleStatusMemberOutsideClick(e) {
  if (!statusMemberMenuEl) return;
  if (statusMemberMenuEl.contains(e.target)) return;
  closeStatusMemberMenu();
}

function openStatusMemberMenu(droneId, teamId, anchorEl) {
  const drone = getDroneById(droneId);
  const team = getTeamById(teamId);
  if (!drone || !team) return;

  closeStatusMemberMenu();
  pendingStatusMember = { droneId, teamId };

  const host = document.getElementById("app") || document.body;
  statusMemberMenuEl = document.createElement("div");
  statusMemberMenuEl.className = "relative-menu status-member-menu";
  statusMemberMenuEl.innerHTML = `
    <div class="menu-head">
      <h4>Drone #${droneId + 1}</h4>
    </div>
    <button class="cmd-chip cmd-action" type="button" data-action="leave-team">Remove from Team</button>
  `;
  statusMemberMenuEl.addEventListener("pointerdown", (ev) => ev.stopPropagation());
  host.appendChild(statusMemberMenuEl);
  enableMenuDrag(statusMemberMenuEl);

  const position = (el) => {
    if (!statusMemberMenuEl || !el) return;
    const hostRect = host.getBoundingClientRect();
    const aRect = el.getBoundingClientRect();

    const pad = 10;
    const menuW = statusMemberMenuEl.offsetWidth || 180;
    const menuH = statusMemberMenuEl.offsetHeight || 90;

    // Prefer positioning right next to the drone's name in the status row.
    let left = aRect.right - hostRect.left + pad;
    let top = aRect.top - hostRect.top + aRect.height / 2 - menuH / 2;

    // If it doesn't fit to the right, flip to the left side of the label.
    if (left + menuW + pad > hostRect.width) {
      left = aRect.left - hostRect.left - menuW - pad;
    }

    const maxLeft = hostRect.width - menuW - pad;
    const maxTop = hostRect.height - menuH - pad;
    left = Math.max(pad, Math.min(maxLeft, left));
    top = Math.max(pad, Math.min(maxTop, top));

    statusMemberMenuEl.style.left = `${left}px`;
    statusMemberMenuEl.style.top = `${top}px`;
  };

  position(anchorEl);
  // Re-anchor during status re-render, unless the user dragged it.
  statusMemberMenuEl._reposition = (el) => {
    if (statusMemberMenuEl && statusMemberMenuEl._dragged) return;
    position(el);
  };

  const btn = statusMemberMenuEl.querySelector("[data-action='leave-team']");
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeStatusMemberMenu();
      detachFromTeam(droneId);
      tooltipSuppressUntil = performance.now() + 600;
      if (tooltipEl) tooltipEl.style.display = "none";
      updateStatusList();
      updateTooltip();
      forceRedraw();
    });
  }

  document.addEventListener("pointerdown", handleStatusMemberOutsideClick, true);
}

function openHomePickerMenu(anchorPoint = null) {
  if (!map || !groundStations || groundStations.length === 0) return;
  const team = pinnedTeamId !== null ? getTeamById(pinnedTeamId) : null;
  const drone = pinnedDroneId !== null ? getDroneById(pinnedDroneId) : null;
  const latest = team ? getTeamSnapshot(team) : drone && drone.getLatest && drone.getLatest();
  if (!latest) return;

  tooltipMode = "info";
  tooltipSuppressUntil = performance.now() + 550;
  if (tooltipEl) tooltipEl.style.display = "none";
  closeWaypointMenu(false, true);
  closeFollowMenu(false);

  // Preselect nearest home so the flow matches "click home icon" (mode + confirm).
  let nearestId = groundStations[0].id;
  let nearestDist = Infinity;
  groundStations.forEach((gs) => {
    const dist = haversine2dMeters(latest.lat, latest.lng, gs.lat, gs.lng);
    if (isFinite(dist) && dist < nearestDist) {
      nearestDist = dist;
      nearestId = gs.id;
    }
  });

  pendingHome = {
    ...(team ? { teamId: team.id } : { droneId: drone.id }),
    stationId: nearestId,
    mode: "land",
  };

  if (homeMenuEl && homeMenuEl.parentNode) {
    homeMenuEl.parentNode.removeChild(homeMenuEl);
  }
  homeMenuEl = document.createElement("div");
  homeMenuEl.className = "relative-menu";

  const entries = groundStations
    .map((gs) => {
      const dist = haversine2dMeters(latest.lat, latest.lng, gs.lat, gs.lng);
      const distKm = dist / 1000;
      const label = dist < 1000 ? `${Math.round(dist)} m` : `${distKm.toFixed(2)} km`;
      const active = pendingHome.stationId === gs.id ? " is-active" : "";
      return `<button class="cmd-chip cmd-action${active}" type="button" data-home="${gs.id}">Home #${
        gs.id + 1
      } (${label})</button>`;
    })
    .join("");

  homeMenuEl.innerHTML = `
    <div class="menu-head">
      <h4>Return to Home #${pendingHome.stationId + 1}</h4>
    </div>
    <div class="segmented">
      <button type="button" class="seg-btn is-active" data-mode="land">Land</button>
      <button type="button" class="seg-btn" data-mode="hover">Hover</button>
    </div>
    <div class="command-list cmd-action-list column">${entries}</div>
    <button class="cmd-chip cmd-action" type="button" data-action="rth">Return to Home</button>
  `;

  const pt = anchorPoint || map.latLngToContainerPoint([latest.lat, latest.lng]);
  const mapRect = map.getContainer().getBoundingClientRect();
  homeMenuEl.style.left = `${mapRect.left + pt.x + 12}px`;
  homeMenuEl.style.top = `${mapRect.top + pt.y - 10}px`;
  homeMenuEl.addEventListener("pointerdown", (ev) => ev.stopPropagation());

  const host = document.getElementById("app") || document.body;
  host.appendChild(homeMenuEl);
  enableMenuDrag(homeMenuEl);
  // Draw the default (closest) home preview line immediately.
  draw();

  const updateTitle = () => {
    const h4 = homeMenuEl.querySelector("h4");
    if (h4 && pendingHome && pendingHome.stationId !== null && pendingHome.stationId !== undefined) {
      h4.textContent = `Return to Home #${pendingHome.stationId + 1}`;
    }
  };

  homeMenuEl.querySelectorAll(".seg-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const mode = btn.dataset.mode;
      pendingHome.mode = mode === "hover" ? "hover" : "land";
      homeMenuEl.querySelectorAll(".seg-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
    });
  });

  homeMenuEl.querySelectorAll("[data-home]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const homeId = Number(btn.dataset.home);
      if (!Number.isFinite(homeId)) return;
      pendingHome.stationId = homeId;
      homeMenuEl.querySelectorAll("[data-home]").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      updateTitle();
      draw();
    });
  });

  const act = homeMenuEl.querySelector("[data-action='rth']");
  if (act) {
    act.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!pendingHome || pendingHome.stationId === null || pendingHome.stationId === undefined) return;
      issueReturnHome(pendingHome);
    });
  }
}

function openHomeMenu(latlng, containerPoint, station) {
  const team = pinnedTeamId !== null ? getTeamById(pinnedTeamId) : null;
  const drone = pinnedDroneId !== null ? getDroneById(pinnedDroneId) : null;
  if (!team && !drone) return;

  tooltipSuppressUntil = performance.now() + 550;
  if (tooltipEl) tooltipEl.style.display = "none";
  closeWaypointMenu(false, true);
  closeFollowMenu(false);
  closeOrbitMenu(false, true);

  pendingHome = {
    ...(team ? { teamId: team.id } : { droneId: drone.id }),
    stationId: station.id,
    mode: "land",
  };

  if (homeMenuEl && homeMenuEl.parentNode) {
    homeMenuEl.parentNode.removeChild(homeMenuEl);
  }
  homeMenuEl = document.createElement("div");
  homeMenuEl.className = "relative-menu";
  homeMenuEl.innerHTML = `
    <div class="menu-head">
      <h4>Return to Home #${station.id + 1}</h4>
    </div>
    <div class="segmented">
      <button type="button" class="seg-btn is-active" data-mode="land">Land</button>
      <button type="button" class="seg-btn" data-mode="hover">Hover</button>
    </div>
    <div class="command-list cmd-action-list column" style="margin-top:8px;">
      <button class="cmd-chip cmd-action" type="button" data-action="rth">Return to Home</button>
      <button class="cmd-chip cmd-action" type="button" data-action="orbit-home">Orbit</button>
    </div>
  `;

  const mapRect = map.getContainer().getBoundingClientRect();
  homeMenuEl.style.left = `${mapRect.left + containerPoint.x + 12}px`;
  homeMenuEl.style.top = `${mapRect.top + containerPoint.y - 10}px`;
  homeMenuEl.addEventListener("pointerdown", (ev) => ev.stopPropagation());

  const host = document.getElementById("app") || document.body;
  host.appendChild(homeMenuEl);
  enableMenuDrag(homeMenuEl);
  // Draw the preview line to the selected home immediately on open.
  draw();

  homeMenuEl.querySelectorAll(".seg-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const mode = btn.dataset.mode;
      pendingHome.mode = mode;
      homeMenuEl.querySelectorAll(".seg-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
    });
  });

  const act = homeMenuEl.querySelector("[data-action='rth']");
  if (act) {
    act.addEventListener("click", (e) => {
      e.stopPropagation();
      issueReturnHome(pendingHome);
    });
  }

  const orbit = homeMenuEl.querySelector("[data-action='orbit-home']");
  if (orbit) {
    orbit.addEventListener("click", (e) => {
      e.stopPropagation();
      const anchor = { type: "home", stationId: station.id };
      closeHomeMenu(false);
      openOrbitMenu(anchor, containerPoint);
    });
  }
}

function issueFollowCommand(follower, targetId) {
  if (!follower || targetId === null || targetId === undefined) return;
  const latest = follower.getLatest && follower.getLatest();
  if (!latest) return;
  issueFollowCommandSingle(follower.id, targetId);
  closeFollowMenu();
  // Suppress tooltip and deselect after issuing follow.
  tooltipSuppressUntil = performance.now() + 2000;
  hoveredDroneId = null;
  tooltipMode = "info";
  pinnedDroneId = null;
  pinnedTeamId = null;
  if (tooltipEl) tooltipEl.style.display = "none";
  closeHomeMenu(false);
  closeWaypointMenu(false, true);
  updateStatusList();
  updateCommandSequencePanel();
  updateTooltip();
  draw();
}

function issueFollowCommandSingle(followerId, targetId, options = {}) {
  const follower = getDroneById(followerId);
  if (!follower || targetId === null || targetId === undefined) return;
  const latest = follower.getLatest && follower.getLatest();
  if (!latest) return;
  const cmd = `Follow drone #${targetId + 1}`;
  const next = { ...latest, command: cmd, uptimeSec: latest.uptimeSec + 0.01 };
  follower.updateTelemetry(next);
  if (groundControl) groundControl.assignMission(follower.id, cmd);
  // Record only when issued directly by the user (not via sequence playback).
  if (!options.fromSequence) {
    const key = options.selectionKey || `drone:${follower.id}`;
    appendPlannedForKey(key, cmd);
  }
  followTargets.set(follower.id, targetId);
  waypointTargets.delete(follower.id);
  homeTargets.delete(follower.id);
  orbitTargets.delete(follower.id);
}

function openFollowMenu(targetDroneId, containerPoint) {
  const followerId = pinnedDroneId;
  if (followerId === null || followerId === undefined) return;
  if (followerId === targetDroneId) return;
  const follower = getDroneById(followerId);
  const target = getDroneById(targetDroneId);
  if (!follower || !target) return;

  tooltipSuppressUntil = performance.now() + 550;
  if (tooltipEl) tooltipEl.style.display = "none";
  closeWaypointMenu(false, true);
  closeHomeMenu(false);

  pendingFollow = { followerId, targetId: targetDroneId };
  if (followMenuEl && followMenuEl.parentNode) {
    followMenuEl.parentNode.removeChild(followMenuEl);
  }
  followMenuEl = document.createElement("div");
  followMenuEl.className = "relative-menu";
  followMenuEl.innerHTML = `
    <div class="menu-head">
      <h4>Follow drone #${targetDroneId + 1}</h4>
    </div>
    <button class="cmd-chip cmd-action" type="button" data-action="follow">Follow</button>
  `;

  const mapRect = map.getContainer().getBoundingClientRect();
  followMenuEl.style.left = `${mapRect.left + containerPoint.x + 12}px`;
  followMenuEl.style.top = `${mapRect.top + containerPoint.y - 10}px`;

  followMenuEl.addEventListener("pointerdown", (ev) => ev.stopPropagation());

  const host = document.getElementById("app") || document.body;
  host.appendChild(followMenuEl);
  enableMenuDrag(followMenuEl);

  const btn = followMenuEl.querySelector("[data-action='follow']");
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      issueFollowCommand(follower, targetDroneId);
    });
  }
}

function openRelationMenu(targetId, containerPoint) {
  if (!map) return;
  const target = getDroneById(targetId);
  if (!target) return;

  const selTeam = pinnedTeamId !== null ? getTeamById(pinnedTeamId) : null;
  const selDroneId = pinnedDroneId;
  const selIsTeam = !!selTeam;
  if (!selIsTeam && (selDroneId === null || selDroneId === undefined)) return;
  if (!selIsTeam && selDroneId === targetId) return;

  const targetTeam = getTeamForDrone(targetId);
  const targetInTeam = !!targetTeam;

  const withinSelectedTeam = selIsTeam && selTeam.members.has(targetId);

  tooltipMode = "info";
  tooltipSuppressUntil = performance.now() + 550;
  if (tooltipEl) tooltipEl.style.display = "none";
  closeWaypointMenu(false, true);
  closeHomeMenu(false);
  closeFollowMenu(false);
  closeOrbitMenu(false, true);
  closeRelationMenu(false);

  pendingRelation = {
    selTeamId: selIsTeam ? selTeam.id : null,
    selDroneId: selIsTeam ? null : selDroneId,
    targetId,
    targetTeamId: targetInTeam ? targetTeam.id : null,
    withinSelectedTeam,
  };

  relationMenuEl = document.createElement("div");
  relationMenuEl.className = "relative-menu";
  relationMenuEl.addEventListener("pointerdown", (ev) => ev.stopPropagation());

  const title = `Drone #${targetId + 1}`;
  const actions = [];

  if (withinSelectedTeam) {
    actions.push({ key: "remove", label: "Remove from Team" });
  } else if (!selIsTeam) {
    // Selected is a single drone
    if (!targetInTeam) {
      actions.push({ key: "follow", label: `Follow drone #${targetId + 1}` });
      actions.push({ key: "orbit", label: `Orbit around drone #${targetId + 1}` });
      actions.push({ key: "team", label: "Form team" });
    } else {
      actions.push({ key: "assign", label: `Assign to Team #${targetTeam.id + 1}` });
      actions.push({ key: "follow", label: `Follow drone #${targetId + 1}` });
      actions.push({ key: "orbit", label: `Orbit around drone #${targetId + 1}` });
    }
  } else {
    // Selected is a team
    if (!targetInTeam) {
      actions.push({ key: "assign", label: `Add Drone #${targetId + 1} to Team #${selTeam.id + 1}` });
      actions.push({ key: "follow", label: `Follow drone #${targetId + 1}` });
      actions.push({ key: "orbit", label: `Orbit around drone #${targetId + 1}` });
    } else {
      if (targetTeam.id !== selTeam.id) {
        actions.push({ key: "unify", label: `Unify Team #${selTeam.id + 1} + Team #${targetTeam.id + 1}` });
      } else {
        actions.push({ key: "remove", label: "Remove from Team" });
      }
    }
  }

  const buttons = actions
    .map((a) => `<button class="cmd-chip cmd-action" type="button" data-rel="${a.key}">${a.label}</button>`)
    .join("");

  relationMenuEl.innerHTML = `
    <div class="menu-head">
      <h4>${title}</h4>
    </div>
    <div class="command-list cmd-action-list column">${buttons}</div>
  `;

  const mapRect = map.getContainer().getBoundingClientRect();
  relationMenuEl.style.left = `${mapRect.left + containerPoint.x + 12}px`;
  relationMenuEl.style.top = `${mapRect.top + containerPoint.y - 10}px`;

  const host = document.getElementById("app") || document.body;
  host.appendChild(relationMenuEl);
  enableMenuDrag(relationMenuEl);

  relationMenuEl.querySelectorAll("[data-rel]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const act = btn.dataset.rel;
      if (!pendingRelation) return;
      const selTeamId2 = pendingRelation.selTeamId;
      const selDroneId2 = pendingRelation.selDroneId;
      const targetId2 = pendingRelation.targetId;
      const targetTeamId2 = pendingRelation.targetTeamId;

      const finalize = (keepSelection = false) => {
        closeRelationMenu(false);
        tooltipMode = "info";
        hoveredDroneId = null;
        tooltipSuppressUntil = performance.now() + 1200;
        if (!keepSelection) {
          pinnedDroneId = null;
          pinnedTeamId = null;
        }
        if (tooltipEl) tooltipEl.style.display = "none";
        updateStatusList();
        updateCommandSequencePanel();
        updateTooltip();
        draw();
      };

      if (act === "follow") {
        if (selTeamId2 !== null) {
          const t = getTeamById(selTeamId2);
          if (t) {
            [...t.members].forEach((id) => issueFollowCommandSingle(id, targetId2, { fromSequence: true, selectionKey: `drone:${id}` }));
            appendPlannedForKey(`team:${t.id}`, `Follow drone #${targetId2 + 1}`);
          }
        } else if (selDroneId2 !== null) {
          issueFollowCommandSingle(selDroneId2, targetId2);
        }
        finalize(false);
        return;
      }

      if (act === "orbit") {
        closeRelationMenu(false);
        openOrbitMenu({ type: "drone", targetId: targetId2 }, containerPoint);
        return;
      }

      if (act === "team" && selDroneId2 !== null) {
        const t = ensureTeam([selDroneId2, targetId2]);
        closeRelationMenu(false);
        if (t) setPinnedTeam(t.id, true);
        else setPinnedDrone(selDroneId2);
        tooltipSuppressUntil = performance.now() + 800;
        if (tooltipEl) tooltipEl.style.display = "none";
        updateStatusList();
        updateCommandSequencePanel();
        updateTooltip();
        draw();
        return;
      }

      if (act === "assign") {
        if (selTeamId2 !== null) {
          const team = getTeamById(selTeamId2);
          if (team) {
            const t = ensureTeam([...team.members, targetId2]);
            closeRelationMenu(false);
            if (t) setPinnedTeam(t.id, true);
            tooltipSuppressUntil = performance.now() + 800;
            if (tooltipEl) tooltipEl.style.display = "none";
            updateStatusList();
            updateCommandSequencePanel();
            updateTooltip();
            draw();
          }
          return;
        }
        if (targetTeamId2 !== null && selDroneId2 !== null) {
          const team = getTeamById(targetTeamId2);
          if (team) {
            const t = ensureTeam([...team.members, selDroneId2]);
            closeRelationMenu(false);
            if (t) setPinnedTeam(t.id, true);
            tooltipSuppressUntil = performance.now() + 800;
            if (tooltipEl) tooltipEl.style.display = "none";
            updateStatusList();
            updateCommandSequencePanel();
            updateTooltip();
            draw();
          }
          return;
        }
      }

      if (act === "unify" && selTeamId2 !== null && targetTeamId2 !== null) {
        const a = getTeamById(selTeamId2);
        const b = getTeamById(targetTeamId2);
        if (a && b) {
          const t = ensureTeam([...a.members, ...b.members]);
          closeRelationMenu(false);
          if (t) setPinnedTeam(t.id, true);
          tooltipSuppressUntil = performance.now() + 800;
          if (tooltipEl) tooltipEl.style.display = "none";
          updateStatusList();
          updateCommandSequencePanel();
          updateTooltip();
          draw();
        }
        return;
      }

      if (act === "remove") {
        closeRelationMenu(false);
        detachFromTeam(targetId2);
        tooltipSuppressUntil = performance.now() + 800;
        if (tooltipEl) tooltipEl.style.display = "none";
        updateStatusList();
        updateCommandSequencePanel();
        updateTooltip();
        draw();
        return;
      }

      finalize(false);
    });
  });
}

function attemptFollowMenuFromPoint(containerPoint) {
  if (pinnedDroneId === null || pinnedDroneId === undefined) return;
  const near = findNearestDrone(containerPoint, getHoverRadius());
  if (!near || near.id === pinnedDroneId) return;
  closeHomeMenu(false);
  openFollowMenu(near.id, containerPoint);
}

function handleContextMenu(e) {
  e.originalEvent?.preventDefault?.();
  if (LIVE_POSITION_MODE) {
    if (pendingDistanceMeasurement) {
      cancelPendingDistanceMeasurement();
      suppressMapClickUntil = performance.now() + 350;
      longPressSuppressUntil = performance.now() + 350;
      return;
    }
    if (pendingUserHomePlacement) return;
    const measurementHit = findDistanceMeasurementHit(e.containerPoint);
    if (measurementHit) {
      openDistanceMeasurementMenu(measurementHit, e.containerPoint);
      return;
    }
    const nearGs = findNearestGroundStation(e.containerPoint, getHoverRadius() + 6);
    if (nearGs) {
      openGroundStationMenu(nearGs, e.containerPoint);
    } else {
      openLiveMapMenu(e.latlng, e.containerPoint);
    }
    return;
  }
  if (pendingUserHomePlacement) return;
  const point = e.containerPoint;
  const near = findNearestDrone(point, getHoverRadius());
  const nearGs = findNearestGroundStation(point, getHoverRadius());
  if (nearGs && pinnedDroneId === null && pinnedTeamId === null) {
    openGroundStationMenu(nearGs, point);
    return;
  }
  if (nearGs && (pinnedDroneId !== null || pinnedTeamId !== null)) {
    openHomeMenu(e.latlng, point, nearGs);
    return;
  }
  if (near && (pinnedDroneId !== null || pinnedTeamId !== null)) {
    // Relation actions moved to long-press; keep right-click for goto-wp only.
  }
  if (pinnedTeamId !== null) {
    openWaypointMenu(e.latlng, point, null, null);
    return;
  }
  if (pinnedDroneId !== null) {
    openWaypointMenu(e.latlng, point, pinnedDroneId, null);
    return;
  }
}

function attemptActionLongPress(containerPoint) {
  if (LIVE_POSITION_MODE) {
    if (pendingDistanceMeasurement) {
      cancelPendingDistanceMeasurement();
      suppressMapClickUntil = performance.now() + 350;
      longPressSuppressUntil = performance.now() + 350;
      return;
    }
    if (pendingUserHomePlacement) {
      const latlng = map.containerPointToLatLng(containerPoint);
      addUserHomeAtLatLng(latlng);
      return;
    }
    const measurementHit = findDistanceMeasurementHit(containerPoint);
    if (measurementHit) {
      openDistanceMeasurementMenu(measurementHit, containerPoint);
      return;
    }
    const nearGs = findNearestGroundStation(containerPoint, getHoverRadius() + 6);
    if (nearGs) {
      openGroundStationMenu(nearGs, containerPoint);
      return;
    }
    const near = findNearestDrone(containerPoint, getHoverRadius());
    if (near) {
      setPinnedDrone(near.id);
      openLiveDroneActionSheet(near, { x: containerPoint.x, y: containerPoint.y });
      return;
    }
    const latlng = map.containerPointToLatLng(containerPoint);
    openLiveMapMenu(latlng, containerPoint);
    return;
  }
  if (pendingUserHomePlacement) return;
  const hitWp = findNearestWaypoint(containerPoint, 16);
  const near = findNearestDrone(containerPoint, getHoverRadius());
  const nearGs = findNearestGroundStation(containerPoint, getHoverRadius());

  // Long-press while flanking: cancel flank and deselect.
  if (flankMenuEl) {
    closeFlankMenu(true);
    updateStatusList();
    updateCommandSequencePanel();
    updateTooltip();
    draw();
    return;
  }

  // Long-press on a waypoint with no selection: open WP change/delete directly (and allow dragging immediately).
  if (hitWp && pinnedDroneId === null && pinnedTeamId === null) {
    openWaypointEditModeMenu(hitWp.wpId, containerPoint);
    return;
  }

  // Long-press on a different drone while something is selected: open relation actions menu.
  if (near && (pinnedDroneId !== null || pinnedTeamId !== null)) {
    // keep the "self long-press opens commands" behavior for a selected single drone
    if (!(pinnedDroneId !== null && pinnedTeamId === null && near.id === pinnedDroneId)) {
      openRelationMenu(near.id, containerPoint);
      return;
    }
  }

  // Long-press on a drone with no prior selection: select it and open Commands immediately.
  if (near && pinnedDroneId === null && pinnedTeamId === null) {
    // An explicit long-press should override tooltip suppression and close other menus.
    tooltipSuppressUntil = 0;
    closeSequenceMenu();
    closeWaypointMenu(false, true);
    closeHomeMenu(false);
    closeFollowMenu(false);
    closeRelationMenu(false);
    closeOrbitMenu(false, true);
    setPinnedDrone(near.id);
    tooltipMode = "commands";
    updateTooltip();
    return;
  }

  // Long-press on the already-selected single drone: jump straight to Commands.
  if (near && pinnedDroneId !== null && pinnedTeamId === null && near.id === pinnedDroneId) {
    tooltipSuppressUntil = 0;
    closeSequenceMenu();
    closeWaypointMenu(false, true);
    closeHomeMenu(false);
    closeFollowMenu(false);
    closeRelationMenu(false);
    closeOrbitMenu(false, true);
    tooltipMode = "commands";
    updateTooltip();
    return;
  }

  if (nearGs && (pinnedDroneId !== null || pinnedTeamId !== null)) {
    const latlng = map.containerPointToLatLng(containerPoint);
    openHomeMenu(latlng, containerPoint, nearGs);
    return;
  }
  // Long-press on a GS with no selection: open GS menu.
  if (nearGs && pinnedDroneId === null && pinnedTeamId === null) {
    openGroundStationMenu(nearGs, containerPoint);
    return;
  }
  // Team creation/merge via long-press moved into the relation menu.

  // Long-press on empty map to open Goto WP for the current selection.
  if (!near && !nearGs) {
    // If long-pressing an existing waypoint while something is selected, treat it as a waypoint context,
    // so the menu knows which WP we pressed (for sync/edit flows).
    if (hitWp && (pinnedDroneId !== null || pinnedTeamId !== null)) {
      openWaypointMenu({ lat: hitWp.wp.lat, lng: hitWp.wp.lng }, containerPoint, null, hitWp.wpId);
      return;
    }
    if (pinnedTeamId !== null || pinnedDroneId !== null) {
      const latlng = map.containerPointToLatLng(containerPoint);
      openWaypointMenu(latlng, containerPoint, null, null);
      return;
    }
    // Long-press on empty map with no selection: create an independent waypoint.
    if (!hitWp && pinnedDroneId === null && pinnedTeamId === null) {
      const latlng = map.containerPointToLatLng(containerPoint);
      openCreateWaypointMenu(latlng, containerPoint);
      return;
    }
  }
}

function addFlankToSequence(key, flank) {
  if (!key || !flank || !groundControl) return;
  const a = flank.anchor;
  if (!a || !a.type) return;

  const speed = Math.max(10, Math.min(100, Math.round(flank.approachSpeedKmh || 60)));
  const diam = Math.max(100, Math.min(2000, Math.round(flank.diameterM || 500)));
  const alt = Math.max(0, Math.min(200, Math.round(flank.altitudeM || 0)));
  const dir = flank.direction === "CCW" ? "CCW" : "CW";

  let around = "Waypoint";
  let pre = "Flank";
  if (a.type === "home") {
    around = `Home #${a.stationId + 1}`;
  } else if (a.type === "wp") {
    let wpId = a.wpId;
    if (wpId === null || wpId === undefined) {
      const wp = createWaypoint(a.lat, a.lng, { name: "Flank point" });
      wpId = wp ? wp.id : null;
    }
    if (wpId !== null && wpId !== undefined) {
      around = `WP #${wpId}`;
      flank.anchor = { type: "wp", wpId };
    }
  }

  pre = `Flank (around ${around}, d ${diam} m, alt ${alt} m, spd ${speed} km/h, ${dir})`;
  groundControl.appendPlanned(key, pre);
}

function getWaypointPinGeometryPx() {
  const z = map && map.getZoom ? map.getZoom() : 12;
  const scale = 0.7;
  const ringOuterR = Math.max(8 * scale, Math.min(16 * scale, z * 1.0 * scale));
  const ringCy = -ringOuterR * 1.88;
  const hitR = ringOuterR * 2.4;
  return { ringOuterR, ringCy, hitR };
}

function isContainerPointOnPendingWaypointPin(containerPoint) {
  if (!map || !containerPoint) return false;
  if (!waypointMenuEl || !["goto", "edit"].includes(waypointMenuEl.dataset.mode)) return false;
  if (!pendingWaypoint) return false;
  const tip = latLngToScreen(pendingWaypoint.lat, pendingWaypoint.lng);
  if (!tip) return false;
  const { ringCy, hitR } = getWaypointPinGeometryPx();
  const ringC = { x: tip.x, y: tip.y + ringCy };
  const dTip = Math.hypot(containerPoint.x - tip.x, containerPoint.y - tip.y);
  const dRing = Math.hypot(containerPoint.x - ringC.x, containerPoint.y - ringC.y);
  return Math.min(dTip, dRing) <= hitR;
}

function closeEditWaypointMenu() {
  if (editWaypointMenuEl && editWaypointMenuEl.parentNode) {
    editWaypointMenuEl.parentNode.removeChild(editWaypointMenuEl);
  }
  editWaypointMenuEl = null;
  pendingEditWaypoint = null;
  activeWaypointId = null;
  document.removeEventListener("pointerdown", handleEditWaypointOutsideClick, true);
}

function handleEditWaypointOutsideClick(e) {
  if (!editWaypointMenuEl) return;
  if (editWaypointMenuEl.contains(e.target)) return;
  closeEditWaypointMenu();
}

function closeCreateWaypointMenu() {
  if (createWaypointMenuEl && createWaypointMenuEl.parentNode) {
    createWaypointMenuEl.parentNode.removeChild(createWaypointMenuEl);
  }
  createWaypointMenuEl = null;
  pendingCreateWaypoint = null;
  document.removeEventListener("pointerdown", handleCreateWaypointOutsideClick, true);
}

function handleCreateWaypointOutsideClick(e) {
  if (!createWaypointMenuEl) return;
  if (createWaypointMenuEl.contains(e.target)) return;
  closeCreateWaypointMenu();
}

function openCreateWaypointMenu(latlng, containerPoint) {
  if (!map || !latlng || !containerPoint) return;
  const host = document.getElementById("app") || document.body;
  closeCreateWaypointMenu();
  closeEditWaypointMenu();
  closeWaypointMenu(false, true);
  closeOrbitMenu(false, true);
  closeHomeMenu(false);
  closeFollowMenu(false);
  closeRelationMenu(false);
  closeSequenceMenu();

  pendingCreateWaypoint = { lat: latlng.lat, lng: latlng.lng };
  createWaypointMenuEl = document.createElement("div");
  createWaypointMenuEl.className = "relative-menu";
  host.appendChild(createWaypointMenuEl);
  createWaypointMenuEl.addEventListener("pointerdown", (ev) => ev.stopPropagation());
  enableMenuDrag(createWaypointMenuEl);

  const mapRect = map.getContainer().getBoundingClientRect();
  createWaypointMenuEl.style.left = `${mapRect.left + containerPoint.x + 12}px`;
  createWaypointMenuEl.style.top = `${mapRect.top + containerPoint.y - 10}px`;

  createWaypointMenuEl.innerHTML = `
    <div class="menu-head">
      <h4>Create WP</h4>
    </div>
    <div class="command-list cmd-action-list column" style="margin-top:2px;">
      <button class="cmd-chip cmd-action" data-action="wp-create" type="button">Create waypoint</button>
    </div>
  `;

  const btn = createWaypointMenuEl.querySelector("[data-action='wp-create']");
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const p = pendingCreateWaypoint;
      if (!p) return;
      createWaypoint(p.lat, p.lng);
      closeCreateWaypointMenu();
      // No auto-select/menu after creation; just add the WP and return to the map.
      activeWaypointId = null;
      draw();
    });
  }

  document.addEventListener("pointerdown", handleCreateWaypointOutsideClick, true);
}

function openEditWaypointMenu(hitWp, containerPoint) {
  if (!map || !hitWp || !hitWp.wp || !containerPoint) return;
  const host = document.getElementById("app") || document.body;

  closeEditWaypointMenu();
  closeWaypointMenu(false, true);
  closeOrbitMenu(false, true);
  closeHomeMenu(false);
  closeFollowMenu(false);
  closeRelationMenu(false);
  closeSequenceMenu();

  pendingEditWaypoint = { wpId: hitWp.wpId };
  activeWaypointId = hitWp.wpId;

  editWaypointMenuEl = document.createElement("div");
  editWaypointMenuEl.className = "relative-menu";
  host.appendChild(editWaypointMenuEl);
  editWaypointMenuEl.addEventListener("pointerdown", (ev) => ev.stopPropagation());
  enableMenuDrag(editWaypointMenuEl);

  const mapRect = map.getContainer().getBoundingClientRect();
  editWaypointMenuEl.style.left = `${mapRect.left + containerPoint.x + 12}px`;
  editWaypointMenuEl.style.top = `${mapRect.top + containerPoint.y - 10}px`;

  const droneLabel = `WP #${hitWp.wpId}`;

  editWaypointMenuEl.innerHTML = `
    <div class="menu-head">
      <h4>${droneLabel}</h4>
    </div>
    <div class="command-list cmd-action-list column" style="margin-top:2px;">
      <button class="cmd-chip cmd-action" data-action="edit-wp" type="button">Edit waypoint</button>
    </div>
  `;

  const btn = editWaypointMenuEl.querySelector("[data-action='edit-wp']");
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const p = pendingEditWaypoint;
      if (!p || p.wpId === null || p.wpId === undefined) return;
      closeEditWaypointMenu();
      openWaypointEditModeMenu(p.wpId, containerPoint);
    });
  }

  document.addEventListener("pointerdown", handleEditWaypointOutsideClick, true);
}

function renderWaypointEditModeMenu() {
  if (!waypointMenuEl || !pendingWaypoint || waypointMenuEl.dataset.mode !== "edit") return;
  const id = pendingWaypoint.wpId;
  if (id === null || id === undefined) return;
  const relocating = waypointRelocate && Number(waypointRelocate.wpId) === Number(id);
  if (relocating) {
    waypointMenuEl.innerHTML = `
      <div class="menu-head">
        <span class="menu-eta" style="display:block;">Tap map to place</span>
      </div>
    `;
    return;
  }

  waypointMenuEl.innerHTML = `
      <div class="menu-head">
        <h4>WP #${id}</h4>
        <span class="menu-eta">Drag to move</span>
      </div>
      <div class="command-list cmd-action-list column" style="margin-top:2px;">
        <button class="cmd-chip cmd-action" data-action="wp-change" type="button">Change WP</button>
        <button class="cmd-chip cmd-action" data-action="wp-delete" type="button">Delete WP</button>
      </div>
    `;

  const change = waypointMenuEl.querySelector("[data-action='wp-change']");
  if (change) {
    change.addEventListener("click", (e) => {
      e.stopPropagation();
      const wpId = pendingWaypoint && pendingWaypoint.wpId;
      if (wpId === null || wpId === undefined) return;
      waypointRelocate = { wpId: Number(wpId) };
      renderWaypointEditModeMenu();
      draw();
    });
  }

  const del = waypointMenuEl.querySelector("[data-action='wp-delete']");
  if (del) {
    del.addEventListener("click", (e) => {
      e.stopPropagation();
      const wpId = pendingWaypoint && pendingWaypoint.wpId;
      if (wpId === null || wpId === undefined) return;
      // Remove the waypoint and clear any drone relationships pointing to it.
      waypoints.delete(Number(wpId));
      for (const [droneId, t0] of waypointTargets.entries()) {
        const t = normalizeWaypointTarget(droneId);
        if (t && Number(t.wpId) === Number(wpId)) waypointTargets.delete(droneId);
      }
      closeWaypointMenu(true);
      draw();
    });
  }
}

function openWaypointEditModeMenu(wpId, containerPoint) {
  if (!map || wpId === null || wpId === undefined || !containerPoint) return;
  const wp = getWaypointById(wpId);
  if (!wp) return;

  closeWaypointMenu(false, true);
  const host = document.getElementById("app") || document.body;
  if (waypointMenuEl && waypointMenuEl.parentNode) waypointMenuEl.parentNode.removeChild(waypointMenuEl);

  waypointMenuEl = document.createElement("div");
  waypointMenuEl.className = "relative-menu";
  host.appendChild(waypointMenuEl);
  waypointMenuEl.addEventListener("pointerdown", (ev) => ev.stopPropagation());
  enableMenuDrag(waypointMenuEl);

  const mapRect = map.getContainer().getBoundingClientRect();
  waypointMenuEl.style.left = `${mapRect.left + containerPoint.x + 12}px`;
  waypointMenuEl.style.top = `${mapRect.top + containerPoint.y - 10}px`;

  waypointDroneId = null;
  waypointTeamId = null;
  pendingWaypoint = { wpId: wp.id, lat: wp.lat, lng: wp.lng };
  waypointMenuEl.dataset.mode = "edit";
  activeWaypointId = wp.id;
  waypointRelocate = null;

  renderWaypointEditModeMenu();

  document.addEventListener("pointerdown", handleWaypointOutsideClick, true);
  draw();
}

function handleWaypointOutsideClick(e) {
  if (!waypointMenuEl) return;
  if (waypointMenuEl.contains(e.target)) return;
  // While "Change WP" is active, allow a map click to place the WP without closing the menu.
  if (waypointMenuEl.dataset.mode === "edit" && waypointRelocate && pendingWaypoint && pendingWaypoint.wpId !== null && pendingWaypoint.wpId !== undefined) {
    if (Number(waypointRelocate.wpId) === Number(pendingWaypoint.wpId)) return;
  }
  // Allow dragging the pending WP pin without the menu auto-closing.
  if (map && pendingWaypoint && ["goto", "edit"].includes(waypointMenuEl.dataset.mode)) {
    try {
      const pt = map.mouseEventToContainerPoint(e);
      if (isContainerPointOnPendingWaypointPin(pt)) return;
    } catch (_) {
      // ignore
    }
  }
  closeWaypointMenu(true);
}

function openWaypointMenu(latlng, containerPoint, droneId = null, wpId = null, options = {}) {
  const selectedTeam = droneId === null || droneId === undefined ? (pinnedTeamId !== null ? getTeamById(pinnedTeamId) : null) : null;
  const drone =
    droneId !== null && droneId !== undefined
      ? getDroneById(droneId)
      : pinnedDroneId !== null
        ? getDroneById(pinnedDroneId)
        : waypointDroneId !== null
          ? getDroneById(waypointDroneId)
          : null;
  if (!drone && !selectedTeam) return;
  if (performance.now() < waypointCloseSuppressUntil) return;

  // Hide tooltip/local command menu when opening waypoint menu.
  tooltipMode = "info";
  tooltipSuppressUntil = performance.now() + 550;
  if (tooltipEl) tooltipEl.style.display = "none";
  closeCreateWaypointMenu();
  closeEditWaypointMenu();
  closeGroundStationMenu(true);
  closeFollowMenu();
  closeHomeMenu();
  closeOrbitMenu(false, true);
  closeFlankMenu(false, true);

  const latest = selectedTeam ? getTeamSnapshot(selectedTeam) : drone.getLatest && drone.getLatest();
  const defaultAlt = latest && isFinite(Number(latest.alt)) ? Math.round(Number(latest.alt)) : 30;
  const initialAlt = Math.max(5, Math.min(100, defaultAlt || 30));
  const existingWp = wpId !== null && wpId !== undefined ? getWaypointById(wpId) : null;
  const wpLat = existingWp ? existingWp.lat : latlng.lat;
  const wpLng = existingWp ? existingWp.lng : latlng.lng;
  pendingWaypoint = { wpId: existingWp ? existingWp.id : null, lat: wpLat, lng: wpLng, speedKmh: 60, altM: initialAlt };
  activeWaypointId = existingWp ? existingWp.id : null;
  waypointRelocate = null;
  const distKm = latest ? haversine2dMeters(latest.lat, latest.lng, wpLat, wpLng) / 1000 : null;
  const distLabel = distKm !== null && isFinite(distKm) ? `${distKm.toFixed(2)} km` : "Waypoint";
  const syncDroneId = existingWp ? getAnyDroneTargetingWaypoint(existingWp.id, { excludeDroneId: drone ? drone.id : null }) : null;
  const syncTarget = syncDroneId !== null ? normalizeWaypointTarget(syncDroneId) : null;
  const showSync = !!(syncTarget && isFinite(Number(syncTarget.speedKmh)));
  if (options && options.isEdit && syncTarget) {
    pendingWaypoint.speedKmh = Math.max(10, Math.min(100, Math.round(syncTarget.speedKmh || 60)));
    pendingWaypoint.altM = Math.max(5, Math.min(100, Math.round(syncTarget.altM ?? initialAlt)));
  }

  const formatEta = (km, speed) => {
    if (!isFinite(km) || !isFinite(speed) || speed <= 0) return "";
    const totalSec = (km / speed) * 3600;
    const m = Math.floor(totalSec / 60);
    const s = Math.max(0, Math.round(totalSec - m * 60));
    return `${m}m ${s.toString().padStart(2, "0")}s`;
  };
  const etaLabel = distKm !== null && isFinite(distKm) ? formatEta(distKm, pendingWaypoint.speedKmh) : "";
  const host = document.getElementById("app") || document.body;
  if (waypointMenuEl && waypointMenuEl.parentNode !== host) {
    waypointMenuEl.parentNode.removeChild(waypointMenuEl);
    waypointMenuEl = null;
  }

  // Always recreate to ensure fresh positioning when clicking elsewhere.
  if (waypointMenuEl && waypointMenuEl.parentNode) {
    waypointMenuEl.parentNode.removeChild(waypointMenuEl);
  }
  waypointMenuEl = document.createElement("div");
  waypointMenuEl.className = "relative-menu";
  host.appendChild(waypointMenuEl);
  waypointMenuEl.addEventListener("pointerdown", (ev) => ev.stopPropagation());
  enableMenuDrag(waypointMenuEl);

  waypointDroneId = selectedTeam ? null : drone.id;
  waypointTeamId = selectedTeam ? selectedTeam.id : null;
  const pinSelection = !(options && options.pinSelection === false);
  if (pinSelection) {
    if (selectedTeam) {
      pinnedTeamId = selectedTeam.id; // keep team selected while menu is open
      pinnedDroneId = null;
    } else {
      pinnedDroneId = drone.id; // keep drone selected while menu is open
      pinnedTeamId = null;
    }
  }

  const mapRect = map.getContainer().getBoundingClientRect();
  waypointMenuEl.style.left = `${mapRect.left + containerPoint.x + 12}px`;
  waypointMenuEl.style.top = `${mapRect.top + containerPoint.y - 10}px`;

  const updateLabel = (val) => {
    const lbl = waypointMenuEl.querySelector("[data-speed-label]");
    if (lbl) lbl.textContent = `${val} km/h`;
    const etaSpan = waypointMenuEl.querySelector(".menu-eta");
    if (etaSpan && distKm !== null && isFinite(distKm)) {
      if (val > 0) {
        const totalSec = (distKm / val) * 3600;
        const m = Math.floor(totalSec / 60);
        const s = Math.max(0, Math.round(totalSec - m * 60));
        etaSpan.textContent = `${m}m ${s.toString().padStart(2, "0")}s`;
      }
    }
  };

  const updateAltLabel = (val) => {
    const lbl = waypointMenuEl.querySelector("[data-alt-label]");
    if (lbl) lbl.textContent = `${val} m`;
  };

  waypointMenuEl.innerHTML = `
    <div class="menu-head">
      <h4>${distLabel}</h4>
      ${showSync ? `<button class="sync-btn" type="button" data-sync title="Match ETA">⇆</button>` : ""}
      <span class="menu-eta">${etaLabel}</span>
    </div>
    <div class="command-list cmd-action-list column" data-root-actions style="margin-top:2px;">
      <button class="cmd-chip cmd-action" data-action="goto-wp" type="button">Goto WP</button>
      <button class="cmd-chip cmd-action" data-action="orbit" type="button">Orbit</button>
      <button class="cmd-chip cmd-action" data-action="flank" type="button">Flank</button>
    </div>
    <div class="speed-row" data-goto-details>
      <span class="slider-label">Speed</span>
      <input type="range" min="10" max="100" value="${pendingWaypoint.speedKmh}" step="1" data-speed-slider>
      <span class="slider-value" data-speed-label>${pendingWaypoint.speedKmh} km/h</span>
    </div>
    <div class="speed-row" data-goto-details>
      <span class="slider-label">Altitude</span>
      <input type="range" min="5" max="100" value="${pendingWaypoint.altM}" step="1" data-alt-slider>
      <span class="slider-value" data-alt-label>${pendingWaypoint.altM} m</span>
    </div>
    <button class="cmd-chip cmd-action confirm-btn" data-action="goto-wp-confirm" data-goto-details type="button">Goto WP</button>
  `;

  // Root view: show only distance + actions. Details (ETA/speed) appear only after pressing "Goto WP".
  {
    const etaEl = waypointMenuEl.querySelector(".menu-eta");
    if (etaEl) etaEl.style.display = "none";
    waypointMenuEl.querySelectorAll("[data-goto-details]").forEach((row) => {
      row.style.display = "none";
    });
    const syncEl = waypointMenuEl.querySelector("[data-sync]");
    if (syncEl) syncEl.style.display = "none";
    waypointMenuEl.dataset.mode = "root";
  }

  const enterGotoDetails = () => {
    if (!waypointMenuEl) return;
    if (waypointMenuEl.dataset.mode === "goto") return;
    waypointMenuEl.dataset.mode = "goto";
    const etaEl = waypointMenuEl.querySelector(".menu-eta");
    if (etaEl) etaEl.style.display = "";
    waypointMenuEl.querySelectorAll("[data-goto-details]").forEach((row) => {
      row.style.display = "flex";
    });
    const syncEl = waypointMenuEl.querySelector("[data-sync]");
    if (syncEl) syncEl.style.display = "";
    const rootActions = waypointMenuEl.querySelector("[data-root-actions]");
    if (rootActions) rootActions.style.display = "none";
    updateLabel(pendingWaypoint ? pendingWaypoint.speedKmh : 60);
    updateAltLabel(pendingWaypoint ? pendingWaypoint.altM : 30);
    // Show the WP preview (pin + dashed line) exactly when transitioning into the Goto WP details view.
    draw();
  };

  const slider = waypointMenuEl.querySelector("[data-speed-slider]");
  if (slider) {
    slider.addEventListener("input", (e) => {
      const v = Number(e.target.value) || 60;
      pendingWaypoint.speedKmh = v;
      updateLabel(v);
    });
  }

  const altSlider = waypointMenuEl.querySelector("[data-alt-slider]");
  if (altSlider) {
    altSlider.addEventListener("input", (e) => {
      const v = Number(e.target.value) || pendingWaypoint.altM || 30;
      pendingWaypoint.altM = Math.max(5, Math.min(100, Math.round(v)));
      updateAltLabel(pendingWaypoint.altM);
    });
  }

  const btn = waypointMenuEl.querySelector("[data-action='goto-wp']");
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Reveal the detailed controls (speed + ETA). Confirm is done via the bottom button.
      enterGotoDetails();
    });
  }

  const confirmBtn = waypointMenuEl.querySelector("[data-action='goto-wp-confirm']");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!pendingWaypoint) return;
      if (pendingWaypoint.wpId === null || pendingWaypoint.wpId === undefined) {
        pendingWaypoint.wpId = createWaypoint(pendingWaypoint.lat, pendingWaypoint.lng).id;
      }
      if (waypointTeamId !== null) {
        const team = getTeamById(waypointTeamId);
        if (team) {
          [...team.members].forEach((id) => {
            const d = getDroneById(id);
            if (d) issueGotoWaypointSingle(d, pendingWaypoint, { fromSequence: true, selectionKey: `drone:${id}` });
          });
          const speed = Math.max(10, Math.min(100, Math.round(pendingWaypoint.speedKmh || 60)));
          const alt = Math.max(5, Math.min(100, Math.round(pendingWaypoint.altM || 30)));
          appendPlannedForKey(`team:${team.id}`, `Goto WP #${pendingWaypoint.wpId} (spd ${speed} km/h, alt ${alt} m)`);
        }
        closeWaypointMenu();
        tooltipMode = "info";
        pinnedDroneId = null;
        pinnedTeamId = null;
        updateCommandSequencePanel();
        updateStatusList();
        updateTooltip();
        draw();
      } else {
        issueGotoWaypoint(drone, pendingWaypoint);
      }
    });
  }

  const orbitBtn = waypointMenuEl.querySelector("[data-action='orbit']");
  if (orbitBtn) {
    orbitBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!pendingWaypoint) return;
      closeEditWaypointMenu();
      const anchor = { type: "wp", wpId: pendingWaypoint.wpId ?? null, lat: pendingWaypoint.lat, lng: pendingWaypoint.lng };
      closeWaypointMenu(false, true);
      openOrbitMenu(anchor, containerPoint);
    });
  }

  const flankBtn = waypointMenuEl.querySelector("[data-action='flank']");
  if (flankBtn) {
    flankBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!pendingWaypoint) return;
      closeEditWaypointMenu();
      const anchor = { type: "wp", wpId: pendingWaypoint.wpId ?? null, lat: pendingWaypoint.lat, lng: pendingWaypoint.lng };
      closeWaypointMenu(false, true);
      openFlankMenu(anchor, containerPoint);
    });
  }

  const syncBtn = waypointMenuEl.querySelector("[data-sync]");
  if (syncBtn && syncDroneId !== null && syncTarget && latest) {
    syncBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const ownerDrone = getDroneById(syncDroneId);
      const ownerLatest = ownerDrone && ownerDrone.getLatest && ownerDrone.getLatest();
      const ownerSpeed = Number(syncTarget.speedKmh);
      if (!ownerLatest || !isFinite(ownerSpeed) || ownerSpeed <= 0) return;
      const ownerDistKm = haversine2dMeters(ownerLatest.lat, ownerLatest.lng, pendingWaypoint.lat, pendingWaypoint.lng) / 1000;
      if (!isFinite(ownerDistKm) || ownerDistKm <= 0) return;
      const etaHours = ownerDistKm / ownerSpeed;
      if (!isFinite(etaHours) || etaHours <= 0) return;
      if (!distKm || !isFinite(distKm)) return;
      let targetSpeed = distKm / etaHours;
      targetSpeed = Math.max(10, Math.min(100, targetSpeed));
      pendingWaypoint.speedKmh = Math.round(targetSpeed);
      const sliderEl = waypointMenuEl.querySelector("[data-speed-slider]");
      if (sliderEl) sliderEl.value = targetSpeed;
      updateLabel(pendingWaypoint.speedKmh);
    });
  }

  document.addEventListener("pointerdown", handleWaypointOutsideClick, true);
  if (options && options.startInGotoMode) {
    enterGotoDetails();
  } else {
    draw();
  }
}

function renderBatteryBars(batteryPct) {
  const pct = Math.max(0, Math.min(100, batteryPct ?? 0));
  const filled = Math.ceil(pct / 20); // 0-5
  // Single color for all lit bars based on how many are filled.
  // 1 bar: red -> 5 bars: green
  const hue = Math.round(120 * Math.max(0, Math.min(1, (filled - 1) / 4 || 0)));
  const litColor = filled > 0 ? `hsl(${hue}deg 85% 60%)` : null;
  // Blink: 1 Hz at 20%, linearly up to 5 Hz at 5% (200ms period min)
  const blinkDuration =
    pct < 20 ? 200 + ((Math.max(0, Math.min(20, pct)) - 5) / 15) * 800 : null;

  let bars = "";
  for (let i = 1; i <= 5; i++) {
    const isOn = i <= filled;
    bars += `<span class="battery-bar${isOn ? " filled" : ""}" style="${
      isOn && litColor ? `color:${litColor}; background:${litColor};` : ""
    }"></span>`;
  }
  return `
    <span class="battery-wrap${pct < 20 ? " low" : ""}" aria-label="Battery ${pct.toFixed(0)} percent"${
      blinkDuration ? ` style="--blink-duration:${Math.max(200, Math.min(1000, blinkDuration))}ms;"` : ""
    }>
      <span class="battery-shell">
        <span class="battery-bars">${bars}</span>
      </span>
      <span class="battery-cap"></span>
    </span>
  `;
}

function renderRssiBars(rssiDbm) {
  const level = rssiLevelFromDbm(rssiDbm);
  const heights = [6, 9, 12, 15];
  // Color per level (1-4): red -> orange -> yellow-green -> green
  const hueMap = { 1: 0, 2: 30, 3: 80, 4: 120 };
  const litColor = level > 0 ? `hsl(${hueMap[level]}deg 85% 60%)` : null;

  let bars = "";
  for (let i = 1; i <= 4; i++) {
    const isOn = i <= level;
    const h = heights[i - 1];
    bars += `<span class="rssi-bar${isOn ? " filled" : ""}" style="height:${h}px;${
      isOn && litColor ? `color:${litColor}; background:${litColor};` : ""
    }"></span>`;
  }
  const labelVal = rssiDbm !== undefined && rssiDbm !== null ? `${rssiDbm.toFixed(0)} dBm` : "N/A";
  return `<span class="rssi-bars" aria-label="RSSI ${labelVal}">${bars}</span>`;
}

function setTimestampNow() {
  const d = new Date();
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = d.toLocaleDateString([], { month: "short", day: "2-digit", year: "numeric" }).toUpperCase();

  document.getElementById("timeLine").textContent = time;
  document.getElementById("dateLine").textContent = date;
}

function initMapOnline() {
  // Tel Aviv coordinates: 32.0853°N, 34.7818°E
  map = L.map("map", { zoomControl: false, doubleClickZoom: false }).setView([32.0853, 34.7818], 11);

  // Dynamic scale bar (updates automatically with zoom). Click to change units.
  setScaleUnits("metric");

  // --- Esri basemaps (no API key). Licensing/terms apply. ---
  const esriBase = {
    "Esri • Satellite": L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19 }
    ),
    "Esri • Topographic": L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19 }
    ),
    "Esri • Streets": L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19 }
    ),
    "Esri • Gray": L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19 }
    ),
    "Esri • Oceans": L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19 }
    ),
  };

  // Default: vanilla satellite imagery
  esriBase["Esri • Satellite"].addTo(map);

  // --- Optional Esri overlay layers (toggle on/off) ---
  const esriOverlays = {
    "Satellite Labels": L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19, opacity: 0.95 }
    ),
    Transportation: L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19, opacity: 0.9 }
    ),
  };

  // --- Layer picker that is guaranteed to be above all UI ---
  const host = document.getElementById("layerPickerHost");
  if (!host) {
    // Fallback: if host is missing, use standard Leaflet control.
    L.control.layers(esriBase, esriOverlays, { collapsed: true, position: "topright" }).addTo(map);
    return;
  }

  // Build modal shell
  host.innerHTML = `
    <div class="layer-picker-backdrop" data-close="1" aria-hidden="true"></div>
    <div class="layer-picker-panel" role="dialog" aria-label="Map layers">
      <div id="layerPickerMount"></div>
    </div>
  `;

  const mount = host.querySelector("#layerPickerMount");
  const backdrop = host.querySelector(".layer-picker-backdrop");

  const layersControl = L.control.layers(esriBase, esriOverlays, {
    collapsed: false, // always expanded inside the modal
    position: "topright",
  });
  layersControl.addTo(map);

  // Move the control DOM into our always-on-top host
  const controlEl = layersControl.getContainer();
  mount.appendChild(controlEl);

  // Open/close helpers
  const setOpen = (open) => {
    if (open) {
      host.classList.add("is-open");
      host.setAttribute("aria-hidden", "false");
      if (backdrop) backdrop.setAttribute("aria-hidden", "false");
    } else {
      host.classList.remove("is-open");
      host.setAttribute("aria-hidden", "true");
      if (backdrop) backdrop.setAttribute("aria-hidden", "true");
    }
  };

  // Start closed (so it behaves like a menu button)
  setOpen(false);

  // Close on any click outside the panel
  const panelEl = host.querySelector(".layer-picker-panel");

  // Prevent clicks inside the panel from closing it (capture phase to beat Leaflet handlers)
  if (panelEl) {
    const stop = (e) => {
      // Do NOT stop propagation here; Leaflet's control relies on these events
      // reaching the radio/checkbox inputs to add/remove layers.
    };
    panelEl.addEventListener("pointerdown", (e) => e.stopPropagation(), true);
    // Removed: click/mousedown/touchstart propagation blocking (it broke layer changes)
  }

  // Only close when clicking on the backdrop/host itself (outside the panel)
  host.addEventListener("pointerdown", (e) => {
    if (!host.classList.contains("is-open")) return;
    if (e.target !== host && e.target !== backdrop) return;
    setOpen(false);
  });

  // Close when clicking outside (backdrop)
  if (backdrop) {
    backdrop.addEventListener("click", (e) => {
      e.stopPropagation();
      setOpen(false);
    });
  }

  // Compact control bar (top-right): fullscreen (mobile) + layers side-by-side.
  const ControlBar = L.Control.extend({
    options: { position: "topright" },
    onAdd: function () {
      const wrap = L.DomUtil.create("div", "leaflet-bar");
      wrap.style.display = "inline-flex";
      wrap.style.alignItems = "center";
      wrap.style.gap = "8px";
      wrap.style.background = "transparent";
      wrap.style.border = "none";
      wrap.style.boxShadow = "none";

      const makeBtnBase = () => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.style.height = "44px";
        btn.style.padding = "0 14px";
        btn.style.cursor = "pointer";
        btn.style.background = "rgba(25,32,41,0.75)";
        btn.style.border = "1px solid rgba(255,255,255,0.25)";
        btn.style.color = "rgba(255,255,255,0.92)";
        btn.style.fontWeight = "900";
        btn.style.fontSize = "13px";
        btn.style.letterSpacing = "0.10em";
        btn.style.textTransform = "uppercase";
        btn.style.lineHeight = "42px";
        btn.style.borderRadius = "10px";
        btn.style.display = "inline-flex";
        btn.style.alignItems = "center";
        btn.style.gap = "10px";
        btn.style.boxShadow = "0 10px 24px rgba(0,0,0,0.25)";
        L.DomEvent.disableClickPropagation(btn);
        return btn;
      };

      const layerBtn = makeBtnBase();
      layerBtn.title = "Layers";
      layerBtn.setAttribute("aria-label", "Layers");
      const layerIcon = document.createElement("span");
      layerIcon.textContent = "|||";
      layerIcon.style.fontSize = "16px";
      layerIcon.style.lineHeight = "1";
      const layerLabel = document.createElement("span");
      layerLabel.textContent = "Layers";
      layerBtn.appendChild(layerIcon);
      layerBtn.appendChild(layerLabel);
      layerBtn.dataset.role = "layerPickerButton";

  const openAnchored = () => {
    setOpen(true);
    const panel = host.querySelector(".layer-picker-panel");
    if (!panel) return;
    const r = layerBtn.getBoundingClientRect();
        const gap = 10;
        const desiredTop = Math.round(r.bottom + gap);
        const desiredRight = Math.round(window.innerWidth - r.right);
        panel.style.top = `${Math.max(12, desiredTop)}px`;
        panel.style.right = `${Math.max(12, desiredRight)}px`;
        const caretRight = Math.max(18, Math.round(r.width / 2 + 18));
        panel.style.setProperty("--layer-caret-right", `${caretRight}px`);
      };

      L.DomEvent.on(layerBtn, "click", (e) => {
        L.DomEvent.stop(e);
        openAnchored();
      });

      // Optional fullscreen button (mobile/touch). Inserted to the left.
      if (isMobileLike() && document.fullscreenEnabled) {
        const fsBtn = makeBtnBase();
        fsBtn.title = "Fullscreen";
        fsBtn.setAttribute("aria-label", "Fullscreen");
        const fsIcon = document.createElement("span");
        fsIcon.textContent = "[ ]";
        fsIcon.style.fontSize = "13px";
        fsIcon.style.lineHeight = "1";
        const fsLabel = document.createElement("span");
        fsLabel.textContent = "Full";
        fsBtn.appendChild(fsIcon);
        fsBtn.appendChild(fsLabel);

        const target = document.documentElement;
        const updateLabel = () => {
          const active = !!document.fullscreenElement;
          fsLabel.textContent = active ? "Exit" : "Full";
          fsBtn.title = active ? "Exit Fullscreen" : "Fullscreen";
        };

        L.DomEvent.on(fsBtn, "click", (e) => {
          L.DomEvent.stop(e);
          if (document.fullscreenElement) {
            document.exitFullscreen?.();
          } else {
            target.requestFullscreen?.();
          }
        });

        document.addEventListener("fullscreenchange", updateLabel);
        updateLabel();

        wrap.appendChild(fsBtn); // left of Layers
      }

      wrap.appendChild(layerBtn);
      return wrap;
    },
  });
  map.addControl(new ControlBar());

  // Re-anchor panel on resize/rotate if it's open
  window.addEventListener("resize", () => {
    if (!host.classList.contains("is-open")) return;
    const btn = document.querySelector('[data-role="layerPickerButton"]');
    if (!btn) return;
    // trigger the same anchoring math
    const panel = host.querySelector(".layer-picker-panel");
    if (!panel) return;
    const r = btn.getBoundingClientRect();
    const gap = 10;
    const desiredTop = Math.round(r.bottom + gap);
    const desiredRight = Math.round(window.innerWidth - r.right);
    panel.style.top = `${Math.max(12, desiredTop)}px`;
    panel.style.right = `${Math.max(12, desiredRight)}px`;
  });

  // Also close on Esc
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  // Close when a layer is selected (base or overlay)
  controlEl.addEventListener("change", (e) => {
    const t = e.target;
    if (!t) return;
    if (t.tagName === "INPUT") {
      // Keep picker open while interacting; remove auto-close.
      // (Menu closes only when clicking outside)
    }
  });
}

function setupOverlay() {
  overlay = document.getElementById("overlay");
  ctx = overlay.getContext("2d");

  // Keep canvas in its original position (outside Leaflet panes) 
  // so we have full control over positioning
  overlay.style.position = "absolute";
  overlay.style.left = "0";
  overlay.style.top = "0";
  overlay.style.pointerEvents = "none";
  // Keep in sync with CSS: above tiles, below UI panels
  overlay.style.zIndex = "5";

  const resize = () => {
    const size = map.getSize();
    overlay.style.width = `${size.x}px`;
    overlay.style.height = `${size.y}px`;

    overlay.width = Math.round(size.x * devicePixelRatio);
    overlay.height = Math.round(size.y * devicePixelRatio);

    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    draw();
  };

  // Animation loop for smooth updates during zoom
  let animating = false;
  const startAnimLoop = () => {
    if (animating) return;
    animating = true;
    const loop = () => {
      draw();
      if (animating) requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  };
  const stopAnimLoop = () => {
    animating = false;
  };

  window.addEventListener("resize", () => {
    map.invalidateSize();
    resize();
  });

  // Panning: redraw continuously
  map.on("move", draw);
  map.on("moveend", draw);

  // Zooming: redraw every frame while zooming so pixels stay accurate.
  map.on("zoomstart", () => {
    isZooming = true;
    zoomInterp.active = false; // disable interpolation during live pinch
    startAnimLoop();
  });

  // zoomanim fires continuously during animated zoom; request a draw.
  map.on("zoomanim", draw);
  map.on("zoom", draw);

  map.on("zoomend", () => {
    isZooming = false;
    stopAnimLoop();
    resize();
    draw();
  });

  map.on("resize", resize);

  resize();
}

// Deterministic RNG (so links/drones don't change between redraws)
function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    // xorshift32
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) / 4294967296);
  };
}

function startMockTelemetryLoop(drone) {
  const tick = () => {
    const prev = drone.getLatest();
    if (!prev) return;

    // Base cadence ~1s, with occasional skips to simulate link gaps.
    const baseDelay = 800 + Math.random() * 800;
    const gap = Math.random() < 0.08 ? 2200 : 0;
    const delayMs = baseDelay + gap;
    const dtSec = delayMs / 1000;

    const next = {
      uptimeSec: prev.uptimeSec + dtSec,
      lat: prev.lat + (Math.random() - 0.5) * 0.00018,
      lng: prev.lng + (Math.random() - 0.5) * 0.00018,
      alt: Math.max(0, prev.alt + (Math.random() - 0.5) * 3.5),
      heading: (prev.heading + (Math.random() - 0.5) * 18 + 360) % 360,
      battery: Math.max(0, prev.battery - (0.015 + Math.random() * 0.035) * dtSec),
      rssi: Math.max(-125, Math.min(-80, prev.rssi + (Math.random() - 0.5) * 3)),
      command: prev.command,
      armed: prev.armed,
      rescuePhase: prev.rescuePhase,
    };

    drone.updateTelemetry(next);
    setTimeout(tick, delayMs);
  };

  // Stagger start to avoid perfect sync across drones.
  setTimeout(tick, 300 + Math.random() * 700);
}

function randomCommand(rng) {
  const cmd = COMMAND_OPTIONS[Math.floor(rng() * COMMAND_OPTIONS.length)];
  if (cmd === "Follow drone") return `Follow drone #${Math.floor(rng() * 50)}`;
  if (cmd === "Boid group") return `Boid group #${1 + Math.floor(rng() * 4)}`;
  if (cmd === "Goto WP") return "Goto WP";
  return cmd;
}

function makeMockSwarm() {
  // Always regenerate from scratch once at startup, but deterministically for initial placement.
  const rng = makeRng(0xC0FFEE);
  const randBetweenSeeded = (a, b) => a + rng() * (b - a);

  // Tel Aviv center coordinates
  const center = { lat: 32.0853, lng: 34.7818 };

  const clusters = [
    { lat: 32.165, lng: 34.64, n: 26 },
    { lat: 32.155, lng: 34.92, n: 24 },
    { lat: 31.97, lng: 34.9, n: 18 },
    { lat: 31.95, lng: 34.66, n: 14 },
  ];

  drones = [];
  let id = 0;

  const spawnDrone = (lat, lng, type) => {
    const d = new Drone(id++, { type });
    const givenCmd = randomCommand(rng);
    let performingCmd = givenCmd;
    if (rng() < 0.4) {
      // Deliberately diverge sometimes to show red status
      let altCmd = randomCommand(rng);
      if (COMMAND_OPTIONS.length > 1) {
        let tries = 0;
        while (altCmd === givenCmd && tries < 5) {
          altCmd = randomCommand(rng);
          tries++;
        }
      }
      performingCmd = altCmd;
    }

    d.updateTelemetry({
      uptimeSec: randBetweenSeeded(120, 360),
      lat,
      lng,
      alt: randBetweenSeeded(60, 180),
      heading: rng() * 360,
      battery: 60 + rng() * 40,
      rssi: -120 + rng() * 40, // ~[-120, -80] dBm
      command: performingCmd,
      armed: true,
    });
    drones.push(d);
    if (groundControl) groundControl.assignMission(d.id, givenCmd);
    startMockTelemetryLoop(d);
    return d;
  };

  for (let i = 0; i < 22; i++) {
    spawnDrone(center.lat + randBetweenSeeded(-0.03, 0.03), center.lng + randBetweenSeeded(-0.04, 0.04), "core");
  }

  clusters.forEach((c, idx) => {
    for (let i = 0; i < c.n; i++) {
      const lat = c.lat + randBetweenSeeded(-0.03, 0.03);
      const lng = c.lng + randBetweenSeeded(-0.04, 0.04);
      spawnDrone(lat, lng, ["blue", "cyan", "green", "orange"][idx % 4]);
    }
  });

  // No link generation; cluster arcs removed per request.
}

function initGroundStations() {
  userGroundStationId = null;
  if (LIVE_POSITION_MODE) {
    groundStations = [];
    return;
  }
  // Single Tel Aviv anchor (e.g., HQ/helipad). Can be extended later.
  groundStations = [
    new GroundStation(0, 32.0853, 34.7818, 20, "Tel-Aviv"), // Tel Aviv center-ish
  ];
}

function tryAddUserHomeFromDevice() {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    openUserHomePrompt("Device location not supported");
    return;
  }

  const addHome = (lat, lng, alt = 0) => {
    if (userGroundStationId !== null && userGroundStationId !== undefined) {
      const existing = groundStations.find((g) => g.id === userGroundStationId);
      if (existing) {
        existing.updatePosition({ lat, lng, alt });
      }
    } else {
      const nextId = groundStations.reduce((m, g) => Math.max(m, g.id), -1) + 1;
      userGroundStationId = nextId;
      groundStations.push(new GroundStation(nextId, lat, lng, alt, null));
    }
    publishLiveHomesStateSoon();
    const gs = groundStations.find((g) => g.id === userGroundStationId);
    if (gs && (!gs.name || !String(gs.name).trim())) openGroundStationNameMenu(gs.id);
    forceRedraw();
  };

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = Number(pos?.coords?.latitude);
      const lng = Number(pos?.coords?.longitude);
      const alt = Number(pos?.coords?.altitude);
      if (!isFinite(lat) || !isFinite(lng)) return;
      addHome(lat, lng, isFinite(alt) ? alt : 0);
    },
    (err) => {
      const msg =
        err && err.code === 1
          ? "Location permission denied"
          : err && err.code === 2
            ? "Location unavailable"
            : "Location request timed out";
      openUserHomePrompt(msg);
    },
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 }
  );
}

function drawGroundStationIcon(x, y, size = 18, { active = false } = {}) {
  ctx.save();
  ctx.translate(x, y);

  // Larger perimeter ring; keep H compact.
  const radius = size * 0.95;

  // Selection glow: every HOME has a small halo; selected HOME gets a much wider bloom.
  ctx.save();
  ctx.shadowColor = active ? SETTINGS.SELECTION_GLOW_COLOR : "rgba(120, 220, 255, 0.78)";
  ctx.shadowBlur = active ? Math.max(42, size * 4.8) : Math.max(9, size * 0.95);
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle = active ? "rgba(120, 220, 255, 0.24)" : "rgba(120, 220, 255, 0.08)";
  ctx.beginPath();
  ctx.arc(0, 0, radius * (active ? 2.85 : 1.18), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Outer ring
  ctx.lineWidth = Math.max(2, size * 0.12);
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Inner glow ring
  ctx.lineWidth = Math.max(1.4, size * 0.08);
  ctx.strokeStyle = "rgba(120, 220, 255, 0.85)";
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.72, 0, Math.PI * 2);
  ctx.stroke();

  // "H" glyph
  const hHeight = radius * 0.75;
  const hHalfWidth = radius * 0.3;
  ctx.lineWidth = Math.max(1.6, size * 0.1);
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(120, 220, 255, 0.95)";
  ctx.beginPath();
  ctx.moveTo(-hHalfWidth, -hHeight / 2);
  ctx.lineTo(-hHalfWidth, hHeight / 2);
  ctx.moveTo(hHalfWidth, -hHeight / 2);
  ctx.lineTo(hHalfWidth, hHeight / 2);
  ctx.moveTo(-hHalfWidth, 0);
  ctx.lineTo(hHalfWidth, 0);
  ctx.stroke();

  ctx.restore();
}

function drawGroundStationLabel(x, y, text, size = 18) {
  if (!text) return;
  ctx.save();
  const zoom = map && map.getZoom ? map.getZoom() : 12;
  const fontPx = Math.max(10, Math.min(14, (zoom * 0.9)));
  ctx.font = `600 ${fontPx}px system-ui, -apple-system, Segoe UI, Roboto, Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.95)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.fillText(String(text), x, y + size * 0.95 + 2);
  ctx.restore();
}

function drawDroneIcon(x, y, size = 10, headingDeg = 0, options = {}) {
  // Concave triangle (chevron/arrow) with a cheap, high-contrast outline.
  const isStale = options.isStale || false;
  const isLanded = options.isLanded || false;
  const freshness = options.freshness || (isStale ? "stale" : "fresh");

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(((headingDeg || 0) * Math.PI) / 180);
  if (freshness === "off") ctx.globalAlpha = 0.25;
  else if (freshness === "offline") ctx.globalAlpha = 0.32;
  else if (freshness === "stale") ctx.globalAlpha = 0.45;
  else if (freshness === "late") ctx.globalAlpha = 0.72;

  const w = size * 1.2;
  const h = size * 1.4;
  const indent = size * 0.4;

  const path = () => {
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.lineTo(w / 2, h / 2);
    ctx.lineTo(0, h / 2 - indent);
    ctx.lineTo(-w / 2, h / 2);
    ctx.closePath();
  };

  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  const outlineW = Math.max(2.2, size * 0.26);

  ctx.strokeStyle = isLanded ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.85)";
  ctx.lineWidth = outlineW;

  const offs = Math.max(1.0, outlineW * 0.45);
  const offsets = [
    [offs, 0],
    [-offs, 0],
    [0, offs],
    [0, -offs],
  ];
  for (const [ox, oy] of offsets) {
    ctx.save();
    ctx.translate(ox, oy);
    path();
    ctx.stroke();
    ctx.restore();
  }

  path();
  ctx.stroke();

  const liveFill =
    freshness === "late" || freshness === "weak"
      ? "rgba(255, 211, 108, 0.88)"
      : freshness === "off"
        ? "rgba(190, 196, 202, 0.70)"
      : freshness === "stale" || freshness === "offline"
        ? "rgba(255, 138, 138, 0.82)"
        : null;
  ctx.fillStyle = liveFill || (isStale ? "rgba(255, 180, 180, 0.82)" : isLanded ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.92)");
  path();
  ctx.fill();

  ctx.lineWidth = Math.max(1.2, size * 0.10);
  ctx.strokeStyle = isLanded ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.95)";
  path();
  ctx.stroke();

  ctx.restore();
}

function isTelemetryLanded(latest) {
  if (!latest) return false;
  // Primary: explicit state machine phase from Betaflight rescue.
  if (latest.rescuePhase === "RESCUE_COMPLETE") return true;
  // Fallback when phase isn't available yet: use altitude threshold.
  const alt = Number(latest.alt);
  if (isFinite(alt) && alt <= 2) return true;
  return false;
}

function drawStaleLabel(x, y, ageSec) {
  const text = `+${ageSec.toFixed(1)}s`;
  ctx.save();
  ctx.font = "10px 'Inter', system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(0,0,0,0.65)";
  ctx.fillStyle = "rgba(255, 120, 120, 0.95)";
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawSelectionHighlight(x, y, size = 10, headingDeg = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(((headingDeg || 0) * Math.PI) / 180);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // Slightly larger than the drone icon shape
  const w = size * SETTINGS.SELECTION_SHAPE_W_SCALE;
  const h = size * SETTINGS.SELECTION_SHAPE_H_SCALE;
  const indent = size * SETTINGS.SELECTION_SHAPE_INDENT_SCALE;
  const glowColor = SETTINGS.SELECTION_GLOW_COLOR;

  const drawGlow = (blur, alpha, scale = 1) => {
    ctx.save();
    ctx.scale(scale, scale);
    ctx.fillStyle = glowColor;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = blur;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.lineTo(w / 2, h / 2);
    ctx.lineTo(0, h / 2 - indent);
    ctx.lineTo(-w / 2, h / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  // Intense layered glow for visibility
  drawGlow(size * SETTINGS.SELECTION_GLOW_OUTER_BLUR, SETTINGS.SELECTION_GLOW_OUTER_ALPHA, 1.25);
  drawGlow(size * SETTINGS.SELECTION_GLOW_MID_BLUR, SETTINGS.SELECTION_GLOW_MID_ALPHA, 1.1);
  drawGlow(size * SETTINGS.SELECTION_GLOW_INNER_BLUR, SETTINGS.SELECTION_GLOW_INNER_ALPHA, 1.0);

  // Add a bright outline to punch through bright backgrounds
  ctx.shadowBlur = size * 1.4;
  ctx.shadowColor = glowColor;
  ctx.globalAlpha = SETTINGS.SELECTION_OUTLINE_ALPHA;
  ctx.lineWidth = Math.max(2, size * SETTINGS.SELECTION_OUTLINE_WIDTH_FACTOR);
  ctx.strokeStyle = "rgba(200, 245, 255, 0.95)";
  ctx.beginPath();
  ctx.moveTo(0, -h / 2);
  ctx.lineTo(w / 2, h / 2);
  ctx.lineTo(0, h / 2 - indent);
  ctx.lineTo(-w / 2, h / 2);
  ctx.closePath();
  ctx.stroke();

  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawWaypointPin(x, y, { active = false } = {}) {
  ctx.save();
  ctx.translate(x, y);
  const z = map && map.getZoom ? map.getZoom() : 12;
  const scale = 0.7;
  const ringOuterR = Math.max(8 * scale, Math.min(16 * scale, z * 1.0 * scale));
  // Bring the ring lower so it overlaps the pointer and reads as one object.
  const ringCy = -ringOuterR * 1.88;
  const ringThickness = Math.max(3.2, Math.min(7.0, ringOuterR * 0.45)); // thicker ring
  const ringInnerR = Math.max(2.2, ringOuterR - ringThickness);
  const triW = ringOuterR * 1.55;

  const pinColor = "rgb(255, 90, 90)"; // light red, fully opaque
  const fill = pinColor;
  const stroke = pinColor;
  const lineW = Math.max(1.8, Math.min(3.2, ringOuterR * 0.16));

  // No transparency/blur; keep the marker fully solid.
  ctx.shadowBlur = 0;

  // Glow behind the marker (white by default, cyan when the WP is selected)
  {
    const overlap = Math.max(lineW * 1.2, ringOuterR * 0.35);
    const baseY = ringCy + ringOuterR - overlap;
    ctx.save();
    const glow = active ? SETTINGS.SELECTION_GLOW_COLOR : "rgba(255,255,255,1)";
    ctx.shadowColor = glow;
    ctx.shadowBlur = Math.max(18, ringOuterR * 2.2);
    ctx.lineWidth = lineW + 3.2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = active ? "rgba(120,220,255,0.92)" : "rgba(255,255,255,0.90)";

    const strokeGlow = () => {
      ctx.beginPath();
      ctx.arc(0, ringCy, ringOuterR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-triW / 2, baseY);
      ctx.lineTo(0, 0);
      ctx.lineTo(triW / 2, baseY);
      ctx.closePath();
      ctx.stroke();
    };

    // Two-pass glow: a thicker soft bloom + a slightly crisper rim.
    strokeGlow();
    ctx.shadowBlur = Math.max(10, ringOuterR * 1.4);
    ctx.lineWidth = lineW + 1.6;
    ctx.strokeStyle = active ? "rgba(120,220,255,0.72)" : "rgba(255,255,255,0.75)";
    strokeGlow();
    ctx.restore();
  }

  // Draw ring + pointer as one object: same fill/stroke, overlapping connection.
  // Ring outer fill
  ctx.beginPath();
  ctx.arc(0, ringCy, ringOuterR, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();

  // Pointer fill (overlap into the ring so it reads as one piece).
  // NOTE: `ringCy` moves the ring and would also move `baseY` if we tie them directly,
  // so keep an explicit overlap amount to control how much the triangle intrudes into the ring.
  const overlap = Math.max(lineW * 1.2, ringOuterR * 0.35);
  const baseY = ringCy + ringOuterR - overlap;
  ctx.beginPath();
  ctx.moveTo(-triW / 2, baseY);
  ctx.lineTo(0, 0);
  ctx.lineTo(triW / 2, baseY);
  ctx.closePath();
  ctx.fill();

  // Cut the hole after fills
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(0, ringCy, ringInnerR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Single outline pass for both shapes (same stroke, rounded joins)
  ctx.shadowBlur = 0;
  ctx.lineWidth = lineW;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = stroke;
  ctx.beginPath();
  ctx.arc(0, ringCy, ringOuterR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-triW / 2, baseY);
  ctx.lineTo(0, 0);
  ctx.lineTo(triW / 2, baseY);
  ctx.closePath();
  ctx.stroke();

  // Keep the hole clean (no extra inner edge stroke) so it reads as a single combined shape.
  ctx.restore();
}

function drawLivePositionDrones(zoom) {
  const droneSize = Math.max(7, Math.min(13, zoom * 0.82));
  const now = Date.now();
  drones.forEach((d) => {
    const latest = d && typeof d.getLatest === "function" ? d.getLatest() : null;
    if (!latest) return;
    const p = latLngToScreen(latest.lat, latest.lng);
    const freshness = getLiveFreshnessState(d, now);
    const displayState = getLiveDisplayState(d, freshness, now);
    const isHighlighted = pinnedDroneId !== null && d.id === pinnedDroneId;
    if (isHighlighted) {
      drawSelectionHighlight(p.x, p.y, droneSize, latest.heading || 0);
    }
    drawDroneIcon(p.x, p.y, droneSize, latest.heading || 0, {
      freshness: displayState,
      isStale: ["stale", "offline", "weak", "off"].includes(displayState),
      isLanded: false,
    });
    if (displayState !== "fresh") {
      const age = d.getSecondsSinceLastUpdate(now);
      if (age !== null) drawStaleLabel(p.x, p.y - droneSize * 1.25, age);
    }
  });
}

function roundedRectPath(ctx2, x, y, width, height, radius) {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  ctx2.beginPath();
  ctx2.moveTo(x + r, y);
  ctx2.lineTo(x + width - r, y);
  ctx2.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx2.lineTo(x + width, y + height - r);
  ctx2.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx2.lineTo(x + r, y + height);
  ctx2.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx2.lineTo(x, y + r);
  ctx2.quadraticCurveTo(x, y, x + r, y);
  ctx2.closePath();
}

function formatDistanceMeasurement(distanceMeters) {
  if (!isFinite(distanceMeters)) return "N/A";
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} m`;
  }
  return `${(distanceMeters / 1000).toFixed(1)} km`;
}

function drawDistanceMeasurements() {
  distanceMeasurementHitRegions = [];
  if (!ctx || !map || !LIVE_POSITION_MODE) return;

  const arrowColor = "rgba(255,255,255,0.96)";
  const haloColor = "rgba(0,0,0,0.62)";

  const drawMeasurementArrow = (measurement, { cacheHit = true, preview = false } = {}) => {
    if (!measurement) return;
    const start = latLngToScreen(measurement.startLat, measurement.startLng);
    const end = latLngToScreen(measurement.endLat, measurement.endLng);
    if (!start || !end) return;

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.hypot(dx, dy);
    if (len < 2) return;

    const ux = dx / len;
    const uy = dy / len;
    const perpX = -uy;
    const perpY = ux;
    const arrowLen = Math.max(12, Math.min(18, len * 0.18));
    const arrowWidth = arrowLen * 0.52;

    ctx.save();
    if (preview) {
      ctx.globalAlpha = 0.86;
    }
    ctx.setLineDash([]);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = haloColor;
    ctx.shadowBlur = 9;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;

    [start, end].forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = arrowColor;
      ctx.fill();
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = "rgba(0,0,0,0.48)";
      ctx.stroke();
    });

    ctx.lineWidth = 3.2;
    ctx.strokeStyle = arrowColor;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(end.x - ux * arrowLen + perpX * arrowWidth, end.y - uy * arrowLen + perpY * arrowWidth);
    ctx.lineTo(end.x - ux * arrowLen - perpX * arrowWidth, end.y - uy * arrowLen - perpY * arrowWidth);
    ctx.closePath();
    ctx.fillStyle = arrowColor;
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.restore();

    const distanceMeters = map.distance(
      [measurement.startLat, measurement.startLng],
      [measurement.endLat, measurement.endLng]
    );
    const label = formatDistanceMeasurement(distanceMeters);
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const labelX = midX + perpX * 18;
    const labelY = midY + perpY * 18;
    let angle = Math.atan2(dy, dx);
    if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
      angle += Math.PI;
    }

    ctx.save();
    ctx.font = "800 13px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const textWidth = ctx.measureText(label).width;
    const boxWidth = textWidth + 16;
    const boxHeight = 24;
    ctx.translate(labelX, labelY);
    ctx.rotate(angle);
    ctx.fillStyle = "rgba(18,24,32,0.88)";
    ctx.strokeStyle = "rgba(0,0,0,0.55)";
    ctx.lineWidth = 3;
    roundedRectPath(ctx, -boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 7);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(235,250,255,0.98)";
    ctx.shadowColor = "rgba(0,0,0,0.75)";
    ctx.shadowBlur = 4;
    ctx.fillText(label, 0, 0);
    ctx.restore();

    if (cacheHit) {
      distanceMeasurementHitRegions.push({
        measurement,
        start,
        end,
        labelRect: {
          cx: labelX,
          cy: labelY,
          width: boxWidth + 8,
          height: boxHeight + 8,
          angle,
        },
      });
    }
  };

  distanceMeasurements.forEach((measurement) => {
    drawMeasurementArrow(measurement);
  });

  if (pendingDistanceMeasurement) {
    const hasPreview =
      isFinite(Number(pendingDistanceMeasurement.previewLat)) &&
      isFinite(Number(pendingDistanceMeasurement.previewLng));
    if (hasPreview) {
      drawMeasurementArrow(
        {
          id: "pending",
          startLat: pendingDistanceMeasurement.startLat,
          startLng: pendingDistanceMeasurement.startLng,
          endLat: pendingDistanceMeasurement.previewLat,
          endLng: pendingDistanceMeasurement.previewLng,
        },
        { cacheHit: false, preview: true }
      );
    } else {
      const start = latLngToScreen(pendingDistanceMeasurement.startLat, pendingDistanceMeasurement.startLng);
      if (start) {
        ctx.save();
        ctx.fillStyle = "rgba(255,255,255,0.96)";
        ctx.shadowColor = "rgba(0,0,0,0.62)";
        ctx.shadowBlur = 9;
        ctx.shadowOffsetY = 2;
        ctx.beginPath();
        ctx.arc(start.x, start.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = "rgba(0,0,0,0.48)";
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function draw() {
  if (!ctx || !map) return;

  const size = map.getSize();
  const w = size.x;
  const h = size.y;

  ctx.clearRect(0, 0, w, h);

  // Draw vignette FIRST (behind everything)
  const grad = ctx.createRadialGradient(
    w / 2,
    h / 2,
    Math.min(w, h) * 0.25,
    w / 2,
    h / 2,
    Math.max(w, h) * 0.65
  );
  grad.addColorStop(0, "rgba(0,0,0,0.00)");
  grad.addColorStop(1, "rgba(0,0,0,0.20)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const zoom = map.getZoom();
  const selTeam = pinnedTeamId !== null ? getTeamById(pinnedTeamId) : null;
  const selMembers = selTeam ? selTeam.members : null;

  // Ground stations (anchors)
  const gsSize = Math.max(14, Math.min(26, zoom * 1.45)) * 0.75;
  groundStations.forEach((gs) => {
    const p = latLngToScreen(gs.lat, gs.lng);
    const active = activeGroundStationId === gs.id;
    drawGroundStationIcon(p.x, p.y, gsSize, { active });
    drawGroundStationLabel(p.x, p.y, gs.name || `Home #${gs.id + 1}`, gsSize);
  });

  drawDistanceMeasurements();

  if (LIVE_POSITION_MODE) {
    drawLivePositionDrones(zoom);
    updateTooltip();
    return;
  }

  // Follow links (dashed line from follower to target)
  followTargets.forEach((targetId, followerId) => {
    const follower = getDroneById(followerId);
    const target = getDroneById(targetId);
    const fLatest = follower && follower.getLatest && follower.getLatest();
    const tLatest = target && target.getLatest && target.getLatest();
    if (!fLatest || !tLatest) return;
    const from = latLngToScreen(fLatest.lat, fLatest.lng);
    const to = latLngToScreen(tLatest.lat, tLatest.lng);
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy);
    if (len < 2) return;
    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = "rgba(120,220,255,0.85)";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    // Arrow head pointing toward the followed drone, placed near the target.
    const ux = dx / len;
    const uy = dy / len;
    const arrowLen = Math.max(9, Math.min(14, (map.getZoom ? map.getZoom() : 10) * 1.0));
    const backOff = Math.max(10, arrowLen * 0.8);
    const tipX = to.x - ux * 4; // slight inset so it sits near target
    const tipY = to.y - uy * 4;
    const baseX = tipX - ux * backOff;
    const baseY = tipY - uy * backOff;
    const perpX = -uy;
    const perpY = ux;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(baseX + perpX * (arrowLen * 0.4), baseY + perpY * (arrowLen * 0.4));
    ctx.lineTo(baseX - perpX * (arrowLen * 0.4), baseY - perpY * (arrowLen * 0.4));
    ctx.closePath();
    ctx.fillStyle = "rgba(120,220,255,0.9)";
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.lineWidth = 1.2;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });

  // Home links (dashed line from drone to ground station)
  homeTargets.forEach((stationId, droneId) => {
    const drone = getDroneById(droneId);
    const station = groundStations.find((g) => g.id === stationId);
    const latest = drone && drone.getLatest && drone.getLatest();
    if (!latest || !station) return;
    const from = latLngToScreen(latest.lat, latest.lng);
    const to = latLngToScreen(station.lat, station.lng);
    ctx.save();
    ctx.setLineDash([6, 5]);
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  });

  // RTH preview (while the Home menu is open and a home is selected)
  if (homeMenuEl && pendingHome && pendingHome.stationId !== null && pendingHome.stationId !== undefined) {
    const sel = getSelectedEntity();
    const latest = sel && sel.latest;
    const station = groundStations.find((g) => g.id === pendingHome.stationId);
    if (latest && station) {
      const from = latLngToScreen(latest.lat, latest.lng);
      const to = latLngToScreen(station.lat, station.lng);
      ctx.save();
      ctx.setLineDash([6, 5]);
      ctx.lineWidth = 2.0;
      ctx.strokeStyle = "rgba(255,255,255,0.92)";
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Waypoints (independent map entities)
  waypoints.forEach((wp, wpId) => {
    // If a WP is being moved via a menu, draw it only once (in the preview section below).
    // In the root "pick an action" menu, we are *not* moving the WP, so keep it visible.
    if (
      pendingWaypoint &&
      pendingWaypoint.wpId === wpId &&
      waypointMenuEl &&
      ["goto", "edit"].includes(waypointMenuEl.dataset.mode)
    )
      return;
    const p = latLngToScreen(wp.lat, wp.lng);
    drawWaypointPin(p.x, p.y, { active: activeWaypointId === wpId });
  });

  // Goto-WP links (dashed line from drone to a waypoint)
  waypointTargets.forEach((t0, droneId) => {
    const t = normalizeWaypointTarget(droneId);
    if (!t || t.wpId === null || t.wpId === undefined) return;
    const wp = getWaypointById(t.wpId);
    if (!wp) return;
    const d = getDroneById(droneId);
    const latest = d && d.getLatest && d.getLatest();
    if (!latest) return;
    const from = latLngToScreen(latest.lat, latest.lng);
    const to = latLngToScreen(wp.lat, wp.lng);
    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  });

  // Waypoint preview (pin + dashed line) after entering the Goto WP details view.
  if (waypointMenuEl && pendingWaypoint && waypointMenuEl.dataset.mode === "goto") {
    const sel = getSelectedEntity();
    let latest = sel && sel.latest ? sel.latest : null;
    if (!latest && waypointDroneId !== null && waypointDroneId !== undefined) {
      const d = getDroneById(waypointDroneId);
      latest = d && d.getLatest && d.getLatest();
    }
    const to = latLngToScreen(pendingWaypoint.lat, pendingWaypoint.lng);
    if (latest && isFinite(latest.lat) && isFinite(latest.lng)) {
      const from = latLngToScreen(latest.lat, latest.lng);
      ctx.save();
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      ctx.restore();
    }
    drawWaypointPin(to.x, to.y, { active: true });
  }

  // Waypoint edit preview (no dashed line; just the movable pin)
  if (waypointMenuEl && pendingWaypoint && waypointMenuEl.dataset.mode === "edit") {
    const to = latLngToScreen(pendingWaypoint.lat, pendingWaypoint.lng);
    drawWaypointPin(to.x, to.y, { active: true });
  }

  // Orbit visualization (only for the current selection)
  const calcSpeed = (radiusM, periodMin) => {
    const r = Number(radiusM);
    const p = Number(periodMin);
    if (!isFinite(r) || !isFinite(p) || r <= 0 || p <= 0) return null;
    return ((2 * Math.PI * r) / (p * 60)) * 3.6;
  };

  const sel = getSelectedEntity();
  const key = getSelectionKey(sel);

  // Flank visualization (only while the flank menu is open)
  if (flankMenuEl && pendingFlank && pendingFlank.anchor) {
    const anchor = resolveFlankAnchor(pendingFlank.anchor);
    if (anchor) {
      const from = sel && sel.latest ? { lat: sel.latest.lat, lng: sel.latest.lng } : null;
      drawFlankVisualization(
        anchor,
        pendingFlank.approachBearingDeg,
        pendingFlank.diameterM,
        pendingFlank.direction,
        pendingFlank.approachSpeedKmh,
        from
      );
    }
  }

  // When the orbit menu is open, always render the live preview from its pending values.
  // (Selection snapshots can be transient during interaction; the preview should still animate.)
  if (orbitMenuEl && pendingOrbit && pendingOrbit.anchor) {
    const center = resolveOrbitCenter(pendingOrbit.anchor);
    if (center) {
      const spd = calcSpeed(pendingOrbit.radiusM, pendingOrbit.orbitPeriodMin);
      const from = sel && sel.latest ? { lat: sel.latest.lat, lng: sel.latest.lng } : null;
      drawOrbitVisualization(center, pendingOrbit.radiusM, pendingOrbit.direction, spd, pendingOrbit.orbitPeriodMin, from);
    }
  } else if (sel && key) {
    const preview = orbitPreview && orbitPreview.key === key ? orbitPreview.orbit : null;
    if (preview && preview.anchor) {
      const center = resolveOrbitCenter(preview.anchor);
      if (center) {
        const spd = calcSpeed(preview.radiusM, preview.orbitPeriodMin);
        drawOrbitVisualization(center, preview.radiusM, preview.direction, spd, preview.orbitPeriodMin, { lat: sel.latest.lat, lng: sel.latest.lng });
      }
    } else if (pinnedTeamId !== null && selMembers) {
      // Team: show orbit (if any) for each member, lightly.
      ctx.save();
      ctx.globalAlpha = 0.65;
      for (const id of selMembers) {
        const spec = orbitTargets.get(id);
        if (!spec) continue;
        const center = resolveOrbitCenter(spec.anchor);
        if (!center) continue;
        const spd = isFinite(Number(spec.orbitSpeedKmh))
          ? Number(spec.orbitSpeedKmh)
          : calcSpeed(spec.radiusM, spec.orbitPeriodMin);
        drawOrbitVisualization(center, spec.radiusM, spec.direction, spd, spec.orbitPeriodMin, { lat: sel.latest.lat, lng: sel.latest.lng });
        break; // avoid clutter: show the first available orbit spec
      }
      ctx.restore();
    } else if (pinnedDroneId !== null) {
      const spec = orbitTargets.get(pinnedDroneId);
      if (spec && spec.anchor) {
        const center = resolveOrbitCenter(spec.anchor);
        if (center) {
          const spd = isFinite(Number(spec.orbitSpeedKmh))
            ? Number(spec.orbitSpeedKmh)
            : calcSpeed(spec.radiusM, spec.orbitPeriodMin);
          drawOrbitVisualization(center, spec.radiusM, spec.direction, spd, spec.orbitPeriodMin, { lat: sel.latest.lat, lng: sel.latest.lng });
        }
      }
    }
  }

  // drones (on top, with visible shadows)
  const droneSize = Math.max(5, Math.min(11, zoom * 0.75));

  const now = Date.now();
  drones.forEach((d) => {
    const latest = d && typeof d.getLatest === "function" ? d.getLatest() : null;
    if (!latest) return;

    const p = latLngToScreen(latest.lat, latest.lng);
      const isStale = typeof d.isStale === "function" ? d.isStale(now) : false;
      const isLanded = isTelemetryLanded(latest);
      const isHighlighted =
        (pinnedDroneId !== null && d.id === pinnedDroneId) || (selMembers && selMembers.has(d.id));

    if (isHighlighted) {
      drawSelectionHighlight(p.x, p.y, droneSize, latest.heading || 0);
    }

      drawDroneIcon(p.x, p.y, droneSize, latest.heading || 0, { isStale, isLanded });

    if (isStale) {
      const age = typeof d.getSecondsSinceLastUpdate === "function" ? d.getSecondsSinceLastUpdate(now) : null;
      if (age !== null) {
        drawStaleLabel(p.x, p.y - droneSize * 1.2, age);
      }
    }
  });

  updateTooltip();
  ensureOrbitAnimationLoop();
}

window.addEventListener("DOMContentLoaded", () => {
  applyRuntimeModeUi();
  setTimestampNow();
  setInterval(setTimestampNow, 1000 * 15);
  updateVisualViewportVars();
  document.addEventListener(
    "focusin",
    (e) => {
      const t = e.target;
      if (isTextInputElement(t)) setGlobalKeyboardActive(true);
    },
    true
  );
  document.addEventListener(
    "focusout",
    () => {
      // Delay to allow focus to move to another input without toggling.
      setTimeout(() => {
        const active = document.activeElement;
        const stillOpen = getCommsKeyboardInset() > 40;
        if (!isTextInputElement(active) && !stillOpen) setGlobalKeyboardActive(false);
      }, 120);
    },
    true
  );
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => {
      updateVisualViewportVars();
      if (map && typeof map.invalidateSize === "function") {
        map.invalidateSize({ pan: false });
      }
      forceRedraw();
    });
    window.visualViewport.addEventListener("scroll", () => {
      updateVisualViewportVars();
      if (map && typeof map.invalidateSize === "function") {
        map.invalidateSize({ pan: false });
      }
      forceRedraw();
    });
  }

  // Collapsible panels
  document.querySelectorAll("aside.panel[data-collapsible='1'] .panel-title").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.closest("aside.panel");
      if (!panel) return;
      const collapsed = panel.classList.toggle("is-collapsed");
      btn.setAttribute("aria-expanded", collapsed ? "false" : "true");
    });
  });

  groundControl = new GroundControl();
  updateCommandSequencePanel();
  initLivePositionUi();

  const addBtn = document.getElementById("sequenceAddBtn");
  if (addBtn) {
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openSequenceMenu(addBtn);
    });
  }

  const playBtn = document.getElementById("seqPlayBtn");
  if (playBtn) {
    playBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      playBtn.classList.add("is-active");
      setTimeout(() => playBtn.classList.remove("is-active"), 220);
      const sel = getSelectedEntity();
      const key = getSelectionKey(sel);
      if (!key) return;
      if (isSequencePlaying(key)) {
        pauseSelectedEntity();
      } else {
        executeSelectedSequenceCommand();
      }
    });
  }

  updateCommandSequencePanel();

  initMapOnline();
  initGroundStations();
  if (LIVE_POSITION_MODE) {
    if (liveState.mockEnabled) {
      startLivePositionMock();
    }
  } else {
    makeMockSwarm();
    tryAddUserHomeFromDevice();
  }
  setupOverlay();
  setupHoverHandlers();
  updateStatusList();
  setInterval(() => {
    updateStatusList();
    updateCommandSequencePanel();
    updateTooltip();
    renderLiveControls();
    if (isLiveRemoteViewerMode()) renderLiveGcStatus();
    if (LIVE_POSITION_MODE) draw();
  }, 1000);

  // Draw once Leaflet has applied initial view & tiles; prevents initial misalignment.
  map.whenReady(() => {
    draw();
  });
});
