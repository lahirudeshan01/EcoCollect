const bcrypt = require('bcryptjs');
const User = require('./model');
const { loginUser } = require('./service');

async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'email and password are required' });
  try {
    const result = await loginUser(email, password);
    return res.json(result);
  } catch (_e) {
    return res.status(401).json({ message: 'invalid credentials' });
  }
}

// Creates or updates an admin account; safe to call multiple times.
async function seedAdmin(req, res) {
  const email = process.env.ADMIN_EMAIL || 'admin@ecocollect.local';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const name = process.env.ADMIN_NAME || 'Admin';
  // If user exists, update password; else create new (pre-save will hash)
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email, password, role: 'ADMIN' });
  } else {
    user.password = password;
    user.role = 'ADMIN';
  }
  await user.save();
  return res.json({ ok: true, email: user.email, role: user.role, name });
}

module.exports = { login, seedAdmin };
