import StatisticsPage from './pages/statistics';
import SettingsPage from './pages/settings';
// Main React App
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/dashboard';
import LoginPage from './pages/login';
import Register from './pages/register';
import PaymentHistoryPage from './pages/payments';
import WasteHistoryPage from './pages/history';
import { AuthProvider } from './components/context/AuthContext';
import AddCardPage from './pages/AddCardPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resident/payments" element={<PaymentHistoryPage />} />
          <Route path="/resident/history" element={<WasteHistoryPage />} />
          <Route path="/resident/settings" element={<SettingsPage />} />
          <Route path="/resident/statistics" element={<StatisticsPage />} />
            <Route path="/add-card" element={<AddCardPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
