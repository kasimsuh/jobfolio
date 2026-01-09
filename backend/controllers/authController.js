const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, university, major, graduationYear } = req.body;
  
  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }
  
  // Create user
  const user = await User.create({
    name,
    email,
    password,
    university,
    major,
    graduationYear,
  });
  
  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        major: user.major,
        graduationYear: user.graduationYear,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Validate email & password
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide an email and password');
  }
  
  // Check for user (include password for comparison)
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  
  // Check password
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  
  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      university: user.university,
      major: user.major,
      graduationYear: user.graduationYear,
      token: generateToken(user._id),
    },
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  res.json({
    success: true,
    data: user,
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, university, major, graduationYear } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, university, major, graduationYear },
    { new: true, runValidators: true }
  );
  
  res.json({
    success: true,
    data: user,
  });
});

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  const user = await User.findById(req.user._id).select('+password');
  
  // Check current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }
  
  user.password = newPassword;
  await user.save();
  
  res.json({
    success: true,
    data: {
      token: generateToken(user._id),
    },
  });
});

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
};
