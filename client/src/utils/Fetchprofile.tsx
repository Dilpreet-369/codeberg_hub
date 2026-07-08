// src/utils/profileUtils.ts
import axios from "axios";

export const fetchUserProfile = async (
  setProfile: (data: any) => void,
  setLoading: (loading: boolean) => void,
  setError: (message: string | null) => void
) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    const res = await axios.get("http://localhost:5000/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` }
    });

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