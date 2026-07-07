import express from 'express';
import { getMe, updateOnboarding } from '../controller/auth.controller.js';
import { protectRoute } from '../middleware/authMiddleware.js'; // Your JWT validation middleware

const router = express.Router();

// Both routes require a valid logged-in session token
router.get('/me', protectRoute, getMe);
router.put('/onboarding', protectRoute, updateOnboarding);

export default router;