/**
 * MarketSummaryPage.jsx
 *
 * Displays a detailed market summary for a given date.
 * Features:
 * - Total market value
 * - Market value by owner
 * - Market value by owner & filter
 * - Market value by owner & type
 * - Back button navigation
 *
 * Fetches multiple endpoints simultaneously using Promise.all for performance.
 */
// src/pages/MarketSummaryPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import Card from "../components/Card";

export default function MarketSummaryPage() {
  const { date } = useParams(); // Get date from URL params
  const navigate = useNavigate(); // Hook to navigate programmatically

  // --- State ---
  const [summary, setSummary] = useState({
    total: null,         // Total market value
    byOwner: [],         // Object mapping owner => value
    byOwnerFilter: [],   // Array of objects: { owner, accountFilter, total }
    byOwnerType: [],     // Array of objects: { owner, type, total }
  });

  const [loading, setLoading] = useState(true); // Loading indicator

  /**
   * Fetch all market summary endpoints for the given date
   */
  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);

      try {
        // Define all endpoints to fetch
        const endpoints = [
          `/portfolio/total?asOf=${date}`,
          `/portfolio/by-owner?asOf=${date}`,
          `/portfolio/by-owner-filter?asOf=${date}`,
          `/portfolio/by-owner-type?asOf=${date}`,
        ];

        // Fetch all endpoints in parallel
        const [totalRes, byOwnerRes, byOwnerFilterRes, byOwnerTypeRes] = await Promise.all(
          endpoints.map((url) => axios.get(url))
        );

        // Update summary state with fetched data
        setSummary({
          total: totalRes.data,
          byOwner: byOwnerRes.data,
          byOwnerFilter: byOwnerFilterRes.data,
          byOwnerType: byOwnerTypeRes.data,
        });
      } catch (err) {
        console.error("Failed to fetch market summary:", err);
        alert("Failed to fetch market summary.");
      } finally {
        setLoading(false);
      }
    };

    if (date) fetchSummary();
  }, [date]);

  // --- Loading state ---
  if (loading) return <p className="p-6">Loading market summary for {date}...</p>;

  // --- JSX Render ---
  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 space-y-6">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium transition"
      >
        &larr; Back
      </button>

      {/* Page Heading */}
      <h1 className="text-3xl font-bold">Market Summary — {date}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Total Market Value Card */}
        <Card title="Total Market Value">
          <p className="text-lg font-semibold">${summary.total.toLocaleString()}</p>
          <p></p>
          <h2 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">By Owner</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Owner</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-300">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {Object.entries(summary.byOwner).map(([owner, value]) => (
                    <tr key={owner} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{owner}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 text-right">
                        ${value.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </Card>

        {/* Detailed Summary Cards */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">


          {/* By Owner & Filter */}
          <Card title="By Owner & Filter">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Owner</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Filter</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-300">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {summary.byOwnerFilter.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{item.owner}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{item.accountFilter}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 text-right">
                        ${item.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* By Owner & Type */}
          <Card title="By Owner & Type">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Owner</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Type</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-300">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {summary.byOwnerType.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{item.owner}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{item.type}</td>
                      <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 text-right">
                        ${item.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
