import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthorityLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Bypass authentication - check credentials locally
    if (username === 'admin' && password === 'password') {
      // Store a fake token for consistency
      localStorage.setItem('authorityToken', 'local-auth-token-' + Date.now());
      // Navigate directly to routes page instead of dashboard
      navigate('/routes');
    } else {
      setError('Invalid credentials. Use: admin / password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white text-gray-900 antialiased">
      {/* Header with Logo */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div onClick={() => navigate('/')} className="flex items-center gap-4 cursor-pointer">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12h4l2-3 3 6 3-8 4 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="text-lg font-semibold">EcoCollect</div>
            <div className="text-xs text-gray-500 -mt-0.5">Smart Waste Management</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a onClick={() => navigate('/')} className="hover:text-emerald-600 transition cursor-pointer">Home</a>
          <a className="text-emerald-600 font-semibold">For Authorities</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {/* Removed operator login button for cleaner authority login page */}
        </div>
      </header>

      {/* Main Login Content */}
      <main className="max-w-7xl mx-auto px-6 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-6xl">
          
          {/* Left Side - Welcome Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
                Welcome back,
                <span className="text-emerald-600"> Manager</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-xl">
                Access your authority dashboard to monitor waste collection across your jurisdiction, 
                view analytics, and manage collection operations efficiently.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M4 20h16M8 16V8M12 16v-4M16 16v-8" stroke="#10B981" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Real-time Analytics</div>
                  <div className="text-gray-500 text-sm">Monitor collection efficiency and waste patterns</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12h18M12 3v18" stroke="#10B981" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Route Management</div>
                  <div className="text-gray-500 text-sm">Optimize collection routes and schedules</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="3" stroke="#10B981" strokeWidth="1.4"/>
                    <path d="M4 20v-1a6 6 0 0116 0v1" stroke="#10B981" strokeWidth="1.4"/>
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Resident Management</div>
                  <div className="text-gray-500 text-sm">Oversee resident accounts and service requests</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="relative">
            <div className="rounded-3xl p-8 bg-gradient-to-b from-white/80 to-gray-50 shadow-2xl border border-gray-100">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900">Authority Login</h2>
                  <p className="text-gray-600 mt-2">Sign in to access your authority dashboard</p>
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                      <strong>Demo Credentials:</strong> admin / password
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition bg-white"
                      placeholder="admin"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition bg-white"
                      placeholder="password"
                      required
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                      <p className="text-red-600 text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl hover:bg-emerald-700 transform hover:translate-y-[-1px] transition duration-200"
                  >
                    Sign In to Dashboard
                  </button>
                </form>

                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Need help? Contact your system administrator
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -right-16 top-8 w-44 h-44 rounded-full bg-emerald-100/30 blur-3xl -z-10"></div>
            <div className="absolute -left-8 bottom-8 w-32 h-32 rounded-full bg-green-100/40 blur-2xl -z-10"></div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t bg-white/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} EcoCollect. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-emerald-600 transition">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-600 transition">Terms of Service</a>
              <a href="#" className="hover:text-emerald-600 transition">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthorityLoginPage;
