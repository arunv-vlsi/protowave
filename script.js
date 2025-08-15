document.addEventListener("DOMContentLoaded", function () {
    const goBtn = document.getElementById("go-btn");
    const protocolSelect = document.getElementById("protocol");
    const dataInput = document.getElementById("data-input");
    const canvas = document.getElementById("waveform-canvas");
    const ctx = canvas.getContext("2d");

    let waveformData = [];
    let protocol = "i2c";
    let scrollOffset = 0;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 300;

    function hexToBin(hex) {
        return hex.match(/.{1,2}/g)
            .map(byte => parseInt(byte, 16).toString(2).padStart(8, "0"))
            .join("");
    }

    function generateWaveform(protocol, dataBits) {
        let lines = [];

        if (protocol === "i2c") {
            // Two lines: SCL and SDA
            let scl = [];
            let sda = [];

            // Start condition: SDA goes low while SCL high
            scl.push(1); sda.push(1);
            scl.push(1); sda.push(0);

            for (let bit of dataBits) {
                // Clock low, data stable
                scl.push(0); sda.push(parseInt(bit));
                // Clock high, data stable
                scl.push(1); sda.push(parseInt(bit));
            }

            // Stop condition: SDA high while SCL high
            scl.push(1); sda.push(1);

            lines.push({ name: "SCL", data: scl });
            lines.push({ name: "SDA", data: sda });
        }

        else if (protocol === "spi") {
            // Four lines: SCLK, MOSI, MISO, CS
            let sclk = [];
            let mosi = [];
            let miso = [];
            let cs = [];

            cs.push(1); // inactive high
            cs.push(0); // select

            for (let bit of dataBits) {
                sclk.push(0); mosi.push(parseInt(bit)); miso.push(0); cs.push(0);
                sclk.push(1); mosi.push(parseInt(bit)); miso.push(0); cs.push(0);
            }

            cs.push(1); // deselect

            lines.push({ name: "SCLK", data: sclk });
            lines.push({ name: "MOSI", data: mosi });
            lines.push({ name: "MISO", data: miso });
            lines.push({ name: "CS", data: cs });
        }

        else if (protocol === "uart") {
            // One line: TX
            let tx = [];
            tx.push(1); // idle high
            tx.push(0); // start bit

            for (let bit of dataBits) {
                tx.push(parseInt(bit));
            }

            tx.push(1); // stop bit
            lines.push({ name: "TX", data: tx });
        }

        return lines;
    }

    function drawWaveform(lines) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.font = "14px Arial";
        ctx.fillStyle = "#fff";

        const lineHeight = canvas.height / (lines.length + 1);
        let pixelsPerBit = 40;

        lines.forEach((line, i) => {
            let yBase = lineHeight * (i + 1);
            ctx.fillText(line.name, 10, yBase - 10);

            ctx.beginPath();
            ctx.strokeStyle = "#00e0ff";
            ctx.lineWidth = 2;

            let x = 100 - scrollOffset;
            let prevLevel = line.data[0];

            ctx.moveTo(x, yBase - prevLevel * 20);

            for (let bit of line.data) {
                ctx.lineTo(x, yBase - bit * 20);
                x += pixelsPerBit;
            }

            ctx.stroke();
        });
    }

    function animate() {
        scrollOffset -= 2;
        if (scrollOffset < -40) scrollOffset = 0; // loop smoothly
        drawWaveform(waveformData);
        requestAnimationFrame(animate);
    }

    goBtn.addEventListener("click", () => {
        protocol = protocolSelect.value;
        let raw = dataInput.value.trim();

        let bits;
        if (/^[0-1]+$/.test(raw)) {
            bits = raw;
        } else {
            bits = hexToBin(raw);
        }

        waveformData = generateWaveform(protocol, bits);
        scrollOffset = 0;
    });

    animate();
});
