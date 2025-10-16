const mongoose = require('mongoose');

const WasteRecordSchema = new mongoose.Schema({
    residentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: { // e.g., 'Regular', 'Special - Bulky', 'Special - Hazardous'
        type: String,
        required: true
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Collected', 'Completed', 'Canceled'],
        default: 'Scheduled'
    },
    weight: { // Weight recorded after collection
        type: Number
    },
    isSpecialPickup: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('WasteRecord', WasteRecordSchema);
