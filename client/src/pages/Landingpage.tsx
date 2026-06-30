import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 bg-gray-100 font-sans">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        My App
      </h1>
      <p className="text-gray-600 mb-6">Welcome to the platform!</p>
      
      {/* Using Link instead of <a> tag prevents the browser 
        from doing a full page reload when switching routes!
      */}
      <Link
        to="/register"
        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition mb-6"
      >
        Go to Register
      </Link>
      <Link
        to="/login"
        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition"
      >
        Go to Login
      </Link>
    </div>
  );
};

export default Home;