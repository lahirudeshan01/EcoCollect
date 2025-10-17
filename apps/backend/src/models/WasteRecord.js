const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const WasteRecord = require('./models/WasteRecord'); // your file

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/wasteDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// --- Routes ---

// Create new pickup request
app.post('/api/pickups', async (req, res) => {
    try {
        const { residentId, wasteType, date, time, weight, notes } = req.body;

        const newPickup = new WasteRecord({
            residentId: residentId || '000000000000000000000000', // use dummy id if auth not implemented
            type: wasteType,
            scheduledDate: new Date(`${date}T${time}`), // combine date & time
            weight: weight || 0,
            notes,
            isSpecialPickup: wasteType !== 'Regular'
        });

        const savedPickup = await newPickup.save();
        res.status(200).json({ success: true, pickup: savedPickup });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// Fetch all pickups (optional for dashboard)
app.get('/api/pickups', async (req, res) => {
    try {
        const pickups = await WasteRecord.find().sort({ scheduledDate: -1 });
        res.status(200).json(pickups);
    } catch (err) {
        res.status(500).json({ error: 'Server Error' });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
