from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from waveforms import generate_waveform

app = FastAPI()

# Allow frontend JS to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/waveform/")
def get_waveform(protocol: str, data: str):
    return generate_waveform(protocol, data)
