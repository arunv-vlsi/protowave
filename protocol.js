// Generate signals for protocols
function generateProtocolWave(protocol, data) {
  switch (protocol) {
    case "i2c":
      return i2cWaveform(data);
    case "spi":
      return spiWaveform(data);
    case "uart":
      return uartWaveform(data);
    default:
      return [];
  }
}

// Dummy implementations (simplified)
function i2cWaveform(data) {
  return data.split("").map(bit => bit === "1" ? 1 : 0);
}

function spiWaveform(data) {
  return data.split("").map(bit => bit === "1" ? 1 : 0);
}

function uartWaveform(data) {
  let bits = [];
  bits.push(0); // start bit
  data.split("").forEach(bit => bits.push(bit === "1" ? 1 : 0));
  bits.push(1); // stop bit
  return bits;
}
