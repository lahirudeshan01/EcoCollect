const SystemConfig = require('./model');

async function getConfig(_req, res) {
  const cfg = await SystemConfig.findOne() || await SystemConfig.create({});
  res.json(cfg);
}

async function updateConfig(req, res) {
  const update = req.body || {};
  const cfg = await SystemConfig.findOneAndUpdate({}, update, { new: true, upsert: true });
  res.json(cfg);
}

module.exports = { getConfig, updateConfig };
