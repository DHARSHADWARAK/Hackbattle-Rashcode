import React from 'react'
import Filters from '../components/Filters';
import Navbar from '../components/Navbar';

const Transactions = () => {
  const Title='TRANSACTIONS';
  return (
    <>
      <Navbar/>
    
    <section className='font-suse text-md p-4 md:p-6'>
            <div className="text-3xl font-black text-gray-400 pb-2">{Title}</div>
              <Filters/>
              
    </section>
    </>
  )
}

export default Transactions