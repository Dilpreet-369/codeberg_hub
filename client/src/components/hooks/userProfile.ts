// hooks/useProfile.ts
import { useState, useEffect } from "react";
import axios from "axios";

export interface UserProfileData {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  workOrStudy: string;
  bio: string;
  skills: string[];
}

export type ConnectionStatus = "none" | "pending" | "accepted" | "rejected";

export const useProfile = (
  usernameParam: string | undefined,
  redirectToLogin: () => void,
) => {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("none");
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [isSender, setIsSender] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Track if the profile currently being viewed is the logged-in user's own
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfileAndConnection = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch the logged-in user's profile first to identify who "I" am
        const meResponse = await axios.get("/users/profile", {
          withCredentials: true,
        });
        const meData =
          meResponse.data?.data || meResponse.data?.user || meResponse.data;

        if (!meData || !meData._id) {
          throw new Error("Could not verify session");
        }

        // 2. Determine if we are looking at our own profile
        const viewingOwn =
          !usernameParam ||
          usernameParam.toLowerCase() === meData.username.toLowerCase() ||
          usernameParam === meData._id;

        setIsOwnProfile(viewingOwn);

        if (viewingOwn) {
          // If viewing own profile, we already have the profile data!
          setProfile(meData);
        } else {
          // 3. Viewing someone else's profile -> Fetch their profile specifically
          const targetResponse = await axios.get(
            `/users/profile/${usernameParam}`,
            { withCredentials: true },
          );
          const targetData =
            targetResponse.data?.data ||
            targetResponse.data?.user ||
            targetResponse.data;

          if (!targetData) throw new Error("No profile data received");

          // Double safety: If target profile ID matches my ID, it's actually my profile
          if (targetData._id === meData._id) {
            setIsOwnProfile(true);
            setProfile(meData);
            setLoading(false);
            return;
          }

          setProfile(targetData);

          // 4. Fetch connection status with this target user
          // Inside useProfile.ts (useEffect)
          const statusRes = await axios.get(
            `/users/connections/status/${targetData._id}`,
            { withCredentials: true },
          );

          if (statusRes.data?.success && statusRes.data?.data) {
            const conn = statusRes.data.data;

            // ⚡ THE FIX: If the connection is rejected, treat it as "none"
            // so the "Connect" button renders again on refresh.
            if (conn.status === "rejected") {
              setConnectionStatus("none");
              setConnectionId(null);
              setIsSender(false);
            } else {
              setConnectionStatus(conn.status);
              setConnectionId(conn._id);
              setIsSender(conn.sender === meData._id);
            }
          } else {
            setConnectionStatus("none");
            setConnectionId(null);
            setIsSender(false);
          }
        }
      } catch (err: any) {
        console.error("Profile fetch error:", err);
        if (err.response?.status === 401) {
          redirectToLogin();
          return;
        }
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndConnection();
  }, [usernameParam]); // Re-run whenever the URL profile changes

  // ─── CONNECTION ACTIONS HANDLERS ───

  const handleConnectAction = async () => {
    if (!profile?._id || actionLoading) return;
    try {
      setActionLoading(true);
      const res = await axios.post(
        `/users/connections/connect/${profile._id}`,
        {},
        { withCredentials: true },
      );
      if (res.data?.success) {
        setConnectionStatus("pending");
        setIsSender(true);
        setConnectionId(res.data.data?._id || null);
      }
    } catch (err) {
      console.error("Failed to send connection request:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (!connectionId || actionLoading) return;
    try {
      setActionLoading(true);
      const res = await axios.put(
        `/users/connections/accept/${connectionId}`,
        {},
        { withCredentials: true },
      );
      if (res.data?.success) setConnectionStatus("accepted");
    } catch (err) {
      console.error("Failed to accept connection:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!connectionId || actionLoading) return;
    try {
      setActionLoading(true);
      const res = await axios.put(
        `/users/connections/reject/${connectionId}`,
        {},
        { withCredentials: true },
      );
      if (res.data?.success) {
        setConnectionStatus("none");
        setConnectionId(null);
        setIsSender(false);
      }
    } catch (err) {
      console.error("Failed to decline connection:", err);
    } finally {
      setActionLoading(false);
    }
  };

  return {
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
  };
};
