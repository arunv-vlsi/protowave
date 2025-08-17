/**
 * Generate a clock waveform (0/1 array) with the given number of data bits
 * Each data bit gets one full clock cycle (High + Low).
 * @param {number} length - number of data bits to align the clock with
 * @returns {Array} - Array of 0s and 1s representing the clock waveform
 */
function clockArray(length) {
  let clk = []; // store clock values

  // Loop for twice the number of data bits (because each bit = 1 high + 1 low)
  for (let i = 0; i < length * 2; i++) {
    // Push 0 for even index, 1 for odd index → creates square wave
    clk.push(i % 2);
  }

  return clk; // return clock waveform
}
