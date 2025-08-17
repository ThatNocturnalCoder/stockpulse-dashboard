from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf

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

@app.get("/stock/{ticker}")
def stock_data(ticker: str):
    try:
        # Download data
        df = yf.download(ticker, period="1mo", interval="1d", progress=False, auto_adjust=False)
        if df.empty:
            return {"error": "No data found"}

        # Convert dates to strings
        dates = [d.strftime("%Y-%m-%d") for d in df.index]

        # Safely get Close prices (handle MultiIndex)
        if "Close" in df.columns:
            close_col = df["Close"]
            # If MultiIndex, pick first column
            if isinstance(close_col, type(df)):
                prices = close_col.iloc[:, 0].round(2).tolist()
            else:
                prices = close_col.round(2).tolist()
        else:
            return {"error": "No 'Close' column in data"}

        return {"dates": dates, "prices": prices}

    except Exception as e:
        return {"error": str(e)}

