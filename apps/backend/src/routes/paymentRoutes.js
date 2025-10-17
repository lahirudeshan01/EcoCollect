const express = require('express');
const Payment = require('../models/Payment');

const router = express.Router();

// -------------------- GET all payments --------------------
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ date: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
});

// -------------------- Add a new payment --------------------
router.post('/', async (req, res) => {
  try {
    const { residentName, address, date, amount, paymentMethod, cardDetails } = req.body;

    const payment = new Payment({
      residentName,
      address,
      date,
      amount,
      paymentMethod,
      cardDetails: paymentMethod === 'card' ? cardDetails : null,
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add payment' });
  }
});

// -------------------- DELETE a payment --------------------
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Payment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ message: 'Payment deleted successfully', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete payment' });
  }
});

module.exports = router;
