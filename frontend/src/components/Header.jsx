import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import Logo from '../assets/Logo.png';
import { FiLogOut } from 'react-icons/fi';

const getInitials = (name = '') => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }
    const first = parts[0]?.[0] || '';
    const last = parts[parts.length - 1]?.[0] || '';
    return (first + last).toUpperCase();
};

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { auth, logout } = useAuth();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const handleLogout = async () => {
        setIsProfileMenuOpen(false);
        await logout();
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <img 
                        src={Logo} 
                        alt="CollabSphere Logo" 
                        className="object-contain"
                        style={{ width: '6.25rem', height: '6.25rem' }}
                    />
                    <div>
                        <p className="text-lg font-semibold text-gray-900">CollabSphere</p>
                        <p className="text-xs text-gray-500">Build together, faster.</p>
                    </div>
                </div>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                    {location.pathname !== '/dashboard' && (
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="hover:text-purple-600 transition-colors"
                        >
                            Dashboard
                        </button>
                    )}
                    <button 
                        onClick={() => navigate('/discover-projects')}
                        className="hover:text-purple-600 transition-colors"
                    >
                        Projects
                    </button>
                    <button 
                        onClick={() => navigate('/smart-matches')}
                        className="hover:text-purple-600 transition-colors"
                    >
                        Find Teammates
                    </button>
                    <button 
                        onClick={() => navigate('/mentors')}
                        className="hover:text-purple-600 transition-colors"
                    >
                        Mentorship
                    </button>
                    <button 
                        onClick={() => navigate('/feed')}
                        className="hover:text-purple-600 transition-colors"
                    >
                        Feed
                    </button>
                </nav>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                            className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white"
                        >
                            {getInitials(auth.user?.name || 'User')}
                        </button>
                        {isProfileMenuOpen && (
                            <div className="absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                                <button
                                    onClick={() => {
                                        setIsProfileMenuOpen(false);
                                        navigate('/profile');
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    Your Profile
                                </button>
                                <div className="border-t border-gray-100 my-1" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 inline-flex items-center gap-2"
                                >
                                    <FiLogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

