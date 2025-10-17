const mongoose = require('mongoose');

// Card details sub-schema
const cardSchema = new mongoose.Schema({
  nameOnCard: { type: String, trim: true },
  cardNumber: { type: String, trim: true },
  expiry: { type: String, trim: true },
  cvc: { type: String, trim: true },
  billingAddress: { type: String, trim: true },
}, { _id: false }); // Prevent creating an extra _id for card subdocument

// Main Payment schema
const paymentSchema = new mongoose.Schema({
  residentName: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, enum: ['card', 'cash'], required: true },
  cardDetails: { type: cardSchema, default: null },
  status: { type: String, enum: ['Paid', 'Pending'], default: 'Paid' },
  type: { type: String, enum: ['Charge', 'Payback'], default: 'Charge' },
}, { timestamps: true });

// Optional: Add a virtual field for formatted date
paymentSchema.virtual('formattedDate').get(function () {
  return this.date ? this.date.toISOString().split('T')[0] : '';
});

// Ensure virtuals are included when converting to JSON
paymentSchema.set('toJSON', { virtuals: true });
paymentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Payment', paymentSchema);
