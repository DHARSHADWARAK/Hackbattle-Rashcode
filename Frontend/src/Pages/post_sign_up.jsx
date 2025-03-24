import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const StockForm = () => {
  const [stocks, setStocks] = useState([{ id: 1, name: "", quantity: "", price: "" }]);
  const navigate = useNavigate();

  const addStock = () => {
    setStocks([...stocks, { id: stocks.length + 1, name: "", quantity: "", price: "" }]);
  };

  const handleChange = (index, field, value) => {
    const updatedStocks = [...stocks];
    updatedStocks[index][field] = value;
    setStocks(updatedStocks);
  };

  const handleSubmit = () => {
    // Navigate to the stock chart page with stock data
    navigate("/stock-chart", { state: { stocks } });
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-10">
        <div className="bg-white p-6 shadow-lg rounded-lg w-96">
          <h2 className="text-lg font-semibold mb-4">Enter Stock Details</h2>

          {stocks.map((stock, index) => (
            <div key={stock.id} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Stock Name"
                value={stock.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                className="border p-2 rounded w-1/3"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={stock.quantity}
                onChange={(e) => handleChange(index, "quantity", e.target.value)}
                className="border p-2 rounded w-1/3"
              />
              <input
                type="number"
                placeholder="Price"
                value={stock.price}
                onChange={(e) => handleChange(index, "price", e.target.value)}
                className="border p-2 rounded w-1/3"
              />
            </div>
          ))}

          <div className="flex justify-between mt-4">
            <button className="text-gray-500 hover:underline">Skip for now</button>
            <div>
              <button onClick={addStock} className="bg-black mr-4 text-white px-4 py-2 rounded">
                Add Stock
              </button>
              <button onClick={handleSubmit} className="bg-black text-white px-4 py-2 rounded">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StockForm;
