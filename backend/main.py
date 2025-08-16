from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="StockPulse API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

COMPANIES = {
    "Reliance": "RELIANCE.NS",
    "TCS": "TCS.NS",
    "Infosys": "INFY.NS",
    "HDFC Bank": "HDFCBANK.NS",
    "ICICI Bank": "ICICIBANK.NS",
    "SBI": "SBIN.NS",
    "Axis Bank": "AXISBANK.NS",
    "ITC": "ITC.NS",
    "HCL Tech": "HCLTECH.NS",
    "Wipro": "WIPRO.NS",
}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/companies")
def companies():
    return [{"name": k, "ticker": v} for k, v in COMPANIES.items()]
