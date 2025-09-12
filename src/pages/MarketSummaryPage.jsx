// src/pages/MarketSummaryPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import Card from "../components/Card";

export default function MarketSummaryPage() {
  const { date } = useParams();
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    total: null,
    byOwner: [],
    byOwnerFilter: [],
    //byOwnerType: [],
    byOwnerTypeAccounts: [], // new data
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);

      try {
        const endpoints = [
          `/portfolio/total?asOf=${date}`,
          `/portfolio/by-owner?asOf=${date}`,
          `/portfolio/by-owner-filter?asOf=${date}`,
          `/portfolio/by-owner-type-accountname?asOf=${date}`, // NEW
        ];

        const [
          totalRes,
          byOwnerRes,
          byOwnerFilterRes,
          //byOwnerTypeRes,
          byOwnerTypeAccountsRes,
        ] = await Promise.all(endpoints.map((url) => axios.get(url)));

        setSummary({
          total: totalRes.data,
          byOwner: byOwnerRes.data,
          byOwnerFilter: byOwnerFilterRes.data,
          //byOwnerType: byOwnerTypeRes.data,
          byOwnerTypeAccounts: byOwnerTypeAccountsRes.data,
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

  if (loading) return <p className="p-6">Loading market summary for {date}...</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 space-y-6">

      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium transition"
      >
        &larr; Back
      </button>

      <h1 className="text-3xl font-bold">Market Summary — {date}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Total Market Value */}
        <Card title="Total Market Value">
          <p className="text-lg font-semibold">${summary.total.toLocaleString()}</p>

          <h2 className="font-semibold text-lg mt-4 mb-2">By Owner</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">Owner</th>
                  <th className="px-4 py-2 text-right text-sm font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(summary.byOwner).map(([owner, value]) => (
                  <tr key={owner} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2">{owner}</td>
                    <td className="px-4 py-2 text-right">${value.toLocaleString()}</td>
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
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Owner</th>
                    <th className="px-4 py-2 text-left">Filter</th>
                    <th className="px-4 py-2 text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.byOwnerFilter.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-2">{item.owner}</td>
                      <td className="px-4 py-2">{item.accountFilter}</td>
                      <td className="px-4 py-2 text-right">${item.total.toLocaleString()}</td>
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
      <thead>
        <tr>
          <th className="px-4 py-2 text-left">Owner</th>
          <th className="px-4 py-2 text-left">Type</th>
          <th className="px-4 py-2 text-right">Value & Accounts</th>
        </tr>
      </thead>
      <tbody>
        {summary.byOwnerTypeAccounts.map((item, idx) => (
          <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-4 py-2 align-top">{item.owner}</td>
            <td className="px-4 py-2 align-top">{item.type}</td>
            <td className="px-4 py-2 text-right align-top">
              {/* Value */}
              <div className="font-semibold">
                ${item.total.toLocaleString()}
              </div>

              {/* Account Names (small font, wrapped) */}
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                {item.accountNames.map((name, i) => (
                  <div key={i}>
                    <a
                      href={`/account/${encodeURIComponent(name)}?date=${encodeURIComponent(date)}`}
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
    </div>
  );
}
