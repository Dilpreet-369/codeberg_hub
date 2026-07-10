import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';

export const protectRoute = asyncHandler(async (req, res, next) => {
  // Read the cookie directly from the parsed cookie container
  const token = req.cookies.refreshToken;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, session token missing. Please log in.');
  }

  try {
    // Validate string against the exact secret used to sign it
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const currentUser = await User.findById(decoded.id).select('-password');

    if (!currentUser) {
      res.status(401);
      throw new Error('Not authorized, user profile no longer exists');
    }

    // Attach the verified profile payload directly to the request object
    req.user = currentUser;
    return next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, session expired or invalid');
  }
});