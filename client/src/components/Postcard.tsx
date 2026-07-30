import { useState } from "react";
import { Link } from "react-router-dom";
import { Globe, MoreVertical, ThumbsUp, MessageSquare, Share2, Send } from "lucide-react";
import axios from "axios";

export interface PostData {
  _id: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  timeAgo: string;
  author: {
    username: string;
    fullname: string;
    roleOrHeadline?: string;
    profilePic?: string;
  } | null;
  // ─── ADD THESE ───
  isLiked?: boolean;  // Track if current user liked this post
  likedBy?: string[]; // Array of user IDs who liked this post
}

interface PostCardProps {
  post: PostData;
  onLike?: (postId: string, isLiked: boolean) => void; // Optional callback for parent
}

const ActionButton = ({ 
  icon, 
  label, 
  active = false, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
  onClick?: () => void;
}) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition cursor-pointer bg-transparent border-none ${
      active 
        ? 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20' 
        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
    } active:scale-[0.98]`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export const PostCard = ({ post, onLike }: PostCardProps) => {
  // ─── STATE ───
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isLoading, setIsLoading] = useState(false);

  if (!post.author) {
    return (
      <div className="bg-white dark:bg-zinc-900 border-y sm:border border-zinc-200 dark:border-zinc-800/80 p-4 transition-colors duration-200">
        <p className="text-sm text-zinc-400 dark:text-zinc-500 italic">
          Post author no longer exists
        </p>
      </div>
    );
  }

  const isVideo = post.imageUrl?.match(/\.(mp4|webm|ogg|mov|mkv)$/i);

  // ─── HANDLE LIKE ───
  const handleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    const previousLiked = isLiked;
    const previousCount = likesCount;

    // Optimistic update
    setIsLiked(!isLiked);
    setLikesCount(prev => !isLiked ? prev + 1 : prev - 1);

    try {
      // ─── API CALL TO LIKE/UNLIKE ───
      const res = await axios.post(
        `/users/${post._id}/like`,
        {},
        { withCredentials: true }
      );

      if (res.data?.success) {
        // Update with server response
        setIsLiked(res.data.isLiked);
        setLikesCount(res.data.likesCount);
        
        // Notify parent component
        if (onLike) {
          onLike(post._id, res.data.isLiked);
        }
      } else {
        // Revert on failure
        setIsLiked(previousLiked);
        setLikesCount(previousCount);
      }
    } catch (error) {
      console.error('Failed to like/unlike post:', error);
      // Revert on error
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border-y sm:border border-zinc-200 dark:border-zinc-800/80 p-4 transition-colors duration-200">
      {/* Header Profile Frame Row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <Link to={`/profile/${post.author.username}`} className="shrink-0">
            <div className="h-10 w-10 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center font-bold text-sm text-white shadow-xs overflow-hidden select-none">
              {post.author.profilePic ? (
                <img src={post.author.profilePic} alt={post.author.fullname} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs">{post.author.fullname.charAt(0)}</span>
              )}
            </div>
          </Link>

          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline">
              <Link to={`/profile/${post.author.username}`}>
                {post.author.fullname}
              </Link>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-60">
              {post.author.roleOrHeadline || "CodebergHub Developer"}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
              <span>{post.timeAgo}</span>
              <span>•</span>
              <Globe className="h-2.5 w-2.5" />
            </div>
          </div>
        </div>

        <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-1 bg-transparent border-none cursor-pointer">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Main Post Body */}
      <div className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed mb-3 whitespace-pre-wrap">
        {post.content}
      </div>

      {/* Media Attachment */}
      {post.imageUrl && (
        <div className="my-3 -mx-4 sm:mx-0 overflow-hidden bg-zinc-50 dark:bg-zinc-950 sm:rounded-xl border-y sm:border border-zinc-200/60 dark:border-zinc-800/60 shadow-inner flex items-center justify-center">
          {isVideo ? (
            <video
              src={post.imageUrl}
              controls
              playsInline
              preload="metadata"
              className="w-full max-h-105 bg-black/90 dark:bg-zinc-950 object-contain block focus:outline-hidden"
              style={{ contentVisibility: 'auto' }}
            >
              Your browser does not support the video playback stream.
            </video>
          ) : (
            <img
              src={post.imageUrl}
              alt="Shared Graphic"
              className="w-full h-auto object-cover max-h-96"
              loading="lazy"
            />
          )}
        </div>
      )}

      {/* ─── UPDATED: Social Engagement Statistics ─── */}
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-2 mb-2 text-xs text-zinc-400 dark:text-zinc-500">
        <button 
          onClick={handleLike}
          disabled={isLoading}
          className={`flex items-center gap-1 hover:underline cursor-pointer bg-transparent border-none ${
            isLiked ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'
          }`}
        >
          <span className={`flex items-center justify-center h-4 w-4 rounded-full text-[9px] text-white font-bold ${
            isLiked ? 'bg-indigo-600' : 'bg-indigo-500'
          }`}>
            👍
          </span>
          <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
        </button>
        <div className="hover:underline cursor-pointer">
          {post.commentsCount} comments
        </div>
      </div>

      {/* ─── UPDATED: Bottom Action Buttons ─── */}
      <div className="grid grid-cols-4 gap-1 pt-0.5">
        <ActionButton 
          icon={<ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-indigo-600' : ''}`} />} 
          label="Like" 
          active={isLiked}
          onClick={handleLike}
        />
        <ActionButton icon={<MessageSquare className="h-4 w-4" />} label="Comment" />
        <ActionButton icon={<Share2 className="h-4 w-4" />} label="Share" />
        <ActionButton icon={<Send className="h-4 w-4" />} label="Send" />
      </div>
    </div>
  );
};