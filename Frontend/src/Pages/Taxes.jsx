import React from 'react';
import Navbar from '../components/Navbar';

const Taxes = () => {
  const TITLE = 'TAXES';

  return (
    <>
    <Navbar/>
  <section className="font-suse text-md p-4 md:p-6 text-lg">
    <div className="text-3xl font-black text-gray-400 pb-2">{TITLE}</div>
  <div className="flex flex-col md:flex-row gap-2 ">
  </div>
  </section>

  </>
  )
}

export default Taxes