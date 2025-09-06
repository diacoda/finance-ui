// src/pages/AccountDetailsPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "../api/axiosInstance";

export default function AccountDetailsPage() {
  const { accountName } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const date = searchParams.get("date"); // optional ?date=YYYY-MM-DD

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      setLoading(true);
      try {
        const url = date
          ? `/accounts/names/${encodeURIComponent(accountName)}?date=${encodeURIComponent(date)}`
          : `/accounts/names/${encodeURIComponent(accountName)}`;

        const res = await axios.get(url);
        setAccount(res.data);
      } catch (err) {
        console.error("Failed to fetch account details:", err);
        alert("Failed to fetch account details.");
      } finally {
        setLoading(false);
      }
    };

    if (accountName) fetchAccount();
  }, [accountName, date]);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading account details...</p>;
  }
  if (!account) {
    return <p className="p-6 text-gray-500">No account found.</p>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 space-y-6">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium transition"
      >
        &larr; Back
      </button>

      {/* Header Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          {account.name}
        </h1>
        {date && <p className="text-gray-500">As of {date}</p>}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Cash</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            ${account.cash?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "0.00"}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Market Value</p>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            ${account.marketValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "0.00"}
          </p>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Holdings</h2>
        {!account.holdings || account.holdings.length === 0 ? (
          <p className="text-gray-500">No holdings for this account.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                    Symbol
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-300">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {account.holdings.map((h, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}
                  >
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {h.symbol}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 text-right">
                      {h.quantity?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "0.00"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
