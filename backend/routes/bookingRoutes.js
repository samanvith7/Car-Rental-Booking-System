const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, getBooking, cancelBooking, updateBookingStatus, getAllBookings } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my', protect, getUserBookings);
router.get('/all', protect, admin, getAllBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/status', protect, admin, updateBookingStatus);

module.exports = router;
