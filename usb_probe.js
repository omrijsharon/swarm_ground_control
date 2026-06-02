const ESPRESSIF_VENDOR_ID = 0x303a;
const ESP32_S3_SERIAL_JTAG_PRODUCT_ID = 0x1001;
const MAX_LOG_LINES = 200;

const els = {};
const state = {
  device: null,
  logLines: [],
};

function bindElements() {
  [
    "stateDot",
    "stateLabel",
    "stateDetail",
    "requestEspressifBtn",
    "requestAnyBtn",
    "openDeviceBtn",
    "closeDeviceBtn",
    "clearLogBtn",
    "deviceName",
    "vendorId",
    "productId",
    "openedState",
    "deviceInfo",
    "eventLog",
    "infoStatus",
    "logStatus",
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

function hex16(value) {
  if (value === undefined || value === null) {
    return "None";
  }
  return `0x${value.toString(16).padStart(4, "0")}`;
}

function setState(kind, label, detail) {
  els.stateDot.classList.toggle("connected", kind === "connected");
  els.stateDot.classList.toggle("error", kind === "error");
  els.stateLabel.textContent = label;
  els.stateDetail.textContent = detail;
}

function appendLog(line) {
  state.logLines.push(`[${nowLabel()}] ${line}`);
  while (state.logLines.length > MAX_LOG_LINES) {
    state.logLines.shift();
  }
  els.eventLog.textContent = state.logLines.join("\n");
  els.eventLog.scrollTop = els.eventLog.scrollHeight;
  els.logStatus.textContent = `Last event ${nowLabel()}`;
}

function getDeviceName(device) {
  if (!device) {
    return "None";
  }
  return device.productName || device.manufacturerName || "USB device";
}

function updateControls() {
  const hasUsb = "usb" in navigator;
  const hasDevice = Boolean(state.device);
  const opened = Boolean(state.device?.opened);

  els.requestEspressifBtn.disabled = !hasUsb || opened;
  els.requestAnyBtn.disabled = !hasUsb || opened;
  els.openDeviceBtn.disabled = !hasDevice || opened;
  els.closeDeviceBtn.disabled = !hasDevice || !opened;
  els.openedState.textContent = opened ? "Yes" : "No";
}

function describeConfiguration(device) {
  if (!device?.configuration) {
    return null;
  }

  return {
    configurationValue: device.configuration.configurationValue,
    interfaces: device.configuration.interfaces.map((iface) => ({
      interfaceNumber: iface.interfaceNumber,
      claimed: iface.claimed,
      alternates: iface.alternates.map((alternate) => ({
        alternateSetting: alternate.alternateSetting,
        interfaceClass: alternate.interfaceClass,
        interfaceSubclass: alternate.interfaceSubclass,
        interfaceProtocol: alternate.interfaceProtocol,
        endpoints: alternate.endpoints.map((endpoint) => ({
          endpointNumber: endpoint.endpointNumber,
          direction: endpoint.direction,
          type: endpoint.type,
          packetSize: endpoint.packetSize,
        })),
      })),
    })),
  };
}

function deviceSummary(device) {
  if (!device) {
    return {};
  }

  return {
    productName: device.productName || null,
    manufacturerName: device.manufacturerName || null,
    serialNumber: device.serialNumber || null,
    vendorId: hex16(device.vendorId),
    productId: hex16(device.productId),
    usbVersionMajor: device.usbVersionMajor,
    usbVersionMinor: device.usbVersionMinor,
    usbVersionSubminor: device.usbVersionSubminor,
    deviceClass: device.deviceClass,
    deviceSubclass: device.deviceSubclass,
    deviceProtocol: device.deviceProtocol,
    opened: device.opened,
    configuration: describeConfiguration(device),
  };
}

function renderDevice() {
  const device = state.device;
  els.deviceName.textContent = getDeviceName(device);
  els.vendorId.textContent = hex16(device?.vendorId);
  els.productId.textContent = hex16(device?.productId);
  els.deviceInfo.textContent = device ? JSON.stringify(deviceSummary(device), null, 2) : "";
  els.infoStatus.textContent = device ? "Selected" : "Ready";
  updateControls();
}

async function requestDevice(filters) {
  if (!("usb" in navigator)) {
    setState("error", "Unsupported", "This browser does not expose navigator.usb.");
    return;
  }

  try {
    const device = await navigator.usb.requestDevice({ filters });
    state.device = device;
    appendLog(`selected ${getDeviceName(device)} ${hex16(device.vendorId)}:${hex16(device.productId)}`);
    setState("connected", "Device selected", `${getDeviceName(device)} is visible to WebUSB.`);
    renderDevice();
  } catch (err) {
    if (err.name === "NotFoundError") {
      setState("error", "No USB device selected", "The USB picker was closed or found no matching devices.");
      appendLog("request cancelled or no compatible devices found");
    } else {
      setState("error", "USB request failed", err.message);
      appendLog(`request failed: ${err.message}`);
    }
  }
}

async function openDevice() {
  if (!state.device) {
    return;
  }

  try {
    await state.device.open();
    appendLog("device opened");

    if (!state.device.configuration && state.device.configurations?.length) {
      await state.device.selectConfiguration(state.device.configurations[0].configurationValue);
      appendLog(`selected configuration ${state.device.configuration.configurationValue}`);
    }

    setState("connected", "Opened", "WebUSB can open this device.");
    renderDevice();
  } catch (err) {
    setState("error", "Open failed", err.message);
    appendLog(`open failed: ${err.message}`);
    renderDevice();
  }
}

async function closeDevice() {
  if (!state.device?.opened) {
    return;
  }

  try {
    await state.device.close();
    appendLog("device closed");
    setState("connected", "Device selected", "Device is selected but closed.");
  } catch (err) {
    setState("error", "Close failed", err.message);
    appendLog(`close failed: ${err.message}`);
  } finally {
    renderDevice();
  }
}

function clearLog() {
  state.logLines = [];
  els.eventLog.textContent = "";
  els.logStatus.textContent = "Ready";
}

function initSupportState() {
  if ("usb" in navigator) {
    setState("connected", "Ready", "WebUSB is available in this browser.");
  } else {
    setState("error", "Unsupported", "This browser does not expose navigator.usb.");
  }
  renderDevice();
}

function bindEvents() {
  els.requestEspressifBtn.addEventListener("click", () => {
    requestDevice([{ vendorId: ESPRESSIF_VENDOR_ID }]);
  });

  els.requestAnyBtn.addEventListener("click", () => {
    requestDevice([]);
  });

  els.openDeviceBtn.addEventListener("click", openDevice);
  els.closeDeviceBtn.addEventListener("click", closeDevice);
  els.clearLogBtn.addEventListener("click", clearLog);

  if ("usb" in navigator) {
    navigator.usb.addEventListener("connect", (event) => {
      appendLog(`USB connect ${getDeviceName(event.device)} ${hex16(event.device.vendorId)}:${hex16(event.device.productId)}`);
    });

    navigator.usb.addEventListener("disconnect", (event) => {
      appendLog(`USB disconnect ${getDeviceName(event.device)} ${hex16(event.device.vendorId)}:${hex16(event.device.productId)}`);
      if (event.device === state.device) {
        state.device = null;
        setState("error", "Disconnected", "Selected USB device disconnected.");
        renderDevice();
      }
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  bindElements();
  bindEvents();
  initSupportState();
});
