import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from '../../api/axios';
import Header from '../../components/Header';
import {
    FiUsers,
    FiFolder,
    FiMessageSquare,
    FiShield,
    FiTrendingUp,
    FiActivity,
    FiLink,
    FiSettings,
    FiPieChart,
    FiUserPlus,
    FiAlertCircle
} from 'react-icons/fi';

const AdminDashboard = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axiosPrivate.get('/admin/analytics');
                if (res.data?.success) {
                    setAnalytics(res.data.data);
                }
            } catch (err) {
                console.error('Error fetching analytics:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const statCards = [
        {
            label: 'Total Users',
            value: analytics?.totalUsers || 0,
            icon: FiUsers,
            color: 'text-purple-600'
        },
        {
            label: 'Total Projects',
            value: analytics?.totalProjects || 0,
            icon: FiFolder,
            color: 'text-sky-500'
        },
        {
            label: 'Total Posts',
            value: analytics?.totalPosts || 0,
            icon: FiMessageSquare,
            color: 'text-purple-500'
        },
        {
            label: 'Blocked Users',
            value: analytics?.statusBreakdown?.blocked || 0,
            icon: FiAlertCircle,
            color: 'text-red-500'
        }
    ];

    const actionCards = [
        {
            title: 'Manage Users',
            icon: FiUsers,
            highlight: true,
            description: 'View, edit, and manage all users',
            navigate: '/admin/users'
        },
        {
            title: 'System Analytics',
            icon: FiPieChart,
            description: 'Detailed platform analytics'
        },
        {
            title: 'Role Management',
            icon: FiShield,
            description: 'Assign and manage user roles'
        },
        {
            title: 'Platform Settings',
            icon: FiSettings,
            description: 'Configure platform settings'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
                {/* Welcome */}
                <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="flex flex-col gap-4">
                        <div>
                            <p className="text-2xl md:text-3xl font-semibold text-gray-900">
                                Admin Portal <span className="inline-block">🛡️</span>
                            </p>
                            <p className="text-gray-500 mt-1">
                                Welcome back, {auth.user?.name || 'Admin'}. Here&apos;s the platform overview.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                            {actionCards.map((card) => (
                                <button
                                    key={card.title}
                                    onClick={() => card.navigate && navigate(card.navigate)}
                                    className={`flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                                        card.highlight
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white border-transparent shadow-lg shadow-purple-200/60'
                                            : 'bg-white border-gray-200 text-gray-900 hover:border-purple-400'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`rounded-full p-2 ${card.highlight ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-600'}`}>
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
                        <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>{stat.label}</span>
                                <span className="text-gray-400"><FiTrendingUp /></span>
                            </div>
                            <div className="flex items-end gap-2">
                                <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                    ))}
                </section>

                {/* Role Breakdown */}
                {analytics?.roleBreakdown && (
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                            <p className="text-lg font-semibold text-gray-900 mb-4">Role Breakdown</p>
                            <div className="space-y-3">
                                {[
                                    { label: 'Students', count: analytics.roleBreakdown.students, color: 'bg-purple-500' },
                                    { label: 'Mentors', count: analytics.roleBreakdown.mentors, color: 'bg-blue-500' },
                                    { label: 'Organizations', count: analytics.roleBreakdown.organizations, color: 'bg-sky-500' },
                                    { label: 'Admins', count: analytics.roleBreakdown.admins, color: 'bg-indigo-500' },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">{item.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                            <p className="text-lg font-semibold text-gray-900 mb-4">Recent Signups</p>
                            <div className="space-y-3">
                                {(analytics.recentSignups || []).map((user) => (
                                    <div key={user._id} className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-xs">
                                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                            user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                                            user.role === 'MENTOR' ? 'bg-blue-100 text-blue-700' :
                                            user.role === 'ORGANIZATION' ? 'bg-sky-100 text-sky-700' :
                                            'bg-purple-100 text-purple-700'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
