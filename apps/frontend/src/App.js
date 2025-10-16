// Main React App
import React, { useState } from 'react';
import Home from './pages/Home';
import ScanQR from './pages/ScanQR';

function App() {
  const [route, setRoute] = useState('home');

  return (
    <div>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-end">
        <button onClick={() => setRoute('home')} className="mr-3 px-3 py-1 rounded bg-gray-100">Home</button>
        <button onClick={() => setRoute('scan')} className="px-3 py-1 rounded bg-emerald-600 text-white">Scan QR</button>
      </div>

      {route === 'home' && <Home />}
      {route === 'scan' && <ScanQR />}
    </div>
  );
}

export default App;
