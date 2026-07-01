import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const OnboardPage = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Client-side validation regex: alphanumeric and dashes/underscores only
        const usernameRegex = /^[a-zA-Z0-9-_]+$/;
        if (!usernameRegex.test(username)) {
            setError('Username can only contain letters, numbers, dashes (-), and underscores (_)');
            setLoading(false);
            return;
        }

        try {
            // Update the endpoint string to match your API layout
            const response = await axios.put('/api/users/onboard', { username }, { withCredentials: true });
            
            if (response.data.success) {
                // Profile activated! Send them to the main feed
                navigate('/feed');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Try another username.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
            <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl shadow-md p-8">
                <div className="text-center mb-6">
                    <span className="text-3xl font-bold text-blue-600">LinkedClone</span>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">Claim your unique handle</h2>
                    <p className="mt-2 text-sm text-gray-500">
                        This will be your public profile address: <span className="font-medium text-gray-700">linkedclone.com/in/{username || 'your-name'}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value.trim().toLowerCase())}
                            placeholder="e.g., dilpreet-singh"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-medium"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 font-medium bg-red-50 p-2.5 rounded-lg border border-red-100">
                            ⚠️ {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !username}
                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Securing handle...' : 'Complete Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};