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
// --- New: seed resident for testing ---
async function seedResident(req, res) {
  const email = req.body?.email || 'resident@test.com';
  const password = req.body?.password || '12345';
  const name = req.body?.name || 'Resident User';
  const role = 'user';
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.findOneAndUpdate(
    { email },
    { email, name, passwordHash, role },
    { new: true, upsert: true }
  );
  return res.json({ ok: true, email: user.email, role: user.role });
}

module.exports.seedResident = seedResident;

// --- New: register resident ---
async function register(req, res) {
  try {
    const { name, email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'email and password are required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name || 'Resident', email, passwordHash, role: 'user' });
    return res.status(201).json({ id: user._id, email: user.email, name: user.name });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Registration failed', detail: err?.message });
  }
}

module.exports.register = register;
