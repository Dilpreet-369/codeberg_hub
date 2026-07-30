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
    data: user,
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
    username: { $regex: new RegExp(`^${username}$`, 'i') },
  }).select('-password');

  if (!targetUser) {
    res.status(404);
    throw new Error(`Developer profile for @${username} could not be found`);
  }

  res.status(200).json({
    success: true,
    data: targetUser,
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
    'fullname username profilePic roleOrHeadline',
  );

  res.status(201).json({
    success: true,
    message: 'Post published successfully',
    data: populatedPost,
  });
});

// ─── EXISTING: GET COMMUNITY TIMELINE ───
// In your getAllPosts controller
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'fullname username profilePic roleOrHeadline')
      .sort({ createdAt: -1 });

    // ─── ADD VIRTUALS TO RESPONSE ───
    const postsWithCounts = posts.map((post) => ({
      ...post.toObject(),
      likesCount: post.likesCount, // Virtual
      commentsCount: post.commentsCount, // Virtual
      isLiked: post.likes.includes(req.user._id), // Check if current user liked
    }));

    res.status(200).json({
      success: true,
      data: postsWithCounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch posts',
    });
  }
};

// In user.controller.js

export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // Check if user already liked this post
    const likedIndex = post.likes.indexOf(userId);
    const isLiked = likedIndex !== -1;

    if (isLiked) {
      // ─── UNLIKE: Remove user from likes array ───
      post.likes.splice(likedIndex, 1);
    } else {
      // ─── LIKE: Add user to likes array ───
      post.likes.push(userId);
    }

    await post.save();

    // ─── RETURN UPDATED DATA ───
    res.status(200).json({
      success: true,
      likesCount: post.likes.length, // Using actual array length
      isLiked: !isLiked,
    });
  } catch (error) {
    console.error('Error in toggleLike:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle like',
    });
  }
};
