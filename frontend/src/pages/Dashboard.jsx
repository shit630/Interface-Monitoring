import React, { useState, useEffect } from "react";
import SummaryCards from "../components/SummaryCards";
import ChartsPanel from "../components/ChartsPanel";
import LogsTable from "../components/LogsTable";
import FiltersModal from "../components/FiltersModal";
import { fetchSummary } from "../services/api";

export default function Dashboard() {
  const [range, setRange] = useState("24h");
  const [summary, setSummary] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const ranges = ["1h", "24h", "7d", "30d"];

  const loadSummary = async () => {
    try {
      const data = await fetchSummary({ range });
      setSummary(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSummary();
    const intv = setInterval(loadSummary, 30 * 1000); // poll every 30s
    return () => clearInterval(intv);
  }, [range]);

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 shadow-md flex flex-wrap items-center justify-between gap-4">
        {/* Range Selector */}
        <div className="flex flex-wrap gap-2">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 text-sm rounded-lg border transition-all ${
                range === r
                  ? "bg-cyan-600 border-cyan-500 text-white shadow"
                  : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Filters Button */}
        <button
          onClick={() => setFiltersOpen(true)}
          className="px-4 py-1.5 text-sm rounded-lg border border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
        >
          Advanced Filters
        </button>
      </div>

      {/* Summary Cards */}
      <SummaryCards data={summary} />

      {/* Charts */}
      <ChartsPanel summary={summary} range={range} />

      {/* Logs */}
      <LogsTable range={range} />

      {/* Modal */}
      <FiltersModal open={filtersOpen} onClose={() => setFiltersOpen(false)} />
    </div>
  );
}
