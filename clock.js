/**
 * Draws a clock waveform on the same canvas
 * @param {number} cycles - number of clock cycles to draw
 */
function drawClock(cycles) {
  // Clear only top portion for clock (optional, keeps data separate)
  ctx.clearRect(0, 0, canvas.width, 80);

  ctx.strokeStyle = "#3b82f6"; // blue color for clock
  ctx.lineWidth = 2;

  let x = 20;
  let yHigh = 40;   // clock high level
  let yLow  = 70;   // clock low level
  let step = 25;    // one half cycle width

  ctx.beginPath();
  ctx.moveTo(x, yLow);

  for (let i = 0; i < cycles; i++) {
    // rising edge
    ctx.lineTo(x, yHigh);
    x += step;

    // high phase
    ctx.lineTo(x, yHigh);

    // falling edge
    ctx.lineTo(x, yLow);
    x += step;

    // low phase
    ctx.lineTo(x, yLow);
  }

  ctx.stroke();
}
