const mongoose = require('mongoose');

const SystemConfigSchema = new mongoose.Schema(
  {
    billingModels: [{ name: String, rate: Number }],
    wasteCategories: [{ key: String, label: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('SystemConfig', SystemConfigSchema);
