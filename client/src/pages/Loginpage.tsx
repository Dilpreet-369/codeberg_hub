import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate hook
import axios from "axios";

const Login = () => {
    const navigate = useNavigate(); // 2. Initialize navigate function
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("Verifying credentials...");
        
        try {
            // Send email and password to your Express backend login path
            const res = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                    password
                });
                
                // 3. Deep Security Session Initialization:
                const token = res.data.data?.accessToken;
                
                if (token) {
                    // Save the application token so the dashboard route can verify it
                    localStorage.setItem("authToken", token);
                    
                    setStatus("✅ Credentials verified! Welcome back.");
                    
                    // State cleanup for input hygiene
                    setEmail("");
                    setPassword("");
                    
                    // 4. Secure Client-Side Redirect:
                    setTimeout(() => {
                        navigate("/dashboard");
                    }, 1000);
                } else {
                    setStatus("❌ Authentication succeeded, but no session token was issued.");
                }
                
            } catch (err: any) {
                setStatus(`❌ Access Denied: ${err.response?.data?.message || err.message}`);
            }
        };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 font-sans">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-lg">
                
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Welcome Back</h2>
                    <p className="text-sm text-gray-500 mt-1">Sign in to access your secure profile</p>
                </div>
                
                {/* Form */}
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Email Address</label>
                        <input 
                            type="email" 
                            placeholder="name@example.com" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-base bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition" 
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            required 
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-base bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition" 
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md shadow-indigo-200 active:scale-[0.98] transition mt-2 text-base"
                    >
                        Sign In
                    </button>
                </form>

                {/* Status Notification */}
                {status && (
                    <div className={`mt-5 p-3 rounded-lg text-sm font-medium border break-all leading-relaxed ${
                        status.includes("✅") 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : "bg-red-50 text-red-700 border-red-200"
                    }`}>
                        {status}
                    </div>
                )}
                
                {/* Visual Anchor to toggle between views */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <button 
                        onClick={() => navigate("/register")} 
                        className="text-indigo-600 font-semibold hover:underline"
                    >
                        Register here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;