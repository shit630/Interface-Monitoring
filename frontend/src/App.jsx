import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react"; // Modern icons
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-950 text-gray-100"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Sticky Header */}
        <header className="flex items-center justify-between mb-6 sticky top-0 z-50 backdrop-blur-sm bg-opacity-80 border-b border-gray-700 dark:border-gray-800 p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight">
            Interface Monitoring
          </h1>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all"
          >
            {theme === "dark" ? (
              <>
                <Sun size={18} /> Light Mode
              </>
            ) : (
              <>
                <Moon size={18} /> Dark Mode
              </>
            )}
          </button>
        </header>

        {/* Main Dashboard */}
        <Dashboard />
      </div>
    </div>
  );
}
