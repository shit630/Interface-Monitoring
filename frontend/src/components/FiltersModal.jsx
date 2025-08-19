import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FiltersModal({ open, onClose, onApply }) {
  const [status, setStatus] = useState("All");
  const [interfaceName, setInterfaceName] = useState("");
  const [minDuration, setMinDuration] = useState("");
  const [maxDuration, setMaxDuration] = useState("");

  if (!open) return null;

  const handleApply = () => {
    const filters = {
      status,
      interfaceName,
      minDuration: minDuration ? Number(minDuration) : null,
      maxDuration: maxDuration ? Number(maxDuration) : null,
    };
    onApply(filters);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="filters-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="w-11/12 max-w-2xl p-6 bg-slate-800 rounded-xl shadow-lg text-slate-200">
              <h3
                id="filters-modal-title"
                className="text-lg font-semibold mb-4"
              >
                Advanced Filters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status */}
                <label className="block">
                  <span className="text-sm text-slate-400">Status</span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-2 mt-1 bg-slate-700 rounded-lg border border-slate-600 focus:ring-2 focus:ring-cyan-500"
                  >
                    <option>All</option>
                    <option>SUCCESS</option>
                    <option>FAILED</option>
                    <option>PENDING</option>
                  </select>
                </label>

                {/* Interface Name */}
                <label className="block">
                  <span className="text-sm text-slate-400">Interface Name</span>
                  <input
                    value={interfaceName}
                    onChange={(e) => setInterfaceName(e.target.value)}
                    className="w-full p-2 mt-1 bg-slate-700 rounded-lg border border-slate-600 focus:ring-2 focus:ring-cyan-500"
                    placeholder="Search interface"
                  />
                </label>

                {/* Min Duration */}
                <label className="block">
                  <span className="text-sm text-slate-400">
                    Min Duration (ms)
                  </span>
                  <input
                    type="number"
                    value={minDuration}
                    onChange={(e) => setMinDuration(e.target.value)}
                    className="w-full p-2 mt-1 bg-slate-700 rounded-lg border border-slate-600 focus:ring-2 focus:ring-cyan-500"
                  />
                </label>

                {/* Max Duration */}
                <label className="block">
                  <span className="text-sm text-slate-400">
                    Max Duration (ms)
                  </span>
                  <input
                    type="number"
                    value={maxDuration}
                    onChange={(e) => setMaxDuration(e.target.value)}
                    className="w-full p-2 mt-1 bg-slate-700 rounded-lg border border-slate-600 focus:ring-2 focus:ring-cyan-500"
                  />
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="px-4 py-2 cursor-pointer bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-medium transition"
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
