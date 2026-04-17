const asyncHandler = require('express-async-handler');
const Car = require('../models/Car');

// @desc Get all cars with filters
const getCars = asyncHandler(async (req, res) => {
  const { location, minPrice, maxPrice, category, type, fuelType, transmission, seats, search, available } = req.query;
  let query = {};
  if (location) query.location = { $regex: location, $options: 'i' };
  if (category) query.category = category;
  if (type) query.type = type;
  if (fuelType) query['specs.fuelType'] = fuelType;
  if (transmission) query['specs.transmission'] = transmission;
  if (seats) query['specs.seats'] = parseInt(seats);
  if (available === 'true') query.availability = true;
  if (minPrice || maxPrice) {
    query.pricePerDay = {};
    if (minPrice) query.pricePerDay.$gte = parseInt(minPrice);
    if (maxPrice) query.pricePerDay.$lte = parseInt(maxPrice);
  }
  if (search) query.$or = [
    { name: { $regex: search, $options: 'i' } },
    { brand: { $regex: search, $options: 'i' } },
    { model: { $regex: search, $options: 'i' } },
  ];
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const total = await Car.countDocuments(query);
  const cars = await Car.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
  res.json({ success: true, count: cars.length, total, pages: Math.ceil(total / limit), currentPage: page, data: cars });
});

// @desc Get single car
const getCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) { res.status(404); throw new Error('Car not found'); }
  res.json({ success: true, data: car });
});

// @desc Create car (admin)
const createCar = asyncHandler(async (req, res) => {
  const car = await Car.create(req.body);
  res.status(201).json({ success: true, data: car });
});

// @desc Update car (admin)
const updateCar = asyncHandler(async (req, res) => {
  const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!car) { res.status(404); throw new Error('Car not found'); }
  res.json({ success: true, data: car });
});

// @desc Delete car (admin)
const deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);
  if (!car) { res.status(404); throw new Error('Car not found'); }
  await car.deleteOne();
  res.json({ success: true, message: 'Car deleted' });
});

// @desc Get featured cars
const getFeaturedCars = asyncHandler(async (req, res) => {
  const cars = await Car.find({ availability: true }).sort({ rating: -1 }).limit(6);
  res.json({ success: true, data: cars });
});

module.exports = { getCars, getCar, createCar, updateCar, deleteCar, getFeaturedCars };
