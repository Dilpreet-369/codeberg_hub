// src/features/profile/
// ├── components/
// │   ├── ProfileHeader.tsx       // Top navbar navigation layout
// │   ├── IdentityCard.tsx        // Covers banner image, avatar, bio & text metadata
// │   ├── ConnectionActions.tsx   // Pure presentation of connection action triggers
// │   └── TechStack.tsx           // Skill tags grid display list
// ├── hooks/
// │   └── useProfile.ts           // Single custom hook orchestrating API and state logic
// └── ProfilePage.tsx             // Clean container root page uniting all sub-components

import { ArrowLeft, Settings } from "lucide-react";

interface ProfileHeaderProps {
  username: string;
  isOwnProfile: boolean;
  onBack: () => void;
  onSettings: () => void;
}

export const ProfileHeader = ({ username, isOwnProfile, onBack, onSettings }: ProfileHeaderProps) => (
  <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <button onClick={onBack} className="p-1 -ml-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition bg-transparent border-none cursor-pointer">
        <ArrowLeft className="h-5 w-5" />
      </button>
      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
        @{username}
      </span>
    </div>
    {isOwnProfile && (
      <button className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition bg-transparent border-none cursor-pointer" onClick={onSettings}>
        <Settings className="h-5 w-5" />
      </button>
    )}
  </header>
);