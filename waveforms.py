def generate_clock(length: int):
    """Generate clock waveform for given length (one cycle per bit)."""
    clk = []
    for i in range(length * 2):
        clk.append(i % 2)
    return clk


def generate_i2c(data: str):
    return {
        "signals": [
            {"name": "SCL", "data": generate_clock(len(data))},
            {"name": "SDA", "data": [1 if b == "1" else 0 for b in data]},
        ]
    }


def generate_spi(data: str):
    return {
        "signals": [
            {"name": "CLK", "data": generate_clock(len(data))},
            {"name": "MOSI", "data": [1 if b == "1" else 0 for b in data]},
        ]
    }


def generate_uart(data: str):
    bits = [0]  # Start bit
    bits.extend([1 if b == "1" else 0 for b in data])
    bits.append(1)  # Stop bit
    return {
        "signals": [
            {"name": "TX", "data": bits}
        ]
    }


def generate_waveform(protocol: str, data: str):
    """Main dispatcher for protocol waveforms."""
    if protocol == "i2c":
        return generate_i2c(data)
    elif protocol == "spi":
        return generate_spi(data)
    elif protocol == "uart":
        return generate_uart(data)
    else:
        return {"signals": []}
