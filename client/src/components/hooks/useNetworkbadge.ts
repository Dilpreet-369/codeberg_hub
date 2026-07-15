// @/components/hooks/useNetworkbadge.ts
import { useState, useEffect } from "react";
import axios from "axios";

export const useNetworkbadge = () => {
  const [badgeCount, setBadgeCount] = useState<number>(0);

  useEffect(() => {
    const fetchBadgeCount = async () => {
      try {
        // Double-check that this matches your backend's routing endpoint!
        const res = await axios.get("/users/connections/pending-count", { 
          withCredentials: true 
        });
        
        // Match the backend payload structure
        if (res.data?.success || res.data?.count !== undefined) {
          const count = typeof res.data.count === 'number' ? res.data.count : res.data.data?.count || 0;
          setBadgeCount(count);
        }
      } catch (err) {
        console.error("Failed to fetch connection badge counts:", err);
      }
    };

    fetchBadgeCount();
    
    // Check every 30 seconds for incoming connection invites
    const interval = setInterval(fetchBadgeCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return badgeCount;
};