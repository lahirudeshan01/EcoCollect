// Simple local authentication without database
const jwt = require('jsonwebtoken');

// In-memory authorities (replace database)
const authorities = [
  {
    id: 1,
    username: 'admin',
    password: 'password' // In production, this should be hashed
  }
];

const loginAuthority = (username, password) => {
  return new Promise((resolve, reject) => {
    // Find authority
    const authority = authorities.find(auth => auth.username === username);
    
    if (!authority) {
      reject(new Error('Invalid credentials'));
      return;
    }

    // Check password (in production, use bcrypt)
    if (authority.password !== password) {
      reject(new Error('Invalid credentials'));
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: authority.id, username: authority.username }, 
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );

    resolve({ 
      token, 
      authority: { 
        id: authority.id,
        username: authority.username 
      } 
    });
  });
};

module.exports = {
  loginAuthority
};