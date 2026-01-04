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
};

