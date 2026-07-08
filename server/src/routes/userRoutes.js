import express from 'express';
import { getProfile, createPost, getAllPosts } from '../controller/user.controller.js';
import { protectRoute } from '../middleware/authMiddleware.js'; // Your JWT validation middleware

const router = express.Router();

// Both routes require a valid logged-in session token

router.get('/profile', protectRoute, getProfile);
router.post('/posts', protectRoute, createPost);
router.get('/posts', protectRoute, getAllPosts); // Optional: Fetch all posts for the logged-in user

export default router;