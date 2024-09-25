import React, { useState } from 'react';
import './Filter.css'; // Import the custom CSS file

const Filters = () => {
  // State to manage filter selection
  const [filters, setFilters] = useState({
    UPI: false,
    IMPS: false,
    RTGS: false,
  });

  const [isPaymentDropdownOpen, setPaymentDropdownOpen] = useState(false);
  const [isCustomerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Payment methods array to map through
  const paymentMethods = [
    { name: 'UPI', label: 'UPI' },
    { name: 'IMPS', label: 'IMPS' },
    { name: 'RTGS', label: 'RTGS' },
  ];

  // Customers array to map through with dummy transactions including 'receiver'
  const customers = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      transactions: [
        { sNo: 1, type: 'UPI', debit: 500, credit: 0, receiver: 'Mike Brown' },
        { sNo: 2, type: 'IMPS', debit: 0, credit: 1000, receiver: 'Sara Smith' },
      ],
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '987-654-3210',
      transactions: [
        { sNo: 1, type: 'RTGS', debit: 2000, credit: 0, receiver: 'David Johnson' },
        { sNo: 2, type: 'IMPS', debit: 0, credit: 1500, receiver: 'Emma Wilson' },
      ],
    },
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '555-666-7777',
      transactions: [
        { sNo: 1, type: 'UPI', debit: 750, credit: 0, receiver: 'Chris Green' },
        { sNo: 2, type: 'RTGS', debit: 0, credit: 2500, receiver: 'Olivia Brown' },
      ],
    },
  ];

  // Function to handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  // Function to toggle payment dropdown visibility
  const togglePaymentDropdown = () => {
    setPaymentDropdownOpen(!isPaymentDropdownOpen);
  };

  // Function to toggle customer dropdown visibility
  const toggleCustomerDropdown = () => {
    setCustomerDropdownOpen(!isCustomerDropdownOpen);
  };

  // Function to handle customer selection
  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setCustomerDropdownOpen(false);
  };

  // Function to filter transactions based on selected filters
  const getFilteredTransactions = (transactions) => {
    const activeFilters = Object.keys(filters).filter((key) => filters[key]);

    // If no filter is selected, return all transactions
    if (activeFilters.length === 0) {
      return transactions;
    }

    // Filter transactions based on selected filters
    return transactions.filter((transaction) =>
      activeFilters.includes(transaction.type)
    );
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Filters Section - 1/4 of the screen on large screens, full width on smaller screens */}
      <div className="w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r-[1.5px] h-auto lg:h-[75vh] border-gray-400 pr-4">
        <div className="text-3xl font-semibold mb-4">Filters</div>

        {/* Payment Method Dropdown */}
        <div className="relative mb-4">
          <button
            onClick={togglePaymentDropdown}
            className="text-md font-medium w-full flex flex-row justify-center items-center p-2 border rounded-md bg-gray-100"
          >
            <div>Payment Methods</div>
            <div className="text-base">{isPaymentDropdownOpen ? '▲' : '▼'}</div>
          </button>

          {/* Payment Dropdown content */}
          {isPaymentDropdownOpen && (
            <div className="w-full mt-2 p-2 border rounded-md bg-white shadow-lg">
              {paymentMethods.map((method) => (
                <div key={method.name} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    name={method.name}
                    checked={filters[method.name]}
                    onChange={handleCheckboxChange}
                    className="custom-checkbox mr-2"
                  />
                  <label htmlFor={method.name}>{method.label}</label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customer Dropdown */}
        <div className="relative mb-4">
          <button
            onClick={toggleCustomerDropdown}
            className="text-md font-medium w-full flex flex-row justify-center items-center p-2 border rounded-md bg-gray-100"
          >
            <div>Select Customer</div>
            <div className="text-base">{isCustomerDropdownOpen ? '▲' : '▼'}</div>
          </button>

          {/* Customer Dropdown content */}
          {isCustomerDropdownOpen && (
            <div className="w-full mt-2 p-2 border rounded-md bg-white shadow-lg">
              {customers.map((customer) => (
                <div
                  key={customer.name}
                  onClick={() => handleCustomerSelect(customer)}
                  className="cursor-pointer mb-2 hover:bg-gray-200 p-1"
                >
                  {customer.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Display Selected Customer and Filters - Full width on small screens, 3/4 on large screens */}
      <div className="pt-4 md:pt-0 pl-4 w-full lg:w-3/4">
        <div className="text-3xl font-semibold mb-4">Customer Details</div>
        

        {selectedCustomer ? (
          <div>
            <div className="flex flex-col lg:flex-row justify-between">
              <div className="text-lg mb-2">Name: {selectedCustomer.name}</div>
              <div className="text-lg mb-2">Email: {selectedCustomer.email}</div>
              <div className="text-lg mb-2">Phone: {selectedCustomer.phone}</div>
            </div>

            <div className="mt-6">
              <div className="text-xl font-semibold mb-2">Transactions</div>
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2">S.No</th>
                    <th className="px-4 py-2">Receiver</th>
                    <th className="px-4 py-2">Transaction Type</th>
                    <th className="px-4 py-2">Debit</th>
                    <th className="px-4 py-2">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredTransactions(selectedCustomer.transactions).map(
                    (transaction, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2 text-center">{transaction.sNo}</td>
                        <td className="px-4 py-2 text-center">{transaction.receiver}</td>
                        <td className="px-4 py-2 text-center">{transaction.type}</td>
                        <td className="px-4 py-2 text-center">{transaction.debit}</td>
                        <td className="px-4 py-2 text-center">{transaction.credit}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>Please select a customer from the list.</div>
        )}
      </div>
    </div>
  );
};

export default Filters;
