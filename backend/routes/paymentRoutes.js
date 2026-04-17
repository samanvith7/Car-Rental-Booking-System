const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmPayment, mockPayment, getUserPayments } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.post('/mock', protect, mockPayment);
router.get('/my', protect, getUserPayments);

module.exports = router;
