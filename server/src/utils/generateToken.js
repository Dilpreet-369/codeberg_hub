import jwt from 'jsonwebtoken';

const generateTokensAndSetCookie = (res, userId) => {
  // Generate token
  const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  });

  // Bake the session cookie into the browser container
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,    // Prevents rogue scripts from reading the session token
    secure: true,      // MANDATORY FOR PRODUCTION: Forces delivery over HTTPS
    sameSite: 'none',  // MANDATORY FOR PRODUCTION: Allows cookie to cross from Render to Vercel
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return refreshToken;
};  

export default generateTokensAndSetCookie;