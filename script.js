document.getElementById('goBtn').addEventListener('click', () => {
    const protocol = document.getElementById('protocol').value;
    const data = document.getElementById('dataInput').value.trim();
    const container = document.getElementById('waveform-container');

    if (!data) {
        container.innerHTML = "<p class='placeholder'>Please enter some data</p>";
        return;
    }

    let binaryData;
    if (/^[0-9A-Fa-f]+$/.test(data)) {
        binaryData = parseInt(data, 16).toString(2).padStart(8, '0');
    } else if (/^[01]+$/.test(data)) {
        binaryData = data;
    } else {
        container.innerHTML = "<p class='placeholder'>Invalid data format</p>";
        return;
    }

    let svg = "";
    if (protocol === "i2c") svg = drawI2C(binaryData);
    else if (protocol === "spi") svg = drawSPI(binaryData);
    else if (protocol === "uart") svg = drawUART(binaryData);

    container.innerHTML = svg;
});

/* -------- I²C Waveform -------- */
function drawI2C(bits) {
    let svg = startSVG(bits.length * 50, 120);
    let sclHigh = 20, sclLow = 60;
    let sdaHigh = 90, sdaLow = 110;
    let x = 20;

    // START Condition
    svg += line(x, sclHigh, x + 30, sclHigh, "yellow"); // Clock high
    svg += line(x, sdaHigh, x, sdaLow, "cyan"); // SDA falls while SCL high
    x += 30;

    // Data bits
    for (let b of bits) {
        // SCL low phase
        svg += line(x, sclLow, x + 25, sclLow, "yellow");
        svg += line(x, (b === '1' ? sdaHigh : sdaLow), x + 25, (b === '1' ? sdaHigh : sdaLow), "cyan");
        x += 25;
        // Rising edge
        svg += line(x, sclLow, x, sclHigh, "yellow");
        x += 5;
        // SCL high phase
        svg += line(x, sclHigh, x + 20, sclHigh, "yellow");
        x += 20;
        // Falling edge
        svg += line(x, sclHigh, x, sclLow, "yellow");
    }

    // STOP Condition
    x += 20;
    svg += line(x, sdaLow, x, sdaHigh, "cyan");

    return closeSVG(svg);
}

/* -------- SPI Waveform -------- */
function drawSPI(bits) {
    let svg = startSVG(bits.length * 50, 100);
    let clkHigh = 20, clkLow = 60;
    let mosiHigh = 80, mosiLow = 90;
    let misoHigh = 80, misoLow = 90;
    let x = 20;

    for (let b of bits) {
        // Clock square wave
        svg += line(x, clkLow, x, clkHigh, "yellow");
        svg += line(x, clkHigh, x + 25, clkHigh, "yellow");
        svg += line(x + 25, clkHigh, x + 25, clkLow, "yellow");
        svg += line(x + 25, clkLow, x + 50, clkLow, "yellow");

        // MOSI data setup before rising edge
        svg += line(x, b === '1' ? mosiHigh : mosiLow, x + 50, b === '1' ? mosiHigh : mosiLow, "cyan");
        // Dummy MISO (inverted)
        svg += line(x, b === '0' ? misoHigh : misoLow, x + 50, b === '0' ? misoHigh : misoLow, "lime");

        x += 50;
    }

    return closeSVG(svg);
}

/* -------- UART Waveform -------- */
function drawUART(bits) {
    let svg = startSVG((bits.length + 2) * 50, 100);
    let high = 40, low = 80;
    let x = 20;

    // Idle high
    svg += line(x, high, x + 20, high, "cyan");
    x += 20;

    // Start bit
    svg += line(x, high, x, low, "cyan");
    svg += line(x, low, x + 50, low, "cyan");
    x += 50;

    // Data bits (LSB first)
    for (let b of bits) {
        let level = b === '1' ? high : low;
        svg += line(x, level, x + 50, level, "cyan");
        x += 50;
    }

    // Stop bit
    svg += line(x, low, x, high, "cyan");
    svg += line(x, high, x + 50, high, "cyan");

    return closeSVG(svg);
}

/* -------- Helper Drawing Functions -------- */
function startSVG(width, height) {
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
}
function closeSVG(svg) {
    return svg + "</svg>";
}
function line(x1, y1, x2, y2, color) {
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2"/>`;
}
