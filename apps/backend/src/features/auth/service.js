const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./model');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

async function authenticate(email, password) {
  const user = await User.findOne({ email });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;
  const token = jwt.sign({ sub: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  return { token, user: { id: user._id, email: user.email, name: user.name, role: user.role } };
}

function requireRole(roles = []) {
  if (typeof roles === 'string') roles = [roles];
  return (req, res, next) => {
    try {
      const header = req.headers.authorization || '';
      const token = header.startsWith('Bearer ') ? header.slice(7) : null;
      if (!token) return res.status(401).json({ message: 'Unauthorized' });
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
      if (roles.length && !roles.includes(payload.role)) return res.status(403).json({ message: 'Forbidden' });
      next();
    } catch (e) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
}

module.exports = { authenticate, requireRole };
