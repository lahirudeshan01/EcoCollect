const mongoose = require('mongoose');

const BillingModelSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    rate: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const WasteCategorySchema = new mongoose.Schema(
  {
    key: { type: String, trim: true, required: true },
    label: { type: String, trim: true, required: true },
  },
  { _id: false }
);

const SystemConfigSchema = new mongoose.Schema(
  {
    billingModels: { type: [BillingModelSchema], default: [] },
    wasteCategories: { type: [WasteCategorySchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SystemConfig', SystemConfigSchema);
