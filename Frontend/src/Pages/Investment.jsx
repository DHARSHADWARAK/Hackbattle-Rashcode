import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import Navbar from '../components/Navbar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Investment = () => {
  const TITLE = 'INVESTMENT';

  // State variables
  const [years, setYears] = useState(10);
  const [age, setAge] = useState(25);
  const [selectedFunds, setSelectedFunds] = useState([]);
  const [investmentData, setInvestmentData] = useState({
    sahil: Array.from({ length: 10 }, (_, i) => 10000 + i * 500),  // Example data for Sahil
    funda: Array.from({ length: 10 }, (_, i) => 12000 + i * 600),  // Example data for Fund A
    fundb: Array.from({ length: 10 }, (_, i) => 11000 + i * 550),  // Example data for Fund B
  });

  const availableFunds = ['Sahil', 'Fund A', 'Fund B'];

  // Handle fund selection
  const handleFundSelection = (fund) => {
    setSelectedFunds((prevSelectedFunds) =>
      prevSelectedFunds.includes(fund)
        ? prevSelectedFunds.filter((selectedFund) => selectedFund !== fund)
        : [...prevSelectedFunds, fund]
    );
  };

  // Dynamically generate chart data
  const chartData = {
    labels: Array.from({ length: years }, (_, i) => i + 1),
    datasets: selectedFunds.map((fund, idx) => ({
      label: `${fund} Returns`,
      data: investmentData[fund.toLowerCase().replace(/\s/g, '')] || [], // Handle spaces in fund names
      borderColor: `rgba(${100 + idx * 50}, ${150 - idx * 30}, ${255 - idx * 40}, 0.6)`,
      pointRadius: 2, // Points only
      pointBackgroundColor: `rgba(${100 + idx * 50}, ${150 - idx * 30}, ${255 - idx * 40}, 0.6)`,
      fill: false,
      showLine: true, // Only display points, no line
    })),
  };

  return (
    <>
      <Navbar />
      <section className="font-suse text-md p-4 md:p-6 text-lg">
        <div className="text-3xl font-black text-gray-400 pb-2">{TITLE}</div>
        
        {/* Top: Summary */}
        <div className="bg-gray-100 p-4 rounded shadow-md mb-4">
          <div className="flex justify-between">
            <div>
              <p>Years of Investment: {years}</p>
              <p>Age: {age}</p>
            </div>
            <div>
              <p>Selected Funds: {selectedFunds.join(', ') || 'None'}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Left side: Display graph and points */}
          <div className="md:w-1/2 bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Investment Growth Points</h2>
            <Line data={chartData} />
          </div>

          {/* Right side: Plotted points summary */}
          <div className="md:w-1/2 bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Plotted Points</h2>
            <div className="grid grid-cols-3 gap-4">
              {/* Sahil */}
              {selectedFunds.includes('Sahil') && (
                <div>
                  <h3 className="font-bold">Sahil:</h3>
                  <ul>
                    {investmentData.sahil.map((value, index) => (
                      <li key={index}>Year {index + 1}: {value}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Fund A */}
              {selectedFunds.includes('Fund A') && (
                <div>
                  <h3 className="font-bold">Fund A:</h3>
                  <ul>
                    {investmentData.funda.map((value, index) => (
                      <li key={index}>Year {index + 1}: {value}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Fund B */}
              {selectedFunds.includes('Fund B') && (
                <div>
                  <h3 className="font-bold">Fund B:</h3>
                  <ul>
                    {investmentData.fundb.map((value, index) => (
                      <li key={index}>Year {index + 1}: {value}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom: Inputs */}
        <div className="bg-white p-4 mt-4 rounded shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Years of Investment:</label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full p-2 border rounded"
              placeholder="Enter number of years"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Age:</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full p-2 border rounded"
              placeholder="Enter your age"
            />
          </div>

          {/* Custom Checkbox Group */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Select Mutual Funds:</label>
            {availableFunds.map((fund, idx) => (
              <label key={idx} className="inline-flex items-center mb-2  cursor-pointer">
                <input
                  type="checkbox"
                  value={fund}
                  checked={selectedFunds.includes(fund)}
                  onChange={() => handleFundSelection(fund)}
                  className="hidden"
                />
                <span className="custom-checkbox w-5 h-5 ml-5 border border-gray-300 rounded flex items-center justify-center">
                  {selectedFunds.includes(fund) && (
                    <span className="block w-5 h-5 rounded-sm bg-black"></span>
                  )}
                </span>
                <span className="ml-2">{fund}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* CSS for custom black checkbox */}
      <style jsx>{`
        .custom-checkbox {
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default Investment;
