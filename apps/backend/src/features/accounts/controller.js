const Account = require('./model');

async function getMyAccount(req, res) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const acct = await Account.findOne({ userId }) || await Account.create({ userId });
  res.json(acct);
}

async function schedulePickup(req, res) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const { date, notes } = req.body || {};
  const acct = await Account.findOneAndUpdate(
    { userId },
    { $push: { pickups: { date, notes } } },
    { new: true, upsert: true }
  );
  res.json(acct);
}

module.exports = { getMyAccount, schedulePickup };
