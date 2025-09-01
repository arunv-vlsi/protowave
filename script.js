document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const protocolSelect = document.getElementById('protocol-select');
    const generateBtn = document.getElementById('generate-btn');
    
    // UI Containers
    const waveformControls = document.getElementById('waveform-controls');
    const pcieControls = document.getElementById('pcie-controls');
    const waveformDisplay = document.getElementById('waveform-display');
    const pcieDisplay = document.getElementById('pcie-display');
    const placeholderText = document.getElementById('placeholder-text');
    const errorMessage = document.getElementById('error-message');
    
    // Waveform Elements
    const formatToggle = document.getElementById('format-toggle');
    const dataInput = document.getElementById('data-input');
    const canvas = document.getElementById('waveformCanvas');
    const ctx = canvas.getContext('2d');
    
    // PCIe TLP Elements
    const pcieAddressInput = document.getElementById('pcie-address');
    const pcieDataInput = document.getElementById('pcie-data');
    const tlpContainer = document.getElementById('tlp-container');

    // Drawing Constants
    const PADDING = 60;
    const SIGNAL_HEIGHT = 60;
    const BIT_WIDTH = 40;
    const V_SPACING = 80;
    
    // Colors
    const LINE_COLOR = '#9CA3AF';
    const LABEL_COLOR = '#E5E7EB';
    const HIGH_COLOR = '#38BDF8';
    const CLOCK_COLOR = '#F87171';
    const DATA_ANNOTATION_COLOR = '#10B981';

    // --- EVENT LISTENERS ---
    generateBtn.addEventListener('click', handleGenerate);
    protocolSelect.addEventListener('change', handleProtocolChange);
    formatToggle.addEventListener('change', () => {
        dataInput.placeholder = formatToggle.checked ? 'e.g., B5' : 'e.g., 10110101';
        dataInput.value = '';
    });
    
    // Initialize UI
    handleProtocolChange();

    // --- UI LOGIC ---
    function handleProtocolChange() {
        const protocol = protocolSelect.value;
        if (protocol === 'pcie') {
            waveformControls.classList.add('hidden');
            pcieControls.classList.remove('hidden');
            waveformDisplay.classList.add('hidden');
            pcieDisplay.classList.remove('hidden');
        } else {
            waveformControls.classList.remove('hidden');
            pcieControls.classList.add('hidden');
            waveformDisplay.classList.remove('hidden');
            pcieDisplay.classList.add('hidden');

            // ===================================================================
            // ==                     BUG FIX STARTS HERE                       ==
            // ===================================================================
            // Reset the waveform display to its initial state, showing the placeholder.
            // This was the missing piece of logic.
            placeholderText.classList.remove('hidden');
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear any old drawing
            hideError(); // Also ensures the error message is hidden
            // ===================================================================
            // ==                      BUG FIX ENDS HERE                        ==
            // ===================================================================
        }
    }

    // --- MAIN GENERATION LOGIC ---
    function handleGenerate() {
        hideError();
        const protocol = protocolSelect.value;
        
        switch (protocol) {
            case 'uart':
            case 'i2c':
            case 'spi':
                generateWaveform();
                break;
            case 'pcie':
                drawPcieTlpVisualization();
                break;
        }
    }

    function generateWaveform() {
        const protocol = protocolSelect.value;
        const isHex = formatToggle.checked;
        let data = dataInput.value.trim();

        if (!data) {
            showError("Input data cannot be empty.");
            return;
        }

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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '14px "Roboto Mono"';

        if (protocol === 'uart') drawUartWaveform(binaryData);
        if (protocol === 'i2c') drawI2cWaveform(binaryData);
        if (protocol === 'spi') drawSpiWaveform(binaryData);
    }
    
    // --- PCIe TLP VISUALIZATION ---
    function drawPcieTlpVisualization() {
        const address = pcieAddressInput.value.toUpperCase().replace(/[^0-9A-F]/g, '');
        const payload = pcieDataInput.value.toUpperCase().replace(/[^0-9A-F]/g, '');

        if (!address || !payload) {
            showError("PCIe Address and Data Payload cannot be empty.");
            pcieDisplay.classList.add('hidden');
            return;
        }
        
        const payloadLengthDW = Math.ceil(payload.length / 8); // Length in Double Words (4 bytes)
        
        tlpContainer.innerHTML = ''; // Clear previous TLP

        // --- TLP Header ---
        const dword0 = document.createElement('div');
        dword0.className = 'tlp-dword';
        dword0.innerHTML = `
            <div class="tlp-field field-header" style="flex: 1;" title="Format & Type indicate a Memory Write Request">
                <span class="label">Fmt[2:0], Type[4:0]</span>
                <span class="value">010 00000</span>
            </div>
            <div class="tlp-field field-header" style="flex: 1;" title="Length of the data payload in Double Words (DW)">
                <span class="label">Length[9:0]</span>
                <span class="value">${payloadLengthDW.toString(16).padStart(3, '0').toUpperCase()}</span>
            </div>
        `;
        
        const dword1 = document.createElement('div');
        dword1.className = 'tlp-dword';
        dword1.innerHTML = `
            <div class="tlp-field field-header" style="flex: 2;" title="Unique ID of the component making the request">
                <span class="label">Requester ID</span>
                <span class="value">0100</span>
            </div>
            <div class="tlp-field field-header" style="flex: 1;" title="Transaction identifier tag">
                <span class="label">Tag</span>
                <span class="value">1A</span>
            </div>
            <div class="tlp-field field-header" style="flex: 1;" title="Last DW BE[3:0] & 1st DW BE[3:0]">
                <span class="label">Byte Enables</span>
                <span class="value">F F</span>
            </div>
        `;

        const dword2 = document.createElement('div');
        dword2.className = 'tlp-dword';
        dword2.innerHTML = `
            <div class="tlp-field field-header" style="flex: 1;" title="32-bit Memory Address">
                <span class="label">Address[31:2]</span>
                <span class="value">${address.padStart(8,'0')}</span>
            </div>
        `;

        tlpContainer.append(dword0, dword1, dword2);

        // --- TLP Data Payload ---
        const payloadDwords = payload.padEnd(payloadLengthDW * 8, '0').match(/.{1,8}/g) || [];
        payloadDwords.forEach((dw, index) => {
            const payloadDwordEl = document.createElement('div');
            payloadDwordEl.className = 'tlp-dword';
            payloadDwordEl.innerHTML = `
                <div class="tlp-field field-data" style="flex: 1;" title="Data Payload Double Word ${index}">
                    <span class="label">Data DW ${index}</span>
                    <span class="value">${dw}</span>
                </div>
            `;
            tlpContainer.appendChild(payloadDwordEl);
        });
    }

    // --- HELPER FUNCTIONS ---
    function hexToBinary(hex) {
        return hex.split('').map(c => parseInt(c, 16).toString(2).padStart(4, '0')).join('');
    }
    
    function showError(message) {
        waveformDisplay.classList.remove('hidden');
        placeholderText.classList.add('hidden');
        canvas.classList.add('hidden');
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function hideError() {
        errorMessage.classList.add('hidden');
        canvas.classList.remove('hidden');
    }
    
    // --- WAVEFORM DRAWING FUNCTIONS (UART, I2C, SPI) ---
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

        drawBit(x, yScl, '1', LINE_COLOR);
        drawBit(x, ySda, '1', LINE_COLOR);
        x += BIT_WIDTH;

        drawBit(x, yScl, '1', HIGH_COLOR); 
        drawBit(x, ySda, '1', HIGH_COLOR, BIT_WIDTH / 2); 
        drawTransition(x + BIT_WIDTH / 2, ySda, '1', '0', HIGH_COLOR); 
        drawBit(x + BIT_WIDTH / 2, ySda, '0', HIGH_COLOR, BIT_WIDTH / 2); 
        ctx.fillStyle = DATA_ANNOTATION_COLOR;
        ctx.textAlign = 'center';
        ctx.fillText('Start', x + BIT_WIDTH / 2, ySda + 20);
        x += BIT_WIDTH;
        lastSda = '0';
        
        for (let i = 0; i < numClockCycles; i++) {
            const sdaBit = sdaSequence[i];
            
            drawTransition(x, ySda, lastSda, sdaBit, HIGH_COLOR);
            drawBit(x, ySda, sdaBit, HIGH_COLOR, BIT_WIDTH / 2);

            ctx.strokeStyle = CLOCK_COLOR;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, yScl); 
            ctx.lineTo(x + BIT_WIDTH / 2, yScl); 
            ctx.lineTo(x + BIT_WIDTH / 2, yScl - SIGNAL_HEIGHT); 
            ctx.lineTo(x + BIT_WIDTH, yScl - SIGNAL_HEIGHT); 
            ctx.stroke();

            drawBit(x + BIT_WIDTH / 2, ySda, sdaBit, HIGH_COLOR, BIT_WIDTH / 2);
            
            let annotation = sdaBit;
            if (i < 7) annotation = `A${6-i}`;
            else if (i === 7) annotation = 'W';
            else if (i === 8 || i === 17) annotation = 'ACK';
            else if (i > 8) annotation = `D${16-i}`;
            ctx.fillText(annotation, x + BIT_WIDTH / 2, ySda - SIGNAL_HEIGHT - 10);

            x += BIT_WIDTH;
            lastSda = sdaBit;
        }

        drawBit(x, yScl, '1', HIGH_COLOR); 
        drawBit(x, ySda, lastSda, HIGH_COLOR, BIT_WIDTH / 2); 
        drawTransition(x + BIT_WIDTH / 2, ySda, lastSda, '1', HIGH_COLOR); 
        drawBit(x + BIT_WIDTH / 2, ySda, '1', HIGH_COLOR, BIT_WIDTH / 2); 
        ctx.fillText('Stop', x + BIT_WIDTH / 2, ySda + 20);
        x += BIT_WIDTH;
        
        drawBit(x, yScl, '1', LINE_COLOR);
        drawBit(x, ySda, '1', LINE_COLOR);
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
            ctx.moveTo(x, ySclk); 
            ctx.lineTo(x + BIT_WIDTH / 2, ySclk); 
            ctx.lineTo(x + BIT_WIDTH / 2, ySclk - SIGNAL_HEIGHT); 
            ctx.lineTo(x + BIT_WIDTH, ySclk - SIGNAL_HEIGHT); 
            ctx.moveTo(x + BIT_WIDTH, ySclk - SIGNAL_HEIGHT); 
            ctx.lineTo(x + BIT_WIDTH, ySclk); 
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
});
