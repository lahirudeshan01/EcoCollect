const User = require('./model');

async function listUsers(_req, res) {
  const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
  res.json(users);
}

async function createUser(req, res) {
  const { name, email, password, role = 'USER' } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'email and password are required' });
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'email already in use' });
  const user = new User({ email, role: String(role).toUpperCase() });
  if (name) user.name = name; // name is not in schema now, but keep for forward compat if added
  user.password = password; // triggers pre-save hash
  await user.save();
  res.status(201).json({ id: user._id, email: user.email, name: user.name, role: user.role });
}

module.exports = { listUsers, createUser };
