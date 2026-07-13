import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../middleware/multerMiddleware.js';

// ─── EXISTING: GET LOGGED-IN OWN PROFILE ───
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User profile not found');
  }

  res.status(200).json({ 
    success: true, 
    data: user 
  });
});

// ─── NEW: GET ANY PEER USER PROFILE BY THEIR USERNAME ───
export const getPublicProfileByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    res.status(400);
    throw new Error('Username target parameter is required');
  }

  // Find user by username using a case-insensitive match ($options: 'i')
  // Explicitly excludes sensitive credentials like passwords from transmission maps
  const targetUser = await User.findOne({ 
    username: { $regex: new RegExp(`^${username}$`, 'i') } 
  }).select('-password');

  if (!targetUser) {
    res.status(404);
    throw new Error(`Developer profile for @${username} could not be found`);
  }

  res.status(200).json({
    success: true,
    data: targetUser
  });
});

// ─── EXISTING: CREATE POST ENGINE ───
export const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || !content.trim()) {
    res.status(400);
    throw new Error('Post content is required');
  }

  let uploadedImageUrl = '';
  if (req.file) {
    uploadedImageUrl = await uploadToCloudinary(req.file.path);
  }

  const newPost = await Post.create({
    author: req.user._id,
    content,
    imageUrl: uploadedImageUrl,
  });

  const populatedPost = await Post.findById(newPost._id).populate(
    'author',
    'fullname username profilePic roleOrHeadline'
  );

  res.status(201).json({
    success: true,
    message: 'Post published successfully',
    data: populatedPost,
  });
});

// ─── EXISTING: GET COMMUNITY TIMELINE ───
export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({})
    .populate('author', 'fullname username profilePic roleOrHeadline')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts, 
  });
});