import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    // The link connecting this post to its developer account creator
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Must precisely match the model name string in your user.model.js
      required: [true, 'A post must be anchored to an authentic user profile'],
    },
    // The main text string content
    content: {
      type: String,
      required: [true, 'Post content cannot be empty'],
      trim: true,
      maxlength: [5000, 'Post volume limits capped at 5000 characters'],
    },
    // Array framework for holding attached media urls (e.g. Unsplash, Cloudinary links)
    imageUrl: {
      type: String,
      default: '',
    },
    // Array tracking references of users who clicked Like
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Explicit array tracking separate comment identifiers mapped to this post thread
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment', // Points to your upcoming comment collection
      },
    ],
  },
  {
    timestamps: true, // Automatically registers createdAt and updatedAt timestamps
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── VIRTUAL METRICS FOR FRONTEND COMPATIBILITY ───
// These derive dynamic numbers instantly without saving stale counter values directly to disk

// Returns post.likesCount directly to match your frontend payload signature
postSchema.virtual('likesCount').get(function () {
  return this.likes ? this.likes.length : 0;
});

// Returns post.commentsCount directly to match your frontend payload signature
postSchema.virtual('commentsCount').get(function () {
  return this.comments ? this.comments.length : 0;
});

// ─── INDEXES FOR FEED OPTIMIZATION ───
// Ensures sorting reverse-chronologically (newest posts first) remains lightning fast
postSchema.index({ createdAt: -1 });

const Post = mongoose.model('Post', postSchema);
export default Post;