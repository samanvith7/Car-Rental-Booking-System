const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Car = require('../models/Car');
const { calculateDays, calculateTotalPrice, checkDateConflict } = require('../utils/dateUtils');

// @desc Create booking
const createBooking = asyncHandler(async (req, res) => {
  const { carId, pickupDate, dropoffDate, pickupLocation, dropoffLocation, notes } = req.body;
  const car = await Car.findById(carId);
  if (!car) { res.status(404); throw new Error('Car not found'); }
  if (!car.availability) { res.status(400); throw new Error('Car is not available'); }
  const hasConflict = checkDateConflict(car.bookedDates, pickupDate, dropoffDate);
  if (hasConflict) { res.status(400); throw new Error('Car is not available for selected dates'); }
  const totalDays = calculateDays(pickupDate, dropoffDate);
  const totalAmount = calculateTotalPrice(car.pricePerDay, pickupDate, dropoffDate);
  const booking = await Booking.create({
    user: req.user._id, car: carId, pickupDate, dropoffDate,
    pickupLocation, dropoffLocation: dropoffLocation || pickupLocation,
    totalDays, pricePerDay: car.pricePerDay, totalAmount, notes, status: 'pending'
  });
  car.bookedDates.push({ startDate: pickupDate, endDate: dropoffDate, bookingId: booking._id });
  await car.save();
  const populated = await Booking.findById(booking._id).populate('car', 'name brand images pricePerDay').populate('user', 'name email');
  res.status(201).json({ success: true, data: populated });
});

// @desc Get user bookings
const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('car', 'name brand images pricePerDay specs location')
    .populate('paymentId')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: bookings });
});

// @desc Get single booking
const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('car').populate('user', 'name email phone').populate('paymentId');
  if (!booking) { res.status(404); throw new Error('Booking not found'); }
  if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  res.json({ success: true, data: booking });
});

// @desc Cancel booking
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) { res.status(404); throw new Error('Booking not found'); }
  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  if (['completed', 'cancelled'].includes(booking.status)) {
    res.status(400); throw new Error(`Cannot cancel a ${booking.status} booking`);
  }
  booking.status = 'cancelled';
  booking.cancellationReason = req.body.reason || 'Cancelled by user';
  await booking.save();
  const car = await Car.findById(booking.car);
  if (car) {
    car.bookedDates = car.bookedDates.filter(d => d.bookingId?.toString() !== booking._id.toString());
    await car.save();
  }
  res.json({ success: true, data: booking });
});

// @desc Update booking status (admin)
const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    .populate('car', 'name brand').populate('user', 'name email');
  if (!booking) { res.status(404); throw new Error('Booking not found'); }
  res.json({ success: true, data: booking });
});

// @desc Get all bookings (admin)
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate('car', 'name brand images').populate('user', 'name email').sort({ createdAt: -1 });
  res.json({ success: true, data: bookings });
});

module.exports = { createBooking, getUserBookings, getBooking, cancelBooking, updateBookingStatus, getAllBookings };
