const express = require('express');
const router = express.Router();
const { createReview, getCarReviews, deleteReview } = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/car/:carId', getCarReviews);
router.delete('/:id', protect, deleteReview);

module.exports = router;
