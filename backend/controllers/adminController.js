const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// @desc Get admin dashboard stats
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalCars = await Car.countDocuments();
  const totalBookings = await Booking.countDocuments();
  const availableCars = await Car.countDocuments({ availability: true });
  const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
  const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
  const completedBookings = await Booking.countDocuments({ status: 'completed' });
  const pendingBookings = await Booking.countDocuments({ status: 'pending' });

  const revenueData = await Payment.aggregate([
    { $match: { status: 'succeeded' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const totalRevenue = revenueData[0]?.total || 0;

  const monthlyRevenue = await Payment.aggregate([
    { $match: { status: 'succeeded' } },
    { $group: {
      _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
      revenue: { $sum: '$amount' }, count: { $sum: 1 }
    }},
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 }
  ]);

  const bookingsByCategory = await Booking.aggregate([
    { $lookup: { from: 'cars', localField: 'car', foreignField: '_id', as: 'carData' } },
    { $unwind: '$carData' },
    { $group: { _id: '$carData.category', count: { $sum: 1 } } }
  ]);

  const recentBookings = await Booking.find({})
    .populate('user', 'name email').populate('car', 'name brand')
    .sort({ createdAt: -1 }).limit(5);

  res.json({
    success: true,
    data: {
      totalUsers, totalCars, totalBookings, availableCars,
      confirmedBookings, cancelledBookings, completedBookings, pendingBookings,
      totalRevenue, monthlyRevenue, bookingsByCategory, recentBookings
    }
  });
});

// @desc Get all users (admin)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  res.json({ success: true, data: users });
});

// @desc Delete user (admin)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  if (user.role === 'admin') { res.status(400); throw new Error('Cannot delete admin user'); }
  await user.deleteOne();
  res.json({ success: true, message: 'User deleted' });
});

// @desc Toggle user active status
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, data: user });
});

module.exports = { getDashboardStats, getAllUsers, deleteUser, toggleUserStatus };
