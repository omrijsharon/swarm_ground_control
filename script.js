// UI-only mock. No serial, no backend. Just visuals.

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

let map;
let overlay, ctx;
let drones = [];
let groundStations = [];
let waypointTargets = new Map(); // droneId -> { lat, lng, speedKmh }
let groundControl;

const COMMAND_OPTIONS = [
  "Arm",
  "Disarm",
  "Takeoff",
  "Land",
  "Goto waypoint",
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
let waypointMenuEl = null;
let pendingWaypoint = null;
let waypointCloseSuppressUntil = 0;
let tooltipSuppressUntil = 0;
let waypointDroneId = null;
let waypointTeamId = null;
let followMenuEl = null;
let pendingFollow = null;
let longPressTimer = null;
let longPressSuppressUntil = 0;
let suppressMapClickUntil = 0;
let isMapDragging = false;
let followTargets = new Map(); // followerId -> targetId
let homeTargets = new Map(); // droneId -> stationId
let teams = [];
let pinnedTeamId = null;
let lastCreatedTeamId = null;

function forceRedraw() {
  draw();
  requestAnimationFrame(draw);
  setTimeout(draw, 0);
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
  pinnedTeamId = null;
  pinnedDroneId = null;
  hoveredDroneId = null;
  if (hideTooltip && tooltipEl) tooltipEl.style.display = "none";
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
  constructor(id, lat, lng, alt = 0) {
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.alt = alt;
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
    this.logs = [];
  }

  assignMission(droneId, command, issuedAt = Date.now()) {
    const entry = { droneId, command, issuedAt };
    this.assigned.set(droneId, entry);
    this.logs.push(entry);
  }

  getAssigned(droneId) {
    return this.assigned.get(droneId) || null;
  }
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

function setPinnedDrone(id) {
  const team = getTeamForDrone(id);
  pinnedTeamId = team ? team.id : null;
  pinnedDroneId = team ? null : id;
  hoveredDroneId = id;
  tooltipMode = "info";
  // Only close waypoint menu if selecting a different drone; keep it if it's for the same drone.
  if (waypointDroneId === null || waypointDroneId !== id) {
    closeWaypointMenu();
  }
  closeFollowMenu(false);
  closeHomeMenu(false);
  tooltipSuppressUntil = 0;
  updateStatusList();
  scrollStatusIntoView(id);
  updateTooltip();
  if (team) {
    focusTeamView(team);
  }
  forceRedraw();
}

function setPinnedTeam(id, suppressTooltip = false) {
  pinnedTeamId = id;
  pinnedDroneId = null;
  hoveredDroneId = null;
  tooltipMode = "info";
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

function findNearestWaypoint(containerPoint, maxDist = 14) {
  let best = null;
  let bestDist = maxDist;
  waypointTargets.forEach((wp, droneId) => {
    const p = map.latLngToContainerPoint([wp.lat, wp.lng]);
    const dist = Math.hypot(p.x - containerPoint.x, p.y - containerPoint.y);
    if (dist < bestDist) {
      best = { droneId, wp, point: p };
      bestDist = dist;
    }
  });
  return best;
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

function updateStatusList() {
  const host = document.getElementById("statusList");
  if (!host) return;
  host.innerHTML = "";
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
    row.addEventListener("click", () => {
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

    header.addEventListener("click", () => {
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
}

function ensureTooltipEl() {
  if (tooltipEl) return tooltipEl;
  const host = document.getElementById("app") || document.body;
  const el = document.createElement("div");
  el.className = "drone-tooltip";
  el.style.display = "none";
  host.appendChild(el);
  tooltipEl = el;
  return tooltipEl;
}

function updateTooltip() {
  if (!map) return;
  // If a relative menu (e.g., Goto WP) is open, keep the drone tooltip hidden.
  if (waypointMenuEl || followMenuEl || homeMenuEl || performance.now() < tooltipSuppressUntil) {
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

  const pt = map.latLngToContainerPoint([latest.lat, latest.lng]);
  el.style.left = `${pt.x + 14}px`;
  el.style.top = `${pt.y - 10}px`;
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
    tooltipMode = "commands";
    updateTooltip();
  };
}

function setupHoverHandlers() {
  if (!map) return;

  map.on("mousemove", (e) => {
    lastPointer = e.containerPoint;
    if (pinnedDroneId !== null) {
      updateTooltip();
      return;
    }
    const nearest = findNearestDrone(e.containerPoint, getHoverRadius());
    hoveredDroneId = nearest ? nearest.id : null;
    updateTooltip();
  });

  map.on("click", handleMapClick);

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
  const startLongPress = (ev) => {
    if (performance.now() < longPressSuppressUntil) return;
    if (isZooming || isMapDragging) return;
    if (ev.pointerType === "touch" && ev.isPrimary === false) return;
    if (typeof ev.button === "number" && ev.button !== 0) return;

    if (longPressTimer) clearTimeout(longPressTimer);
    const point = map.mouseEventToContainerPoint(ev);
    longPressPointerId = ev.pointerId ?? null;
    longPressStartClient = { x: ev.clientX, y: ev.clientY };
    longPressTimer = setTimeout(() => {
      longPressTimer = null;
      longPressPointerId = null;
      longPressStartClient = null;
      attemptActionLongPress(point);
      longPressSuppressUntil = performance.now() + 500;
    }, 220);
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
  if (performance.now() < longPressSuppressUntil) return;
  const hitWp = findNearestWaypoint(e.containerPoint, 16);
  const nearest = findNearestDrone(e.containerPoint, getHoverRadius());
  const nearGs = findNearestGroundStation(e.containerPoint, getHoverRadius());

  // Close follow menu on any plain map click.
  if (followMenuEl) closeFollowMenu();
  if (homeMenuEl) closeHomeMenu();

  if (hitWp) {
    if (waypointMenuEl) closeWaypointMenu(false, true);
    if (pinnedTeamId !== null) {
      openWaypointMenu({ lat: hitWp.wp.lat, lng: hitWp.wp.lng }, e.containerPoint, null, hitWp.droneId);
      return;
    }
    const targetId = pinnedDroneId !== null ? pinnedDroneId : hitWp.droneId;
    if (targetId !== null && targetId !== undefined) {
      setPinnedDrone(targetId);
    }
    openWaypointMenu({ lat: hitWp.wp.lat, lng: hitWp.wp.lng }, e.containerPoint, targetId, hitWp.droneId);
    return;
  }

  if (nearest) {
    if (pinnedDroneId !== null && pinnedDroneId !== nearest.id) {
      // With a selected drone, single-click another drone to open Follow menu.
      closeWaypointMenu(false, true);
      closeHomeMenu(false);
      openFollowMenu(nearest.id, e.containerPoint);
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
    }
    return;
  }

  setPinnedDrone(null);
  closeWaypointMenu();
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

function issueLocalCommand(drone, cmd) {
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

  // Changing mission clears any stored waypoint visuals for this drone.
  waypointTargets.delete(drone.id);
  followTargets.delete(drone.id);

  drone.updateTelemetry(next);
  if (groundControl) groundControl.assignMission(drone.id, cmd);
  tooltipMode = "info";
  updateStatusList();
  updateTooltip();
  draw();
}

function issueTeamCommand(team, cmd) {
  if (!team) return;
  [...team.members].forEach((id) => {
    const d = getDroneById(id);
    if (d) issueLocalCommand(d, cmd);
  });
  setPinnedTeam(team.id);
}

function issueGotoWaypointSingle(drone, wp) {
  if (!drone || !wp) return;
  const latest = drone.getLatest && drone.getLatest();
  if (!latest) return;
  const speed = Math.max(10, Math.min(100, Math.round(wp.speedKmh || 60)));
  const cmd = `Goto waypoint (spd ${speed} km/h)`;
  const next = { ...latest, command: cmd, uptimeSec: latest.uptimeSec + 0.01 };
  drone.updateTelemetry(next);
  waypointTargets.set(drone.id, { lat: wp.lat, lng: wp.lng, speedKmh: speed });
  if (groundControl) groundControl.assignMission(drone.id, cmd);
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

function issueReturnHomeSingle(droneId, stationId, mode = "land") {
  const drone = getDroneById(droneId);
  if (!drone) return;
  const latest = drone.getLatest && drone.getLatest();
  if (!latest) return;
  const cmd = `Return home (${mode})`;
  const next = { ...latest, command: cmd, uptimeSec: latest.uptimeSec + 0.01 };
  drone.updateTelemetry(next);
  if (groundControl) groundControl.assignMission(drone.id, cmd);
  homeTargets.set(drone.id, stationId);
}

function issueReturnHome(payload) {
  if (!payload) return;
  const mode = payload.mode === "hover" ? "hover" : "land";
  if (payload.teamId !== undefined && payload.teamId !== null) {
    const team = getTeamById(payload.teamId);
    if (team) {
      [...team.members].forEach((id) => issueReturnHomeSingle(id, payload.stationId, mode));
    }
  } else if (payload.droneId !== undefined && payload.droneId !== null) {
    issueReturnHomeSingle(payload.droneId, payload.stationId, mode);
  }
  closeHomeMenu();
  tooltipMode = "info";
  pinnedDroneId = null;
  pinnedTeamId = null;
  hoveredDroneId = null;
  tooltipSuppressUntil = performance.now() + 1200;
  if (tooltipEl) tooltipEl.style.display = "none";
  updateStatusList();
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
  document.removeEventListener("pointerdown", handleWaypointOutsideClick, true);
  // Clear hover so tooltip doesn't resurrect automatically after suppression expires.
  hoveredDroneId = null;
  if (tooltipEl) tooltipEl.style.display = "none";
  // Deselect only when we actually closed an open waypoint menu and caller wants it.
  if (hadMenu && !keepSelection) {
    pinnedDroneId = null;
    pinnedTeamId = null;
  }
  if (suppressNextOpen) {
    const now = performance.now();
    waypointCloseSuppressUntil = now + 550; // avoid immediate reopen on same click
    tooltipSuppressUntil = now + 550; // also block tooltip reopen for a short window
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
    <button class="cmd-chip cmd-action" type="button" data-action="rth">Return to Home</button>
  `;

  const mapRect = map.getContainer().getBoundingClientRect();
  homeMenuEl.style.left = `${mapRect.left + containerPoint.x + 12}px`;
  homeMenuEl.style.top = `${mapRect.top + containerPoint.y - 10}px`;
  homeMenuEl.addEventListener("pointerdown", (ev) => ev.stopPropagation());

  const host = document.getElementById("app") || document.body;
  host.appendChild(homeMenuEl);

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
}

function issueFollowCommand(follower, targetId) {
  if (!follower || targetId === null || targetId === undefined) return;
  const latest = follower.getLatest && follower.getLatest();
  if (!latest) return;
  const cmd = `Follow drone #${targetId + 1}`;
  const next = { ...latest, command: cmd, uptimeSec: latest.uptimeSec + 0.01 };
  follower.updateTelemetry(next);
  if (groundControl) groundControl.assignMission(follower.id, cmd);
  followTargets.set(follower.id, targetId);
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
  updateTooltip();
  draw();
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

  const btn = followMenuEl.querySelector("[data-action='follow']");
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      issueFollowCommand(follower, targetDroneId);
    });
  }
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
  const point = e.containerPoint;
  const near = findNearestDrone(point, getHoverRadius());
  const nearGs = findNearestGroundStation(point, getHoverRadius());
  if (nearGs && (pinnedDroneId !== null || pinnedTeamId !== null)) {
    openHomeMenu(e.latlng, point, nearGs);
    return;
  }
  if (near && (pinnedDroneId !== null || pinnedTeamId !== null)) {
    // Create/merge team with clicked drone
    const baseIds = pinnedTeamId !== null ? [...(getTeamById(pinnedTeamId)?.members || [])] : [pinnedDroneId];
    if (baseIds.length) {
      const t = ensureTeam([...baseIds, near.id]);
      if (t) setPinnedTeam(t.id, true);
      return;
    }
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
  const near = findNearestDrone(containerPoint, getHoverRadius());
  const nearGs = findNearestGroundStation(containerPoint, getHoverRadius());
  if (nearGs && (pinnedDroneId !== null || pinnedTeamId !== null)) {
    const latlng = map.containerPointToLatLng(containerPoint);
    openHomeMenu(latlng, containerPoint, nearGs);
    return;
  }
  if (near) {
    const selTeam = pinnedTeamId !== null ? getTeamById(pinnedTeamId) : null;
    const nearTeam = getTeamForDrone(near.id);
    if (selTeam && nearTeam && selTeam.id === nearTeam.id) {
      // detach
      detachFromTeam(near.id);
      if (selTeam && selTeam.members.size >= 2) {
        setPinnedTeam(selTeam.id, true);
      }
      return;
    }
    // add to team or create
    const baseIds =
      selTeam ? [...selTeam.members] : pinnedDroneId !== null ? [pinnedDroneId] : nearTeam ? [...nearTeam.members] : [];
    if (baseIds.length) {
      const t = ensureTeam([...baseIds, near.id]);
      if (t) setPinnedTeam(t.id, true);
      return;
    }
  }

  // Long-press on empty map to open Goto WP for the current selection.
  if (!near && !nearGs) {
    if (pinnedTeamId !== null || pinnedDroneId !== null) {
      const latlng = map.containerPointToLatLng(containerPoint);
      openWaypointMenu(latlng, containerPoint, null, null);
      return;
    }
  }
}

function handleWaypointOutsideClick(e) {
  if (!waypointMenuEl) return;
  if (waypointMenuEl.contains(e.target)) return;
  closeWaypointMenu(true);
}

function openWaypointMenu(latlng, containerPoint, droneId = null, ownerId = null) {
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
  closeFollowMenu();
  closeHomeMenu();

  pendingWaypoint = { lat: latlng.lat, lng: latlng.lng, speedKmh: 60, ownerId: ownerId ?? null };
  const latest = selectedTeam ? getTeamSnapshot(selectedTeam) : drone.getLatest && drone.getLatest();
  const distKm = latest ? haversine2dMeters(latest.lat, latest.lng, latlng.lat, latlng.lng) / 1000 : null;
  const distLabel = distKm !== null && isFinite(distKm) ? `${distKm.toFixed(2)} km` : "Waypoint";
  const ownerWp = ownerId !== null ? waypointTargets.get(ownerId) : null;
  const showSync = !!ownerWp;

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

  waypointDroneId = selectedTeam ? null : drone.id;
  waypointTeamId = selectedTeam ? selectedTeam.id : null;
  if (selectedTeam) {
    pinnedTeamId = selectedTeam.id; // keep team selected while menu is open
    pinnedDroneId = null;
  } else {
    pinnedDroneId = drone.id; // keep drone selected while menu is open
    pinnedTeamId = null;
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

  waypointMenuEl.innerHTML = `
    <div class="menu-head">
      <h4>${distLabel}</h4>
      ${showSync ? `<button class="sync-btn" type="button" data-sync title="Match ETA">⇆</button>` : ""}
      <span class="menu-eta">${etaLabel}</span>
    </div>
    <button class="cmd-chip cmd-action" data-action="goto-wp" type="button">Goto WP</button>
    <div class="speed-row">
      <input type="range" min="10" max="100" value="${pendingWaypoint.speedKmh}" step="1" data-speed-slider>
      <span data-speed-label>${pendingWaypoint.speedKmh} km/h</span>
    </div>
  `;

  const slider = waypointMenuEl.querySelector("[data-speed-slider]");
  if (slider) {
    slider.addEventListener("input", (e) => {
      const v = Number(e.target.value) || 60;
      pendingWaypoint.speedKmh = v;
      updateLabel(v);
    });
  }

  const btn = waypointMenuEl.querySelector("[data-action='goto-wp']");
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (waypointTeamId !== null) {
        const team = getTeamById(waypointTeamId);
        if (team) {
          [...team.members].forEach((id) => {
            const d = getDroneById(id);
            if (d) issueGotoWaypointSingle(d, pendingWaypoint);
          });
        }
        closeWaypointMenu();
        tooltipMode = "info";
        pinnedDroneId = null;
        pinnedTeamId = null;
        updateStatusList();
        updateTooltip();
        draw();
      } else {
        issueGotoWaypoint(drone, pendingWaypoint);
      }
    });
  }

  const syncBtn = waypointMenuEl.querySelector("[data-sync]");
  if (syncBtn && ownerWp && latest) {
    syncBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const ownerDrone = getDroneById(ownerId);
      const ownerLatest = ownerDrone && ownerDrone.getLatest && ownerDrone.getLatest();
      if (!ownerLatest || !ownerWp.speedKmh) return;
      const ownerDistKm = haversine2dMeters(ownerLatest.lat, ownerLatest.lng, ownerWp.lat, ownerWp.lng) / 1000;
      if (!isFinite(ownerDistKm) || ownerDistKm <= 0) return;
      const etaHours = ownerDistKm / ownerWp.speedKmh;
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
  map = L.map("map", { zoomControl: false }).setView([32.0853, 34.7818], 11);

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
  if (cmd === "Goto waypoint") return `Goto waypoint (spd ${Math.round(5 + rng() * 10)} m/s)`;
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
  // Single Tel Aviv anchor (e.g., HQ/helipad). Can be extended later.
  groundStations = [
    new GroundStation(0, 32.0853, 34.7818, 20), // Tel Aviv center-ish
  ];
}

function drawGroundStationIcon(x, y, size = 18) {
  ctx.save();
  ctx.translate(x, y);

  // Larger perimeter ring; keep H compact.
  const radius = size * 0.95;

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

function drawDroneIcon(x, y, size = 10, headingDeg = 0, options = {}) {
  // Concave triangle (chevron/arrow) with a cheap, high-contrast outline.
  const isStale = options.isStale || false;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(((headingDeg || 0) * Math.PI) / 180);
  if (isStale) ctx.globalAlpha = 0.45;

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

  ctx.strokeStyle = "rgba(0,0,0,0.85)";
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

  ctx.fillStyle = isStale ? "rgba(255, 180, 180, 0.82)" : "rgba(255,255,255,0.92)";
  path();
  ctx.fill();

  ctx.lineWidth = Math.max(1.2, size * 0.10);
  ctx.strokeStyle = "rgba(255,255,255,0.95)";
  path();
  ctx.stroke();

  ctx.restore();
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

function drawWaypointPin(x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -18);
  ctx.stroke();

  const r = 6;
  ctx.fillStyle = "rgba(255,80,80,0.95)";
  ctx.beginPath();
  ctx.arc(0, -18, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.lineWidth = 1.4;
  ctx.stroke();
  ctx.restore();
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
  const gsSize = Math.max(14, Math.min(26, zoom * 1.45));
  groundStations.forEach((gs) => {
    const p = latLngToScreen(gs.lat, gs.lng);
    drawGroundStationIcon(p.x, p.y, gsSize);
  });

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

  // Waypoints (relative commands)
  waypointTargets.forEach((wp, droneId) => {
    const d = getDroneById(droneId);
    const latest = d && d.getLatest && d.getLatest();
    if (!latest) return;
    const from = latLngToScreen(latest.lat, latest.lng);
    const to = latLngToScreen(wp.lat, wp.lng);

    // Dashed line
    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();

    // Pin (lollipop)
    drawWaypointPin(to.x, to.y);
  });

  // drones (on top, with visible shadows)
  const droneSize = Math.max(5, Math.min(11, zoom * 0.75));

  const now = Date.now();
  drones.forEach((d) => {
    const latest = d && typeof d.getLatest === "function" ? d.getLatest() : null;
    if (!latest) return;

    const p = latLngToScreen(latest.lat, latest.lng);
    const isStale = typeof d.isStale === "function" ? d.isStale(now) : false;
    const isHighlighted =
      (pinnedDroneId !== null && d.id === pinnedDroneId) || (selMembers && selMembers.has(d.id));

    if (isHighlighted) {
      drawSelectionHighlight(p.x, p.y, droneSize, latest.heading || 0);
    }

    drawDroneIcon(p.x, p.y, droneSize, latest.heading || 0, { isStale });

    if (isStale) {
      const age = typeof d.getSecondsSinceLastUpdate === "function" ? d.getSecondsSinceLastUpdate(now) : null;
      if (age !== null) {
        drawStaleLabel(p.x, p.y - droneSize * 1.2, age);
      }
    }
  });

  updateTooltip();
}

window.addEventListener("DOMContentLoaded", () => {
  setTimestampNow();
  setInterval(setTimestampNow, 1000 * 15);

  const slider = document.querySelector(".slider");
  const altVal = document.getElementById("altVal");
  slider.addEventListener("input", () => (altVal.textContent = slider.value));

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
  renderCommandList();

  initMapOnline();
  makeMockSwarm();
  initGroundStations();
  setupOverlay();
  setupHoverHandlers();
  updateStatusList();
  setInterval(() => {
    updateStatusList();
    updateTooltip();
  }, 1000);

  // Draw once Leaflet has applied initial view & tiles; prevents initial misalignment.
  map.whenReady(() => {
    draw();
  });
});

