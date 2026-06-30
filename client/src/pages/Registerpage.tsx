import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { GoogleLogin } from "@react-oauth/google"; // 1. Import official Google login component
import axios from "axios";

const Register = () => {
    const navigate = useNavigate(); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [status, setStatus] = useState("");

    // Reusable utility function to handle post-authentication state updates and forwarding
    const handleAuthSuccess = (token: string, message: string) => {
        localStorage.setItem("authToken", token);
        setStatus(message);
        
        setName("");
        setEmail("");
        setPassword("");
        
        setTimeout(() => {
            navigate("/dashboard");
        }, 1000);
    };

    // ─── TRADITIONAL EMAIL/PASSWORD REGISTRATION ───
    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("Creating your secure account...");
        
        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", {
                name,
                email,
                password
            });
            
            // ✅ FIXED: Corrected path mapping to match your backend data structure payload
            const token = res.data.data?.accessToken;
            
            if (token) {
                handleAuthSuccess(token, "✅ Account verified! Redirecting to dashboard...");
            } else {
                setStatus("❌ Registration completed, but server failed to issue a session token.");
            }
            
        } catch (err: any) {
            setStatus(`❌ Registration Blocked: ${err.response?.data?.message || err.message}`);
        }
    };

    // ─── GOOGLE OAUTH CALLBACK HANDLER ───
    const handleGoogleSuccess = async (credentialResponse: any) => {
        setStatus("Verifying Google profile with server...");
        try {
            // Forward the raw Google credential string token to your backend /google route
            const res = await axios.post("http://localhost:5000/api/auth/google", {
                credential: credentialResponse.credential
            });

            const token = res.data.data?.accessToken;
            if (token) {
                handleAuthSuccess(token, "✅ Google Registration verified! Welcome.");
            } else {
                setStatus("❌ Google validation succeeded, but no app token was issued.");
            }
        } catch (err: any) {
            setStatus(`❌ Google Auth Failed: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 font-sans">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-lg">
                
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Create Account</h2>
                    <p className="text-sm text-gray-500 mt-1">Join the network securely today</p>
                </div>
                
                {/* Form */}
                <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Full Name</label>
                        <input 
                            type="text" 
                            placeholder="John Doe" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            required 
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-base bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition" 
                        />
                    </div>

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
                        Register & Log In
                    </button>
                </form>

                {/* ─── VISUAL DIVIDER ─── */}
                <div className="relative flex py-4 items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">or</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* ─── GOOGLE INTEGRATION HUB ─── */}
                <div className="w-full flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setStatus("❌ Google Authentication Failed client-side")}
                        useOneTap
                        shape="circle"
                        theme="outline"
                        width="360px" // Matches width constraints gracefully
                    />
                </div>

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
                    Already have an account?{" "}
                    <button 
                        onClick={() => navigate("/login")} 
                        className="text-indigo-600 font-semibold hover:underline"
                    >
                        Sign In here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;