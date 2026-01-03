// UI-only mock. No serial, no backend. Just visuals.

let map;
let overlay, ctx;
let drones = [];
let links = [];

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

  // Add a small floating button inside Leaflet's standard control area (top-right)
  // that opens the modal layer picker.
  const LayerBtn = L.Control.extend({
    options: { position: "topright" },
    onAdd: function () {
      const btn = L.DomUtil.create("button", "leaflet-bar");
      btn.type = "button";
      btn.title = "Layers";
      btn.setAttribute("aria-label", "Layers");

      // Bigger button with label
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

      const icon = document.createElement("span");
      icon.textContent = "≡";
      icon.style.fontSize = "20px";
      icon.style.lineHeight = "1";
      icon.style.transform = "translateY(-1px)";

      const label = document.createElement("span");
      label.textContent = "Layers";

      btn.textContent = "";
      btn.appendChild(icon);
      btn.appendChild(label);

      L.DomEvent.disableClickPropagation(btn);

      const openAnchored = () => {
        setOpen(true);

        // Anchor the panel under the button so it looks like a designed dropdown.
        const panel = host.querySelector(".layer-picker-panel");
        if (!panel) return;

        const r = btn.getBoundingClientRect();
        const gap = 10;

        // Position panel below the button; clamp within viewport.
        const desiredTop = Math.round(r.bottom + gap);
        const desiredRight = Math.round(window.innerWidth - r.right);

        panel.style.top = `${Math.max(12, desiredTop)}px`;
        panel.style.right = `${Math.max(12, desiredRight)}px`;

        // Place caret roughly aligned to the button center
        const caretRight = Math.max(18, Math.round((r.width / 2) + 18));
        panel.style.setProperty("--layer-caret-right", `${caretRight}px`);
      };

      L.DomEvent.on(btn, "click", (e) => {
        L.DomEvent.stop(e);
        openAnchored();
      });

      // Keep a reference for later (e.g., window resize while open)
      btn.dataset.role = "layerPickerButton";

      return btn;
    },
  });
  map.addControl(new LayerBtn());

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

function makeMockSwarm() {
  // Always regenerate from scratch once at startup, but deterministically.
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

  for (let i = 0; i < 22; i++) {
    drones.push({
      id: id++,
      lat: center.lat + randBetweenSeeded(-0.03, 0.03),
      lng: center.lng + randBetweenSeeded(-0.04, 0.04),
      type: "core",
    });
  }

  clusters.forEach((c, idx) => {
    for (let i = 0; i < c.n; i++) {
      drones.push({
        id: id++,
        lat: c.lat + randBetweenSeeded(-0.03, 0.03),
        lng: c.lng + randBetweenSeeded(-0.04, 0.04),
        type: ["blue", "cyan", "green", "orange"][idx % 4],
      });
    }
  });

  const core = drones.filter((d) => d.type === "core");
  links = [];
  const colors = {
    blue: "rgba(90, 170, 255, 0.75)",
    cyan: "rgba(120, 255, 245, 0.70)",
    green: "rgba(120, 255, 140, 0.70)",
    orange: "rgba(255, 170, 90, 0.75)",
    core: "rgba(255,255,255,0.25)",
  };

  // Deterministic link selection
  drones.forEach((d) => {
    if (d.type === "core") return;
    if (rng() < 0.35) {
      const target = core[Math.floor(rng() * core.length)];
      links.push({ a: d, b: target, color: colors[d.type] });
    }
  });

  for (let k = 0; k < 8; k++) {
    const a = drones[Math.floor(rng() * drones.length)];
    const b = core[Math.floor(rng() * core.length)];
    links.push({ a, b, color: colors[a.type] || "rgba(255,255,255,0.2)" });
  }
}

function drawDroneIcon(x, y, size = 10) {
  // Concave triangle (chevron/arrow shape pointing up) with a cheap, high-contrast outline
  ctx.save();
  ctx.translate(x, y);

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

  // --- Cheap halo: 4 offset strokes + one main stroke (no blur/filter/shadow) ---
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  const outlineW = Math.max(2.2, size * 0.26);

  ctx.strokeStyle = "rgba(0,0,0,0.85)";
  ctx.lineWidth = outlineW;

  // Draw 4 offset strokes to simulate a thicker outer halo cheaply
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

  // Main black stroke aligned to the actual path for crispness
  path();
  ctx.stroke();

  // --- Marker fill + subtle inner edge ---
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  path();
  ctx.fill();

  ctx.lineWidth = Math.max(1.2, size * 0.10);
  ctx.strokeStyle = "rgba(255,255,255,0.95)";
  path();
  ctx.stroke();

  ctx.restore();
}

function drawArc(a, b, color) {
  // draw a curved link similar-ish to screenshot
  const midx = (a.x + b.x) / 2;
  const midy = (a.y + b.y) / 2;

  // perpendicular offset for curvature
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.max(1, Math.hypot(dx, dy));
  const nx = -dy / len;
  const ny = dx / len;

  const curve = Math.min(140, 40 + len * 0.12);
  const cx = midx + nx * curve;
  const cy = midy + ny * curve;

  ctx.strokeStyle = color;
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.quadraticCurveTo(cx, cy, b.x, b.y);
  ctx.stroke();

  // endpoint dot
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(b.x, b.y, 3.2, 0, Math.PI * 2);
  ctx.fill();
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

  // links
  links.forEach((l) => {
    const A = latLngToScreen(l.a.lat, l.a.lng);
    const B = latLngToScreen(l.b.lat, l.b.lng);
    drawArc(A, B, l.color);
  });

  // drones (on top, with visible shadows)
  const zoom = map.getZoom();
  const droneSize = Math.max(5, Math.min(11, zoom * 0.75));

  drones.forEach((d) => {
    const p = latLngToScreen(d.lat, d.lng);
    drawDroneIcon(p.x, p.y, droneSize);
  });
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

  initMapOnline();
  makeMockSwarm();
  setupOverlay();

  // Draw once Leaflet has applied initial view & tiles; prevents initial misalignment.
  map.whenReady(() => {
    draw();
  });
});
