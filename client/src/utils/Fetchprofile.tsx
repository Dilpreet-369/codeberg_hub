import axios from "axios";

export const fetchUserProfile = async (
  setProfile: (data: any) => void,
  setLoading: (loading: boolean) => void,
  setError: (message: string | null) => void
) => {
  try {
    setLoading(true);
    setError(null);

    const res = await axios.get("/users/profile");

    if (res.data?.success) {
      setProfile(res.data.data || res.data.user);
    } else {
      setProfile(res.data);
    }
  } catch (err: any) {
    setError(err.response?.data?.message || "Failed to sync profile data.");
  } finally {
    setLoading(false);
  }
};