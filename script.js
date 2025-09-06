document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const protocolSelect = document.getElementById('protocol-select');
    const formatToggle = document.getElementById('format-toggle');
    const dataInput = document.getElementById('data-input');
    const generateBtn = document.getElementById('generate-btn');
    const canvas = document.getElementById('waveformCanvas');
    const ctx = canvas.getContext('2d');
    const placeholderText = document.getElementById('placeholder-text');
    const errorMessage = document.getElementById('error-message');

    // Drawing Constants
    const PADDING = 60;
    const SIGNAL_HEIGHT = 60;
    const BIT_WIDTH = 40;
    const V_SPACING = 80;
    
    // Colors
    const LINE_COLOR = '#9CA3AF';
    const LABEL_COLOR = '#E5E7EB';
    const HIGH_COLOR = '#38BDF8';
    const LOW_COLOR = '#38BDF8';
    const CLOCK_COLOR = '#F87171';
    const DATA_ANNOTATION_COLOR = '#10B981';

    // --- EVENT LISTENERS ---

    generateBtn.addEventListener('click', generateWaveform);
    formatToggle.addEventListener('change', () => {
        const isHex = formatToggle.checked;
        dataInput.placeholder = isHex ? 'e.g., B5' : 'e.g., 10110101';
        dataInput.value = '';
    });

    // --- MAIN FUNCTION ---

    function generateWaveform() {
        hideError();
        const protocol = protocolSelect.value;
        const isHex = formatToggle.checked;
        let data = dataInput.value.trim();

        if (!data) {
            showError("Input data cannot be empty.");
            return;
        }

        // Validate and convert data
        let binaryData;
        if (isHex) {
            if (!/^[0-9A-Fa-f]+$/.test(data)) {
                showError("Invalid Hexadecimal data.");
                return;
            }
            binaryData = hexToBinary(data);
        } else {
            if (!/^[01]+$/.test(data)) {
                showError("Invalid Binary data.");
                return;
            }
            binaryData = data;
        }

        placeholderText.classList.add('hidden');
        canvas.classList.remove('hidden');

        // Clear and prepare canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '14px "Roboto Mono"';

        switch (protocol) {
            case 'uart':
                drawUartWaveform(binaryData);
                break;
            case 'i2c':
                drawI2cWaveform(binaryData);
                break;
            case 'spi':
                drawSpiWaveform(binaryData);
                break;
            case 'pcie':
                drawPcieWaveform(binaryData);
                break;
        }
    }

    // --- HELPER FUNCTIONS ---

    function hexToBinary(hex) {
        return hex.split('').map(c => 
            parseInt(c, 16).toString(2).padStart(4, '0')
        ).join('');
    }
    
    function showError(message) {
        placeholderText.classList.add('hidden');
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function hideError() {
        errorMessage.classList.add('hidden');
    }

    function drawSignalLabel(label, y) {
        ctx.fillStyle = LABEL_COLOR;
        ctx.textAlign = "right";
        ctx.fillText(label, PADDING - 10, y + 5);
    }
    
    function drawBit(x, y, bit, color, width = BIT_WIDTH) {
        const yLevel = y - (bit === '1' ? SIGNAL_HEIGHT : 0);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, yLevel);
        ctx.lineTo(x + width, yLevel);
        ctx.stroke();
    }
    
    function drawTransition(x, y, fromBit, toBit, color) {
        const yFrom = y - (fromBit === '1' ? SIGNAL_HEIGHT : 0);
        const yTo = y - (toBit === '1' ? SIGNAL_HEIGHT : 0);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, yFrom);
        ctx.lineTo(x, yTo);
        ctx.stroke();
    }

    // =======================================================================
    // ==         DEFINITIVELY CORRECTED I2C WAVEFORM FUNCTION              ==
    // =======================================================================
    /**
     * I2C: Draws Start, Data/ACK, and Stop conditions ensuring SDA only
     * changes when SCL is low, and is stable when SCL is high.
     */
    function drawI2cWaveform(binaryData) {
        const address = binaryData.slice(0, 7).padEnd(7, '0');
        const data = binaryData.slice(7, 15).padEnd(8, '0');
        const rwBit = '0'; // Write
        const ackBit = '0'; // Assume ACK

        const sdaSequence = `${address}${rwBit}${ackBit}${data}${ackBit}`;
        const numClockCycles = sdaSequence.length;
        
        canvas.width = PADDING * 2 + (numClockCycles + 3) * BIT_WIDTH;
        ctx.font = '14px "Roboto Mono"';

        const yScl = V_SPACING;
        const ySda = V_SPACING * 2;
        let x = PADDING;
        let lastSda = '1'; // Bus is idle high

        drawSignalLabel("SCL", yScl);
        drawSignalLabel("SDA", ySda);

        // --- Idle State ---
        drawBit(x, yScl, '1', LINE_COLOR);
        drawBit(x, ySda, '1', LINE_COLOR);
        x += BIT_WIDTH;

        // --- Start Condition ---
        // While SCL is high, SDA transitions from high to low.
        drawBit(x, yScl, '1', HIGH_COLOR); // SCL stays high
        drawBit(x, ySda, '1', HIGH_COLOR, BIT_WIDTH / 2); // SDA high for first half
        drawTransition(x + BIT_WIDTH / 2, ySda, '1', '0', HIGH_COLOR); // SDA transitions low
        drawBit(x + BIT_WIDTH / 2, ySda, '0', HIGH_COLOR, BIT_WIDTH / 2); // SDA low for second half
        ctx.fillStyle = DATA_ANNOTATION_COLOR;
        ctx.textAlign = 'center';
        ctx.fillText('Start', x + BIT_WIDTH / 2, ySda + 20);
        x += BIT_WIDTH;
        lastSda = '0';
        
        // --- Data Transfer ---
        for (let i = 0; i < numClockCycles; i++) {
            const sdaBit = sdaSequence[i];
            
            // 1. Draw SDA transition and stable low-period level (while SCL is low)
            drawTransition(x, ySda, lastSda, sdaBit, HIGH_COLOR);
            drawBit(x, ySda, sdaBit, HIGH_COLOR, BIT_WIDTH / 2);

            // 2. Draw the SCL clock pulse
            ctx.strokeStyle = CLOCK_COLOR;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, yScl); // Start from low
            ctx.lineTo(x + BIT_WIDTH / 2, yScl); // Low level
            ctx.lineTo(x + BIT_WIDTH / 2, yScl - SIGNAL_HEIGHT); // Rising edge
            ctx.lineTo(x + BIT_WIDTH, yScl - SIGNAL_HEIGHT); // High level
            ctx.stroke();

            // 3. Draw SDA stable high-period level (while SCL is high)
            drawBit(x + BIT_WIDTH / 2, ySda, sdaBit, HIGH_COLOR, BIT_WIDTH / 2);
            
            // Annotations
            let annotation = sdaBit;
            if (i < 7) annotation = `A${6-i}`;
            else if (i === 7) annotation = 'W';
            else if (i === 8 || i === 17) annotation = 'ACK';
            else if (i > 8) annotation = `D${16-i}`;
            ctx.fillText(annotation, x + BIT_WIDTH / 2, ySda - SIGNAL_HEIGHT - 10);

            x += BIT_WIDTH;
            lastSda = sdaBit;
        }

        // --- Stop Condition ---
        // While SCL is high, SDA transitions from low to high.
        drawBit(x, yScl, '1', HIGH_COLOR); // SCL stays high
        drawBit(x, ySda, lastSda, HIGH_COLOR, BIT_WIDTH / 2); // SDA holds last value
        drawTransition(x + BIT_WIDTH / 2, ySda, lastSda, '1', HIGH_COLOR); // SDA transitions high
        drawBit(x + BIT_WIDTH / 2, ySda, '1', HIGH_COLOR, BIT_WIDTH / 2); // SDA stays high
        ctx.fillText('Stop', x + BIT_WIDTH / 2, ySda + 20);
        x += BIT_WIDTH;
        
        // --- Return to Idle ---
        drawBit(x, yScl, '1', LINE_COLOR);
        drawBit(x, ySda, '1', LINE_COLOR);
    }
    
    // --- OTHER PROTOCOL DRAWING FUNCTIONS (Unchanged) ---

    function drawUartWaveform(binaryData) {
        const dataBits = (binaryData.padEnd(8, '0')).slice(0, 8).split('').reverse().join(''); // LSB first
        const frame = `0${dataBits}1`; // Start (0), Data, Stop (1)
        const numBits = frame.length;
        
        canvas.width = PADDING * 2 + (numBits + 1) * BIT_WIDTH;
        ctx.font = '14px "Roboto Mono"';

        const y = V_SPACING;
        let x = PADDING;

        drawSignalLabel("TX", y);
        let lastBit = '1';

        drawBit(x - BIT_WIDTH, y, '1', LINE_COLOR);
        
        for (let i = 0; i < numBits; i++) {
            const bit = frame[i];
            drawTransition(x, y, lastBit, bit, HIGH_COLOR);
            drawBit(x, y, bit, HIGH_COLOR);
            
            ctx.fillStyle = DATA_ANNOTATION_COLOR;
            ctx.textAlign = 'center';
            if (i === 0) ctx.fillText('Start', x + BIT_WIDTH / 2, y + 20);
            else if (i === numBits - 1) ctx.fillText('Stop', x + BIT_WIDTH / 2, y + 20);
            else ctx.fillText(dataBits[i-1], x + BIT_WIDTH / 2, y - SIGNAL_HEIGHT - 10);

            x += BIT_WIDTH;
            lastBit = bit;
        }
        
        drawBit(x, y, '1', LINE_COLOR);
    }

    function drawSpiWaveform(binaryData) {
        const data = binaryData.padEnd(8, '0').slice(0, 8);
        const numBits = data.length;
        
        canvas.width = PADDING * 2 + (numBits + 2) * BIT_WIDTH;
        ctx.font = '14px "Roboto Mono"';

        const ySs = V_SPACING;
        const ySclk = V_SPACING * 2;
        const yMosi = V_SPACING * 3;
        let x = PADDING;

        drawSignalLabel("SS", ySs);
        drawSignalLabel("SCLK", ySclk);
        drawSignalLabel("MOSI", yMosi);

        drawBit(x, ySs, '1', LINE_COLOR);
        drawBit(x, ySclk, '0', LINE_COLOR);
        drawBit(x, yMosi, '0', LINE_COLOR);
        x += BIT_WIDTH;
        
        drawTransition(x, ySs, '1', '0', HIGH_COLOR);
        let lastMosi = '0';
        
        // Draw the full low period of SS
        ctx.strokeStyle = HIGH_COLOR;
        ctx.lineWidth = 2;
        ctx.beginPath();
        const ssY = ySs - (0 * SIGNAL_HEIGHT);
        ctx.moveTo(x, ssY);
        ctx.lineTo(x + numBits * BIT_WIDTH, ssY);
        ctx.stroke();

        for (let i = 0; i < numBits; i++) {
            const mosiBit = data[i];

            drawTransition(x, yMosi, lastMosi, mosiBit, HIGH_COLOR);
            drawBit(x, yMosi, mosiBit, HIGH_COLOR);
            
            ctx.strokeStyle = CLOCK_COLOR;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, ySclk); // Start from low
            ctx.lineTo(x + BIT_WIDTH / 2, ySclk); // low level
            ctx.lineTo(x + BIT_WIDTH / 2, ySclk - SIGNAL_HEIGHT); // rising edge
            ctx.lineTo(x + BIT_WIDTH, ySclk - SIGNAL_HEIGHT); // high level
            ctx.moveTo(x + BIT_WIDTH, ySclk - SIGNAL_HEIGHT); // stay high
            ctx.lineTo(x + BIT_WIDTH, ySclk); // falling edge for next cycle
            ctx.stroke();
            
            ctx.fillStyle = DATA_ANNOTATION_COLOR;
            ctx.textAlign = 'center';
            ctx.fillText(mosiBit, x + BIT_WIDTH / 2, yMosi - SIGNAL_HEIGHT - 10);
            
            x += BIT_WIDTH;
            lastMosi = mosiBit;
        }
        
        drawTransition(x, ySs, '0', '1', HIGH_COLOR);
        
        drawBit(x, ySclk, '0', LINE_COLOR);
        drawBit(x, yMosi, lastMosi, LINE_COLOR);

        drawBit(x, ySs, '1', LINE_COLOR, BIT_WIDTH);
    }
    
    function drawPcieWaveform(binaryData) {
        const numBits = binaryData.length;
        canvas.width = PADDING * 2 + numBits * BIT_WIDTH;
        ctx.font = '14px "Roboto Mono"';

        const yCenter = V_SPACING * 1.5;
        const yPetp = yCenter - SIGNAL_HEIGHT / 2;
        const yPetn = yCenter + SIGNAL_HEIGHT / 2;
        
        drawSignalLabel("PETp0", yPetp);
        drawSignalLabel("PETn0", yPetn);
        
        let x = PADDING;
        let lastPetpBit = '0';
        let lastPetnBit = '1';

        for (let i = 0; i < numBits; i++) {
            const petpBit = binaryData[i];
            const petnBit = petpBit === '1' ? '0' : '1';
            
            drawTransition(x, yPetp, lastPetpBit, petpBit, HIGH_COLOR);
            drawBit(x, yPetp, petpBit, HIGH_COLOR);

            drawTransition(x, yPetn, lastPetnBit, petnBit, CLOCK_COLOR);
            drawBit(x, yPetn, petnBit, CLOCK_COLOR);
            
            ctx.fillStyle = DATA_ANNOTATION_COLOR;
            ctx.textAlign = 'center';
            ctx.fillText(petpBit, x + BIT_WIDTH / 2, yPetp - SIGNAL_HEIGHT - 5);

            x += BIT_WIDTH;
            lastPetpBit = petpBit;
            lastPetnBit = petnBit;
        }
    }
});
