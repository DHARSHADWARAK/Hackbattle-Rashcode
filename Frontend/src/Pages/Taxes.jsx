import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function TaxCalculator() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please upload a file");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/calculate-tax", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(response.data);
    } catch (error) {
      setError("Error calculating tax. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const TITLE = 'TAXES';

  return (
    <>
      <Navbar/>
    
      <section className="font-suse text-md p-4 md:p-6 text-lg">
      <div className="text-3xl font-black text-gray-400 pb-2">{TITLE}</div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".csv,.xlsx"
          className="mb-4 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600"
        >
          {loading ? "Calculating..." : "Upload & Calculate"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {result && (
        <div className="bg-white p-6 mt-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Tax Calculation Result</h2>
          <div className="space-y-2">
            <p><strong>Financial Year:</strong> {result.financial_year}</p>
            <p><strong>Total Income:</strong> ₹{result.total_income.toLocaleString()}</p>
            <p><strong>Total Deductions:</strong> ₹{result.total_deductions.toLocaleString()}</p>
            <p><strong>Old Regime Tax:</strong> ₹{result.old_regime_tax.toLocaleString()}</p>
            <p><strong>New Regime Tax:</strong> ₹{result.new_regime_tax.toLocaleString()}</p>
            <p><strong>Tax Savings:</strong> ₹{result.tax_savings.toLocaleString()}</p>
            <p><strong>Recommended Regime:</strong> {result.recommended_regime}</p>
          </div>
        </div>
      )}
    </section>
    </>
  );
}
