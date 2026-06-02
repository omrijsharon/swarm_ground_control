const ESPRESSIF_VENDOR_ID = 0x303a;
const ESP32_S3_SERIAL_JTAG_PRODUCT_ID = 0x1001;
const MAX_LOG_LINES = 200;

const els = {};
const state = {
  device: null,
  logLines: [],
  claimedInterfaceNumber: null,
  readEndpointNumber: null,
  reading: false,
  consoleText: "",
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
    "consoleStatus",
    "interfaceSelect",
    "endpointSelect",
    "claimInterfaceBtn",
    "startReadBtn",
    "stopReadBtn",
    "clearConsoleBtn",
    "consoleOutput",
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
  const claimed = state.claimedInterfaceNumber !== null;
  const hasEndpoint = state.readEndpointNumber !== null;

  els.requestEspressifBtn.disabled = !hasUsb || opened;
  els.requestAnyBtn.disabled = !hasUsb || opened;
  els.openDeviceBtn.disabled = !hasDevice || opened;
  els.closeDeviceBtn.disabled = !hasDevice || !opened;
  els.claimInterfaceBtn.disabled = !opened || claimed;
  els.startReadBtn.disabled = !opened || !claimed || !hasEndpoint || state.reading;
  els.stopReadBtn.disabled = !state.reading;
  els.interfaceSelect.disabled = !opened || claimed;
  els.endpointSelect.disabled = !opened || claimed;
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
  renderInterfaceOptions();
  updateControls();
}

function endpointKey(interfaceNumber, endpointNumber) {
  return `${interfaceNumber}:${endpointNumber}`;
}

function getReadableInterfaces(device) {
  const options = [];
  if (!device?.configuration) {
    return options;
  }

  device.configuration.interfaces.forEach((iface) => {
    iface.alternates.forEach((alternate) => {
      const inEndpoints = alternate.endpoints.filter((endpoint) => (
        endpoint.direction === "in" && (endpoint.type === "bulk" || endpoint.type === "interrupt")
      ));

      inEndpoints.forEach((endpoint) => {
        options.push({
          interfaceNumber: iface.interfaceNumber,
          alternateSetting: alternate.alternateSetting,
          interfaceClass: alternate.interfaceClass,
          interfaceSubclass: alternate.interfaceSubclass,
          interfaceProtocol: alternate.interfaceProtocol,
          endpointNumber: endpoint.endpointNumber,
          endpointType: endpoint.type,
          packetSize: endpoint.packetSize,
        });
      });
    });
  });

  return options;
}

function renderInterfaceOptions() {
  const options = getReadableInterfaces(state.device);
  els.interfaceSelect.innerHTML = "";
  els.endpointSelect.innerHTML = "";

  if (!options.length) {
    const emptyInterface = document.createElement("option");
    emptyInterface.value = "";
    emptyInterface.textContent = "No readable interface";
    els.interfaceSelect.appendChild(emptyInterface);

    const emptyEndpoint = document.createElement("option");
    emptyEndpoint.value = "";
    emptyEndpoint.textContent = "No IN endpoint";
    els.endpointSelect.appendChild(emptyEndpoint);

    state.readEndpointNumber = null;
    els.consoleStatus.textContent = state.device?.opened ? "No readable endpoint found" : "Not claimed";
    return;
  }

  const uniqueInterfaces = new Map();
  options.forEach((option) => {
    if (!uniqueInterfaces.has(option.interfaceNumber)) {
      uniqueInterfaces.set(option.interfaceNumber, option);
    }
  });

  uniqueInterfaces.forEach((option) => {
    const item = document.createElement("option");
    item.value = String(option.interfaceNumber);
    item.textContent = `Interface ${option.interfaceNumber} class ${option.interfaceClass} subclass ${option.interfaceSubclass}`;
    els.interfaceSelect.appendChild(item);
  });

  const selectedInterface = Number.parseInt(els.interfaceSelect.value, 10);
  renderEndpointOptions(Number.isFinite(selectedInterface) ? selectedInterface : options[0].interfaceNumber);
}

function renderEndpointOptions(interfaceNumber) {
  const options = getReadableInterfaces(state.device).filter((option) => option.interfaceNumber === interfaceNumber);
  els.endpointSelect.innerHTML = "";

  options.forEach((option) => {
    const item = document.createElement("option");
    item.value = endpointKey(option.interfaceNumber, option.endpointNumber);
    item.textContent = `EP ${option.endpointNumber} ${option.endpointType} ${option.packetSize}B`;
    els.endpointSelect.appendChild(item);
  });

  const selected = options[0];
  state.readEndpointNumber = selected ? selected.endpointNumber : null;
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
    els.consoleStatus.textContent = "Choose an interface and claim it.";
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
    await stopRead();
    await releaseClaimedInterface();
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

function appendConsole(text) {
  state.consoleText += text;
  if (state.consoleText.length > 40000) {
    state.consoleText = state.consoleText.slice(-30000);
  }
  els.consoleOutput.textContent = state.consoleText;
  els.consoleOutput.scrollTop = els.consoleOutput.scrollHeight;
}

function selectedInterfaceNumber() {
  const value = Number.parseInt(els.interfaceSelect.value, 10);
  return Number.isFinite(value) ? value : null;
}

function selectedEndpointNumber() {
  const value = els.endpointSelect.value;
  const endpoint = Number.parseInt(value.split(":")[1], 10);
  return Number.isFinite(endpoint) ? endpoint : null;
}

async function claimSelectedInterface() {
  if (!state.device?.opened) {
    return;
  }

  const interfaceNumber = selectedInterfaceNumber();
  const endpointNumber = selectedEndpointNumber();
  if (interfaceNumber === null || endpointNumber === null) {
    els.consoleStatus.textContent = "No readable endpoint selected.";
    appendLog("claim skipped: no readable endpoint selected");
    return;
  }

  try {
    await state.device.claimInterface(interfaceNumber);
    state.claimedInterfaceNumber = interfaceNumber;
    state.readEndpointNumber = endpointNumber;
    els.consoleStatus.textContent = `Claimed interface ${interfaceNumber}, reading endpoint ${endpointNumber} when started.`;
    appendLog(`claimed interface ${interfaceNumber}, selected IN endpoint ${endpointNumber}`);
    updateControls();
  } catch (err) {
    els.consoleStatus.textContent = "Claim failed";
    appendLog(`claim failed: ${err.message}`);
    updateControls();
  }
}

async function releaseClaimedInterface() {
  if (!state.device?.opened || state.claimedInterfaceNumber === null) {
    state.claimedInterfaceNumber = null;
    return;
  }

  try {
    await state.device.releaseInterface(state.claimedInterfaceNumber);
    appendLog(`released interface ${state.claimedInterfaceNumber}`);
  } catch (err) {
    appendLog(`release warning: ${err.message}`);
  } finally {
    state.claimedInterfaceNumber = null;
    updateControls();
  }
}

async function startRead() {
  if (!state.device?.opened || state.claimedInterfaceNumber === null || state.readEndpointNumber === null) {
    return;
  }

  state.reading = true;
  els.consoleStatus.textContent = `Reading endpoint ${state.readEndpointNumber}`;
  updateControls();
  appendLog(`read loop started on endpoint ${state.readEndpointNumber}`);

  const decoder = new TextDecoder();
  while (state.reading && state.device?.opened) {
    try {
      const result = await state.device.transferIn(state.readEndpointNumber, 64);
      if (result.status === "ok" && result.data) {
        appendConsole(decoder.decode(result.data, { stream: true }));
      } else {
        appendLog(`transferIn status: ${result.status}`);
      }
    } catch (err) {
      if (state.reading) {
        appendLog(`read failed: ${err.message}`);
        els.consoleStatus.textContent = "Read failed";
      }
      break;
    }
  }

  state.reading = false;
  if (state.device?.opened && state.claimedInterfaceNumber !== null) {
    els.consoleStatus.textContent = "Read stopped";
  }
  updateControls();
}

async function stopRead() {
  if (!state.reading) {
    return;
  }
  state.reading = false;
  appendLog("read loop stop requested");
  updateControls();
}

function clearLog() {
  state.logLines = [];
  els.eventLog.textContent = "";
  els.logStatus.textContent = "Ready";
}

function clearConsole() {
  state.consoleText = "";
  els.consoleOutput.textContent = "";
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
  els.clearConsoleBtn.addEventListener("click", clearConsole);
  els.claimInterfaceBtn.addEventListener("click", claimSelectedInterface);
  els.startReadBtn.addEventListener("click", startRead);
  els.stopReadBtn.addEventListener("click", stopRead);
  els.interfaceSelect.addEventListener("change", () => {
    const interfaceNumber = selectedInterfaceNumber();
    if (interfaceNumber !== null) {
      renderEndpointOptions(interfaceNumber);
      updateControls();
    }
  });
  els.endpointSelect.addEventListener("change", () => {
    state.readEndpointNumber = selectedEndpointNumber();
    updateControls();
  });

  if ("usb" in navigator) {
    navigator.usb.addEventListener("connect", (event) => {
      appendLog(`USB connect ${getDeviceName(event.device)} ${hex16(event.device.vendorId)}:${hex16(event.device.productId)}`);
    });

    navigator.usb.addEventListener("disconnect", (event) => {
      appendLog(`USB disconnect ${getDeviceName(event.device)} ${hex16(event.device.vendorId)}:${hex16(event.device.productId)}`);
      if (event.device === state.device) {
        state.reading = false;
        state.claimedInterfaceNumber = null;
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
