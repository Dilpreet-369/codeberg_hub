import { Camera, Globe, Edit2, User, MoreHorizontal } from "lucide-react";
import { UserProfileData } from "../hooks/userProfile";

interface IdentityCardProps {
  profile: UserProfileData;
  isOwnProfile: boolean;
  onEditSettings?: () => void;
  children?: React.ReactNode; // Connection state controllers go here
}

export const IdentityCard = ({ profile, isOwnProfile, onEditSettings, children }: IdentityCardProps) => {
  return (
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

      <div className="px-4 mt-3">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{profile.fullname}</h1>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-0.5 leading-normal font-medium">{profile.bio || "No bio added yet."}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-medium">💼 {profile.workOrStudy || "Professional background empty."}</p>

        <div className="flex items-center gap-2 mt-4">
          {isOwnProfile ? (
            <button onClick={onEditSettings} className="flex-1 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold text-sm py-2 px-4 rounded-full hover:bg-indigo-700 transition border-none cursor-pointer">
              Edit Profile
            </button>
          ) : (
            children
          )}
          <button className="p-2 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition cursor-pointer">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};