import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    // No token? Send them to login page instantly
    return <Navigate to="/login" replace />;
  }

  // Token exists? Let them pass to the dashboard
  return <>{children}</>;
};

export default ProtectedRoute;