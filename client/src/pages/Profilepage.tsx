import { useState } from "react";
import { 
  ArrowLeft, Settings, Camera, Edit2, Plus, 
  Globe, MoreHorizontal, Eye, BarChart2, Star 
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate for navigation
interface ProfileStats {
  profileViews: number;
  postViews: number;
  searchAppearances: number;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  // Mock analytics matching the reference card's layout metrics
  const [stats] = useState<ProfileStats>({
    profileViews: 2279545,
    postViews: 279545,
    searchAppearances: 2279
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-12 transition-colors duration-200 selection:bg-indigo-500/20">
      
      {/* ─── TOP HEADER NAVIGATION BAR ─── */}
      <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-1 -ml-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition bg-transparent border-none cursor-pointer" onClick={() => navigate(-1)} >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
            Developer Profile
          </span>
        </div>
        <button className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition bg-transparent border-none cursor-pointer">
          <Settings className="h-5 w-5" />
        </button>
      </header>

      {/* ─── MAIN PROFILE CONTAINER ─── */}
      <main className="w-full max-w-md mx-auto flex flex-col gap-2">

        {/* SECTION 1: HERO & IDENTITY CARD */}
        <div className="bg-white dark:bg-zinc-900 border-b sm:border border-zinc-200 dark:border-zinc-800/80 relative pb-5">
          
          {/* Cover Image Banner Slot */}
          <div className="h-28 w-full bg-zinc-200 dark:bg-zinc-800 relative group border-b border-zinc-300/40 dark:border-zinc-700/30">
            <button className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 transition shadow-sm border-none cursor-pointer">
              <Camera className="h-4 w-4" />
            </button>
          </div>

          {/* Profile Avatar Frame (Overlaps Banner) */}
          <div className="px-4 -mt-14 relative z-10 flex justify-between items-end">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-zinc-300 dark:bg-zinc-700 border-4 border-white dark:border-zinc-900 overflow-hidden flex items-center justify-center font-bold text-2xl text-zinc-600 dark:text-zinc-400">
                {/* Fallback space for user initials or photo */}
                DS
              </div>
              {/* Badge or Status Add Trigger Button */}
              <button className="absolute bottom-0 right-0 p-1 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white border-2 border-white dark:border-zinc-900 hover:bg-indigo-700 transition cursor-pointer">
                <Plus className="h-3.5 w-3.5 stroke-3" />
              </button>
            </div>

            {/* Profile Context Inline Actions */}
            <div className="flex items-center gap-3 pb-1">
              <button className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition bg-transparent border-none cursor-pointer">
                <Globe className="h-5 w-5" />
              </button>
              <button className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition bg-transparent border-none cursor-pointer">
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Core Personal Identity Metadata Text Block */}
          <div className="px-4 mt-3">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                Dilpreet Singh
              </h1>
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                • 2nd
              </span>
            </div>

            {/* Tagline / Professional Headline */}
            <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-0.5 leading-normal font-medium">
              Full Stack Developer & Cybersecurity Enthusiast
            </p>

            {/* Institutional Connection Node */}
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
              Guru Nanak Dev Engineering College (GNDEC)
            </p>
            
            {/* Geo Location Map */}
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
              Ludhiana, Punjab, India
            </p>

            {/* Connection Network Metric Counters */}
            <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer mt-2">
              <span>0 followers</span>
              <span className="text-zinc-300 dark:text-zinc-700 font-normal">•</span>
              <span>0 connections</span>
            </div>

            {/* Interactive Primary Action Row */}
            <div className="flex items-center gap-2 mt-4">
              <button className="flex-1 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold text-sm py-2 px-4 rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-600 transition border-none cursor-pointer">
                Open to
              </button>
              <button className="flex-1 bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-sm py-2 px-4 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition cursor-pointer">
                Add section
              </button>
              <button className="p-2 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition cursor-pointer">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>

        {/* SECTION 2: SOCIAL PROFILE SHIELD (Open to work / projects badge block) */}
        <div className="bg-white dark:bg-zinc-900 border-y sm:border border-zinc-200 dark:border-zinc-800/80 p-4 flex items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Open to work
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-normal">
              Full Stack Developer, Cybersecurity Engineer roles
            </p>
            <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-1 bg-transparent border-none p-0 cursor-pointer text-left">
              See all details
            </button>
          </div>
          <button className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition bg-transparent border-none cursor-pointer">
            <Edit2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* SECTION 3: ANALYTICS DASHBOARD CARD FRAME (Matches image_7732dc.png Base Grid) */}
        <div className="bg-white dark:bg-zinc-900 border-y sm:border border-zinc-200 dark:border-zinc-800/80 p-4">
          
          {/* Dashboard Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Your Dashboard
              </h3>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1 mt-0.5">
                <Eye className="h-3 w-3" /> Private to you
              </p>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wider uppercase">
              <Star className="h-3 w-3 fill-current text-amber-500" /> All-Star
            </div>
          </div>

          {/* Unified Analytics Score Grid */}
          <div className="grid grid-cols-3 border border-zinc-100 dark:border-zinc-800/80 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/20 divide-x divide-zinc-100 dark:divide-zinc-800/80">
            
            {/* Stat Box 1 */}
            <div className="p-3 flex flex-col justify-between min-h-20.5 cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-zinc-800/20 transition rounded-l-xl">
              <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 tracking-tight leading-none">
                {stats.profileViews.toLocaleString()}
              </span>
              <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 leading-snug mt-2">
                Who viewed your profile
              </span>
            </div>

            {/* Stat Box 2 */}
            <div className="p-3 flex flex-col justify-between min-h-20.5 cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-zinc-800/20 transition">
              <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 tracking-tight leading-none">
                {stats.postViews.toLocaleString()}
              </span>
              <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 leading-snug mt-2">
                Post views
              </span>
            </div>

            {/* Stat Box 3 */}
            <div className="p-3 flex flex-col justify-between min-h-20.5 cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-zinc-800/20 transition rounded-r-xl">
              <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 tracking-tight leading-none">
                {stats.searchAppearances.toLocaleString()}
              </span>
              <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 leading-snug mt-2">
                Search appearances
              </span>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default ProfilePage;