const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  pickupDate: { type: Date, required: true },
  dropoffDate: { type: Date, required: true },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  totalDays: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded', 'failed'], default: 'pending' },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  cancellationReason: { type: String, default: '' },
  notes: { type: String, default: '' },
  bookingNumber: { type: String, unique: true },
}, { timestamps: true });

bookingSchema.pre('save', function(next) {
  if (!this.bookingNumber) {
    this.bookingNumber = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
