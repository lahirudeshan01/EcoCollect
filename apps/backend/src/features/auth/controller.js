const bcrypt = require('bcryptjs');
const User = require('./model');
const { authenticate } = require('./service');

async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'email and password are required' });
  const result = await authenticate(email, password);
  if (!result) return res.status(401).json({ message: 'invalid credentials' });
  return res.json(result);
}

// Creates or updates an admin account; safe to call multiple times.
async function seedAdmin(req, res) {
  const email = process.env.ADMIN_EMAIL || 'admin@ecocollect.local';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = process.env.ADMIN_NAME || 'Admin';
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.findOneAndUpdate(
    { email },
    { email, name, passwordHash, role: 'admin' },
    { new: true, upsert: true }
  );
  return res.json({ ok: true, email: user.email, role: user.role });
}

module.exports = { login, seedAdmin };
