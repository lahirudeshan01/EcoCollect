import React from 'react';
import { Link } from 'react-router-dom';

const navItems = [
  { name: 'Home', path: '/dashboard' },
  { name: 'Statistics', path: '/resident/statistics' },
  { name: 'History', path: '/resident/history' },
  { name: 'Payments', path: '/resident/payments' },
  { name: 'Settings', path: '/resident/settings' },
];

function Layout({ children, activeTab, variant = 'header' }) {
  if (variant === 'sidebar') {
    return (
      <div>
        {/* Sidebar (Navigation) - fixed/static */}
        <aside style={{ position: 'fixed', top: 0, left: 0, width: '220px', height: '100vh', padding: '20px', borderRight: '1px solid #e5e7eb', background: '#fff', zIndex: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg,#34d399,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12h4l2-3 3 6 3-8 4 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>EcoCollect</div>
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: -2 }}>Resident Portal</div>
            </div>
          </div>
          <nav>
            {navItems.map(item => (
              <Link key={item.name} to={item.path} style={{ textDecoration: 'none' }}>
                <span style={{ fontWeight: item.name === activeTab ? 'bold' : 'normal', display: 'block', padding: '10px 0', color: item.name === activeTab ? '#065f46' : '#374151' }}>
                  {item.name}
                </span>
              </Link>
            ))}
            <Link to="/">
              <span style={{ marginTop: '30px', display: 'block', color: '#374151' }}>← Logout</span>
            </Link>
          </nav>
        </aside>
        {/* Main Content */}
        <main style={{ padding: '24px', background: '#f9fafb', minHeight: '100vh', marginLeft: '220px' }}>
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white text-gray-900">
      {/* HEADER */}
      <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12h4l2-3 3 6 3-8 4 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="text-base font-semibold">EcoCollect</div>
              <div className="text-[11px] text-gray-500 -mt-0.5">Resident Portal</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={
                  'px-2 py-1 rounded-md transition ' +
                  (item.name === activeTab
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-gray-600 hover:text-emerald-700')
                }
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Logout</Link>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;
