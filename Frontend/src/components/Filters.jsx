import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const Filters = () => {
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.error("No file selected");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const processedTransactions = worksheet.map((row, index) => ({
        sNo: index + 1,
        date: row.date,
        name: row.name,
        withdrawalAmt: row.withdrawal_amt,
        depositAmt: row.deposit_amt,
        closingBalance: row.closing_balance
      }));

      const uniqueCustomers = [...new Set(processedTransactions.map(t => t.name))].map(name => ({
        name,
        transactions: processedTransactions.filter(t => t.name === name),
      }));

      setTransactions(processedTransactions);
      setCustomers(uniqueCustomers);
      setIsFileUploaded(true);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-start py-4">
        {/* Left Filter Panel */}
        <div className="w-1/4 bg-white p-4 shadow rounded">
          <h2 className="font-bold text-lg mb-4">Filters</h2>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="mb-4 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
          />
          <select
            className="w-full p-2 border border-gray-300 rounded"
            onChange={(e) => setSelectedCustomer(customers.find(c => c.name === e.target.value))}
            value={selectedCustomer?.name || ""}
          >
            <option disabled>Select Customer</option>
            {customers.map((customer) => (
              <option key={customer.name} value={customer.name}>{customer.name}</option>
            ))}
          </select>
        </div>

        {/* Right Details Panel */}
        <div className="w-3/4 bg-white p-4 shadow rounded ml-4">
          <h2 className="font-bold text-lg mb-4">Customer Details</h2>
          {selectedCustomer ? (
            <div>
              <h3 className="font-semibold text-md">{selectedCustomer.name}</h3>
              <table className="min-w-full mt-4 border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 text-left">S.No</th>
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Withdrawal Amount</th>
                    <th className="px-6 py-3 text-left">Deposit Amount</th>
                    <th className="px-6 py-3 text-left">Closing Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCustomer.transactions.map((transaction, index) => (
                    <tr key={index}>
                      <td className="border px-6 py-2">{transaction.sNo}</td>
                      <td className="border px-6 py-2">{transaction.date}</td>
                      <td className="border px-6 py-2">{transaction.withdrawalAmt}</td>
                      <td className="border px-6 py-2">{transaction.depositAmt}</td>
                      <td className="border px-6 py-2">{transaction.closingBalance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Please select a customer from the list.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;
