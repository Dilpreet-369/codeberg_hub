import User from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateTokensAndSetCookie from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

// ─── REGISTER CONTROLLER (UPDATED FOR MVP USERNAME) ───
export const registerUser = asyncHandler(async (req, res) => {
  // 1. Destructure fullname, username, email, and password from user request payload
  const { fullname, username, email, password } = req.body;

  // 2. Strict verification: Ensure all essential credentials exist
  if (!fullname || !username || !email || !password) {
    res.status(400);
    throw new Error('Please provide all required fields (fullname, username, email, password)');
  }

  // 3. Prevent Duplication: Check if username OR email is already registered
  const userExists = await User.findOne({ 
    $or: [
      { email: email.toLowerCase() }, 
      { username: username.toLowerCase() }
    ] 
  });

  if (userExists) {
    res.status(400);
    // Explicit condition matching for clearer frontend error response messages
    if (userExists.username === username.toLowerCase()) {
      throw new Error('This username is already taken');
    }
    throw new Error('A user with this email already exists');
  }

  // 4. Create the user profile inside your MongoDB collection
  const user = await User.create({
    fullname,
    username,
    email,
    password,
  });

  if (user) {
    // 5. Generate secure JWT tokens and issue refresh cookie
    const accessToken = generateTokensAndSetCookie(res, user._id);

    // 6. Return response array matching your system layout constraints
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        role: user.role,
        accessToken,
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data provided');
  }
});

// ─── LOGIN CONTROLLER (UPDATED FOR UNIQUE FIELD LOOKUPS) ───
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // 1. Find user by email and pull down hidden password field configuration
  const user = await User.findOne({ email }).select('+password');

  // 2. Validate user document existence and password alignment via instance helper methods
  if (user && (await user.comparePassword(password))) {
    const accessToken = generateTokensAndSetCookie(res, user._id);

    res.status(200).json({
      success: true,  
      data: {
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        role: user.role,
        accessToken,
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// ─── REFRESH TOKEN CONTROLLER (UNCHANGED CORE IMPLEMENTATION) ───
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });

  res.status(200).json({
    success: true,
    accessToken,
  });
});

// ─── LOGOUT CONTROLLER (UNCHANGED COOKIE TERMINATION) ───
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0), 
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

export const completeOnboarding = async (req, res) => {
  try {
    // 1. Grab the authenticated user's ID from your auth middleware (e.g., protect/verifyToken)
    const userId = req.user?._id; 

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Access token missing or invalid.",
      });
    }

    // 2. Extract the profile fields from the request body
    const { bio, workOrStudy, interests } = req.body;

    // 3. Find the user and update the fields
    // We explicitly set isOnboarded to true whether they filled it out or hit "Skip"
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          bio: bio || "",
          workOrStudy: workOrStudy || "",
          skills: Array.isArray(interests) ? interests : [],
          isOnboarded: true, 
        },
      },
      { 
        returnDocument: 'after',          // Returns the freshly updated document
        runValidators: true // Ensures schema constraints (like max length) are enforced
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    // 4. Return the updated user object to sync with the frontend state
    return res.status(200).json({
      success: true,
      message: "Onboarding profile synchronization complete.",
      data: {
        fullname: updatedUser.fullname,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        workOrStudy: updatedUser.workOrStudy,
        interests: updatedUser.interests,
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

// export const updateOnboarding = asyncHandler(async (req, res) => {
//   const { bio, workOrStudy, interests } = req.body;

//   // Option validation logic matching your registration guidelines
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user._id,
//     {
//       $set: {
//         bio,
//         workOrStudy,
//         interests,
//         isOnboarded: true, // Flips flag so frontend skips the onboarding screen next time
//       },
//     },
//     { returnDocument: 'after', runValidators: true } // Production modern Mongoose options
//   );

//   if (!updatedUser) {
//     res.status(404);
//     throw new Error('Unable to sync onboarding data: User account not found');
//   }

//   res.status(200).json({
//     success: true,
//     message: 'Onboarding data synchronized successfully',
//     data: updatedUser,
//   });
// });