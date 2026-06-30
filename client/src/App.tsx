import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Landingpage"; // Importing your home page from the pages folder
import Register from "./pages/Registerpage"; // Importing your register page from the pages folder
import Login from "./pages/Loginpage"; // Importing your login page from the pages folder
import Dashboard from "./pages/Dashboard"; // Importing your dashboard page from the pages folder
const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 font-sans">
        <Routes>
          {/* 1. Default Route (Home View) */}
          <Route
            path="/"
            element={
              <Home />
            }
          />

          {/* 2. Register Route */}
          <Route path="/register" element={<Register />} />
          {/* 3. Login Route */}
          <Route path="/login" element={<Login />} />
          {/* 4. Dashboard Route */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* 5. Fallback Route (Redirects any invalid URLs back to home) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
