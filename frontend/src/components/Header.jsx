import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import Logo from '../assets/Logo.png';
import { FiLogOut, FiShield } from 'react-icons/fi';

const getInitials = (name = '') => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }
    const first = parts[0]?.[0] || '';
    const last = parts[parts.length - 1]?.[0] || '';
    return (first + last).toUpperCase();
};

// Navigation links per role
const NAV_CONFIG = {
    STUDENT: [
        { label: 'Dashboard', path: '/student/dashboard' },
        { label: 'Projects', path: '/student/discover-projects' },
        { label: 'Find Teammates', path: '/student/smart-matches' },
        { label: 'Mentorship', path: '/student/mentors' },
        { label: 'Feed', path: '/feed' }
    ],
    MENTOR: [
        { label: 'Dashboard', path: '/mentor/dashboard' },
        { label: 'Feed', path: '/feed' }
    ],
    ORGANIZATION: [
        { label: 'Dashboard', path: '/organization/dashboard' },
        { label: 'Feed', path: '/feed' }
    ],
    ADMIN: [
        { label: 'Dashboard', path: '/admin/dashboard' },
        { label: 'Users', path: '/admin/users' },
        { label: 'Feed', path: '/feed' }
    ]
};

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { auth, logout, getDashboardPath } = useAuth();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const userRole = auth.user?.role || 'STUDENT';
    const navLinks = NAV_CONFIG[userRole] || NAV_CONFIG.STUDENT;

    const handleLogout = async () => {
        setIsProfileMenuOpen(false);
        await logout();
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(getDashboardPath(userRole))}>
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
                    {navLinks
                        .filter((link) => link.path !== location.pathname)
                        .map((link) => (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className="hover:text-purple-600 transition-colors"
                            >
                                {link.label}
                            </button>
                        ))}
                    {userRole === 'ADMIN' && (
                        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-50 text-red-600 font-semibold">
                            <FiShield className="w-3 h-3" /> Admin
                        </span>
                    )}
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
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-xs font-semibold text-gray-900">{auth.user?.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{userRole.toLowerCase()}</p>
                                </div>
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
