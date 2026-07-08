import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateTokensAndSetCookie from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

export const getProfile = asyncHandler(async (req, res) => {
  // req.user._id is populated dynamically by your protectRoute middleware token decoder
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User profile not found'); // ◄ Automatically picked up by your errorHandler middleware
  }

  res.status(200).json({ 
    success: true, 
    data: user 
  });
});

export const createPost = asyncHandler(async (req, res) => {
  const { content, imageUrl } = req.body;

  if (!content || !content.trim()) {
    res.status(400);
    throw new Error('Post content is required');
  }

  // Create the post instance anchoring the author directly to the logged-in user ID
  const newPost = await Post.create({
    author: req.user._id, // Set automatically via your protectRoute token parsing middleware
    content,
    imageUrl: imageUrl || '',
  });

  res.status(201).json({
    success: true,
    message: 'Post published successfully',
    data: newPost,
  });
});

export const getAllPosts = asyncHandler(async (req, res) => {
  // 1. Pass { author: req.user._id } to isolate ONLY your posts on this route
  const posts = await Post.find({})
    .populate('author', 'fullname username profilePic roleOrHeadline')
    .sort({ createdAt: -1 });

  // 2. Double check your payload mapping names!
  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts, // This sends an array of posts containing filled author objects
  });
});