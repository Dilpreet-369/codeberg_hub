import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landingpage from "./pages/Landingpage"; // Importing your home page from the pages folder
import Register from "./pages/Registerpage"; // Importing your register page from the pages folder
import Login from "./pages/Loginpage"; // Importing your login page from the pages folder
import Homepage from "./pages/Homepage"; // Importing your dashboard page from the pages folder
import Onboardpage from "./pages/Onboardpage"; // Importing your onboarding page from the pages folder
import ProfilePage from "./pages/Profilepage"; // Importing your profile page from the pages folder
import ProtectedRoute from "./components/ProtectedRoute"; // Importing the ProtectedRoute component
import PostPage from "./pages/Postpage"; // Importing the PostPage component
import Settingspage from "./pages/Settingspage";
const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 font-sans">
        <Routes>
          {/* 1. Default Route (Home View) */}
          <Route path="/" element={<Landingpage />} />
          {/* 2. Register Route */}
          <Route path="/register" element={<Register />} />
          {/* 3. Login Route */}
          <Route path="/login" element={<Login />} />
          {/* 4. Homepage Route */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            }
          />
          {/* 5. Onboarding Route */}
          <Route
            path="/onboard"
            element={
              <ProtectedRoute>
                <Onboardpage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:username"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settingspage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post"
            element={
              <ProtectedRoute>
                <PostPage />
              </ProtectedRoute>
            }
          />
          {/* 6. Fallback Route (Redirects any invalid URLs back to home) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
