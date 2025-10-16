import React from 'react';
import { Link } from 'react-router-dom';

const navItems = [
  { name: 'Home', path: '/dashboard' },
  { name: 'Statistics', path: '/resident/statistics' },
  { name: 'History', path: '/resident/history' },
  { name: 'Payment History', path: '/resident/payments' },
  { name: 'Settings', path: '/resident/settings' },
];

function Layout({ children, activeTab }) {
  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar (Navigation) */}
      <aside style={{ width: '200px', padding: '20px', borderRight: '1px solid #ccc' }}>
        <p>Sophia Clark (Admin)</p>
        <nav>
          {navItems.map(item => (
            <Link key={item.name} to={item.path} style={{ textDecoration: 'none' }}>
              <span style={{ fontWeight: item.name === activeTab ? 'bold' : 'normal', display: 'block', padding: '10px 0', color: '#333' }}>
                {item.name}
              </span>
            </Link>
          ))}
          <Link to="/">
            <span style={{ marginTop: '50px', display: 'block', color: '#333' }}>← Logout</span>
          </Link>
        </nav>
      </aside>
      {/* Main Content */}
      <main style={{ flexGrow: 1, padding: '20px' }}>
        {children}
      </main>
    </div>
  );
}

export default Layout;
