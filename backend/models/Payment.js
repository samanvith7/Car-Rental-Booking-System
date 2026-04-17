const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'usd' },
  method: { type: String, enum: ['stripe', 'mock'], default: 'stripe' },
  status: { type: String, enum: ['pending', 'succeeded', 'failed', 'refunded'], default: 'pending' },
  stripePaymentIntentId: { type: String },
  stripeClientSecret: { type: String },
  transactionId: { type: String },
  receiptUrl: { type: String },
  refundId: { type: String },
  metadata: { type: Object, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
