/**
 * DatesPage.jsx
 *
 * Displays a list of available market summary dates.
 * Allows users to:
 * - Request today's market summary
 * - Request a summary for a specific date
 * - Delete existing summaries
 *
 * Uses axios for API calls and React Router for navigation.
 */

// src/pages/DatesPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axiosInstance";

export default function DatesPage() {
  // --- State variables ---
  const [dates, setDates] = useState([]);             // List of available summary dates
  const [loading, setLoading] = useState(true);       // Loading state for fetching dates
  const [requesting, setRequesting] = useState(false);// Loading state for requests
  const [deletingIds, setDeletingIds] = useState(new Set()); // Track currently deleting summaries
  const [selectedDate, setSelectedDate] = useState("");      // Date selected by user for request

  // --- Fetch all available summary dates from the API ---
  const fetchDates = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/accounts/latest-dates");
      setDates(res.data);
    } catch (err) {
      console.error("Failed to fetch dates:", err);
      alert("Failed to fetch dates.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch dates on component mount
  useEffect(() => {
    fetchDates();
  }, []);

  // --- Request today's market summary ---
  const requestToday = async () => {
    setRequesting(true);
    try {
      await axios.post("/accounts/summaries");
      alert("Today's market data requested!");
      await fetchDates(); // Refresh dates after request
    } catch (err) {
      console.error("Failed to request today's data:", err);
      alert("Failed to request today's data.");
    } finally {
      setRequesting(false);
    }
  };

  // --- Request market summary for a specific date ---
  const requestDate = async () => {
    if (!selectedDate) return alert("Please select a date.");
    setRequesting(true);
    try {
      await axios.post(`/accounts/summaries?asOf=${encodeURIComponent(selectedDate)}`);
      alert(`Market data requested for ${selectedDate}!`);
      await fetchDates(); // Refresh dates after request
    } catch (err) {
      console.error(`Failed to request data for ${selectedDate}:`, err);
      alert("Failed to request market data.");
    } finally {
      setRequesting(false);
    }
  };

  // --- Delete a summary for a given date ---
  const deleteSummary = async (date) => {
    // Confirm deletion with user
    if (!window.confirm(`Are you sure you want to delete the summary for ${date}?`)) return;

    // Mark as deleting
    setDeletingIds((prev) => new Set(prev).add(date));

    try {
      const res = await axios.delete(`/accounts/summaries?asOf=${encodeURIComponent(date)}`);
      alert(`Deleted ${res.data.deleted} summaries for ${res.data.date}`);
      await fetchDates(); // Refresh dates after deletion
    } catch (err) {
      console.error("Failed to delete summary:", err);
      alert("Failed to delete summary.");
    } finally {
      // Remove from deleting state
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(date);
        return newSet;
      });
    }
  };

  // --- Render component ---
  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 space-y-6">
      <h1 className="text-3xl font-bold">Market Summaries</h1>

      {/* --- Action Buttons --- */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 mb-4">
        {/* Request today's summary */}
        <button
          onClick={requestToday}
          disabled={requesting}
          className={`px-4 py-2 rounded-lg font-medium text-white transition
            ${requesting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {requesting ? "Requesting Today..." : "Request Today’s Market Data"}
        </button>

        {/* Request summary for a specific date */}
        <div className="flex space-x-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2 py-1 rounded border"
          />
          <button
            onClick={requestDate}
            disabled={requesting}
            className={`px-4 py-2 rounded-lg font-medium text-white transition
              ${requesting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
          >
            {requesting ? "Requesting..." : "Request for Date"}
          </button>
        </div>
      </div>

      {/* --- Dates List --- */}
      {loading ? (
        <p>Loading dates...</p>
      ) : dates.length === 0 ? (
        <p>No dates available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {dates.map((d) => (
            <div
              key={d}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex justify-between items-center"
            >
              {/* Link to Market Summary page for the date */}
              <Link
                to={`/summary/${encodeURIComponent(d)}`}
                className="font-semibold text-lg text-gray-900 dark:text-gray-100 hover:underline"
              >
                Summary {d}
              </Link>

              {/* Delete button */}
              <button
                onClick={() => deleteSummary(d)}
                disabled={deletingIds.has(d)}
                className={`ml-2 w-7 h-7 flex items-center justify-center rounded-full text-white transition
                  ${deletingIds.has(d) ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
                title="Delete Summary"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
