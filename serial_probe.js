const MAX_LOG_LINES = 200;

const sampleTelemetry = {
  type: "drone_telemetry",
  nodeId: 1,
  lat: 32.0596637,
  lng: 34.8503487,
  alt: 12.3,
  heading: 91.0,
};

const sampleStatus = {
  type: "gc_status",
  nodeId: 0,
  sharedFrequencyMhz: 915.0,
  connectedDrones: 0,
};

const els = {};
const state = {
  port: null,
  reader: null,
  keepReading: false,
  lineBuffer: "",
  jsonLines: [],
  rawLines: [],
  jsonCount: 0,
  rawCount: 0,
  lastPortInfo: null,
  lastBaudRate: 115200,
  reconnectTimer: null,
  reconnectAttempts: 0,
  manualClose: false,
  disconnectHandled: false,
};

function bindElements() {
  [
    "stateDot",
    "stateLabel",
    "stateDetail",
    "baudRate",
    "autoReconnect",
    "openPortBtn",
    "closePortBtn",
    "portInfo",
    "jsonCount",
    "rawCount",
    "lastLineAt",
    "injectTelemetryBtn",
    "injectStatusBtn",
    "injectLogBtn",
    "clearLogsBtn",
    "jsonLog",
    "rawLog",
    "jsonStatus",
    "rawStatus",
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function nowLabel() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function setConnectionState(kind, label, detail) {
  els.stateDot.classList.toggle("connected", kind === "connected");
  els.stateDot.classList.toggle("error", kind === "error");
  els.stateLabel.textContent = label;
  els.stateDetail.textContent = detail;
}

function setControlsConnected(isConnected) {
  els.openPortBtn.disabled = isConnected;
  els.closePortBtn.disabled = !isConnected;
  els.baudRate.disabled = isConnected;
}

function updateCounters() {
  els.jsonCount.textContent = String(state.jsonCount);
  els.rawCount.textContent = String(state.rawCount);
}

function renderLogs() {
  els.jsonLog.textContent = state.jsonLines.join("\n");
  els.rawLog.textContent = state.rawLines.join("\n");
  els.jsonLog.scrollTop = els.jsonLog.scrollHeight;
  els.rawLog.scrollTop = els.rawLog.scrollHeight;
}

function appendLog(kind, line) {
  const target = kind === "json" ? state.jsonLines : state.rawLines;
  target.push(line);
  while (target.length > MAX_LOG_LINES) {
    target.shift();
  }
  if (kind === "json") {
    state.jsonCount += 1;
    els.jsonStatus.textContent = `Last JSON ${nowLabel()}`;
  } else {
    state.rawCount += 1;
    els.rawStatus.textContent = `Last raw ${nowLabel()}`;
  }
  els.lastLineAt.textContent = nowLabel();
  updateCounters();
  renderLogs();
}

function processLine(line, source = "serial") {
  const trimmed = line.trim();
  if (!trimmed) {
    return;
  }

  try {
    const parsed = JSON.parse(trimmed);
    appendLog("json", `[${nowLabel()}] ${source}\n${JSON.stringify(parsed, null, 2)}`);
  } catch (err) {
    const looksLikeJson = trimmed.startsWith("{") || trimmed.startsWith("[");
    const prefix = looksLikeJson ? `parse error: ${err.message}` : "raw";
    appendLog("raw", `[${nowLabel()}] ${source} ${prefix}\n${trimmed}`);
  }
}

function processChunk(chunk) {
  state.lineBuffer += chunk;
  const lines = state.lineBuffer.split(/\r\n|\n|\r/);
  state.lineBuffer = lines.pop() ?? "";
  lines.forEach((line) => processLine(line));
}

function getBaudRate() {
  const baud = Number.parseInt(els.baudRate.value, 10);
  if (Number.isFinite(baud) && baud > 0) {
    return baud;
  }
  els.baudRate.value = "115200";
  return 115200;
}

function getPortInfo(port) {
  if (!port || typeof port.getInfo !== "function") {
    return {};
  }
  return port.getInfo();
}

function describePort(port) {
  const info = getPortInfo(port);
  const parts = [];
  if (info.usbVendorId !== undefined) {
    parts.push(`VID 0x${info.usbVendorId.toString(16).padStart(4, "0")}`);
  }
  if (info.usbProductId !== undefined) {
    parts.push(`PID 0x${info.usbProductId.toString(16).padStart(4, "0")}`);
  }
  return parts.length ? parts.join(" / ") : "Selected";
}

function sameKnownPort(port) {
  if (!state.lastPortInfo) {
    return true;
  }
  const info = getPortInfo(port);
  if (state.lastPortInfo.usbVendorId !== undefined && info.usbVendorId !== state.lastPortInfo.usbVendorId) {
    return false;
  }
  if (state.lastPortInfo.usbProductId !== undefined && info.usbProductId !== state.lastPortInfo.usbProductId) {
    return false;
  }
  return true;
}

function clearReconnectTimer() {
  if (state.reconnectTimer) {
    window.clearTimeout(state.reconnectTimer);
    state.reconnectTimer = null;
  }
}

function shouldAutoReconnect() {
  return Boolean(els.autoReconnect?.checked) && !state.manualClose;
}

async function readSerialLoop() {
  const decoder = new TextDecoder();

  while (state.port?.readable && state.keepReading) {
    state.reader = state.port.readable.getReader();
    try {
      while (state.keepReading) {
        const { value, done } = await state.reader.read();
        if (done) {
          break;
        }
        if (value) {
          processChunk(decoder.decode(value, { stream: true }));
        }
      }
    } catch (err) {
      if (state.keepReading) {
        appendLog("raw", `[${nowLabel()}] reader error\n${err.message}`);
        handleUnexpectedDisconnect("reader error");
      }
    } finally {
      state.reader.releaseLock();
      state.reader = null;
    }
  }
}

async function openSelectedPort(port, baudRate, sourceLabel) {
  await port.open({ baudRate });

  clearReconnectTimer();
  state.port = port;
  state.lastPortInfo = getPortInfo(port);
  state.lastBaudRate = baudRate;
  state.keepReading = true;
  state.manualClose = false;
  state.disconnectHandled = false;
  state.reconnectAttempts = 0;
  els.portInfo.textContent = describePort(port);
  setControlsConnected(true);
  setConnectionState("connected", "Connected", `${sourceLabel} at ${baudRate} baud.`);

  readSerialLoop();
}

async function openPort() {
  if (!("serial" in navigator)) {
    setConnectionState("error", "Unsupported", "This browser does not expose navigator.serial.");
    return;
  }

  try {
    state.manualClose = false;
    setConnectionState("waiting", "Selecting port", "Choose the ESP32 USB serial device.");
    const port = await navigator.serial.requestPort();
    const baudRate = getBaudRate();

    setConnectionState("waiting", "Opening port", `Opening at ${baudRate} baud.`);
    await openSelectedPort(port, baudRate, "Reading");
  } catch (err) {
    setControlsConnected(false);
    if (err.name === "NotFoundError") {
      setConnectionState("error", "No port selected", "The serial port picker was closed.");
    } else {
      const busyHint = "Failed to open serial port";
      const detail = err.message.includes(busyHint)
        ? "Failed to open serial port. Another app, such as Arduino IDE or PlatformIO monitor, may already own it."
        : err.message;
      setConnectionState("error", "Connection failed", detail);
      appendLog("raw", `[${nowLabel()}] open failed\n${detail}`);
    }
  }
}

async function closePort() {
  state.manualClose = true;
  clearReconnectTimer();
  const port = state.port;
  state.keepReading = false;
  setConnectionState("waiting", "Closing", "Closing serial connection.");
  setControlsConnected(false);

  try {
    if (state.reader) {
      await state.reader.cancel();
    }
  } catch (err) {
    appendLog("raw", `[${nowLabel()}] reader cancel warning\n${err.message}`);
  }

  try {
    if (port) {
      await port.close();
    }
  } catch (err) {
    appendLog("raw", `[${nowLabel()}] close warning\n${err.message}`);
  } finally {
    state.port = null;
    state.reader = null;
    state.lineBuffer = "";
    els.portInfo.textContent = "None";
    setConnectionState("waiting", "Disconnected", "Ready to open a serial port.");
  }
}

async function reopenKnownPort() {
  if (!shouldAutoReconnect() || state.port) {
    return;
  }

  try {
    const ports = await navigator.serial.getPorts();
    const port = ports.find(sameKnownPort);
    if (!port) {
      scheduleReconnect("Waiting for the ESP32 serial port to reappear.");
      return;
    }

    setConnectionState("waiting", "Reconnecting", `Attempt ${state.reconnectAttempts + 1} at ${state.lastBaudRate} baud.`);
    await openSelectedPort(port, state.lastBaudRate, "Reconnected");
    appendLog("raw", `[${nowLabel()}] reconnect\nSerial port reopened automatically.`);
  } catch (err) {
    appendLog("raw", `[${nowLabel()}] reconnect failed\n${err.message}`);
    scheduleReconnect("Reconnect failed; retrying.");
  }
}

function scheduleReconnect(reason) {
  if (!shouldAutoReconnect() || state.reconnectTimer) {
    return;
  }

  state.reconnectAttempts += 1;
  setConnectionState("waiting", "Disconnected", `${reason} Auto reconnect attempt ${state.reconnectAttempts} scheduled.`);
  state.reconnectTimer = window.setTimeout(() => {
    state.reconnectTimer = null;
    reopenKnownPort();
  }, Math.min(1000 + state.reconnectAttempts * 500, 5000));
}

function handleUnexpectedDisconnect(reason) {
  if (state.disconnectHandled) {
    return;
  }
  state.disconnectHandled = true;
  state.keepReading = false;
  state.port = null;
  state.reader = null;
  state.lineBuffer = "";
  els.portInfo.textContent = "None";
  setControlsConnected(false);

  if (shouldAutoReconnect()) {
    scheduleReconnect(`${reason}.`);
  } else {
    setConnectionState("error", "Disconnected", `${reason}. Open the port manually when the ESP32 is ready.`);
  }
}

function clearLogs() {
  state.jsonLines = [];
  state.rawLines = [];
  state.jsonCount = 0;
  state.rawCount = 0;
  els.lastLineAt.textContent = "Never";
  els.jsonStatus.textContent = "Ready";
  els.rawStatus.textContent = "Ready";
  updateCounters();
  renderLogs();
}

function initSupportState() {
  if ("serial" in navigator) {
    setConnectionState("waiting", "Ready", "Web Serial is available in this browser.");
    setControlsConnected(false);
    els.openPortBtn.disabled = false;
  } else {
    setConnectionState("error", "Unsupported", "Use a desktop browser with Web Serial support, such as Chrome or Edge.");
    setControlsConnected(false);
    els.openPortBtn.disabled = true;
  }
}

function bindEvents() {
  els.openPortBtn.addEventListener("click", openPort);
  els.closePortBtn.addEventListener("click", closePort);
  els.injectTelemetryBtn.addEventListener("click", () => processLine(JSON.stringify(sampleTelemetry), "sample"));
  els.injectStatusBtn.addEventListener("click", () => processLine(JSON.stringify(sampleStatus), "sample"));
  els.injectLogBtn.addEventListener("click", () => processLine("[BOOT] simple-mesh firmware log line", "sample"));
  els.clearLogsBtn.addEventListener("click", clearLogs);

  if ("serial" in navigator) {
    navigator.serial.addEventListener("connect", () => {
      if (shouldAutoReconnect() && !state.port) {
        scheduleReconnect("Serial device connected.");
      }
    });

    navigator.serial.addEventListener("disconnect", (event) => {
      if (event.target === state.port) {
        appendLog("raw", `[${nowLabel()}] serial disconnect\nSelected port disconnected.`);
        handleUnexpectedDisconnect("Serial disconnect");
      }
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  bindElements();
  bindEvents();
  initSupportState();
});
