import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from '../api/axios';
import Header from '../components/Header';
import {
    FiUsers,
    FiCalendar,
    FiClock,
    FiStar,
    FiTrendingUp,
    FiActivity,
    FiLink,
    FiEye,
    FiSettings,
    FiBookOpen
} from 'react-icons/fi';

const actionCards = [
    {
        title: 'View Mentees',
        icon: FiUsers,
        highlight: true,
        description: 'See your active mentees'
    },
    {
        title: 'Set Availability',
        icon: FiClock,
        description: 'Update your schedule'
    },
    {
        title: 'Browse Students',
        icon: FiEye,
        description: 'Discover students to mentor'
    },
    {
        title: 'Session History',
        icon: FiBookOpen,
        description: 'Review past sessions'
    }
];

const getStatCards = (stats) => [
    {
        label: 'Active Mentees',
        value: stats.totalMentees || 0,
        icon: FiUsers,
        color: 'text-purple-600'
    },
    {
        label: 'Sessions',
        value: stats.totalSessions || 0,
        icon: FiCalendar,
        color: 'text-sky-500'
    },
    {
        label: 'Pending Requests',
        value: stats.pendingRequests || 0,
        icon: FiClock,
        color: 'text-purple-500'
    },
    {
        label: 'Reviews',
        value: stats.reviews || 0,
        icon: FiStar,
        color: 'text-sky-400'
    }
];

const recentActivity = [
    {
        title: 'New mentorship request',
        time: '1 hour ago'
    },
    {
        title: 'Student completed milestone',
        time: '3 hours ago'
    },
    {
        title: 'Session feedback received',
        time: '1 day ago'
    }
];

const quickLinks = [
    { label: 'View Mentorship Requests', path: '#' },
    { label: 'Community Feed', path: '/feed' },
    { label: 'Edit Profile', path: '/profile' },
    { label: 'Availability Settings', path: '#' }
];

const MentorDashboard = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axiosPrivate.get('/mentor/dashboard-stats');
                if (res.data?.success) {
                    setStats(res.data.data);
                }
            } catch (err) {
                console.error('Error fetching mentor stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = getStatCards(stats);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
                {/* Welcome Block */}
                <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="text-2xl md:text-3xl font-semibold text-gray-900">
                                Welcome back, {auth.user?.name || 'mentor'} <span className="inline-block">🎓</span>
                            </p>
                            <p className="text-gray-500 mt-1">
                                Here&apos;s your mentorship overview
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                            {actionCards.map((card) => (
                                <button
                                    key={card.title}
                                    className={`flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                                        card.highlight
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white border-transparent shadow-lg shadow-purple-200/60'
                                            : 'bg-white border-gray-200 text-gray-900 hover:border-purple-400'
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
                                    <p className={`text-sm ${card.highlight ? 'text-white/80' : 'text-gray-500'}`}>
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
                                    key={link.label}
                                    onClick={() => link.path !== '#' && navigate(link.path)}
                                    className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-purple-600"
                                >
                                    {link.label}
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

export default MentorDashboard;
