const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

// @desc Register user
// @route POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    res.status(400); throw new Error('Please provide all required fields');
  }
  const userExists = await User.findOne({ email });
  if (userExists) { res.status(400); throw new Error('User already exists with this email'); }
  const user = await User.create({ name, email, password, phone });
  res.status(201).json({
    success: true,
    data: {
      _id: user._id, name: user.name, email: user.email,
      role: user.role, phone: user.phone, avatar: user.avatar,
      wishlist: user.wishlist, token: generateToken(user._id)
    }
  });
});

// @desc Login user
// @route POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400); throw new Error('Please provide email and password'); }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401); throw new Error('Invalid email or password');
  }
  if (!user.isActive) { res.status(401); throw new Error('Account has been deactivated'); }
  res.json({
    success: true,
    data: {
      _id: user._id, name: user.name, email: user.email,
      role: user.role, phone: user.phone, avatar: user.avatar,
      wishlist: user.wishlist, address: user.address,
      token: generateToken(user._id)
    }
  });
});

// @desc Get current user
// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name brand pricePerDay images rating');
  res.json({ success: true, data: user });
});

module.exports = { registerUser, loginUser, getMe };
