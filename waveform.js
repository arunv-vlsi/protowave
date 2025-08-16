// Get the canvas element from HTML
const canvas = document.getElementById("waveCanvas");
// Get the 2D rendering context for drawing on the canvas
const ctx = canvas.getContext("2d");
// Set canvas size (fixed width and height)
canvas.width = 760;
canvas.height = 250;

// Add a click event listener to the "GO" button
document.getElementById("goBtn").addEventListener("click", () => {
  // Get selected protocol from dropdown (I2C, SPI, UART, etc.)
  const protocol = document.getElementById("protocol").value;
  // Get input data (user enters something like 101010)
  const inputData = document.getElementById("inputData").value;

  // Generate waveform data (array of 1s and 0s) using the protocol rules
  const signal = generateProtocolWave(protocol, inputData);

  // Call function to draw waveform on canvas
  drawWaveform(signal);

  // Draw clock aligned with signal length
  drawClock(signal.length)
});

/**
 * Function to draw waveform on the canvas
 //* @param {Array} signal - Array of bits (0s and 1s) representing the waveform
 */
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
  let high = yMid - 20;              // Y position for logic 1
  let low  = yMid;                   // Y position for logic 0

  // Start path
  ctx.beginPath();

  // Start at first signal level
  let prevBit = signal[0];
  ctx.moveTo(x, prevBit ? high : low);
  x += step;
  ctx.lineTo(x, prevBit ? high : low);

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
