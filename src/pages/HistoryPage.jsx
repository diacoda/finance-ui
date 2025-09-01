/**
 * HistoryPage.jsx
 *
 * Displays historical market data for a configurable number of days.
 * Users can:
 * - Select the history length (number of days) to display
 * - View a table of dates with corresponding market values
 *
 * Uses axios for API calls.
 */

// src/pages/HistoryPage.jsx

import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";

export default function HistoryPage() {
  // --- State variables ---
  const [history, setHistory] = useState([]);        // Array of historical data objects
  const [loading, setLoading] = useState(true);      // Loading state for fetching history
  const [historyLength, setHistoryLength] = useState(7); // Default number of days to display

  /**
   * Fetch history data from API for a given number of days.
   * @param {number} length - Number of days to fetch
   */
  const fetchHistory = async (length) => {
    setLoading(true);
    try {
      const res = await axios.get(`/history?days=${length}`);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history:", err);
      alert("Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch history when component mounts or historyLength changes
  useEffect(() => {
    fetchHistory(historyLength);
  }, [historyLength]);

  // --- Render component ---
  if (loading) return <p className="p-6">Loading market history...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 space-y-6">
      <h1 className="text-3xl font-bold">History</h1>

      {/* --- History Length Selector --- */}
      <div className="space-y-2">
        <label htmlFor="historyLength" className="block font-medium">
          History Length:
        </label>
        <select
          id="historyLength"
          value={historyLength}
          onChange={(e) => setHistoryLength(Number(e.target.value))}
          className="p-2 border rounded bg-white dark:bg-gray-800"
        >
          {/* Generate options from 1 to 30 */}
          {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* --- History Table --- */}
      {history.length === 0 ? (
        <p>No items to display.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 divide-y divide-gray-200 dark:border-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Market Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {history.map((item, idx) => (
                <tr
                  key={item.asOf}
                  className={
                    idx % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                >
                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {item.asOf}
                  </td>
                  {/* Market Value */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 text-right">
                    {item.marketValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
