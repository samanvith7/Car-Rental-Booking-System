const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  category: { type: String, enum: ['Economy', 'Premium', 'Luxury', 'SUV', 'Sedan', 'Hatchback', 'Van'], required: true },
  type: { type: String, enum: ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Van', 'Convertible'], required: true },
  pricePerDay: { type: Number, required: true },
  images: [{ type: String }],
  features: [{ type: String }],
  specs: {
    fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'], required: true },
    transmission: { type: String, enum: ['Automatic', 'Manual'], required: true },
    seats: { type: Number, required: true },
    mileage: { type: String },
    engine: { type: String },
    horsepower: { type: Number },
    acceleration: { type: String },
    topSpeed: { type: String },
  },
  location: { type: String, required: true },
  availability: { type: Boolean, default: true },
  bookedDates: [{
    startDate: Date,
    endDate: Date,
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
  }],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  description: { type: String, default: '' },
  registrationNumber: { type: String, unique: true },
  color: { type: String, default: 'White' },
}, { timestamps: true });

module.exports = mongoose.model('Car', carSchema);
