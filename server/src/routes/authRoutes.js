import express from 'express';
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  completeOnboarding
} from '../controller/auth.controller.js';
import {
  protectRoute,
} from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Public Authentication Endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.put('/onboard', protectRoute, completeOnboarding);

// // 2. Token Refresh Endpoint (Uses your custom cookie validator middleware)
// router.post('/refresh-token', verifyRefreshToken, refreshAccessToken);

// 3. Protected Route (Verifies that our protectRoute gatekeeper works!)
router.get('/profile', protectRoute, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to your private profile dashboard!',
    user: req.user, // Available because protectRoute attached the verified user to req
  });
});

export default router;