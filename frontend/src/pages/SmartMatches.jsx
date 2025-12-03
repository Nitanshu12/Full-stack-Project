import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from '../api/axios';
import Header from '../components/Header';
import {
    FiZap,
    FiMail,
    FiExternalLink
} from 'react-icons/fi';
import useAuth from '../hooks/useAuth';

const SmartMatches = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [connectingIds, setConnectingIds] = useState(new Set());
    const [connectedIds, setConnectedIds] = useState(new Set());

    useEffect(() => {
        fetchUsers();
        fetchConnections();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axiosPrivate.get('/all-user');
            if (response.data.success) {
                setUsers(response.data.data || []);
            } else {
                setError('Failed to fetch users');
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load matches. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchConnections = async () => {
        try {
            const res = await axiosPrivate.get('/connections/my');
            if (res.data?.success) {
                const myId = auth.user?._id;
                const ids = new Set();
                (res.data.data || []).forEach((conn) => {
                    const requesterId = conn.requester?._id || conn.requester;
                    const receiverId = conn.receiver?._id || conn.receiver;
                    const otherId = requesterId === myId ? receiverId : requesterId;
                    if (otherId) ids.add(String(otherId));
                });
                setConnectedIds(ids);
            }
        } catch (err) {
            console.error('Error fetching connections:', err);
        }
    };

    const handleConnect = async (targetUserId) => {
        if (!targetUserId) return;
        setError(null);

        setConnectingIds((prev) => new Set(prev).add(targetUserId));
        try {
            const res = await axiosPrivate.post('/connections/connect', { targetUserId });
            if (res.data?.success) {
                setConnectedIds((prev) => new Set(prev).add(targetUserId));
            } else {
                setError(res.data?.message || 'Failed to connect. Please try again.');
            }
        } catch (err) {
            console.error('Error creating connection:', err);
            setError(err.response?.data?.message || 'Failed to connect. Please try again.');
        } finally {
            setConnectingIds((prev) => {
                const copy = new Set(prev);
                copy.delete(targetUserId);
                return copy;
            });
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const getMatchColor = (score) => {
        if (score >= 85) return 'bg-blue-500';
        if (score >= 70) return 'bg-purple-500';
        return 'bg-gray-400';
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
                {/* Header Section */}
                <div className="mb-8 md:mb-12">
                    <div className="flex items-center gap-3 mb-3">
                        <FiZap className="w-8 h-8 text-blue-500" />
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Smart Matches</h1>
                    </div>
                    <p className="text-gray-600 text-base md:text-lg ml-11">
                        AI-powered teammate recommendations based on your skills and interests
                    </p>
                </div>

                {/* How Matching Works Card */}
                <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8 md:mb-12 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <FiZap className="w-6 h-6 text-purple-600" />
                        <h2 className="text-xl font-semibold text-gray-900">How Matching Works</h2>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                        Our AI analyzes your skills, interests, projects, and location to find the perfect teammates. 
                        Match scores are calculated based on skill complementarity, shared interests, and collaboration style.
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Users Grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 text-lg">No matches found at the moment.</p>
                            </div>
                        ) : (
                            users.map((user) => (
                                <div
                                    key={user._id}
                                    className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    {/* Match Score Badge */}
                                    <div className="flex justify-end mb-4">
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-sm font-medium ${getMatchColor(user.matchScore || 0)}`}>
                                            <FiZap className="w-3.5 h-3.5" />
                                            <span>{user.matchScore || 0}%</span>
                                        </div>
                                    </div>

                                    {/* User Info */}
                                    <div className="flex items-start gap-4 mb-4">
                                        {/* Avatar */}
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-xl">
                                                {getInitials(user.name)}
                                            </div>
                                        </div>

                                        {/* Name and Role */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                {user.name || 'Anonymous'}
                                            </h3>
                                            <p className="text-sm text-gray-500">student</p>
                                        </div>
                                    </div>

                                    {/* Skills */}
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                                        {user.skills && user.skills.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {user.skills.slice(0, 3).map((skill, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                                {user.skills.length > 3 && (
                                                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                                        +{user.skills.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">No skills listed</p>
                                        )}
                                    </div>

                                    {/* Interests */}
                                    <div className="mb-6">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Interests</p>
                                        {user.interests && user.interests.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {user.interests.slice(0, 3).map((interest, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                                                    >
                                                        {interest}
                                                    </span>
                                                ))}
                                                {user.interests.length > 3 && (
                                                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                                        +{user.interests.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">No interests listed</p>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            disabled={connectedIds.has(user._id) || connectingIds.has(user._id)}
                                            onClick={() => handleConnect(user._id)}
                                            className={`flex-1 px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm transition-all ${
                                                connectedIds.has(user._id)
                                                    ? 'bg-green-50 text-green-700 border border-green-200 cursor-default'
                                                    : 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600'
                                            } ${connectingIds.has(user._id) ? 'opacity-70 cursor-wait' : ''}`}
                                        >
                                            <FiMail className="w-4 h-4" />
                                            {connectedIds.has(user._id)
                                                ? 'Connected'
                                                : connectingIds.has(user._id)
                                                ? 'Connecting...'
                                                : 'Connect'}
                                        </button>
                                        <button className="px-4 py-2.5 border border-purple-200 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors flex items-center justify-center gap-2">
                                            <FiExternalLink className="w-4 h-4" />
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default SmartMatches;

