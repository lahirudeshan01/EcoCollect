const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  nameOnCard: String,
  cardNumber: String,
  expiry: String,
  cvc: String,
  billingAddress: String,
});

const paymentSchema = new mongoose.Schema({
  residentName: { type: String, required: true },
  address: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['card', 'cash'], required: true },
  cardDetails: { type: cardSchema, default: null },
  status: { type: String, enum: ['Paid', 'Pending'], default: 'Paid' },
  type: { type: String, enum: ['Charge', 'Payback'], default: 'Charge' },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
