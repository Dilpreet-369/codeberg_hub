import { useState } from "react";

// Mock Data for the feed
const INITIAL_POSTS = [
    {
        id: 1,
        author: "Alex Rivera",
        headline: "Senior Full-Stack Developer | MERN Specialist",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
        time: "2h • 🌐",
        content: "Just launched a new project optimized for mobile devices! It uses Tailwind CSS for rapid UI development and a clean Express modular architecture on the backend. Hard work pays off! 🚀✨ #mern #webdev #programming",
        likes: 24,
        comments: 5,
        hasLiked: false
    },
    {
        id: 2,
        author: "Sarah Chen",
        headline: "Cybersecurity Analyst @ SecureNet",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80",
        time: "5h • 🌐",
        time_text: "",
        content: "Reminder for the day: Always sanitize your input fields on the backend! Never trust client-side data blindly. A small vulnerability can lead to huge data breaches. Stay secure! 🔒🛡️",
        likes: 142,
        comments: 18,
        hasLiked: false
    }
];

const Homepage = () => {
    const [posts, setPosts] = useState(INITIAL_POSTS);
    const [newPostText, setNewPostText] = useState("");

    // Handle liking a post
    const handleLike = (id: number) => {
        setPosts(posts.map(post => {
            if (post.id === id) {
                return {
                    ...post,
                    likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
                    hasLiked: !post.hasLiked
                };
            }
            return post;
        }));
    };

    // Handle creating a new post locally
    const handleCreatePost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostText.trim()) return;

        const newPost = {
            id: Date.now(),
            author: "Dilpreet Singh", // Hardcoded for local profile test
            headline: "Full-Stack Developer Student",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80",
            time: "Just now • 🌐",
            content: newPostText,
            likes: 0,
            comments: 0,
            hasLiked: false
        };

        setPosts([newPost, ...posts]);
        setNewPostText("");
    };

    return (
        <div className="min-h-screen bg-gray-100 pb-16 font-sans">
            
            {/* 1. Mobile App Top Header */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between gap-3">
                <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80" 
                    alt="Profile" 
                    className="w-9 h-9 rounded-full object-cover border border-gray-300"
                />
                <div className="flex-1">
                    <input 
                        type="text" 
                        placeholder="🔍 Search" 
                        className="w-full bg-blue-50 text-sm px-3 py-1.5 rounded-md outline-none border border-transparent focus:border-blue-400"
                    />
                </div>
                <button className="text-gray-600 text-xl font-bold tracking-wide">💬</button>
            </div>

            {/* Main Wrapper Box */}
            <div className="max-w-md mx-auto p-3 flex flex-col gap-3">
                
                {/* 2. Share Box (Create Post) */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <form onSubmit={handleCreatePost} className="flex flex-col gap-3">
                        <div className="flex gap-3">
                            <img 
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80" 
                                alt="Profile" 
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <textarea 
                                placeholder="Share an article, photo, or update..." 
                                value={newPostText}
                                onChange={(e) => setNewPostText(e.target.value)}
                                className="w-full text-sm border-none resize-none outline-none pt-2 h-12 text-gray-700"
                            />
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                            <div className="flex gap-4 text-gray-500 text-sm font-medium">
                                <button type="button" className="hover:bg-gray-50 p-1.5 rounded">📷 <span className="text-xs text-gray-600 ml-1">Media</span></button>
                                <button type="button" className="hover:bg-gray-50 p-1.5 rounded">💼 <span className="text-xs text-gray-600 ml-1">Job</span></button>
                            </div>
                            <button 
                                type="submit" 
                                disabled={!newPostText.trim()}
                                className={`px-4 py-1 rounded-full text-sm font-semibold transition ${
                                    newPostText.trim() 
                                        ? "bg-blue-600 text-white hover:bg-blue-700" 
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                                Post
                            </button>
                        </div>
                    </form>
                </div>

                {/* 3. News Feed Stream */}
                <div className="flex flex-col gap-2.5">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            
                            {/* Card Top Block */}
                            <div className="p-4 pb-2 flex gap-3">
                                <img src={post.avatar} alt={post.author} className="w-11 h-11 rounded-full object-cover" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-gray-900 truncate">{post.author}</h3>
                                    <p className="text-xs text-gray-500 truncate">{post.headline}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{post.time}</p>
                                </div>
                            </div>

                            {/* Main Content Body */}
                            <div className="px-4 py-1 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                                {post.content}
                            </div>

                            {/* Counter Statistics Metrics */}
                            <div className="px-4 py-2 flex justify-between items-center text-xs text-gray-500 border-b border-gray-100 mt-2">
                                <div className="flex items-center gap-1">
                                    <span className="bg-blue-500 text-white text-[9px] px-1 rounded-full">👍</span>
                                    <span>{post.likes}</span>
                                </div>
                                <div>{post.comments} comments</div>
                            </div>

                            {/* Action Operations Control Panels */}
                            <div className="px-2 py-1 flex justify-around items-center text-gray-600 font-semibold text-sm bg-gray-50">
                                <button 
                                    onClick={() => handleLike(post.id)}
                                    className={`flex-1 py-2 text-center rounded-md active:bg-gray-200 transition flex items-center justify-center gap-1.5 ${
                                        post.hasLiked ? "text-blue-600" : "text-gray-600"
                                    }`}
                                >
                                    <span>{post.hasLiked ? "👍" : " Like"}</span>
                                    <span className="text-xs">Like</span>
                                </button>
                                <button className="flex-1 py-2 text-center rounded-md active:bg-gray-200 transition flex items-center justify-center gap-1.5">
                                    <span>💬</span>
                                    <span className="text-xs">Comment</span>
                                </button>
                                <button className="flex-1 py-2 text-center rounded-md active:bg-gray-200 transition flex items-center justify-center gap-1.5">
                                    <span>🔁</span>
                                    <span className="text-xs">Repost</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Bottom Tab bar navigation panel */}
            <div className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-200 flex items-center justify-around text-gray-500 z-50 max-w-md mx-auto">
                <button className="flex flex-col items-center justify-center flex-1 text-blue-600">
                    <span className="text-lg">🏠</span>
                    <span className="text-[10px] font-medium">Home</span>
                </button>
                <button className="flex flex-col items-center justify-center flex-1">
                    <span className="text-lg">👥</span>
                    <span className="text-[10px] font-medium">My Network</span>
                </button>
                <button className="flex flex-col items-center justify-center flex-1">
                    <span className="text-lg">➕</span>
                    <span className="text-[10px] font-medium">Post</span>
                </button>
                <button className="flex flex-col items-center justify-center flex-1">
                    <span className="text-lg">💼</span>
                    <span className="text-[10px] font-medium">Jobs</span>
                </button>
            </div>

        </div>
    );
};

export default Homepage;