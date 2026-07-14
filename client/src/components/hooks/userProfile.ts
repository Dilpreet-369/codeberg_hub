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

export const useProfile = (usernameParam: string | undefined, redirectToLogin: () => void) => {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("none");
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [isSender, setIsSender] = useState<boolean>(false); 
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Global authenticated credentials identity layer mock object
  const loggedInUser = { username: "johndoe", _id: "6a548d12253b0cfd36ce7f6d" }; 
  const isOwnProfile = !usernameParam || usernameParam.toLowerCase() === loggedInUser.username.toLowerCase();

  useEffect(() => {
    const fetchProfileAndConnection = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = isOwnProfile ? "/users/profile" : `/users/profile/${usernameParam}`;
        const profileResponse = await axios.get(url, { withCredentials: true });
        const profileData = profileResponse.data?.data || profileResponse.data?.user || profileResponse.data;

        if (!profileData) throw new Error("No profile data received");
        setProfile(profileData);

        if (!isOwnProfile) {
          const statusRes = await axios.get(`/users/connections/status/${profileData._id}`, { withCredentials: true });
          if (statusRes.data?.success && statusRes.data?.data) {
            const conn = statusRes.data.data;
            setConnectionStatus(conn.status);
            setConnectionId(conn._id);
            setIsSender(conn.sender === loggedInUser._id);
          } else {
            setConnectionStatus("none");
            setConnectionId(null);
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
  }, [usernameParam, isOwnProfile]);

  const handleConnectAction = async () => {
    if (!profile?._id || actionLoading) return;
    try {
      setActionLoading(true);
      const res = await axios.post(`/users/connections/connect/${profile._id}`, {}, { withCredentials: true });
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
      const res = await axios.put(`/users/connections/accept/${connectionId}`, {}, { withCredentials: true });
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
      const res = await axios.put(`/users/connections/reject/${connectionId}`, {}, { withCredentials: true });
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
    handleRejectRequest
  };
};