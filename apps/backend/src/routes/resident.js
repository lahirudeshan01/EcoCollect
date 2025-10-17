const express = require('express');
const router = express.Router();
const ResidentService = require('../services/ResidentService');
const PaymentService = require('../services/PaymentService');
const Account = require('../models/Account'); 
const WasteRecord = require('../models/WasteRecord'); 
const PaymentHistory = require('../models/PaymentHistory'); 
const authMiddleware = require('../middleware/auth'); // Middleware for token validation


// All routes below require a valid Resident token
router.use(authMiddleware);

// GET /api/resident/dashboard
router.get('/dashboard', async (req, res) => {
    // Use req.userId from authMiddleware to fetch data
    const totalWaste = await WasteRecord.getTotalCollected(req.userId);
    const upcomingPickups = await WasteRecord.getUpcoming(req.userId);

    res.json({
        totalWaste: totalWaste || 12500, // Dummy data if DB fails
        recyclingPercentage: 65,
        upcomingPickups: upcomingPickups.length || 3,
        recentActivity: await WasteRecord.getRecent(req.userId)
    });
});

// GET /api/resident/payment-history (Wireframe Improvement)
router.get('/payment-history', async (req, res) => {
    const history = await PaymentHistory.findByResidentId(req.userId);
    res.json(history);
});

// POST /api/resident/pickup (Use Case Step 4)
router.post('/pickup', async (req, res) => {
    try {
        const result = await ResidentService.schedulePickup(req.userId, req.body);
        
        if (!result.success && result.suggestion) {
            // Handle Extension 4.a
            return res.status(202).json({ 
                message: result.message, 
                suggestion: result.suggestion 
            });
        }
        
        // Successful scheduling (requires payment or not)
        return res.status(201).json({ 
            message: "Pickup scheduled successfully.", 
            requiresPayment: result.requiresPayment 
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to schedule pickup." });
    }
});

// POST /api/resident/pay (Use Case Step 6)
router.post('/pay', async (req, res) => {
    try {
        const transactionResult = await PaymentService.processPayment(req.userId, req.body.paymentDetails);
        
        if (transactionResult.success) {
            // Handle Extension 6.a (Paybacks logic is inside PaymentService)
            return res.json({ 
                message: "Payment confirmed.", 
                paybacksCredited: transactionResult.paybacksCredited 
            });
        }
        
        res.status(400).json({ message: "Payment failed. Please retry." });
    } catch (error) {
        res.status(500).json({ message: "Payment gateway error." });
    }
});

module.exports = router;
