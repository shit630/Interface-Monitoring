import React from "react";
import { formatDistanceToNowStrict } from "date-fns";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaChartLine,
} from "react-icons/fa";

export default function SummaryCards({ data }) {
  const totals = data?.totals || { total: 0, avgDuration: 0 };
  const byStatus = (data?.byStatus || []).reduce(
    (acc, s) => ((acc[s._id] = s.count), acc),
    {}
  );

  const successCount = byStatus["SUCCESS"] || 0;
  const failedCount = byStatus["FAILED"] || 0;
  const successRate = totals.total
    ? Math.round((successCount / totals.total) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Executions */}
      <div className="p-5 rounded-xl shadow-lg bg-gradient-to-br from-cyan-900/40 to-cyan-700/20 border border-cyan-500/20 hover:shadow-cyan-500/30 transition-all">
        <div className="flex items-center gap-3 mb-2">
          <FaChartLine className="text-cyan-400 text-xl" />
          <span className="text-sm text-gray-400">Total Executions</span>
        </div>
        <div className="text-3xl font-bold text-white">{totals.total}</div>
        <div className="text-xs text-gray-500 mt-1">
          Updated {formatDistanceToNowStrict(new Date(), { addSuffix: true })}
        </div>
      </div>

      {/* Success Rate */}
      <div className="p-5 rounded-xl shadow-lg bg-gradient-to-br from-emerald-900/40 to-emerald-700/20 border border-emerald-500/20 hover:shadow-emerald-500/30 transition-all">
        <div className="flex items-center gap-3 mb-2">
          <FaCheckCircle className="text-emerald-400 text-xl" />
          <span className="text-sm text-gray-400">Success Rate</span>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 flex items-center justify-center rounded-full font-bold text-white text-lg"
            style={{
              background: `conic-gradient(#06b6d4 ${
                successRate * 3.6
              }deg, rgba(6,182,212,0.2) 0deg)`,
              transition: "background 0.5s ease",
            }}
          >
            {successRate}%
          </div>
          <div className="text-sm text-gray-400">of all executions</div>
        </div>
      </div>

      {/* Failed Executions */}
      <div className="p-5 rounded-xl shadow-lg bg-gradient-to-br from-red-900/40 to-red-700/20 border border-red-500/20 hover:shadow-red-500/30 transition-all">
        <div className="flex items-center gap-3 mb-2">
          <FaTimesCircle className="text-red-400 text-xl" />
          <span className="text-sm text-gray-400">Failed Executions</span>
        </div>
        <div className="text-3xl font-bold text-red-400">{failedCount}</div>
        <div className="text-xs text-gray-500 mt-1">
          Critical failures highlighted separately
        </div>
      </div>

      {/* Average Processing Time */}
      <div className="p-5 rounded-xl shadow-lg bg-gradient-to-br from-indigo-900/40 to-indigo-700/20 border border-indigo-500/20 hover:shadow-indigo-500/30 transition-all">
        <div className="flex items-center gap-3 mb-2">
          <FaClock className="text-indigo-400 text-xl" />
          <span className="text-sm text-gray-400">Avg Processing Time</span>
        </div>
        <div className="text-3xl font-bold text-white">
          {Math.round(totals.avgDuration || 0)} ms
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Compare to previous period
        </div>
      </div>
    </div>
  );
}
