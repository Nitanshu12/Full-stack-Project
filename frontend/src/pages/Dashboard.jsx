import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { axiosPrivate } from '../api/axios';
import Logo from '../assets/Logo.png';
import {
    FiBell,
    FiLogOut,
    FiPlusSquare,
    FiUsers,
    FiSearch,
    FiUserCheck,
    FiFolder,
    FiMessageSquare,
    FiTrendingUp,
    FiLink,
    FiActivity
} from 'react-icons/fi';

const actionCards = [
    {
        title: 'Create Project',
        icon: FiPlusSquare,
        highlight: true,
        description: 'Start something new today'
    },
    {
        title: 'Find Teammates',
        icon: FiSearch,
        description: 'Discover matching collaborators',
        navigate: '/smart-matches'
    },
    {
        title: 'Find Mentor',
        icon: FiUserCheck,
        description: 'Get expert guidance'
    },
    {
        title: 'Browse Projects',
        icon: FiFolder,
        description: 'See what others are building',
        navigate: '/discover-projects'
    }
];

const getStatCards = (activeProjectsCount) => [
    {
        label: 'Active Projects',
        value: activeProjectsCount,
        icon: FiFolder,
        color: 'text-purple-600'
    },
    {
        label: 'Connections',
        value: 0,
        icon: FiUsers,
        color: 'text-sky-500'
    },
    {
        label: 'Messages',
        value: 0,
        icon: FiMessageSquare,
        color: 'text-purple-500'
    },
    {
        label: 'Posts',
        value: 0,
        icon: FiTrendingUp,
        color: 'text-sky-400'
    }
];

const recentActivity = [
    {
        title: 'New collaboration request',
        time: '2 hours ago'
    },
    {
        title: '5 new teammate matches',
        time: '5 hours ago'
    },
    {
        title: 'Mentor replied to your query',
        time: '1 day ago'
    }
];

const quickLinks = [
    'View Collaboration Requests',
    'Community Feed',
    'Edit Profile',
    'Resource Library'
];

const Dashboard = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeProjectsCount, setActiveProjectsCount] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch project stats
    const fetchProjectStats = async () => {
        try {
            const response = await axiosPrivate.get('/project/stats');
            if (response.data.success) {
                setActiveProjectsCount(response.data.data.activeProjects || 0);
            }
        } catch (err) {
            console.error('Error fetching project stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectStats();
    }, []);

    // Refresh stats when returning from create project page
    useEffect(() => {
        if (location.state?.projectCreated) {
            fetchProjectStats();
            // Clear the state to prevent unnecessary refetches
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const statCards = getStatCards(activeProjectsCount);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img 
                            src={Logo} 
                            alt="CollabSphere Logo" 
                            className="h-20 w-20 object-contain"
                        />
                        <div>
                            <p className="text-lg font-semibold text-gray-900">CollabSphere</p>
                            <p className="text-xs text-gray-500">Build together, faster.</p>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
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
                        <button className="hover:text-purple-600 transition-colors">Mentorship</button>
                        <button 
                            onClick={() => navigate('/feed')}
                            className="hover:text-purple-600 transition-colors"
                        >
                            Feed
                        </button>
                    </nav>

                    <div className="flex items-center gap-4">
                        <button className="relative text-gray-500 hover:text-gray-900 transition-colors">
                            <FiBell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-purple-500" />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-purple-500 hover:text-purple-600 transition-colors"
                        >
                            <FiLogOut />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
                {/* Welcome Block */}
                <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="text-2xl md:text-3xl font-semibold text-gray-900">
                                Welcome back, {auth.user?.name || 'creator'} <span className="inline-block">👋</span>
                            </p>
                            <p className="text-gray-500 mt-1">
                                Here&apos;s what&apos;s happening with your collaborations
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                            {actionCards.map((card) => (
                                <button
                                    key={card.title}
                                    onClick={() => {
                                        if (card.navigate) {
                                            navigate(card.navigate);
                                        } else if (card.title === 'Create Project') {
                                            navigate('/create-project');
                                        }
                                    }}
                                    className={`flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                                        card.highlight
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white border-transparent shadow-lg shadow-purple-200/60 pointer-cursor'
                                            : 'bg-white border-gray-200 text-gray-900 hover:border-purple-400 pointer-cursor'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`rounded-full p-2 ${
                                                card.highlight
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-purple-50 text-purple-600'
                                            }`}
                                        >
                                            <card.icon className="w-5 h-5" />
                                        </div>
                                        <p className={`font-semibold ${card.highlight ? 'text-white' : 'text-gray-900'}`}>
                                            {card.title}
                                        </p>
                                    </div>
                                    <p
                                        className={`text-sm ${
                                            card.highlight ? 'text-white/80' : 'text-gray-500'
                                        }`}
                                    >
                                        {card.description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col gap-3"
                        >
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>{stat.label}</span>
                                <span className="text-gray-400">
                                    <FiTrendingUp />
                                </span>
                            </div>
                            <div className="flex items-end gap-2">
                                <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                            <p className="text-xs text-gray-400">No updates yet</p>
                        </div>
                    ))}
                </section>

                {/* Activity + Quick Links */}
                <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-lg font-semibold text-gray-900">Recent Activity</p>
                            <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
                                View all
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentActivity.map((activity) => (
                                <div key={activity.title} className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                                        <FiActivity className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{activity.title}</p>
                                        <p className="text-sm text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <p className="text-lg font-semibold text-gray-900 mb-4">Quick Links</p>
                        <div className="space-y-4">
                            {quickLinks.map((link) => (
                                <button
                                    key={link}
                                    className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-purple-600"
                                >
                                    {link}
                                    <FiLink className="w-4 h-4" />
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;

