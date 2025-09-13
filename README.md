<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Protocolwave - Project README</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
            margin: 0;
            padding: 2rem;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 2rem 3rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        h1, h2, h3 {
            font-weight: 600;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 0.5rem;
            margin-top: 2rem;
            margin-bottom: 1.5rem;
        }
        h1 {
            font-size: 2.5rem;
            text-align: center;
            border-bottom: none;
        }
        h2 {
            font-size: 1.75rem;
        }
        p {
            margin-bottom: 1rem;
        }
        ul, ol {
            padding-left: 20px;
        }
        li {
            margin-bottom: 0.75rem;
        }
        strong {
            font-weight: 600;
            color: #0056b3;
        }
        code {
            background-color: #e9ecef;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        input[type="checkbox"] {
            margin-right: 8px;
            position: relative;
            top: 2px;
        }
    </style>
</head>
<body>

    <div class="container">
        <h1>protocolwave - A Visual Protocol Waveform Generator</h1>

        <p>protocolwave is an interactive, web-based tool designed to help students, hobbyists, and engineers visualize the digital waveforms of common communication protocols. By entering data, you can instantly generate a graphical representation of the signals for protocols like UART, I2C, and SPI.</p>

        <p>For more complex protocols like PCIe, which are impractical to visualize at a physical signal level, protocolwave provides a high-level representation of a Transaction Layer Packet (TLP) to illustrate the data structure.</p>

        <h2>✨ Features</h2>
        <ul>
            <li><strong>Multiple Protocol Support:</strong> Visualize waveforms for UART, I2C, and SPI.</li>
            <li><strong>High-Level PCIe View:</strong> Generates a simplified Memory Write Transaction Layer Packet (TLP) for PCIe.</li>
            <li><strong>Dual Data Input:</strong> Accepts data in both <strong>Binary</strong> and <strong>Hexadecimal</strong> formats.</li>
            <li><strong>Interactive & User-Friendly:</strong> A clean and simple interface allows you to select a protocol, input data, and generate the visualization with a single click.</li>
            <li><strong>Educational Focus:</strong> Built to serve as a learning aid for understanding how data is transmitted physically over a wire or logically in a packet.</li>
            <li><strong>Pure Front-End:</strong> Runs entirely in the browser using HTML, CSS, and JavaScript. No server-side processing is required.</li>
        </ul>

        <h2>🚀 How to Use</h2>
        <ol>
            <li><strong>Open the Application:</strong> Clone or download the repository and open the <code>index.html</code> file in any modern web browser.</li>
            <li><strong>Select a Protocol:</strong> Use the dropdown menu to choose between UART, I2C, SPI, or PCIe.</li>
            <li><strong>Enter Your Data:</strong>
                <ul>
                    <li>For <strong>UART, I2C, or SPI</strong>:
                        <ul>
                            <li>Use the toggle switch to select "Binary" or "Hex" as your data format.</li>
                            <li>Enter the data you want to transmit into the "Input Data" field.</li>
                        </ul>
                    </li>
                    <li>For <strong>PCIe</strong>:
                        <ul>
                            <li>Enter the target memory address (in Hex).</li>
                            <li>Enter the data payload (in Hex).</li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li><strong>Generate the Waveform:</strong> Click the <strong>"Generate"</strong> button.</li>
            <li><strong>View the Output:</strong> The generated waveform or PCIe TLP diagram will appear in the display area below the controls.</li>
        </ol>

        <h2>📂 Project Structure</h2>
        <p>This project is self-contained and relies on three core files:</p>
        <ul>
            <li><code>index.html</code>: Contains the main structure of the web page, including the header, controls, and display sections.</li>
            <li><code>style.css</code>: Provides the styling for the application, ensuring a clean and responsive layout.</li>
            <li><code>script.js</code>: Houses all the logic for the application. This includes:
                <ul>
                    <li>Handling user input and interactions.</li>
                    <li>Validating the input data.</li>
                    <li>Generating the protocol-specific data arrays.</li>
                    <li>Drawing the waveforms on the HTML5 Canvas.</li>
                    <li>Constructing and displaying the PCIe TLP view.</li>
                </ul>
            </li>
        </ul>

        <h2>🛠️ Built With</h2>
        <ul>
            <li><strong>HTML5:</strong> For the core markup and structure.</li>
            <li><strong>CSS3:</strong> For custom styling, layout (Flexbox), and a modern look.</li>
            <li><strong>Vanilla JavaScript:</strong> For all DOM manipulation, application logic, and rendering.</li>
            <li><strong>HTML5 Canvas API:</strong> Used for drawing and rendering the digital waveforms.</li>
        </ul>

        <h2>💡 Future Improvements</h2>
        <ul>
            <li><input type="checkbox" disabled> Add more protocols (e.g., CAN bus, LIN bus, USB).</li>
            <li><input type="checkbox" disabled> Allow customization of protocol parameters (e.g., UART baud rate, parity, stop bits; SPI clock polarity).</li>
            <li><input type="checkbox" disabled> Implement waveform zooming and panning.</li>
            <li><input type="checkbox" disabled> Add annotations and tooltips to the waveform to explain each part (start bit, data bits, ack, etc.).</li>
            <li><input type="checkbox" disabled> Decode a waveform from an uploaded data file (e.g., CSV).</li>
        </ul>
    </div>

</body>
</html>
