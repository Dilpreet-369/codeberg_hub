// src/utils/profileUtils.ts
import axios from "axios";

export const fetchUserProfile = async (
  setProfile: (data: any) => void,
  setLoading: (loading: boolean) => void,
  setError: (message: string | null) => void,
) => {
  try {
    setLoading(true);
    setError(null);

    // 1. Leverages global baseURL ("/users/profile") instead of hardcoded localhost
    // 2. Automatically passes secure cookies via the global withCredentials flag
    const res = await axios.get(
      "/users/profile",
    );

    // Handle standard API layout differences cleanly
    if (res.data?.success) {
      setProfile(res.data.data || res.data.user);
    } else {
      setProfile(res.data);
    }
  } catch (err: any) {
    console.error("Profile synchronization error:", err);
    setError(
      err.response?.data?.message ||
        "Failed to establish synchronization with the server.",
    );
  } finally {
    setLoading(false);
  }
};
