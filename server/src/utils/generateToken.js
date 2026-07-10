import jwt from 'jsonwebtoken';

/**
 * Generates both Access and Refresh tokens, and sets the Refresh Token in a secure HTTP-Only cookie.
 * @returns {String} The short-term Access Token to send back to the React frontend.
 */
const generateTokensAndSetCookie = (res, userId) => {
  // 1. Generate the short-term Access Token (15 minutes)
  const accessToken = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });

  // 2. Generate the long-term Refresh Token (7 days)
  const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });

  // 3. Bake the Refresh Token into a secure, encrypted HTTP-Only browser cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // Prevents JavaScript from reading the token (Blocks XSS attacks)
    secure: process.env.NODE_ENV === 'production', // Only sends via HTTPS in production
    sameSite: 'none', // Protects against CSRF forging attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds matching your .env
  });

  // 4. Return the access token (The controller will send this back in the JSON body)
  return accessToken;
};

export default generateTokensAndSetCookie;