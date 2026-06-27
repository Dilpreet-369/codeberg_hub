import User from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateTokensAndSetCookie from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Check if all required fields are provided
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // 2. Check if user already exists in the database
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('A user with this email already exists');
  }

  // 3. Create the user (Our Schema pre-save hook handles password hashing!)
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    // 4. Generate tokens and drop the Refresh Token into an HTTP-only cookie
    const accessToken = generateTokensAndSetCookie(res, user._id);

    // 5. Send successful response with user details and short-term access token
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data provided');
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // 1. Find user and explicitly select password field (since select: false is on the schema)
  const user = await User.findOne({ email }).select('+password');

  // 2. Verify user exists and the password matches via our Schema Instance Method
  if (user && (await user.comparePassword(password))) {
    const accessToken = generateTokensAndSetCookie(res, user._id);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  // req.userId is passed down smoothly by your verifyRefreshToken middleware
  const user = await User.findById(req.userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Generate a brand new short-term access token
  const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });

  res.status(200).json({
    success: true,
    accessToken,
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  // Erase the cookie from the client's browser profile instantly
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0), // Sets expiration to a past date, wiping it out instantly
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});