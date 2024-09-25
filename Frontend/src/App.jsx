import { useState } from 'react'
import Dashboard from './Pages/Dashboard'
import Navbar from './components/Navbar'
import Signup from './Pages/Signup'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Transactions from './Pages/Transactions';
// import User from './Pages/User';

import Profile from './Pages/Profile';
function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Transactions" element={<Transactions/>} />
        <Route path="/Profile" element={<Profile/>} />
        {/* <Route path="/User" element={<User/>} /> */}
      </Routes>
    </Router>
    </>
  )
}

export default App
