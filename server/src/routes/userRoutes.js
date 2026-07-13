import express from 'express';
import {
  getProfile,
  createPost,
  getAllPosts,
  getPublicProfileByUsername
} from '../controller/user.controller.js';
import { protectRoute } from '../middleware/authMiddleware.js'; // Your JWT validation middleware
import { upload } from '../middleware/multerMiddleware.js'; // Your multer configuration for file uploads

const router = express.Router();

// Both routes require a valid logged-in session token

router.get('/profile', protectRoute, getProfile);
router.post('/posts', protectRoute, upload.single('image'), createPost);
router.get('/profile/:username', protectRoute, getPublicProfileByUsername); // Fetch a public profile by username
router.get('/posts', protectRoute, getAllPosts); // Optional: Fetch all posts for the logged-in user
export default router;