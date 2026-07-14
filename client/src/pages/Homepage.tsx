import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  MessageSquare,
  Home,
  Users,
  SquarePlus,
  Bell,
  Briefcase,
  ScanFace,
  User,
  Loader2,
  AlertCircle,
} from "lucide-react";

// ─── EXTERNAL IMPORT ARTIFACTS ───
import { PostCard, PostData } from "@/components/Postcard";

// Interface for the logged-in user profile identity
interface LoggedInUserData {
  username: string;
  fullname: string;
  profilePic?: string;
}

const Homepage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("home");

  // ─── STATE MANAGEMENT FOR LIVE FEED & AUTH ───
  const [posts, setPosts] = useState<PostData[]>([]);
  const [currentUser, setCurrentUser] = useState<LoggedInUserData | null>(null); // ◄ ADDED: Track who is logged in
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ─── FETCH ENGINE EFFECT ───
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch current logged-in user details for profile navigation layout
        try {
          const userRes = await axios.get("/users/profile", { withCredentials: true });
          const userData = userRes.data?.data || userRes.data?.user || userRes.data;
          if (userData?.username) {
            setCurrentUser(userData);
          }
        } catch (userErr) {
          console.error("Failed to fetch session identity context:", userErr);
        }

        // 2. Fetch all post cards
        const res = await axios.get("/users/posts", { withCredentials: true });

        if (res.data?.success) {
          setPosts(res.data.data);
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to load community feed.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Safe handler fallback to routing path
  const handleAvatarClick = () => {
    if (currentUser?.username) {
      navigate(`/profile/${currentUser.username.toLowerCase()}`);
    } else {
      // Fallback to general settings or dashboard fallback if session isn't loaded yet
      navigate("/settings");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-16 transition-colors duration-200 selection:bg-indigo-500/20">
      
      {/* ─── TOP HEADER / STICKY SEARCH BAR ─── */}
      <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-2 flex items-center gap-3">
        
        {/* ◄ FIXED: User Mini Avatar Dynamic Profile Link Trigger */}
        <div
          className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden shrink-0 cursor-pointer border border-zinc-300 dark:border-zinc-600 flex items-center justify-center select-none"
          onClick={handleAvatarClick}
        >
          {currentUser?.profilePic ? (
            <img src={currentUser.profilePic} alt="Me" className="w-full h-full object-cover" />
          ) : (
            <User className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
          )}
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
            <p className="text-xs font-medium tracking-wide">
              Syncing network hub...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center text-zinc-500 dark:text-zinc-400 gap-2">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-400 gap-1">
            <p className="text-sm font-bold">No activity yet</p>
            <p className="text-xs text-zinc-500">
              Be the first to share an update!
            </p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </main>

      {/* ─── PERSISTENT BOTTOM NAVIGATION ─── */}
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
          onClick={() => navigate("/network")}
        />
        <BottomNavItem
          icon={<SquarePlus className="h-5 w-5" />}
          label="Post"
          active={activeTab === "post"}
          onClick={() => navigate("/post")}
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

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badgeCount?: number;
}

const BottomNavItem = ({
  icon,
  label,
  active,
  onClick,
  badgeCount,
}: NavItemProps) => (
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
    <span className="text-[10px] mt-0.5 tracking-tight font-medium select-none">
      {label}
    </span>
    {active && (
      <span className="absolute bottom-0 h-0.5 w-6 bg-zinc-950 dark:bg-zinc-50 rounded-full" />
    )}
  </button>
);

export default Homepage;