import { useState } from "react";
import { 
  Search, MessageSquare, ThumbsUp, Share2, Send, 
  Home, Users, SquarePlus, Bell, Briefcase, MoreVertical, Globe, ScanFace
} from "lucide-react";

// ─── INTERFACES FOR EXTENSIBILITY ───
interface PostAuthor {
  fullname: string;
  username: string;
  roleOrHeadline: string; // e.g., "Java Technical Lead" or "Student at GNDEC"
  avatarUrl?: string;
}

interface PostData {
  id: string;
  author: PostAuthor;
  timeAgo: string;
  content: string;
  imageUrl?: string; // Optional field for media attachments
  likesCount: number;
  commentsCount: number;
}

const Homepage = () => {
  // Temporary state matching our data collections logic
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  // Sample seed data mock reflecting the layout structure of image_ebb3aa.png
  const [posts] = useState<PostData[]>([
    {
      id: "1",
      author: {
        fullname: "Stanislav Naida",
        username: "snaida",
        roleOrHeadline: "Java Technical Lead — Ciklum",
      },
      timeAgo: "16h",
      content: "Hello, I am looking for a new career opportunity and would appreciate your support. Thanks in advance for any contact recommendation, advice, or tech stack mentorship!",
      likesCount: 77,
      commentsCount: 11
    },
    {
      id: "2",
      author: {
        fullname: "Vera Drozdova",
        username: "vdrozdova",
        roleOrHeadline: "UI/UX Designer",
      },
      timeAgo: "17h",
      content: "Just finalized the mobile-first dashboard asset mockups for the team. Clean layouts with high-contrast elements.",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80", // Placeholder matching visual reference card
      likesCount: 142,
      commentsCount: 24
    }
  ]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-16 transition-colors duration-200 selection:bg-indigo-500/20">
      
      {/* ─── TOP HEADER / STICKY SEARCH BAR (Matches image_ebb3aa.png Top Shelf) ─── */}
      <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-2 flex items-center gap-3">
        {/* User Mini Avatar Profile Trigger */}
        <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden shrink-0 cursor-pointer border border-zinc-300 dark:border-zinc-600">
          <div className="w-full h-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">
            DS
          </div>
        </div>

        {/* Unified Search Input Container */}
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search posts, stacks, developers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none focus:bg-white dark:focus:bg-zinc-800 focus:ring-1 focus:ring-zinc-400 border border-transparent dark:border-transparent transition"
          />
          <ScanFace className="absolute right-3 h-4 w-4 text-zinc-400 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300" />
        </div>

        {/* Global Chat Anchor Icon Link */}
        <button className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition relative bg-transparent border-none cursor-pointer">
          <MessageSquare className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500" />
        </button>
      </header>

      {/* ─── MAIN ACTIVITY FEED CONTAINER ─── */}
      <main className="w-full max-w-md mx-auto flex flex-col gap-2 mt-2 px-0 sm:px-2">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </main>

      {/* ─── PERSISTENT BOTTOM NAVIGATION (Matches image_ebb3aa.png Base Shelf) ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-2 py-1 flex justify-around items-center max-w-md mx-auto">
        <BottomNavItem 
          icon={<Home className="h-5 w-5" />} 
          label="Home" 
          active={activeTab === "home"} 
          onClick={() => setActiveTab("home")} 
        />
        <BottomNavItem 
          icon={<Users className="h-5 w-5" />} 
          label="Network" 
          active={activeTab === "network"} 
          onClick={() => setActiveTab("network")} 
        />
        <BottomNavItem 
          icon={<SquarePlus className="h-5 w-5" />} 
          label="Post" 
          active={activeTab === "post"} 
          onClick={() => setActiveTab("post")} 
        />
        <BottomNavItem 
          icon={<Bell className="h-5 w-5" />} 
          label="Notifications" 
          active={activeTab === "notifications"} 
          onClick={() => setActiveTab("notifications")} 
          badgeCount={4}
        />
        <BottomNavItem 
          icon={<Briefcase className="h-5 w-5" />} 
          label="Jobs" 
          active={activeTab === "jobs"} 
          onClick={() => setActiveTab("jobs")} 
        />
      </nav>

    </div>
  );
};

// ─── COMPONENT: MODULAR POST CARD ───
const PostCard = ({ post }: { post: PostData }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border-y sm:border border-zinc-200 dark:border-zinc-800/80 p-4 transition-colors duration-200">
      
      {/* Card Metadata Top Header Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          {/* Author Dynamic Avatar Asset */}
          <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-semibold text-sm text-zinc-700 dark:text-zinc-300">
            {post.author.fullname.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight hover:underline cursor-pointer">
              {post.author.fullname}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-60">
              {post.author.roleOrHeadline}
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

      {/* Post Structural Core Content */}
      <div className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed mb-3 whitespace-pre-wrap">
        {post.content}
      </div>

      {/* Optional Post Media Graphic Attachment Frame */}
      {post.imageUrl && (
        <div className="my-3 -mx-4 sm:mx-0 overflow-hidden bg-zinc-100 dark:bg-zinc-950 border-y sm:border border-zinc-200/60 dark:border-zinc-800/60">
          <img 
            src={post.imageUrl} 
            alt="Shared Content Graphic" 
            className="w-full h-auto object-cover max-h-72"
            loading="lazy"
          />
        </div>
      )}

      {/* Content Metrics Row Framework */}
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-2 mb-2 text-xs text-zinc-400 dark:text-zinc-500">
        <div className="flex items-center gap-1">
          <span className="flex items-center justify-center h-4 w-4 rounded-full bg-indigo-500 text-[9px] text-white font-bold">👍</span>
          <span>{post.likesCount}</span>
        </div>
        <div className="hover:underline cursor-pointer">
          {post.commentsCount} comments
        </div>
      </div>

      {/* Functional Interactive Social Response Action Pipeline Grid */}
      <div className="grid grid-cols-4 gap-1 pt-0.5">
        <ActionButton icon={<ThumbsUp className="h-4 w-4" />} label="Like" />
        <ActionButton icon={<MessageSquare className="h-4 w-4" />} label="Comment" />
        <ActionButton icon={<Share2 className="h-4 w-4" />} label="Share" />
        <ActionButton icon={<Send className="h-4 w-4" />} label="Send" />
      </div>

    </div>
  );
};

// ─── COMPONENT: REUSABLE SOCIAL INTERACTION BUTTON ───
const ActionButton = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="flex flex-col sm:flex-row items-center justify-center gap-1 py-1.5 rounded text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-800 dark:hover:text-zinc-200 transition text-[11px] sm:text-xs font-semibold bg-transparent border-none cursor-pointer">
    {icon}
    <span>{label}</span>
  </button>
);

// ─── COMPONENT: INDIVIDUAL NAVIGATION ANCHOR CELL ───
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badgeCount?: number;
}

const BottomNavItem = ({ icon, label, active, onClick, badgeCount }: NavItemProps) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center flex-1 py-1 transition relative bg-transparent border-none cursor-pointer ${
      active 
        ? "text-zinc-900 dark:text-zinc-100 font-bold" 
        : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-400"
    }`}
  >
    <div className="relative">
      {icon}
      {badgeCount && badgeCount > 0 && (
        <span className="absolute -top-1.5 -right-2 bg-red-500 text-white font-bold text-[9px] h-3.5 min-w-3.5 px-0.5 rounded-full flex items-center justify-center border border-white dark:border-zinc-900">
          {badgeCount}
        </span>
      )}
    </div>
    <span className="text-[10px] mt-0.5 tracking-tight font-medium select-none">{label}</span>
    {active && (
      <span className="absolute bottom-0 h-0.5 w-6 bg-zinc-950 dark:bg-zinc-50 rounded-full" />
    )}
  </button>
);

export default Homepage;