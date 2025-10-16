const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    // Link to the User model
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 0.00
    },
    totalRecyclingMass: { // Used for payback calculation (Extension 6.a)
        type: Number,
        default: 0.00
    }
    // You could add payment history array here, but for simplicity, we use a separate model below.
}, { timestamps: true });

module.exports = mongoose.model('Account', AccountSchema);
