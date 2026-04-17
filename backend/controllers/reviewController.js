const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Booking = require('../models/Booking');

// @desc Create review
const createReview = asyncHandler(async (req, res) => {
  const { carId, rating, title, comment, bookingId } = req.body;
  const existing = await Review.findOne({ user: req.user._id, car: carId });
  if (existing) { res.status(400); throw new Error('You have already reviewed this car'); }
  const review = await Review.create({ user: req.user._id, car: carId, booking: bookingId, rating, title, comment });
  const populated = await Review.findById(review._id).populate('user', 'name avatar');
  res.status(201).json({ success: true, data: populated });
});

// @desc Get car reviews
const getCarReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ car: req.params.carId })
    .populate('user', 'name avatar').sort({ createdAt: -1 });
  res.json({ success: true, count: reviews.length, data: reviews });
});

// @desc Delete review
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) { res.status(404); throw new Error('Review not found'); }
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  await review.deleteOne();
  res.json({ success: true, message: 'Review deleted' });
});

module.exports = { createReview, getCarReviews, deleteReview };
