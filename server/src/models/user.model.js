import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email address',
      ],
    },
    password: {
      type: String,
      // Required only if the user is NOT using Google OAuth
      required: function () {
        return !this.googleId;
      },
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Prevents password from being accidentally leaked in API responses
    },
    googleId: {
      type: String,
      default: null, // Stays null for standard users
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  },
);

// ✨ THE BULLETPROOF INDEX FIX:
// This instructs MongoDB to enforce uniqueness on googleId ONLY if it is a string.
// It will completely ignore all 'null' entries from regular registrations.
userSchema.index(
  { googleId: 1 },
  { 
    unique: true, 
    partialFilterExpression: { googleId: { $type: "string" } } 
  }
);

// 🔒 Pre-save Hook: Modern async/await version (No 'next' parameter!)
userSchema.pre('save', async function () {
  // 1. Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return;
  
  // 2. Extra safety guard: If there is no password (like a Google Sign-In user), exit
  if (!this.password) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // No next() needed; the async execution completes naturally here.
  } catch (error) {
    throw error; 
  }
});

// 🔑 Instance Method: Compares entered login password with hashed database password
userSchema.methods.comparePassword = async function (enteredPassword) {
  // Double-check we have a hashed password to compare against (safeguard for Google-only profiles)
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;