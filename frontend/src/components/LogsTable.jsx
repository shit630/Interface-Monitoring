import React, { useEffect, useState, useMemo } from "react";
import { fetchExecutions } from "../services/api"; // your API service
import { formatDistanceToNow } from "date-fns";
import {
  FaSortUp,
  FaSortDown,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
} from "react-icons/fa";

export default function LogsTable({ range }) {
  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [sort, setSort] = useState("desc");
  const [filterText, setFilterText] = useState("");

  // Set large page size as needed
  const pageSize = 100;

  // Load data from backend
  const loadPage = async (cursor = null) => {
    try {
      const params = { limit: pageSize, sort, range };
      if (cursor) params.cursor = cursor;

      const res = await fetchExecutions(params);

      // Append if cursor exists, otherwise replace
      setItems((prev) =>
        cursor ? [...prev, ...(res.items || [])] : res.items || []
      );
      setNextCursor(res.nextCursor || null);
    } catch (err) {
      console.error(err);
    }
  };

  // Initial load + auto-refresh every 30s
  useEffect(() => {
    loadPage();
    const interval = setInterval(() => loadPage(), 30 * 1000);
    return () => clearInterval(interval);
  }, [range, sort]);

  // Filter items based on input
  const filtered = useMemo(() => {
    if (!filterText) return items;
    const q = filterText.toLowerCase();
    return items.filter(
      (it) =>
        it.interfaceName?.toLowerCase().includes(q) ||
        it.integrationKey?.toLowerCase().includes(q) ||
        it.message?.toLowerCase().includes(q) ||
        it.status?.toLowerCase().includes(q)
    );
  }, [items, filterText]);

  return (
    <div className="card p-4 bg-gray-900 border border-gray-700 rounded-xl shadow-lg">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 border border-gray-600 transition"
            onClick={() => setSort((s) => (s === "desc" ? "asc" : "desc"))}
          >
            Sort {sort === "asc" ? <FaSortUp /> : <FaSortDown />}
          </button>
          <input
            className="px-3 py-1 bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Filter logs..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <div className="bg-amber-400 text-black px-1 py-2 rounded">
          {items.length} entries
        </div>
        <button
          className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm text-white disabled:opacity-50 transition cursor-pointer"
          onClick={() => loadPage(nextCursor)}
          disabled={!nextCursor}
        >
          Load More
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto max-h-[70vh] rounded-lg border border-gray-700">
        <table className="min-w-full text-left text-sm text-gray-300">
          <thead className="sticky top-0 bg-gray-800/95 backdrop-blur border-b border-gray-700 text-xs uppercase tracking-wider text-gray-400">
            <tr>
              <th className="p-3">Interface</th>
              <th className="p-3">Integration Key</th>
              <th className="p-3">Status</th>
              <th className="p-3">When</th>
              <th className="p-3">Message</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((it, idx) => (
              <tr
                key={it._id}
                className={`border-t border-gray-800 hover:bg-gray-800/50 transition ${
                  idx % 2 === 0 ? "bg-gray-900" : "bg-gray-850"
                }`}
              >
                <td className="p-3">
                  {idx + 1}. {it.interfaceName}
                </td>
                <td className="p-3 truncate max-w-xs" title={it.integrationKey}>
                  {it.integrationKey?.slice(0, 30) || "-"}
                </td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      it.status === "SUCCESS"
                        ? "bg-green-900/30 text-green-300 border border-green-700"
                        : it.status === "FAILED"
                        ? "bg-red-900/30 text-red-300 border border-red-700"
                        : "bg-blue-900/30 text-blue-300 border border-blue-700"
                    }`}
                  >
                    {it.status === "SUCCESS" && <FaCheckCircle />}
                    {it.status === "FAILED" && <FaTimesCircle />}
                    {it.status !== "SUCCESS" && it.status !== "FAILED" && (
                      <FaInfoCircle />
                    )}
                    {it.status}
                  </span>
                </td>
                <td className="p-3">
                  {it.startTime
                    ? formatDistanceToNow(new Date(it.startTime), {
                        addSuffix: true,
                      })
                    : "-"}
                </td>
                <td className="p-3 truncate max-w-lg" title={it.message}>
                  {(it.message || "").slice(0, 120)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
