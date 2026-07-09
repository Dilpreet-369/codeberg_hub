import User from '../models/user.model.js';
import Post from '../models/post.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../middleware/multerMiddleware.js'; // ◄ 1. Import your cloud upload asset pusher
// import { io } from '../server.js'; // ◄ 2. Import the Socket.io server instance from server.js

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

export const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content || !content.trim()) {
    res.status(400);
    throw new Error('Post content is required');
  }

  // 3. INTERCEPT INCOMING MULTIPART FILE
  // If the user appended an image file, push it to Cloudinary and get the live CDN URL
  let uploadedImageUrl = '';
  if (req.file) {
    uploadedImageUrl = await uploadToCloudinary(req.file.path);
  }

  // 4. SAVE CLEAN TEXT DATA STRINGS TO MONGODB
  const newPost = await Post.create({
    author: req.user._id,
    content,
    imageUrl: uploadedImageUrl, // Saves the permanent secure URL string (or stays empty if no image)
  });

  // 5. HYDRATE FIELD PROPERTIES
  // Fill the reference author ObjectId with their actual profile details before sending it out
  const populatedPost = await Post.findById(newPost._id).populate(
    'author',
    'fullname username profilePic roleOrHeadline'
  );

  // 6. REAL-TIME BROADCAST MEGAPHONE
  // Blasts the complete post out to everyone connected via socket instantly
  // io.emit("NEW_POST_PUBLISHED", populatedPost);

  res.status(201).json({
    success: true,
    message: 'Post published successfully',
    data: populatedPost,
  });
});

export const getAllPosts = asyncHandler(async (req, res) => {
  // Querying with an empty object {} means we fetch the global timeline from everyone
  const posts = await Post.find({})
    .populate('author', 'fullname username profilePic roleOrHeadline')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts, 
  });
});