const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema(
  {
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: String,
    weightKg: Number,
    timestamp: { type: Date, default: Date.now },
    note: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Collection', CollectionSchema);
