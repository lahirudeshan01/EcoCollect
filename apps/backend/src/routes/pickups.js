const express = require('express');
const router = express.Router();
const Pickup = require('../models/Pickup'); // make sure this model exists

// ✅ POST /api/pickups — create a new pickup
router.post('/', async (req, res) => {
  try {
    const pickupData = req.body;
    console.log('📦 Pickup request received:', pickupData);

    const newPickup = await Pickup.create({
      type: pickupData.wasteType,
      date: pickupData.date,
      time: pickupData.time,
      weight: pickupData.weight,
      notes: pickupData.notes,
      status: 'Scheduled',
    });

    res.status(201).json({ message: 'Pickup created successfully', data: newPickup });
  } catch (err) {
    console.error('❌ Error creating pickup:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ GET /api/pickups — fetch all pickups for dashboard
router.get('/', async (req, res) => {
  try {
    const pickups = await Pickup.find().sort({ date: -1 });

    const totalWaste = pickups.reduce((sum, p) => sum + (p.weight || 0), 0);
    const pendingPickups = pickups.filter(p => p.status !== 'Completed').length;
    const nextPickup = pickups.find(p => p.status === 'Scheduled');

    res.json({
      totalWaste,
      pendingPickups,
      nextPickupDate: nextPickup ? nextPickup.date : null,
      recentActivity: pickups,
    });
  } catch (err) {
    console.error('❌ Error fetching pickups:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
