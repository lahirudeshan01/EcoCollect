const bcrypt = require('bcryptjs');
const User = require('./model');
const { loginUser } = require('./service');
const { httpError } = require('../../utils/httpError');

async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    throw httpError(400, 'email and password are required');
  }
  const result = await loginUser(email, password);
  // Set HttpOnly cookie instead of returning token in body
  const secure = process.env.NODE_ENV === 'production';
  res.cookie('ecocollect_token', result.token, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    maxAge: 24 * 60 * 60 * 1000,
  });
  return res.json({ user: result.user });
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
// Registration: creates a USER account
async function register(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    throw httpError(400, 'email and password are required');
  }
  const exists = await User.findOne({ email });
  if (exists) {
    throw httpError(409, 'email already in use');
  }
  const user = new User({ email, password, role: 'USER' });
  await user.save();
  return res.status(201).json({ ok: true });
}

module.exports.register = register;

// Return session info for the authenticated user
async function session(req, res) {
  const id = req.user?.id;
  const role = req.user?.role;
  if (!id) {
    throw httpError(401, 'Unauthorized');
  }
  const user = await User.findById(id).select({ email: 1, role: 1 });
  if (!user) {
    throw httpError(401, 'Unauthorized');
  }
  return res.json({ id: user._id, email: user.email, role: user.role });
}

module.exports.session = session;

// Logout: clear the HttpOnly auth cookie
async function logout(req, res) {
  const secure = process.env.NODE_ENV === 'production';
  res.clearCookie('ecocollect_token', {
    httpOnly: true,
    sameSite: 'lax',
    secure,
  });
  return res.json({ ok: true });
}

module.exports.logout = logout;
