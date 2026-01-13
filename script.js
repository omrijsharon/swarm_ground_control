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
let statusMemberMenuEl = null;
let pendingStatusMember = null;
let followMenuEl = null;
let pendingFollow = null;
let relationMenuEl = null;
let pendingRelation = null;
let orbitMenuEl = null;
let pendingOrbit = null;
let orbitCloseSuppressUntil = 0;
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
let commsLogsByStationId = new Map(); // stationId -> { messages: {from,text,ts}[] }
let commsComposerEl = null;
let commsDraftByStationId = new Map(); // stationId -> string
let commsComposerInputEl = null;
let commsComposerSendEl = null;

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
      closeUserHomePrompt();
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
  const gs = groundStations.find((g) => g.id === stationId);
  if (!gs) return;

  const host = document.getElementById("app") || document.body;
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
  const isUser = userGroundStationId !== null && Number(userGroundStationId) === Number(gs.id);
  const relocating = gsRelocate && Number(gsRelocate.stationId) === Number(gs.id);
  const isDynamic = !!gs.isDynamic;

  if (relocating) {
    gsMenuEl.innerHTML = `
      <div class="menu-head">
        <span class="menu-eta" style="display:block;">Tap map to place</span>
      </div>
    `;
    return;
  }

  const name = (gs.name || `Home #${gs.id + 1}`).trim();
  gsMenuEl.innerHTML = `
    <div class="menu-head">
      <h4>${name}</h4>
      <span class="menu-eta">Ground Station</span>
    </div>
    <div class="command-list cmd-action-list column" style="margin-top:2px;">
      ${isUser ? `<button class="cmd-chip cmd-action" data-action="gs-rename" type="button">Change name</button>` : ""}
      ${
        isUser
          ? `<button class="cmd-chip cmd-action" data-action="gs-move" type="button" ${
              isDynamic ? "disabled" : ""
            } style="${isDynamic ? "opacity:0.45; cursor:not-allowed;" : ""}">Change location</button>`
          : ""
      }
    </div>
    ${
      isUser
        ? `<div class="seg-wrap" style="margin-top:10px;">
            <div class="seg">
              <button class="seg-btn${!isDynamic ? " is-active" : ""}" data-gs-mode="static" type="button">Static</button>
              <button class="seg-btn${isDynamic ? " is-active" : ""}" data-gs-mode="dynamic" type="button">Dynamic</button>
            </div>
          </div>`
        : `<div class="status-mission" style="line-height:1.35; opacity:0.85; margin-top:10px;">Read-only.</div>`
    }
  `;

  const rename = gsMenuEl.querySelector("[data-action='gs-rename']");
  if (rename) {
    rename.addEventListener("click", (e) => {
      e.stopPropagation();
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

  const mapRect = map.getContainer().getBoundingClientRect();
  gsMenuEl.style.left = `${mapRect.left + containerPoint.x + 12}px`;
  gsMenuEl.style.top = `${mapRect.top + containerPoint.y - 10}px`;

  renderGroundStationMenu();
  document.addEventListener("pointerdown", handleGsMenuOutsideClick, true);
  updateCommandSequencePanel();
  forceRedraw();
}

function addUserHomeAtLatLng(latlng, alt = 0) {
  if (!latlng) return;
  const lat = Number(latlng.lat);
  const lng = Number(latlng.lng);
  if (!isFinite(lat) || !isFinite(lng)) return;
  if (userGroundStationId !== null && userGroundStationId !== undefined) {
    const existing = groundStations.find((g) => g.id === userGroundStationId);
    if (existing) {
      existing.updatePosition({ lat, lng, alt: isFinite(Number(alt)) ? Number(alt) : existing.alt });
    }
  } else {
    const nextId = groundStations.reduce((m, g) => Math.max(m, g.id), -1) + 1;
    userGroundStationId = nextId;
    groundStations.push(new GroundStation(nextId, lat, lng, isFinite(Number(alt)) ? Number(alt) : 0, null));
  }
  pendingUserHomePlacement = false;
  closeUserHomePrompt();
  const gs = groundStations.find((g) => g.id === userGroundStationId);
  if (gs && (!gs.name || !String(gs.name).trim())) openGroundStationNameMenu(gs.id);
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

function setPinnedDrone(id) {
  const nextTeam = getTeamForDrone(id);
  const nextTeamId = nextTeam ? nextTeam.id : null;
  const nextDroneId = nextTeam ? null : id;
  clearTooltipPinnedIfSelectionChanges(nextDroneId, nextTeamId);
  const team = getTeamForDrone(id);
  pinnedTeamId = team ? team.id : null;
  pinnedDroneId = team ? null : id;
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
  const d = Math.max(20, Number(diameterM) || 0);
  const radius = d / 2;
  const baseBearing = bearingDeg(anchorLatLng.lat, anchorLatLng.lng, fromLatLng.lat, fromLatLng.lng);
  const secondBearingA = (baseBearing + 90 + 360) % 360;
  const secondBearingB = (baseBearing - 90 + 360) % 360;
  const secondPointA = destinationLatLng(anchorLatLng.lat, anchorLatLng.lng, secondBearingA, radius);
  const secondPointB = destinationLatLng(anchorLatLng.lat, anchorLatLng.lng, secondBearingB, radius);

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
  const theta = toRad(approachBearing);
  const n = { x: Math.cos(theta), y: -Math.sin(theta) }; // normal to tangent (bearing 0 = +y)

  const buildGeom = (centerXY, secondPoint) => {
    const center = toLL(centerXY);
    const radiusM = radius;
    const droneXY = toXY(fromLatLng);
    const v = { x: droneXY.x - centerXY.x, y: droneXY.y - centerXY.y };
    const vLen = Math.hypot(v.x, v.y);
    const entryXY =
      vLen > 1e-6
        ? { x: centerXY.x + (v.x / vLen) * radiusM, y: centerXY.y + (v.y / vLen) * radiusM }
        : { x: centerXY.x + radiusM, y: centerXY.y };
    const entryPoint = toLL(entryXY);
    const aEntry = Math.atan2(entryXY.y - centerXY.y, entryXY.x - centerXY.x);
    const aTarget = Math.atan2(T.y - centerXY.y, T.x - centerXY.x);
    return { center, radiusM, entryPoint, aEntry, aTarget, secondPoint };
  };

  const centerAXY = { x: n.x * radius, y: n.y * radius };
  const centerBXY = { x: -n.x * radius, y: -n.y * radius };
  const geomA = buildGeom(centerAXY, secondPointA);
  const geomB = buildGeom(centerBXY, secondPointB);

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
      options.push({ ...geom, direction, totalDistM, alignErr, tangentBearing });
    });
  });

  options.sort((a, b) => {
    if (a.alignErr !== b.alignErr) return a.alignErr - b.alignErr;
    return a.totalDistM - b.totalDistM;
  });
  return options[0] || null;
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

  const { center, entryPoint, radiusM } = geom;
  const chosenDir = geom.direction || direction || "CW";
  const c = latLngToScreen(center.lat, center.lng);
  const t = latLngToScreen(anchorLatLng.lat, anchorLatLng.lng);
  const s = latLngToScreen(entryPoint.lat, entryPoint.lng);
  if (!c || !t || !s) return;

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

  // Mark the entry point
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.arc(s.x, s.y, Math.max(3, rPx * 0.04), 0, Math.PI * 2);
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

function updateStatusList() {
  const host = document.getElementById("statusList");
  if (!host) return;
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
      }
      gsRelocate = null;
      closeGroundStationMenu();
      updateTooltip();
      draw();
      return;
    }
  }
  // Flank bearing is controlled only by the knob (no map click behavior).
  // If we're asking the user to place their Home, the next click places it.
  if (pendingUserHomePlacement) {
    addUserHomeAtLatLng(e.latlng);
    return;
  }
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

function getCommsLog(stationId) {
  const id = Number(stationId);
  if (!commsLogsByStationId.has(id)) {
    commsLogsByStationId.set(id, { messages: [] });
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

  if (!log.messages.length) {
    const empty = document.createElement("div");
    empty.className = "sequence-empty";
    empty.textContent = `No comms messages with ${(gs.name || `Home #${gs.id + 1}`).trim()} yet.`;
    thread.appendChild(empty);
  } else {
    log.messages.forEach((m) => {
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

  const input = commsComposerEl.querySelector("[data-comms-input]");
  const send = commsComposerEl.querySelector("[data-comms-send]");
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

  const sendMsg = () => {
    const text = (input && input.value ? input.value : "").trim();
    if (!text) return;
    log.messages.push({ from: "us", text, ts: Date.now() });
    if (input) input.value = "";
    renderCommsPanel(gs, listEl);
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
    send.addEventListener("click", (e) => {
      e.stopPropagation();
      sendMsg();
    });
  }
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMsg();
      }
    });
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

  const calcEtaSec = () => {
    if (!sel || !sel.latest) return null;
    const from = { lat: sel.latest.lat, lng: sel.latest.lng };
    let dir = pendingFlank.direction;
    const geom = computeFlankSolution(anchorLatLng, pendingFlank.approachBearingDeg, pendingFlank.diameterM, from);
    if (!geom) return null;
    dir = geom.direction || dir;
    pendingFlank.direction = dir;
    const distToEntry = haversine2dMeters(sel.latest.lat, sel.latest.lng, geom.entryPoint.lat, geom.entryPoint.lng);
    const arcLen = arcLengthForDirection(geom.radiusM, geom.aEntry, geom.aTarget, dir);
    const speedMps = Math.max(1, (pendingFlank.approachSpeedKmh / 3.6));
    return (distToEntry + arcLen) / speedMps;
  };

  const updateEta = () => {
    const etaEl = flankMenuEl.querySelector(".menu-eta");
    if (!etaEl) return;
    const sec = calcEtaSec();
    etaEl.textContent = formatEta(sec);
  };

  flankMenuEl.innerHTML = `
    <div class="menu-head">
      <h4>Flank</h4>
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
      <button class="cmd-chip cmd-action" type="button" data-action="flank-cancel" style="flex:1;">Cancel</button>
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
      pendingFlank.approachBearingDeg = Math.round(deg);
      updateFlankBearingUI();
      updateFlankEtaDisplay();
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

  const cancel = flankMenuEl.querySelector("[data-action='flank-cancel']");
  if (cancel) {
    cancel.addEventListener("click", (e) => {
      e.stopPropagation();
      closeFlankMenu(true);
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
  const distToEntry = haversine2dMeters(from.lat, from.lng, geom.entryPoint.lat, geom.entryPoint.lng);
  const arcLen = arcLengthForDirection(geom.radiusM, geom.aEntry, geom.aTarget, geom.direction || "CW");
  const speedMps = Math.max(1, pendingFlank.approachSpeedKmh / 3.6);
  const sec = (distToEntry + arcLen) / speedMps;
  const etaEl = flankMenuEl.querySelector(".menu-eta");
  if (!etaEl) return;
  const m = Math.floor(sec / 60);
  const s = Math.max(0, Math.round(sec - m * 60));
  etaEl.textContent = `${m}m ${s.toString().padStart(2, "0")}s`;
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
  // Single Tel Aviv anchor (e.g., HQ/helipad). Can be extended later.
  userGroundStationId = null;
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

  // Selection glow (cyan) when active.
  if (active) {
    ctx.shadowColor = SETTINGS.SELECTION_GLOW_COLOR;
    ctx.shadowBlur = Math.max(12, size * 1.35);
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

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
    drawGroundStationIcon(p.x, p.y, gsSize, { active: activeGroundStationId === gs.id });
    drawGroundStationLabel(p.x, p.y, gs.name || `Home #${gs.id + 1}`, gsSize);
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
  ensureOrbitAnimationLoop();
}

window.addEventListener("DOMContentLoaded", () => {
  setTimestampNow();
  setInterval(setTimestampNow, 1000 * 15);

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
  makeMockSwarm();
  initGroundStations();
  tryAddUserHomeFromDevice();
  setupOverlay();
  setupHoverHandlers();
  updateStatusList();
  setInterval(() => {
    updateStatusList();
    updateCommandSequencePanel();
    updateTooltip();
  }, 1000);

  // Draw once Leaflet has applied initial view & tiles; prevents initial misalignment.
  map.whenReady(() => {
    draw();
  });
});
