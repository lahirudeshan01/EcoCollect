// Main React App with tiny hash router to support Scan QR page
import React, { useEffect, useState } from 'react';
import Home from './pages/Home';
import ScanQR from './pages/ScanQR';

export default function App() {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (route.startsWith('#/scan')) return <ScanQR />;
  return <Home />;
}
