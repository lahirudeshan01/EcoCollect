const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./model');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

// New login service aligned with password field and uppercase roles
async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid email or password');
  const ok = await user.comparePassword(password);
  if (!ok) throw new Error('Invalid email or password');
  const payload = { id: user._id, role: user.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
  return { token, user: { email: user.email, role: user.role } };
}

// Generic bearer token extractor and verifier
function protect(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (_e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

// Role guard with case-insensitive comparison; accepts string or array
function requireRole(roles = []) {
  if (typeof roles === 'string') roles = [roles];
  const want = roles.map(r => String(r).toUpperCase());
  return (req, res, next) => {
    if (!req.user) {
      try {
        const header = req.headers.authorization || '';
        const token = header.startsWith('Bearer ') ? header.slice(7) : null;
        if (!token) return res.status(401).json({ message: 'Unauthorized' });
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
      } catch (_e) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    }
    const actual = String(req.user.role || '').toUpperCase();
    if (want.length && !want.includes(actual)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

function adminOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (String(req.user.role).toUpperCase() !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
  next();
}

module.exports = { loginUser, protect, requireRole, adminOnly };
