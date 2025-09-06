import { useEffect, useState } from "react";
import axios from "../api/axiosInstance"; // ✅ use your axiosInstance (with baseURL)

export default function AccountsExplorerPage() {
  const [dates, setDates] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [accountDetails, setAccountDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Fetch dates and accounts
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const [datesRes, accountsRes] = await Promise.all([
          axios.get("/Accounts/latest-dates"),
          axios.get("/Accounts/names"),
        ]);

        const datesData = datesRes.data || [];
        const accountsData = accountsRes.data || [];

        setDates(datesData);
        setAccounts(accountsData);

        // Pick first available date/account
        if (datesData.length > 0) setSelectedDate(datesData[0]);
        if (accountsData.length > 0) setSelectedAccount(accountsData[0]);
      } catch (err) {
        console.error("Failed to fetch accounts explorer lists", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  // Fetch account details when both are selected
  useEffect(() => {
    if (!selectedDate || !selectedAccount) return;

    const fetchDetails = async () => {
      setDetailsLoading(true);
      try {
        const res = await axios.get(
          `/Accounts/names/${encodeURIComponent(selectedAccount)}?date=${selectedDate}`
        );
        setAccountDetails(res.data);
      } catch (err) {
        console.error("Failed to fetch account details", err);
        setAccountDetails(null);
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchDetails();
  }, [selectedDate, selectedAccount]);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading Accounts Explorer...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">Accounts Explorer</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
        {/* Date Selector */}
        <div>
          <label htmlFor="date-select" className="block text-sm font-medium">
            Select Date
          </label>
          <select
            id="date-select"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 shadow-sm"
          >
            {dates.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Account Selector */}
        <div>
          <label htmlFor="account-select" className="block text-sm font-medium">
            Select Account
          </label>
          <select
            id="account-select"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1 shadow-sm"
          >
            {accounts.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Account Details */}
      <div>
        {detailsLoading && <p className="text-gray-500">Loading account details...</p>}

        {!detailsLoading && accountDetails && (
          <div className="p-6 rounded-xl shadow-md bg-white space-y-6">
            {/* Account Header */}
            <div className="border-b pb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {accountDetails.name}
              </h2>
              <p className="text-sm text-gray-500">As of {selectedDate}</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Cash</p>
                <p className="text-xl font-bold text-gray-900">
                  ${accountDetails.cash?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">Market Value</p>
                <p className="text-xl font-bold text-gray-900">
                  ${accountDetails.marketValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Holdings Table */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Holdings</h3>
              {accountDetails.holdings?.length > 0 ? (
                <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 text-left">
                    <tr>
                      <th className="px-4 py-2">Symbol</th>
                      <th className="px-4 py-2">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountDetails.holdings.map((h, i) => (
                      <tr
                        key={i}
                        className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-2 font-medium">{h.symbol}</td>
                        <td className="px-4 py-2">{h.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-sm">No holdings available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
