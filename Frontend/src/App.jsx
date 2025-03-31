import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Signup from './Pages/Signup';
import Transactions from './Pages/Transactions';
import Profile from './Pages/Profile';
import Investment from './Pages/Investment';
import Taxes from './Pages/Taxes';
import TaxCalculator from './Pages/Tax_calc';
import Post_sign_up from './Pages/post_sign_up';
import StockChartPage from './Pages/Graph';
import AuthPage from './Pages/Authpage';
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
        <Route path="/tax_calc" element={<TaxCalculator/>} />
        <Route path="/post_sign_up" element={<Post_sign_up/>} />
        <Route path="/stock-chart" element={<StockChartPage />} />
        <Route path="/auth" element={<AuthPage/>} />

      </Routes>
    </Router>
  );
}

export default App;