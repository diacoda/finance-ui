// src/pages/PricesByDatePage.jsx
import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";

export default function PricesByDatePage() {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [prices, setPrices] = useState([]);
  const [loadingDates, setLoadingDates] = useState(true);
  const [loadingPrices, setLoadingPrices] = useState(false);

  const fetchDates = async () => {
    setLoadingDates(true);
    try {
      const res = await axios.get("/accounts/latest-dates");
      setDates(res.data);
      if (!selectedDate && res.data.length > 0) {
        setSelectedDate(res.data[0]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch available dates.");
    } finally {
      setLoadingDates(false);
    }
  };

  const fetchPrices = async (date) => {
    if (!date) return;
    setLoadingPrices(true);
    try {
      const res = await axios.get(`/prices?asOf=${encodeURIComponent(date)}`);
      // map to add temporary local value for editing
      setPrices(res.data.map(p => ({ ...p, editedValue: p.value })));
    } catch (err) {
      console.error(err);
      alert(`Failed to fetch prices for ${date}.`);
      setPrices([]);
    } finally {
      setLoadingPrices(false);
    }
  };

  useEffect(() => {
    fetchDates();
  }, []);

  useEffect(() => {
    fetchPrices(selectedDate);
  }, [selectedDate]);

  const handleChange = (symbol, newValue) => {
    setPrices(prev =>
      prev.map(p => (p.symbol === symbol ? { ...p, editedValue: newValue } : p))
    );
  };

  const handleSave = async (symbol, value) => {
    try {
      await axios.post("/prices", {
        symbol,
        date: selectedDate,
        value: parseFloat(value),
      });
      alert(`Price for ${symbol} saved!`);
      // Update the displayed value
      setPrices(prev =>
        prev.map(p => (p.symbol === symbol ? { ...p, value: parseFloat(value) } : p))
      );
    } catch (err) {
      console.error(err);
      alert(`Failed to save price for ${symbol}`);
    }
  };

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
            {dates.map(d => (
              <option key={d} value={d}>{d}</option>
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
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">Symbol</th>
                <th className="px-4 py-2 text-right text-sm font-medium">Price</th>
                <th className="px-4 py-2 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {prices.map(p => (
                <tr key={p.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2">{p.symbol}</td>
                  <td className="px-4 py-2 text-right">
                    <input
                      type="number"
                      value={p.editedValue}
                      onChange={(e) => handleChange(p.symbol, e.target.value)}
                      className="w-24 text-right px-2 py-1 border rounded dark:bg-gray-700 dark:text-white"
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleSave(p.symbol, p.editedValue)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
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
