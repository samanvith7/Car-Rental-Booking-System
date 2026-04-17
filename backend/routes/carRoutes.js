const express = require('express');
const router = express.Router();
const { getCars, getCar, createCar, updateCar, deleteCar, getFeaturedCars } = require('../controllers/carController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getCars);
router.get('/featured', getFeaturedCars);
router.get('/:id', getCar);
router.post('/', protect, admin, createCar);
router.put('/:id', protect, admin, updateCar);
router.delete('/:id', protect, admin, deleteCar);

module.exports = router;
