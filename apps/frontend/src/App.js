import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import RouteOptimizationPage from './pages/RouteOptimizationPage.jsx';
import RouteDetailsPage from './pages/RouteDetailsPage';
import PinithiDashboard from './pages/PinithiDashboard';
import LoginPage from './pages/LoginPage';
import AuthorityLoginPage from './pages/AuthorityLoginPage';
import AuthorityDashboard from './pages/AuthorityDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/routes" element={<RouteOptimizationPage />} />
        <Route path="/route-details/:id" element={<RouteDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pinithi-dashboard" element={<PinithiDashboard />} />
        <Route path="/authority/login" element={<AuthorityLoginPage />} />
        <Route path="/authority/dashboard" element={<AuthorityDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
