import React, { useState } from 'react';
import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import RouteOptimizationPage from './pages/RouteOptimizationPage.jsx';
import RouteDetailsPage from './pages/RouteDetailsPage';

import LoginPage from './pages/LoginPage';

function App() {
  const [route, setRoute] = useState('home');

  const onNavigate = (newRoute) => {
    setRoute(newRoute);
  };

  const renderPage = () => {
    switch (route) {
      case 'home':
        return <Home onNavigate={onNavigate} />;
      case 'dashboard':
        return <DashboardPage onNavigate={onNavigate} />;
      case 'routes':
        return <RouteOptimizationPage onNavigate={onNavigate} />;
      case 'route-details':
        return <RouteDetailsPage onNavigate={onNavigate} />;
      case 'login':
        return <LoginPage onNavigate={onNavigate} />;
      default:
        return <Home onNavigate={onNavigate} />;
    }
  };

  return (
    <div>
      {renderPage()}
    </div>
  );
}

export default App;
