import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchStocks = async () => {
    console.log("[DEBUG] fetchStocks called...");
    try {
      console.log("[DEBUG] Making GET request to /stocks/user...");
      const res = await fetch("http://localhost:5000/stocks/user", {
        credentials: "include", // ensure cookies are sent for auth
      });
      console.log("[DEBUG] Received response:", res);

      if (!res.ok) {
        throw new Error("Not authenticated or error fetching stocks");
      }

      const data = await res.json();
      console.log("[DEBUG] Response JSON from /stocks/user:", data);

      setStocks(data.stocks || []);
      console.log("[DEBUG] Setting state 'stocks' to:", data.stocks);
    } catch (err) {
      console.error("[DEBUG] Error in fetchStocks:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // Add stock handler
  const handleAddStock = async () => {
    try {
      setError("");
      if (!symbol || !buyPrice || !quantity) {
        return setError("All fields are required");
      }

      const payload = {
        symbol,
        buyPrice: Number(buyPrice),
        quantity: Number(quantity),
      };

      const res = await fetch("http://localhost:5000/stocks/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error adding stock");
      }

      // Clear input fields
      setSymbol("");
      setBuyPrice("");
      setQuantity("");

      // Refresh the list
      fetchStocks();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Delete stock handler
  const handleDelete = async (stockSymbol) => {
    try {
      const res = await fetch(`http://localhost:5000/stocks/delete/${stockSymbol}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error deleting stock");
      }
      // Refresh the list
      fetchStocks();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Logout (optional)
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
        credentials: "include",
      });
      // Possibly redirect to login page
      navigate("/auth"); 
    } catch (err) {
      console.error(err);
      setError("Error logging out");
    }
  };

  // Prepare data for the chart
  // We can show "symbol" vs. "currentValue" if we have it.
  // If the backend is returning only buyPrice, you can fetch the updated price from /profitloss or store them in the same array.
  // For demonstration, let's assume each stock in `stocks` has `symbol`, `quantity`, `buyPrice`, `currentPrice`, `profit`, `currentValue`.
  // If you only have partial data, adapt accordingly.
  const chartData = stocks.map((s) => ({
    symbol: s.symbol,
    currentValue: s.currentValue || 0, // fallback if missing
  }));

  return (
    <div className="p-4">
      <Navbar/>

      <div className="mb-4">
        <p className="text-gray-700">Your email: {stocks?.[0]?.userEmail || "Unknown"}</p>
      </div>

      <div className="flex gap-2 items-center mb-4">
        <input
          type="text"
          placeholder="Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="border p-1 rounded"
        />
        <input
          type="number"
          placeholder="Buy Price"
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          className="border p-1 rounded"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border p-1 rounded"
        />
        <button onClick={handleAddStock} className="bg-black text-white px-3 py-1 rounded">
          Add Stock
        </button>
      </div>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      {/* Stocks Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-4 py-2 text-left">Symbol</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Buy Price</th>
              <th className="px-4 py-2 text-left">Current Price</th>
              <th className="px-4 py-2 text-left">Profit/Loss</th>
              <th className="px-4 py-2 text-left">Current Value</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{stock.symbol}</td>
                <td className="px-4 py-2">{stock.quantity}</td>
                <td className="px-4 py-2">{stock.buyPrice}</td>
                <td className="px-4 py-2">
                  {stock.currentPrice !== undefined ? stock.currentPrice : "N/A"}
                </td>
                <td className="px-4 py-2">
                  {stock.profit !== undefined ?   stock.profit : "N/A"}
                </td>
                <td className="px-4 py-2">
                  {stock.currentValue !== undefined ? stock.currentValue : "N/A"}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(stock.symbol)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {stocks.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No stocks found. Add one above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Chart Section */}
      <h2 className="text-xl font-bold mt-8 mb-2">Your Portfolio Value</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="symbol" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="currentValue" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
