const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Car = require('../models/Car');

// @desc Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  user.avatar = req.body.avatar || user.avatar;
  user.drivingLicense = req.body.drivingLicense || user.drivingLicense;
  if (req.body.address) user.address = { ...user.address, ...req.body.address };
  if (req.body.password) user.password = req.body.password;
  const updated = await user.save();
  res.json({
    success: true,
    data: {
      _id: updated._id, name: updated.name, email: updated.email,
      role: updated.role, phone: updated.phone, avatar: updated.avatar,
      address: updated.address, drivingLicense: updated.drivingLicense
    }
  });
});

// @desc Toggle wishlist
const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const carId = req.params.carId;
  const car = await Car.findById(carId);
  if (!car) { res.status(404); throw new Error('Car not found'); }
  const idx = user.wishlist.indexOf(carId);
  let action;
  if (idx > -1) { user.wishlist.splice(idx, 1); action = 'removed'; }
  else { user.wishlist.push(carId); action = 'added'; }
  await user.save();
  res.json({ success: true, action, wishlist: user.wishlist });
});

// @desc Get wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json({ success: true, data: user.wishlist });
});

module.exports = { updateProfile, toggleWishlist, getWishlist };
