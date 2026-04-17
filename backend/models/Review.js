const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true, trim: true },
  comment: { type: String, required: true },
  helpful: { type: Number, default: 0 },
}, { timestamps: true });

reviewSchema.index({ user: 1, car: 1 }, { unique: true });

reviewSchema.statics.calcAverageRating = async function(carId) {
  const stats = await this.aggregate([
    { $match: { car: carId } },
    { $group: { _id: '$car', avgRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } }
  ]);
  if (stats.length > 0) {
    await mongoose.model('Car').findByIdAndUpdate(carId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].numReviews
    });
  } else {
    await mongoose.model('Car').findByIdAndUpdate(carId, { rating: 0, numReviews: 0 });
  }
};

reviewSchema.post('save', function() { this.constructor.calcAverageRating(this.car); });
reviewSchema.post('remove', function() { this.constructor.calcAverageRating(this.car); });

module.exports = mongoose.model('Review', reviewSchema);
