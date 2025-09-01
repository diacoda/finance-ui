/**
 * PricesByDatePage.jsx
 *
 * Displays historical prices for a selected date.
 * Features:
 * - Dropdown to select a date from available dates
 * - Table displaying symbol and price values
 * - Fetches prices from API for selected date
 * - Proper handling of loading states and controlled inputs
 */

import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";

export default function PricesByDatePage() {
  // --- State ---
  const [dates, setDates] = useState([]); // List of available dates
  const [selectedDate, setSelectedDate] = useState(""); // Currently selected date
  const [prices, setPrices] = useState([]); // List of prices for selected date
  const [loadingDates, setLoadingDates] = useState(true); // Loading indicator for dates
  const [loadingPrices, setLoadingPrices] = useState(false); // Loading indicator for prices

  /**
   * Fetch list of available dates from API
   */
  const fetchDates = async () => {
    setLoadingDates(true);
    try {
      const res = await axios.get("/accounts/latest-dates");
      setDates(res.data);

      // Auto-select the first date if none is selected
      if (!selectedDate && res.data.length > 0) {
        setSelectedDate(res.data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch dates:", err);
      alert("Failed to fetch available dates.");
    } finally {
      setLoadingDates(false);
    }
  };

  /**
   * Fetch prices for the selected date
   * @param {string} date - Date in YYYY-MM-DD format
   */
  const fetchPrices = async (date) => {
    if (!date) return;

    setLoadingPrices(true);
    try {
      const res = await axios.get(`/prices?asOf=${encodeURIComponent(date)}`);
      setPrices(res.data);
    } catch (err) {
      console.error(`Failed to fetch prices for ${date}:`, err);
      alert(`Failed to fetch prices for ${date}.`);
      setPrices([]);
    } finally {
      setLoadingPrices(false);
    }
  };

  // --- Effects ---
  // Fetch available dates on component mount
  useEffect(() => {
    fetchDates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Runs once

  // Fetch prices whenever selectedDate changes
  useEffect(() => {
    fetchPrices(selectedDate);
  }, [selectedDate]);

  // --- JSX Render ---
  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 space-y-6">
      <h1 className="text-3xl font-bold">Prices by Date</h1>

      {/* Date Selector */}
      <div className="flex items-center space-x-4">
        {loadingDates ? (
          <p>Loading dates...</p>
        ) : (
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          >
            {dates.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Prices Table */}
      {loadingPrices ? (
        <p>Loading prices for {selectedDate}...</p>
      ) : prices.length === 0 ? (
        <p>No prices available for {selectedDate}.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 mt-4">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                  Symbol
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-300">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {prices.map((p) => (
                <tr key={p.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{p.symbol}</td>
                  <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 text-right">
                    ${p.value.toLocaleString()}
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
