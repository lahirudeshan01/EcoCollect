const bcrypt = require('bcryptjs');
const User = require('./model');
const WasteRecord = require('../../models/WasteRecord');

async function listUsers(_req, res) {
  const users = await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 });
  res.json(users);
}

async function createUser(req, res) {
  const { name, email, password, role = 'user' } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'email and password are required' });
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'email already in use' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role });
  res.status(201).json({ id: user._id, email: user.email, name: user.name, role: user.role });
}

async function getWasteHistory(req, res) {
  try {
    // Assume req.user.id is set by auth middleware
    const residentId = req.user.id;
    const history = await WasteRecord.find({ residentId }).sort({ scheduledDate: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch waste history.' });
  }
}

module.exports = { listUsers, createUser, getWasteHistory };
