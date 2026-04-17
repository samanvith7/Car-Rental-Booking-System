const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

// @desc Create payment intent (Stripe)
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  const booking = await Booking.findById(bookingId).populate('car', 'name brand');
  if (!booking) { res.status(404); throw new Error('Booking not found'); }
  if (booking.user.toString() !== req.user._id.toString()) { res.status(403); throw new Error('Not authorized'); }

  let paymentIntent;
  let clientSecret;
  let transactionId;

  if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_placeholder') {
    paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalAmount * 100),
      currency: 'usd',
      metadata: { bookingId: booking._id.toString(), userId: req.user._id.toString() },
    });
    clientSecret = paymentIntent.client_secret;
    transactionId = paymentIntent.id;
  } else {
    // Mock payment for demo
    transactionId = 'mock_pi_' + Date.now();
    clientSecret = 'mock_secret_' + Date.now();
  }

  const payment = await Payment.create({
    booking: bookingId, user: req.user._id, amount: booking.totalAmount,
    stripePaymentIntentId: transactionId, stripeClientSecret: clientSecret,
    transactionId, status: 'pending',
    method: process.env.STRIPE_SECRET_KEY ? 'stripe' : 'mock',
  });

  booking.paymentId = payment._id;
  await booking.save();

  res.json({ success: true, data: { clientSecret, paymentId: payment._id, transactionId, amount: booking.totalAmount } });
});

// @desc Confirm payment (mock or webhook simulation)
const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentId, transactionId } = req.body;
  const payment = await Payment.findById(paymentId);
  if (!payment) { res.status(404); throw new Error('Payment not found'); }
  if (payment.user.toString() !== req.user._id.toString()) { res.status(403); throw new Error('Not authorized'); }

  payment.status = 'succeeded';
  payment.transactionId = transactionId || payment.transactionId;
  await payment.save();

  const booking = await Booking.findById(payment.booking);
  if (booking) {
    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    await booking.save();
  }

  res.json({ success: true, data: payment, booking });
});

// @desc Mock payment success (no real Stripe)
const mockPayment = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  const booking = await Booking.findById(bookingId);
  if (!booking) { res.status(404); throw new Error('Booking not found'); }

  const transactionId = 'mock_txn_' + Date.now();
  const payment = await Payment.create({
    booking: bookingId, user: req.user._id, amount: booking.totalAmount,
    transactionId, status: 'succeeded', method: 'mock',
  });

  booking.status = 'confirmed';
  booking.paymentStatus = 'paid';
  booking.paymentId = payment._id;
  await booking.save();

  res.json({ success: true, data: { payment, booking } });
});

// @desc Get user payments
const getUserPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id })
    .populate({ path: 'booking', populate: { path: 'car', select: 'name brand images' } })
    .sort({ createdAt: -1 });
  res.json({ success: true, data: payments });
});

module.exports = { createPaymentIntent, confirmPayment, mockPayment, getUserPayments };
