import React from 'react';

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        {/* Add header content here */}
      </header>
      <main>{children}</main>
      <footer>
        {/* Add footer content here */}
      </footer>
    </div>
  );
};

export default Layout;
