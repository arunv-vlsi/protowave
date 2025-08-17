/**
 * Generate protocol-specific waveforms.
 * Each protocol returns an array of signals with names + bit arrays.
 * Example:
 *   [ { name: "CLK", data: [0,1,0,1] }, { name: "MOSI", data: [1,0,1,1] } ]
 * @param {string} protocol - Protocol name (i2c, spi, uart)
 * @param {string} data - User input bit string (e.g., "10101")
 */
function generateProtocolWave(protocol, data) {
  switch (protocol) {
    case "i2c":
      return [
        // I²C clock (SCL) generated based on input data length
        { name: "SCL", data: clockArray(data.length) },
        // I²C data (SDA) follows user input
        { name: "SDA", data: data.split("").map(bit => bit === "1" ? 1 : 0) }
      ];

    case "spi":
      return [
        // SPI clock (CLK)
        { name: "CLK", data: clockArray(data.length) },
        // SPI MOSI line
        { name: "MOSI", data: data.split("").map(bit => bit === "1" ? 1 : 0) }
        // MISO can be added here later
      ];

    case "uart":
      // UART has no clock, only TX line
      let bits = [];
      bits.push(0); // Start bit = always 0
      data.split("").forEach(bit => bits.push(bit === "1" ? 1 : 0)); // Data bits
      bits.push(1); // Stop bit = always 1
      return [
        { name: "TX", data: bits }
      ];

    default:
      return [];
  }
}
