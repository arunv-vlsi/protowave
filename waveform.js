const canvas = document.getElementById("waveCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 760;
canvas.height = 250;

document.getElementById("goBtn").addEventListener("click", () => {
  const protocol = document.getElementById("protocol").value;
  const inputData = document.getElementById("inputData").value;

  const signal = generateProtocolWave(protocol, inputData);
  drawWaveform(signal);
});

function drawWaveform(signal) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#22c55e";
  ctx.lineWidth = 2;

  let x = 20;
  let yMid = canvas.height / 2;
  let step = 40;

  ctx.beginPath();
  ctx.moveTo(x, yMid - (signal[0] ? 50 : 0));

  signal.forEach((bit, i) => {
    ctx.lineTo(x + step, yMid - (bit ? 50 : 0));
    x += step;
  });

  ctx.stroke();
}
