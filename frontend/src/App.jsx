import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

export default function App() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/companies`).then(res => setCompanies(res.data)).catch(() => setCompanies([]));
  }, []);

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
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              {c.name}
            </button>
          ))}
        </div>
      </aside>

      {/* Main panel */}
      <main className="flex-1 p-6">
        <header className="mb-6">
          <h2 className="text-2xl font-bold">StockPulse Dashboard</h2>
          <p className="text-sm text-gray-500">
            Welcome! Pick a company from the left to view its stock chart.
          </p>
        </header>

        {/* Placeholder content until a company is selected */}
        <section className="rounded-2xl border bg-white p-8">
          <div className="text-gray-500">
            No company selected yet. Your chart will appear here.
          </div>
        </section>
      </main>
    </div>
  );
}
