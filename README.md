**protocolwave - A Visual Protocol Waveform Generator**
protocolwave is an interactive, web-based tool designed to help students, hobbyists, and engineers visualize the digital waveforms of common communication protocols. By entering data, you can instantly generate a graphical representation of the signals for protocols like UART, I2C, and SPI.

For more complex protocols like PCIe, which are impractical to visualize at a physical signal level, protocolwave provides a high-level representation of a Transaction Layer Packet (TLP) to illustrate the data structure.

✨ Features
Multiple Protocol Support: Visualize waveforms for UART, I2C, and SPI.

High-Level PCIe View: Generates a simplified Memory Write Transaction Layer Packet (TLP) for PCIe.

Dual Data Input: Accepts data in both Binary and Hexadecimal formats.

Interactive & User-Friendly: A clean and simple interface allows you to select a protocol, input data, and generate the visualization with a single click.

Educational Focus: Built to serve as a learning aid for understanding how data is transmitted physically over a wire or logically in a packet.

Pure Front-End: Runs entirely in the browser using HTML, CSS, and JavaScript. No server-side processing is required.

🚀 How to Use
Open the Application: Clone or download the repository and open the index.html file in any modern web browser.

Select a Protocol: Use the dropdown menu to choose between UART, I2C, SPI, or PCIe.

Enter Your Data:

For UART, I2C, or SPI:

Use the toggle switch to select "Binary" or "Hex" as your data format.

Enter the data you want to transmit into the "Input Data" field.

For PCIe:

Enter the target memory address (in Hex).

Enter the data payload (in Hex).

Generate the Waveform: Click the "Generate" button.

View the Output: The generated waveform or PCIe TLP diagram will appear in the display area below the controls.

📂 Project Structure
This project is self-contained and relies on three core files:

index.html: Contains the main structure of the web page, including the header, controls, and display sections.

style.css: Provides the styling for the application, ensuring a clean and responsive layout.

script.js: Houses all the logic for the application. This includes:

Handling user input and interactions.

Validating the input data.

Generating the protocol-specific data arrays.

Drawing the waveforms on the HTML5 Canvas.

Constructing and displaying the PCIe TLP view.

🛠️ Built With
HTML5: For the core markup and structure.

CSS3: For custom styling, layout (Flexbox), and a modern look.

Vanilla JavaScript: For all DOM manipulation, application logic, and rendering.

HTML5 Canvas API: Used for drawing and rendering the digital waveforms.

💡 Future Improvements
[ ] Add more protocols (e.g., CAN bus, LIN bus, USB).

[ ] Allow customization of protocol parameters (e.g., UART baud rate, parity, stop bits; SPI clock polarity).

[ ] Implement waveform zooming and panning.

[ ] Add annotations and tooltips to the waveform to explain each part (start bit, data bits, ack, etc.).

[ ] Decode a waveform from an uploaded data file (e.g., CSV).

📄 License
This project is open-source and available under the MIT License.
