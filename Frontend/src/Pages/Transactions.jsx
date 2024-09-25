import React from 'react';
import Navbar from '../components/Navbar';
import Filters from '../components/Filters';  // Updated Filters component

const Transactions = () => {
  const Title = 'TRANSACTIONS';

  return (
    <>
      <Navbar />
      <section className="font-suse text-md p-4 md:p-6">
        <div className="text-3xl font-black text-gray-400 pb-2">{Title}</div>

        {/* Render the Filters component */}
        <div className="mt-4">
          <Filters />
        </div>
      </section>
    </>
  );
};

export default Transactions;
