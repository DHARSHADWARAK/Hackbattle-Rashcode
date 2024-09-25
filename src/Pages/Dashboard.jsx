import React from 'react';
import Right_db from '../components/Right_db';
import Left_db from '../components/Left_db';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const TITLE = 'DASHBOARD';


  return (
    <>
      <Navbar/>
    <section className="font-suse text-md p-4 md:p-6 text-lg">
      <div className="text-3xl font-black text-gray-400 pb-2">{TITLE}</div>
    <div className="flex flex-col md:flex-row gap-2 ">
      <Right_db/>
      <Left_db/>
    </div>
    </section>

    </>
  );
};

export default Dashboard;
