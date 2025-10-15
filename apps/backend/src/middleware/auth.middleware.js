const { protect, adminOnly, requireRole } = require('../features/auth/service');

module.exports = { protect, adminOnly, requireRole };
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

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

function adminOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (String(req.user.role).toUpperCase() !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
  next();
}

module.exports = { protect, adminOnly };
