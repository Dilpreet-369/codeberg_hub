import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, Settings, Camera, Edit2, Plus, 
  Globe, MoreHorizontal, Eye, Star, Loader2, User 
} from "lucide-react";
// Interface representing the user data stored in your MongoDB Schema
interface UserProfileData {
  fullname: string;
  username: string;
  email: string;
  workOrStudy: string;
  bio: string;
  interests: string[]; // Maps to the schema array layout
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        
        if (!token) {
          setError("No authentication token found. Please log in.");
          setLoading(false);
          return;
        }

        // Fetching from your user endpoint that parses the JWT token payload
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}` // Passes through your protect route middleware
          }
        });

        // Match your server response structure (commonly res.data or res.data.data)
        if (res.data?.success) {
          setProfile(res.data.data);
        } else {
          setProfile(res.data); 
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to establish synchronization with the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Full-screen loading feedback matching the minimalist app aesthetic
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  // Graceful Error View State
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
        <p className="text-sm font-semibold text-red-500 mb-4">{error || "User data empty."}</p>
        <button 
          onClick={() => navigate("/login")}
          className="text-xs font-bold text-indigo-500 hover:underline bg-transparent border-none cursor-pointer"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-12 transition-colors duration-200">
      
      {/* TOP HEADER NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} // Navigates back to the home feed cleanly
            className="p-1 -ml-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
            @{profile.username}
          </span>
        </div>
        <button className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition bg-transparent border-none cursor-pointer" onClick={() => navigate("/settings")}>
          <Settings className="h-5 w-5" />
        </button>
      </header>

      {/* MAIN PROFILE CONTAINER */}
      <main className="w-full max-w-md mx-auto flex flex-col gap-2">

        {/* SECTION 1: HERO & IDENTITY CARD */}
        <div className="bg-white dark:bg-zinc-900 border-b sm:border border-zinc-200 dark:border-zinc-800/80 relative pb-5">
          <div className="h-28 w-full bg-zinc-200 dark:bg-zinc-800 relative border-b border-zinc-300/40 dark:border-zinc-700/30">
            <button className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 hover:bg-white transition border-none cursor-pointer">
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div className="px-4 -mt-14 relative z-10 flex justify-between items-end">
            <div className="h-24 w-24 rounded-full bg-zinc-100 dark:bg-zinc-800 border-4 border-zinc-300 dark:border-zinc-900 flex items-center justify-center  shadow-sm">
              <User className="h-10 w-10 text-zinc-400" />
            </div>
            <div className="flex items-center gap-3 pb-1">
              <button className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition bg-transparent border-none cursor-pointer">
                <Globe className="h-5 w-5" />
              </button>
              <button className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition bg-transparent border-none cursor-pointer">
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* DYNAMIC METADATA INJECTION */}
          <div className="px-4 mt-3">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {profile.fullname}
            </h1>

            {/* Tagline / Developer Tagline Row */}
            <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-0.5 leading-normal font-medium">
              {profile.bio || "No bio added yet."}
            </p>

            {/* Work or Study Placement Row */}
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
              💼 {profile.workOrStudy || "Professional background empty."}
            </p>

            {/* Interactive Primary Action Row */}
            <div className="flex items-center gap-2 mt-4">
              <button className="flex-1 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold text-sm py-2 px-4 rounded-full hover:bg-indigo-700 transition border-none cursor-pointer">
                Open to
              </button>
              <button className="p-2 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition cursor-pointer">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: DYNAMIC CORE INTERESTS TAG CLOUD */}
        <div className="bg-white dark:bg-zinc-900 border-y sm:border border-zinc-200 dark:border-zinc-800/80 p-4">
          <h3 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2.5">
            Core Technical Stack
          </h3>
          {profile.interests && profile.interests.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.map((skill, index) => (
                <span 
                  key={index}
                  className="text-xs px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/40 dark:border-zinc-700/40 font-medium font-mono"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 dark:text-slate-500 italic">
              No tech interests selected. Add skills to show up on the discovery loops.
            </p>
          )}
        </div>

      </main>
    </div>
  );
};

export default ProfilePage;