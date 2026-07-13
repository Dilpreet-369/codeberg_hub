import { Globe, MoreVertical, ThumbsUp, MessageSquare, Share2, Send } from "lucide-react";

export interface PostData {
  _id: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  timeAgo: string;
  author: {
    fullname: string;
    roleOrHeadline?: string;
    profilePic?: string;
  } | null; // ✅ Author can be null if user deleted
}

const ActionButton = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 active:scale-[0.98] transition cursor-pointer bg-transparent border-none">
    {icon}
    <span>{label}</span>
  </button>
);

export const PostCard = ({ post }: { post: PostData }) => {
  
  // ✅ ADDED: Check if author exists - prevents crash when user is deleted
  if (!post.author) {
    return (
      <div className="bg-white dark:bg-zinc-900 border-y sm:border border-zinc-200 dark:border-zinc-800/80 p-4 transition-colors duration-200">
        <p className="text-sm text-zinc-400 dark:text-zinc-500 italic">
          Post author no longer exists
        </p>
      </div>
    );
  }
  
  // ─── MEDIA RECOGNITION ENGINE ───
  // Scans the asset link for common video extensions (case-insensitive)
  const isVideo = post.imageUrl?.match(/\.(mp4|webm|ogg|mov|mkv)$/i);

  return (
    <div className="bg-white dark:bg-zinc-900 border-y sm:border border-zinc-200 dark:border-zinc-800/80 p-4 transition-colors duration-200">
      
      {/* Header Profile Frame Row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center font-bold text-sm text-white shadow-xs overflow-hidden select-none shrink-0">
            {post.author.profilePic ? (
              <img src={post.author.profilePic} alt={post.author.fullname} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs">{post.author.fullname.charAt(0)}</span>
            )}
          </div>

          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight hover:underline cursor-pointer">
              {post.author.fullname}
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

      {/* ─── STYLISH CONDITIONAL MEDIA ATTACHMENT FRAME ─── */}
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

      {/* Social Engagement Statistics Metric Row */}
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-2 mb-2 text-xs text-zinc-400 dark:text-zinc-500">
        <div className="flex items-center gap-1">
          <span className="flex items-center justify-center h-4 w-4 rounded-full bg-indigo-500 text-[9px] text-white font-bold">
            👍
          </span>
          <span>{post.likesCount}</span>
        </div>
        <div className="hover:underline cursor-pointer">
          {post.commentsCount} comments
        </div>
      </div>

      {/* Bottom Action Grid Controller Row */}
      <div className="grid grid-cols-4 gap-1 pt-0.5">
        <ActionButton icon={<ThumbsUp className="h-4 w-4" />} label="Like" />
        <ActionButton icon={<MessageSquare className="h-4 w-4" />} label="Comment" />
        <ActionButton icon={<Share2 className="h-4 w-4" />} label="Share" />
        <ActionButton icon={<Send className="h-4 w-4" />} label="Send" />
      </div>

    </div>
  );
};