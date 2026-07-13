import User from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateTokensAndSetCookie from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';
import Post from '../models/post.model.js';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using project-specific credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── REGISTER CONTROLLER ───
export const registerUser = asyncHandler(async (req, res) => {
  const { fullname, username, email, password } = req.body;

  if (!fullname || !username || !email || !password) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const userExists = await User.findOne({ 
    $or: [
      { email: email.toLowerCase() }, 
      { username: username.toLowerCase() }
    ] 
  });

  if (userExists) {
    res.status(400);
    if (userExists.username === username.toLowerCase()) {
      throw new Error('This username is already taken');
    }
    throw new Error('A user with this email already exists');
  }

  const user = await User.create({
    fullname,
    username,
    email,
    password,
  });

  if (user) {
    // ✅ This sets the httpOnly cookie - THAT'S IT, WE'RE DONE WITH TOKENS
    generateTokensAndSetCookie(res, user._id);

    // ✅ NEVER send the token in the response body
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        isOnboarded: user.isOnboarded || false,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data provided');
  }
});

// ─── LOGIN CONTROLLER ───
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.comparePassword(password))) {
    // ✅ This sets the httpOnly cookie
    generateTokensAndSetCookie(res, user._id);

    // ✅ NEVER send the token in the response body
    res.status(200).json({
      success: true,  
      data: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        isOnboarded: user.isOnboarded || false,
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// ─── REFRESH TOKEN CONTROLLER ───
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // ✅ Generate NEW access token and set it as httpOnly cookie
  const accessToken = jwt.sign(
    { id: user._id }, 
    process.env.ACCESS_TOKEN_SECRET, 
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',  
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: '/',
  });

  res.status(200).json({
    success: true,
    message: 'Token refreshed',
  });
});

// ─── LOGOUT CONTROLLER ───
export const logoutUser = asyncHandler(async (req, res) => {
  // ✅ Clear BOTH cookies
  res.cookie('accessToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  });

  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

// ─── ONBOARDING CONTROLLER ───
export const completeOnboarding = async (req, res) => {
  try {
    const userId = req.user?._id; 

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Access token missing or invalid.",
      });
    }

    const { bio, workOrStudy, interests } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          bio: bio || "",
          workOrStudy: workOrStudy || "",
          interests: Array.isArray(interests) ? interests : [], // ✅ Fixed: was "skills"
          isOnboarded: true, 
        },
      },
      { 
        returnDocument: 'after',
        runValidators: true
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    // ✅ Return the correct field name "interests" not "skills"
    return res.status(200).json({
      success: true,
      message: "Onboarding complete.",
      data: {
        _id: updatedUser._id,
        fullname: updatedUser.fullname,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        workOrStudy: updatedUser.workOrStudy,
        interests: updatedUser.interests, // ✅ Matches what we saved
        isOnboarded: updatedUser.isOnboarded,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Onboarding Failed: ${error.message}`,
    });
  }
};

// Helper function to extract the Cloudinary public_id from its URL
// Upgraded to extract both the Public ID and the true Cloudinary Resource Type
const getPublicIdFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  // 1. Determine resource type by inspecting the path preceding /upload/
  let resourceType = 'image'; // default fallback
  if (url.includes('/video/upload/')) {
    resourceType = 'video';
  } else if (url.includes('/raw/upload/')) {
    resourceType = 'raw';
  }

  const parts = url.split('/upload/');
  if (parts.length < 2) return null;
  let pathWithExtension = parts[1];
  
  // Remove version prefix (e.g., v1720857321/) if present
  pathWithExtension = pathWithExtension.replace(/^v\d+\//, '');
  
  // Remove the file extension  
  let publicId = pathWithExtension;
  const lastDotIndex = pathWithExtension.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    publicId = pathWithExtension.substring(0, lastDotIndex);
  }
  
  return { publicId, resourceType };
};

// ─── DELETE ACCOUNT CONTROLLER ───
export const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    res.status(401);
    throw new Error('Unauthorized: User not authenticated');
  }

  // 1. Query all posts matching this author
  const posts = await Post.find({ author: userId });

  // 2. Extract media URLs and delete corresponding Cloudinary assets dynamically
  const imageUrls = posts.map((post) => post.imageUrl).filter(Boolean);
  
  for (const url of imageUrls) {
    const assetData = getPublicIdFromUrl(url);
    
    if (assetData && assetData.publicId) {
      try {
        // Explicitly defining resource_type ensures both videos and images are dropped
        await cloudinary.uploader.destroy(assetData.publicId, {
          resource_type: assetData.resourceType,
          invalidate: true // Invalidates CDN cached copies across edge servers
        });
      } catch (error) {
        console.error(`Failed to delete Cloudinary asset ${assetData.publicId}:`, error);
      }
    }
  }

  // 3. Delete all posts authored by the user
  await Post.deleteMany({ author: userId });

  // 4. Delete the user document
  await User.findByIdAndDelete(userId);

  // 5. Clear authentication/session cookies with environment-matched configuration flags
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);

  // 6. Return response success state
  res.status(200).json({ success: true });
});