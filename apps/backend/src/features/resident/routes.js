const { Router } = require('express');
const { requireRole } = require('../auth/service');
const WasteRecord = require('../../models/WasteRecord');

const router = Router();

// All resident routes require a logged-in user; allow resident users and admins
router.use(requireRole(['user', 'admin']));

// Create a pickup (special/regular) and store weight if provided
router.post('/pickup', async (req, res) => {
  console.log('POST /api/resident/pickup called with:', req.body);
  console.log('User from token:', req.user);
  try {
    const userId = req.user.sub;
    const { wasteType, date, time, weight, notes } = req.body || {};
    if (!wasteType || !date || !time) return res.status(400).json({ message: 'wasteType, date, time are required' });

    // Build scheduled date from date + time in local time
    const scheduled = new Date(`${date} ${time}`);
    if (isNaN(scheduled.getTime())) {
      return res.status(400).json({ message: 'Invalid date or time' });
    }

    const record = await WasteRecord.create({
      residentId: userId,
      type: wasteType,
      scheduledDate: scheduled,
      status: 'Scheduled',
      weight: weight !== undefined && weight !== null && String(weight) !== '' ? Number(weight) : undefined,
      isSpecialPickup: true,
      notes,
    });
    console.log('Created record:', record);

    return res.status(201).json({ id: record._id });
  } catch (e) {
    console.error('Create pickup error:', e);
    return res.status(500).json({ message: 'Failed to schedule pickup', detail: e?.message });
  }
});

// Recent activity for dashboard
router.get('/recent-activity', async (req, res) => {
  try {
    const userId = req.user.sub;
    const records = await WasteRecord.find({ residentId: userId }).sort({ scheduledDate: -1 }).limit(20);
    const data = records.map(r => ({
      id: r._id,
      date: r.scheduledDate,
      type: r.type,
      weight: r.weight || 0,
      status: r.status,
    }));
    return res.json(data);
  } catch (e) {
    console.error('Recent activity error:', e);
    return res.status(500).json({ message: 'Failed to fetch activity' });
  }
});

module.exports = router;


