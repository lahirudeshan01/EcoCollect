import './globals.css';
import React from 'react';

export const metadata = {
  title: 'EcoCollect',
  description: 'Smart waste management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
