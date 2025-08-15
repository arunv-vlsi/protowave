/* waveform.js */
/* ---------- JAVASCRIPT FOR CLOCK WAVEFORM ---------- */

// Function to create and display the clock waveform
function createClockWaveform() {
    // Get the waveform container
    const waveformContainer = document.getElementById('waveform');

    // Clear any existing waveform
    waveformContainer.innerHTML = '';

    // Create clock signal element
    const clockSignal = document.createElement('div');
    clockSignal.classList.add('clock-signal');

    // Append clock signal to waveform container
    waveformContainer.appendChild(clockSignal);
}

// Run when the page loads
window.onload = function() {
    createClockWaveform();
};
