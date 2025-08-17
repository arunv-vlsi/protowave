const canvas = document.getElementById("waveCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 760;
canvas.height = 300;

document.getElementById("goBtn").addEventListener("click", async () => {
  const protocol = document.getElementById("protocol").value;
  const inputData = document.getElementById("inputData").value;

  // Call Python backend
  const res = await fetch(`http://127.0.0.1:8000/waveform/?protocol=${protocol}&data=${inputData}`);
  const json = await res.json();

  drawSignals(json.signals);
});

function drawSignals(signals) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const spacing = 100;
  let yOffset = 50;

  signals.forEach(sig => {
    ctx.fillStyle = "#f8fafc";
    ctx.font = "14px Segoe UI";
    ctx.fillText(sig.name, 5, yOffset);
    drawWaveform(sig.data, yOffset);
    yOffset += spacing;
  });
}

function drawWaveform(signal, yOffset) {
  ctx.strokeStyle = "#22c55e";
  ctx.lineWidth = 2;

  let x = 60;
  let high = yOffset - 20;
  let low  = yOffset + 20;
  let step = 40;

  ctx.beginPath();
  let prevBit = signal[0];
  ctx.moveTo(x, prevBit ? high : low);

  for (let i = 1; i < signal.length; i++) {
    let currBit = signal[i];

    if (currBit !== prevBit) {
      ctx.lineTo(x, currBit ? high : low);
    }

    x += step;
    ctx.lineTo(x, currBit ? high : low);

    prevBit = currBit;
  }

  ctx.stroke();
}
