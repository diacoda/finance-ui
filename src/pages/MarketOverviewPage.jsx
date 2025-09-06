// src/pages/MarketOverviewPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import Card from "../components/Card";

export default function MarketOverviewPage() {
  const navigate = useNavigate();

  // --- State ---
  const [selectedDate, setSelectedDate] = useState(""); // date selected from history
  const [availableDates, setAvailableDates] = useState([]);

  const [summary, setSummary] = useState({
    total: 0,
    byOwner: [],
    byOwnerFilter: [],
    byOwnerTypeAccounts: [],
  });

  const [loadingSummary, setLoadingSummary] = useState(true);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyLength, setHistoryLength] = useState(7);

  // --- Fetch available dates ---
  useEffect(() => {
    const fetchDates = async () => {
      try {
        const res = await axios.get("/accounts/latest-dates");
        setAvailableDates(res.data);
        if (res.data.length > 0) setSelectedDate(res.data[0]);
      } catch (err) {
        console.error("Failed to fetch available dates:", err);
        alert("Failed to fetch available dates.");
      }
    };
    fetchDates();
  }, []);

  // --- Fetch Market Summary ---
  useEffect(() => {
    if (!selectedDate) return;

    const fetchSummary = async () => {
      setLoadingSummary(true);
      try {
        const endpoints = [
          `/portfolio/total?asOf=${encodeURIComponent(selectedDate)}`,
          `/portfolio/by-owner?asOf=${encodeURIComponent(selectedDate)}`,
          `/portfolio/by-owner-filter?asOf=${encodeURIComponent(selectedDate)}`,
          `/portfolio/by-owner-type-accountname?asOf=${encodeURIComponent(selectedDate)}`,
        ];

        const [totalRes, byOwnerRes, byOwnerFilterRes, byOwnerTypeAccountsRes] =
          await Promise.all(endpoints.map((url) => axios.get(url)));

        setSummary({
          total: totalRes.data ?? 0,
          byOwner: byOwnerRes.data ?? [],
          byOwnerFilter: byOwnerFilterRes.data ?? [],
          byOwnerTypeAccounts: byOwnerTypeAccountsRes.data ?? [],
        });
      } catch (err) {
        console.error("Failed to fetch market summary:", err);
        alert("Failed to fetch market summary.");
      } finally {
        setLoadingSummary(false);
      }
    };

    fetchSummary();
  }, [selectedDate]);

  // --- Fetch Historical Market Data ---
  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const res = await axios.get(`/history?days=${historyLength}`);
        setHistory(res.data ?? []);
      } catch (err) {
        console.error("Failed to load history:", err);
        alert("Failed to load history.");
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [historyLength]);

  if (!selectedDate || loadingSummary || loadingHistory)
    return <p className="p-6">Loading market overview...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 space-y-6">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium transition"
      >
        &larr; Back
      </button>

      <h1 className="text-3xl font-bold">Market Overview — {selectedDate}</h1>

      {/* --- Top Summary Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Total Market Value */}
        <Card title="Total Market Value">
          <p className="text-lg font-semibold">
            ${summary.total.toLocaleString()}
          </p>

          <h2 className="font-semibold text-lg mt-4 mb-2">By Owner</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <tbody>
                {Object.entries(summary.byOwner).map(([owner, value]) => (
                  <tr key={owner} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2">{owner}</td>
                    <td className="px-4 py-2 text-right">
                      ${value?.toLocaleString() ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Detailed Summary */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* By Owner & Filter */}
          <Card title="By Owner & Filter">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <tbody>
                  {summary.byOwnerFilter.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-2">{item.owner}</td>
                      <td className="px-4 py-2">{item.accountFilter}</td>
                      <td className="px-4 py-2 text-right">
                        ${item.total?.toLocaleString() ?? 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* By Owner & Type (+ Accounts) */}
          <Card title="By Owner, Type & Accounts">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <tbody>
                  {summary.byOwnerTypeAccounts.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-2 align-top">{item.owner}</td>
                      <td className="px-4 py-2 align-top">{item.type}</td>
                      <td className="px-4 py-2 text-right align-top">
                        <div className="font-semibold">
                          ${item.total?.toLocaleString() ?? 0}
                        </div>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                          {item.accountNames?.map((name, i) => (
                            <div key={i}>
                              <a
                                href={`/account/${encodeURIComponent(name)}?date=${encodeURIComponent(selectedDate)}`}
                                className="hover:underline"
                              >
                                {name}
                              </a>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

        </div>
      </div>

      {/* --- Historical Market Data --- */}
      <div className="mt-6 space-y-4">
        <h2 className="text-2xl font-bold">Historical Market Values</h2>

        {/* History Length Selector */}
        <div className="flex items-center space-x-2">
          <label htmlFor="historyLength" className="font-medium">Days:</label>
          <select
            id="historyLength"
            value={historyLength}
            onChange={(e) => setHistoryLength(Number(e.target.value))}
            className="px-2 py-1 border rounded dark:bg-gray-700 dark:text-white"
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-right">Market Value</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <tr key={item.asOf} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2">{item.asOf}</td>
                  <td className="px-4 py-2 text-right">
                    {item.marketValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
