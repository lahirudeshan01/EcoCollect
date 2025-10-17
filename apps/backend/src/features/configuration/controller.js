const SystemConfig = require('./model');
const { httpError } = require('../../utils/httpError');

async function getConfig(_req, res) {
  const cfg = (await SystemConfig.findOne()) || (await SystemConfig.create({}));
  res.json(cfg);
}

async function updateConfig(req, res) {
  const update = req.body || {};
  // Validate duplicate category keys
  if (Array.isArray(update.wasteCategories)) {
    const keys = update.wasteCategories.map((c) => String(c?.key || '').trim()).filter(Boolean);
    const dup = keys.find((k, i) => keys.indexOf(k) !== i);
    if (dup) {
      throw httpError(422, `Duplicate waste category key: '${dup}'`);
    }
  }
  const cfg = await SystemConfig.findOneAndUpdate({}, update, { new: true, upsert: true });
  res.json(cfg);
}

async function deleteConfig(_req, res) {
  // We keep only one SystemConfig document; delete all to reset
  await SystemConfig.deleteMany({});
  res.status(204).send();
}

module.exports = { getConfig, updateConfig, deleteConfig };
