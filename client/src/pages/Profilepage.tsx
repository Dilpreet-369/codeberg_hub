import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, Settings, Camera, Edit2, Plus, 
  Globe, MoreHorizontal, Eye, Star, Loader2, User 
} from "lucide-react";

interface UserProfileData {
  _id: string; // Added to handle backend connection target IDs
  fullname: string;
  username: string;
  email: string;
  workOrStudy: string;
  bio: string;
  interests: string[];
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>(); // Grabs the URL parameter string
  
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("none"); // 'none', 'pending', 'accepted'
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncProfileContext = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch the identity payload of the user who is logged in right now
        const meRes = await axios.get("/auth/profile"); 
        const currentMe = meRes.data?.data || meRes.data?.user || meRes.data;
        setLoggedInUser(currentMe);

        // 2. Fetch the target profile using the dynamic username from the route parameter
        // If your backend endpoint changes, point this directly to your dynamic route helper
        const profileRes = await axios.get(`/users/profile/${username}`);
        const targetProfile = profileRes.data?.data || profileRes.data?.user || profileRes.data;
        setProfile(targetProfile);

        // 3. Sync connection state if viewing someone else's profile
        if (currentMe && currentMe.username !== username) {
          setConnectionStatus(profileRes.data?.connectionStatus || "none");
        }
      } catch (err: any) {
        console.error("Profile view sync error:", err);
        setError(err.response?.data?.message || "Failed to sync profile context views.");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      syncProfileContext();
    }
  }, [username]);

  // Handler execution loop when clicking the "Connect" button action path
  const handleConnectAction = async () => {
    if (connectionStatus !== "none" || !profile?._id) return;

    try {
      setConnectionStatus("pending"); // Optimistic UI step
      await axios.post(`/users/connect/${profile._id}`);
    } catch (err) {
      console.error("Failed to post connection handshake:", err);
      setConnectionStatus("none"); // Reset state on network failure
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

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

  // Boolean state tracking variable to check ownership boundaries cleanly
  const isOwnProfile = loggedInUser?.username?.toLowerCase() === username?.toLowerCase();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-12 transition-colors duration-200">
      
      {/* TOP HEADER NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-1 -ml-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
            @{profile.username}
          </span>
        </div>
        {isOwnProfile && (
          <button className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition bg-transparent border-none cursor-pointer" onClick={() => navigate("/settings")}>
            <Settings className="h-5 w-5" />
          </button>
        )}
      </header>

      {/* MAIN PROFILE CONTAINER */}
      <main className="w-full max-w-md mx-auto flex flex-col gap-2">

        {/* SECTION 1: HERO & IDENTITY CARD */}
        <div className="bg-white dark:bg-zinc-900 border-b sm:border border-zinc-200 dark:border-zinc-800/80 relative pb-5">
          <div className="h-28 w-full bg-zinc-200 dark:bg-zinc-800 relative border-b border-zinc-300/40 dark:border-zinc-700/30">
            {isOwnProfile && (
              <button className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 hover:bg-white transition border-none cursor-pointer">
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="px-4 -mt-14 relative z-10 flex justify-between items-end">
            <div className="h-24 w-24 rounded-full bg-zinc-100 dark:bg-zinc-800 border-4 border-zinc-300 dark:border-zinc-900 flex items-center justify-center shadow-sm">
              <User className="h-10 w-10 text-zinc-400" />
            </div>
            <div className="flex items-center gap-3 pb-1">
              <button className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition bg-transparent border-none cursor-pointer">
                <Globe className="h-5 w-5" />
              </button>
              {isOwnProfile && (
                <button className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition bg-transparent border-none cursor-pointer">
                  <Edit2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* DYNAMIC METADATA INJECTION */}
          <div className="px-4 mt-3">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {profile.fullname}
            </h1>

            <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-0.5 leading-normal font-medium">
              {profile.bio || "No bio added yet."}
            </p>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
              💼 {profile.workOrStudy || "Professional background empty."}
            </p>

            {/* DYNAMIC PRIMARY ACTION ROW SWITCH CONTAINER */}
            <div className="flex items-center gap-2 mt-4">
              {isOwnProfile ? (
                /* OWNER CONFIGURATION PATH: SHOW OPEN TO BUTTON */
                <button className="flex-1 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold text-sm py-2 px-4 rounded-full hover:bg-indigo-700 transition border-none cursor-pointer">
                  Open to
                </button>
              ) : (
                /* EXTERNAL CONSUMER PATH: SHOW DYNAMIC RECONCILED CONNECTION COMPONENT BUTTONS */
                <button 
                  onClick={handleConnectAction}
                  disabled={connectionStatus === 'pending'}
                  className={`flex-1 font-semibold text-sm py-2 px-4 rounded-full transition border-none cursor-pointer ${
                    connectionStatus === 'accepted'
                      ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300'
                      : connectionStatus === 'pending'
                      ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 cursor-not-allowed'
                      : 'bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700'
                  }`}
                >
                  {connectionStatus === 'accepted' && "Connected"}
                  {connectionStatus === 'pending' && "Pending Request"}
                  {connectionStatus === 'none' && "Connect"}
                </button>
              )}

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