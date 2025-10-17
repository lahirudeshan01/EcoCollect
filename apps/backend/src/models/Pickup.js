const mongoose = require('mongoose');

const PickupSchema = new mongoose.Schema({
  wasteType: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, default: 'N/A' },
  weight: { type: Number, required: true },
  notes: { type: String, default: '-' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Pickup', PickupSchema);
