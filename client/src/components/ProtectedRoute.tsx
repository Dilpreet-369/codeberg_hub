import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // ✅ Make request to backend to verify auth via httpOnly cookie
        const response = await axios.get("/auth/profile", {
          withCredentials: true, // ✅ IMPORTANT: Send cookies with request
        });

        // ✅ If request succeeds, user is authenticated
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        // ❌ If 401 or any error, user is NOT authenticated
        console.error("Auth verification failed:", error);
        setIsAuthenticated(false);
      }
    };

    verifyAuth();
  }, []);

  // ⏳ While checking auth status, show loading
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  // ❌ Not authenticated? Send to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Authenticated? Show the page
  return <>{children}</>;
};

export default ProtectedRoute;