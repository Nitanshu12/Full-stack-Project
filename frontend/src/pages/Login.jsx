import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import Logo from '../assets/Logo.png';
const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await login(data.email, data.password);
            if (res.success) {
                navigate('/dashboard');
            } else {
                setError(res.message || "Login failed");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        }
    };

    const handleGoogleSignIn = () => {
        // TODO: Implement Google sign-in
        console.log("Google sign-in clicked");
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header with Logo */}
            <header className="px-6 md:px-12 py-6">
                <div className="flex items-center gap-2">
                    <img 
                        src={Logo} 
                        alt="CollabSphere Logo" 
                        className="h-10 w-10 object-contain"
                    />
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">COLLABSPHERE</h1>
                        <p className="text-xs text-gray-600">Where Ideas Come To Life</p>
                    </div>
                </div>
            </header>

            {/* Login Form Container */}
            <div className="flex items-center justify-center px-4 py-8 md:py-12">
                <div className="w-full max-w-md">
                    <div className="bg-gradient-to-b from-purple-800 to-blue-600 rounded-2xl p-8 md:p-10 shadow-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center uppercase tracking-wide">
                            WELCOME BACK
                        </h2>

                        {error && (
                            <div className="bg-red-500/20 border border-red-300 text-red-100 px-4 py-2 rounded-lg mb-6 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label className="block text-white font-medium mb-2">Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-white font-medium mb-2">Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                    placeholder="Enter your password"
                                />
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg transform transition-all active:scale-98"
                            >
                                Login
                            </button>
                        </form>

                        {/* Google Sign In Button */}
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className="w-full mt-4 py-3 bg-white text-gray-900 font-bold rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <span>Sign in with Google</span>
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                        </button>

                        {/* Sign Up Link */}
                        <div className="mt-6 text-center text-white text-sm">
                            Don't have any account?{' '}
                            <Link to="/signup" className="text-blue-200 hover:text-blue-100 font-semibold underline">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
