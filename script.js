document.getElementById("goBtn").addEventListener("click", () => {
  const protocol = document.getElementById("protocol").value;
  const data = document.getElementById("dataInput").value.trim();
  generateWaveform(protocol, data);
});

function generateWaveform(protocol, data) {
  const container = document.getElementById("waveform-container");
  container.innerHTML = "";

  let signals = [];
  if (protocol === "i2c") {
    signals = ["SCL", "SDA"];
  } else if (protocol === "spi") {
    signals = ["SCK", "MOSI", "MISO"];
  } else if (protocol === "uart") {
    signals = ["TX", "RX"];
  }

  signals.forEach(sig => {
    const row = document.createElement("div");
    row.className = "signal-row";

    const name = document.createElement("div");
    name.className = "signal-name";
    name.textContent = sig;

    const waveformDiv = document.createElement("div");
    waveformDiv.className = "waveform";
    waveformDiv.innerHTML = createScrollingWave();

    row.appendChild(name);
    row.appendChild(waveformDiv);
    container.appendChild(row);
  });
}

function createScrollingWave() {
  return `
    <svg width="200%" height="40" xmlns="http://www.w3.org/2000/svg">
      <polyline points="0,20 20,20 20,0 40,0 40,20 60,20 60,0 80,0 80,20 100,20" 
        stroke="#58a6ff" stroke-width="2" fill="none" />
      <polyline points="100,20 120,20 120,0 140,0 140,20 160,20 160,0 180,0 180,20 200,20" 
        stroke="#58a6ff" stroke-width="2" fill="none" />
    </svg>
  `;
}
