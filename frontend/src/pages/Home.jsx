<<<<<<< HEAD
import { useNavigate } from 'react-router-dom';
import HeroImage from '../assets/Hero-capstone.png';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="px-6 md:px-12 py-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="w-10 h-10 bg-blue-500 rounded-lg absolute opacity-80"></div>
                            <div className="w-10 h-10 bg-purple-500 rounded-lg relative transform rotate-12"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">★</span>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">COLLABSPHERE</h1>
                            <p className="text-xs text-gray-600">Where Student Ideas Find Teammates</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-gray-900 font-medium hover:text-blue-600 transition-colors"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Get Started
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="px-6 md:px-12 py-12 md:py-20">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    {/* Left Section - Text Content */}
                    <div className="space-y-6">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            Find Collaborators
                            <br />
                            & Mentors Easily
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                            A platform connecting students with like-minded peers
                            <br />
                            and experienced mentors
                        </p>
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                        >
                            Find Collaborators
                        </button>
                    </div>

                    {/* Right Section - Illustration */}
                    <div className="flex justify-center md:justify-end">
                        <img
                            src={HeroImage}
                            alt="Collaboration illustration"
                            className="w-full max-w-lg h-auto"
                        />
                    </div>
                </div>
            </main>

            {/* Key Features Section */}
            <section className="px-6 md:px-12 py-16 md:py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
                        Key Features
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Teammates</h3>
                            <p className="text-gray-600">
                                Connect with students who share your interests and project goals
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Mentors</h3>
                            <p className="text-gray-600">
                                Get guidance from experienced mentors in your field of study
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Collaboration</h3>
                            <p className="text-gray-600">
                                Streamlined tools to manage projects and communicate effectively
                            </p>
                        </div>
                    </div>
                </div>
            </section>
=======
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </header>

                <div className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
                    <h2 className="text-2xl font-semibold mb-4">Welcome back, {auth.user?.name}!</h2>
                    <p className="text-gray-400 mb-6">
                        You are securely logged in. This is a protected route.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                            <h3 className="text-lg font-medium mb-2 text-purple-400">Profile</h3>
                            <p className="text-sm text-gray-400">{auth.user?.email}</p>
                        </div>
                        <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                            <h3 className="text-lg font-medium mb-2 text-blue-400">Role</h3>
                            <p className="text-sm text-gray-400">{auth.user?.role || 'User'}</p>
                        </div>
                        <div className="bg-gray-700/50 p-6 rounded-xl border border-gray-600">
                            <h3 className="text-lg font-medium mb-2 text-green-400">Status</h3>
                            <p className="text-sm text-gray-400">Active</p>
                        </div>
                    </div>
                </div>
            </div>
>>>>>>> fd546c8a6aa631f2d6ec624f6c4874604d4835b4
        </div>
    );
};

export default Home;
