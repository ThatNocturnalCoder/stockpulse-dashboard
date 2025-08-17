import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const API_BASE = "http://localhost:8000";

export default function App() {
  const [companies, setCompanies] = useState([]);
  const [selected, setSelected] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/companies`)
      .then(res => setCompanies(res.data))
      .catch(() => setCompanies([]));
  }, []);

  const fetchStock = async (ticker, name) => {
  setSelected(name); // marks company as selected
  try {
    const res = await axios.get(`${API_BASE}/stock/${ticker}`);
    if (!res.data.error) {
      setChartData({
        labels: res.data.dates,
        datasets: [
          {
            label: `${name} Stock Price`,
            data: res.data.prices,
            borderColor: "rgb(37, 99, 235)",
            backgroundColor: "rgba(37, 99, 235, 0.3)",
            tension: 0.2,
          },
        ],
      });
    } else {
      setChartData(null);
      alert(res.data.error);
    }
  } catch (err) {
    console.error(err);
    setChartData(null);
    alert("Failed to fetch stock data");
  }
};


  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 border-r bg-white">
        <div className="px-4 py-3 border-b">
          <h1 className="text-xl font-semibold">StockPulse</h1>
          <p className="text-xs text-gray-500">Select a company</p>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-60px)] p-2 space-y-1">
          {companies.map((c) => (
            <button
              key={c.ticker}
              onClick={() => fetchStock(c.ticker, c.name)}
              className={`w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 ${
                selected === c.name ? "bg-gray-200 font-medium" : ""
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6">
        <header className="mb-6">
          <h2 className="text-2xl font-bold">StockPulse Dashboard</h2>
        </header>

        <section className="rounded-2xl border bg-white p-8 min-h-[400px] flex items-center justify-center">
          {chartData ? (
            <Line data={chartData} />
          ) : (
            <div className="text-gray-500 text-center">
              {selected
                ? "No data available for this stock."
                : "Welcome! Pick a company from the left to view its stock chart."}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
