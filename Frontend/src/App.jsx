import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Signup from './Pages/Signup';
import Transactions from './Pages/Transactions';
import Profile from './Pages/Profile';
import Investment from './Pages/Investment';
import Taxes from './Pages/Taxes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/investment" element={<Investment/>} />
        <Route path="/taxes" element={<Taxes />} />
      </Routes>
    </Router>
  );
}

export default App;