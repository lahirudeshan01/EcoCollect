const Collection = require('./model');

async function submitCollection(req, res) {
  const staffId = req.user?.sub;
  if (!staffId) return res.status(401).json({ message: 'Unauthorized' });
  const doc = await Collection.create({ ...req.body, staffId });
  res.status(201).json(doc);
}

module.exports = { submitCollection };
