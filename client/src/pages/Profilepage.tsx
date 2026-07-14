import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Hooks & UI Components
import { useProfile } from "../components/hooks/userProfile.ts";
import { ProfileHeader } from "../components/profilepagecomponents/ProfileHeader.tsx";
import { IdentityCard } from "../components/profilepagecomponents/IdentityCard.tsx";
import { ConnectionActions } from "../components/profilepagecomponents/ConnectionAction.tsx";
import { TechStack } from "../components/profilepagecomponents/TechStack.tsx";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { username } = useParams<{ username?: string }>();

  // Use our custom hook to pull clean state mechanics away from layout trees
  const {
    profile,
    loading,
    error,
    isOwnProfile,
    connectionStatus,
    isSender,
    actionLoading,
    handleConnectAction,
    handleAcceptRequest,
    handleRejectRequest,
  } = useProfile(username, () => navigate("/login"));

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
        <button onClick={() => navigate("/home")} className="text-xs font-bold text-indigo-500 hover:underline bg-transparent border-none">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-12 transition-colors duration-200">
      <ProfileHeader 
        username={profile.username} 
        isOwnProfile={isOwnProfile} 
        onBack={() => navigate(-1)} 
        onSettings={() => navigate("/settings")} 
      />

      <main className="w-full max-w-md mx-auto flex flex-col gap-2">
        <IdentityCard 
          profile={profile} 
          isOwnProfile={isOwnProfile}
          onEditSettings={() => navigate("/settings")}
        >
          {/* Inject dynamic relationship engine layout via simple children props */}
          <ConnectionActions
            status={connectionStatus}
            isSender={isSender}
            loading={actionLoading}
            onConnect={handleConnectAction}
            onAccept={handleAcceptRequest}
            onDecline={handleRejectRequest}
            onMessage={() => navigate(`/messages/${profile._id}`)}
          />
        </IdentityCard>

        <TechStack skills={profile.skills} />
      </main>
    </div>
  );
};

export default ProfilePage;