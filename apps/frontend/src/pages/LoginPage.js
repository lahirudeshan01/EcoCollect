import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div onClick={() => navigate('/')} className="flex items-center gap-4 mb-8 cursor-pointer">
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
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Authority Login</h1>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              type="email"
              id="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              type="password"
              id="password"
              placeholder="••••••••"
            />
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            type="button"
            className="w-full bg-emerald-600 text-white py-2 rounded-md font-semibold shadow hover:shadow-lg transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
