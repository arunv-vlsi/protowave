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

  // Convert hex/binary input to binary string
  let binStr = "";
  if (/^[01]+$/.test(data)) {
    binStr = data;
  } else if (/^[0-9A-Fa-f]+$/.test(data)) {
    binStr = data.split("").map(c =>
      parseInt(c, 16).toString(2).padStart(4, "0")
    ).join("");
  } else {
    binStr = "10101010"; // fallback
  }

  signals.forEach(sig => {
    const row = document.createElement("div");
    row.className = "signal-row";

    const name = document.createElement("div");
    name.className = "signal-name";
    name.textContent = sig;

    const waveformDiv = document.createElement("div");
    waveformDiv.className = "waveform";
    waveformDiv.innerHTML = createScrollingWave(binStr);

    row.appendChild(name);
    row.appendChild(waveformDiv);
    container.appendChild(row);
  });
}

function createScrollingWave(binaryData) {
  const bitWidth = 20; // px per bit
  const mid = 20; // y center
  const high = 0;
  const low = 40;

  let points = "";
  let x = 0;
  let lastLevel = binaryData[0] === "1" ? high : low;

  binaryData.split("").forEach(bit => {
    let level = bit === "1" ? high : low;
    // vertical transition
    if (level !== lastLevel) {
      points += `${x},${lastLevel} ${x},${level} `;
    }
    // horizontal line
    points += `${x + bitWidth},${level} `;
    x += bitWidth;
    lastLevel = level;
  });

  // Duplicate the wave for scrolling
  let duplicatedPoints = points + points;

  return `
    <svg width="${x * 2}" height="40" xmlns="http://www.w3.org/2000/svg">
      <polyline points="${duplicatedPoints}" stroke="#58a6ff" stroke-width="2" fill="none" />
    </svg>
  `;
}
