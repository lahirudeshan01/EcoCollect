const SystemConfig = require('./model');

async function getConfig(_req, res) {
  const cfg = (await SystemConfig.findOne()) || (await SystemConfig.create({}));
  res.json(cfg);
}

async function updateConfig(req, res) {
  const update = req.body || {};
  const cfg = await SystemConfig.findOneAndUpdate({}, update, { new: true, upsert: true });
  res.json(cfg);
}

async function deleteConfig(_req, res) {
  // We keep only one SystemConfig document; delete all to reset
  await SystemConfig.deleteMany({});
  res.status(204).send();
}

module.exports = { getConfig, updateConfig, deleteConfig };
