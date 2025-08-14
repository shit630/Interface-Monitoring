import React, { useEffect, useState } from "react";
import { fetchChartData } from "../services/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format } from "date-fns";

export default function ChartsPanel({ summary, range }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchChartData({ range, bucket: "hour" })
      .then((res) => {
        const rows = res?.rows || [];
        const data = rows.map((row) => {
          const statusMap = {};
          (row.statuses || []).forEach((s) => {
            statusMap[s.status] = s.count;
          });
          return {
            time: format(new Date(row._id), "MMM d, HH:mm"),
            success: statusMap.SUCCESS || 0,
            failed: statusMap.FAILED || 0,
            warning: statusMap.WARNING || 0,
          };
        });
        setChartData(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [range]);

  const pieData =
    (summary?.topFailures || [])
      .slice(0, 6)
      .map((i) => ({ name: i._id, value: i.failCount })) || [];

  const COLORS = [
    "#06b6d4",
    "#f97316",
    "#ef4444",
    "#8b5cf6",
    "#22c55e",
    "#eab308",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Area Chart Card */}
      <div className="bg-slate-800 rounded-xl shadow-lg p-5 col-span-2">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">
          Success vs Failures
        </h3>
        {loading ? (
          <div className="flex justify-center items-center h-48 text-slate-400">
            Loading chart...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <XAxis dataKey="time" tick={{ fill: "#94a3b8" }} />
              <YAxis tick={{ fill: "#94a3b8" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "0.5rem",
                  color: "#fff",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="success"
                stackId="1"
                stroke="#06b6d4"
                fill="#0e7490"
              />
              <Area
                type="monotone"
                dataKey="failed"
                stackId="1"
                stroke="#ef4444"
                fill="#991b1b"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Pie Chart Card */}
      <div className="bg-slate-800 rounded-xl shadow-lg p-5">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">
          Failures by Interface
        </h3>
        {loading ? (
          <div className="flex justify-center items-center h-48 text-slate-400">
            Loading chart...
          </div>
        ) : pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {pieData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "0.5rem",
                  color: "#fff",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-slate-400 text-center">No failure data</div>
        )}
      </div>
    </div>
  );
}
