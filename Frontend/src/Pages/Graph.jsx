import React from "react";
import { useLocation } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Navbar from "../components/Navbar";

const StockChartPage = () => {
  const location = useLocation();
  const { stocks } = location.state || { stocks: [] }; // Get stock data from navigation

  // Convert data for the chart
  const chartData = stocks.map((stock) => ({
    name: stock.name,
    Quantity: Number(stock.quantity),
    Price: Number(stock.price),
  }));

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-10">
        <h2 className="text-2xl font-bold mb-6">Stock Data Visualization</h2>
        <div className="w-full max-w-3xl h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Quantity" fill="#8884d8" />
              <Bar dataKey="Price" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default StockChartPage;
