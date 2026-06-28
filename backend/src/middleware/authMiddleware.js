import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * 🛡️ protectRoute: Protects standard API routes (like posting, liking, viewing profiles).
 * Expects the Short-Term ACCESS TOKEN in the Authorization Header.
 */
export const protectRoute = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];

    // 🚨 CHANGED HERE: Explicitly use ACCESS_TOKEN_SECRET instead of a generic secret
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const currentUser = await User.findById(decoded.id).select('-password');

    if (!currentUser) {
      res.status(401);
      throw new Error('Not authorized, user profile no longer exists');
    }

    req.user = currentUser;
    return next();
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no access token provided');
  }
});

/**
 * 🔄 verifyRefreshToken: Used ONLY on the "/api/auth/refresh" endpoint.
 * Expects the Long-Term REFRESH TOKEN inside the secure HTTP-Only cookie.
 */
export const verifyRefreshToken = asyncHandler(async (req, res, next) => {
  // Extract the cookie using cookie-parser
  const token = req.cookies.refreshToken;

  if (!token) {
    res.status(401);
    throw new Error('Session expired or invalid, please log in again');
  }

  // 🚨 Use REFRESH_TOKEN_SECRET to decode this specific token
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  
  req.userId = decoded.id; // Pass just the ID down to the refresh controller function
  next();
});