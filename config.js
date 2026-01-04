// Configuration for telemetry handling and health heuristics.
// Tweak these values without touching the main app logic.
const CONFIG = {
  // Max telemetry points to keep per drone (900 ~= 15 minutes at ~1 Hz).
  HISTORY_LIMIT: 900,

  // Battery burn-rate calculation window (in seconds). Adjust to smooth or react faster.
  BATTERY_RATE_WINDOW_SEC: 120,
  // Minimum samples required inside the window to attempt a slope calculation.
  BATTERY_MIN_SAMPLES: 4,

  // How long (in seconds) without a packet before marking link stale.
  LINK_STALE_THRESHOLD_SEC: 3,

  // --- Selection glow tuning ---
  SELECTION_SHAPE_W_SCALE: 1.4, // multiplier for chevron width vs base size
  SELECTION_SHAPE_H_SCALE: 1.7, // multiplier for chevron height vs base size
  SELECTION_SHAPE_INDENT_SCALE: 0.45, // controls chevron concavity
  SELECTION_GLOW_COLOR: "rgba(120, 220, 255, 1.0)",
  SELECTION_GLOW_OUTER_BLUR: 4.0, // multiplier on size for outer glow blur
  SELECTION_GLOW_MID_BLUR: 3.0,   // multiplier on size for mid glow blur
  SELECTION_GLOW_INNER_BLUR: 1.6, // multiplier on size for inner glow blur
  SELECTION_GLOW_OUTER_ALPHA: 0.9,
  SELECTION_GLOW_MID_ALPHA: 1.0,
  SELECTION_GLOW_INNER_ALPHA: 1.0,
  SELECTION_OUTLINE_WIDTH_FACTOR: 0.55, // width = max(2, factor * size)
  SELECTION_OUTLINE_ALPHA: 0.95,
};
