function drawWaveform(signal) {
  // Clear old waveform
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set waveform style
  ctx.strokeStyle = "#22c55e";
  ctx.lineWidth = 2;

  // Drawing parameters
  let x = 20;                        // starting X
  let yMid = canvas.height / 2;      // baseline
  let step = 40;                     // horizontal step per bit
  let high = yMid - 50;              // Y position for logic 1
  let low  = yMid;                   // Y position for logic 0

  // Start path
  ctx.beginPath();

  // Start at first signal level
  let prevBit = signal[0];
  ctx.moveTo(x, prevBit ? high : low);

  // Loop over bits
  for (let i = 1; i < signal.length; i++) {
    let currBit = signal[i];

    if (currBit !== prevBit) {
      // If signal changes, draw vertical transition first
      ctx.lineTo(x, currBit ? high : low);
    }

    // Then draw horizontal line one step forward
    x += step;
    ctx.lineTo(x, currBit ? high : low);

    // Update previous bit
    prevBit = currBit;
  }

  // Render on canvas
  ctx.stroke();
}
