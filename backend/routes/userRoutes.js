const express = require('express');
const router = express.Router();
const { updateProfile, toggleWishlist, getWishlist } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.put('/profile', protect, updateProfile);
router.get('/wishlist', protect, getWishlist);
router.put('/wishlist/:carId', protect, toggleWishlist);

module.exports = router;
