import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from '../api/axios';
import Header from '../components/Header';
import {
    FiZap,
    FiMail,
    FiExternalLink,
    FiCpu,
    FiTarget,
    FiHeart,
    FiLayers
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
    const [expandedCard, setExpandedCard] = useState(null);

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
        if (score >= 85) return 'bg-emerald-500';
        if (score >= 70) return 'bg-blue-500';
        if (score >= 50) return 'bg-purple-500';
        return 'bg-gray-400';
    };

    const getMatchLabel = (score) => {
        if (score >= 85) return 'Excellent Match';
        if (score >= 70) return 'Strong Match';
        if (score >= 50) return 'Good Match';
        if (score >= 30) return 'Partial Match';
        return 'Low Match';
    };

    const getScoreBarColor = (score) => {
        if (score >= 70) return 'bg-emerald-400';
        if (score >= 50) return 'bg-blue-400';
        if (score >= 30) return 'bg-yellow-400';
        return 'bg-gray-300';
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
                {/* Header Section */}
                <div className="mb-8 md:mb-12">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
                            <FiCpu className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">AI Smart Matches</h1>
                    </div>
                    <p className="text-gray-600 text-base md:text-lg ml-14">
                        AI-powered teammate recommendations based on your skills and interests
                    </p>
                </div>

                {/* How Matching Works Card */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 md:p-8 mb-8 md:mb-12 border border-purple-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <FiCpu className="w-6 h-6 text-purple-600" />
                        <h2 className="text-xl font-semibold text-gray-900">How AI Matching Works</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 p-1.5 bg-purple-100 rounded-lg">
                                <FiTarget className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 text-sm">Skills Analysis</p>
                                <p className="text-gray-500 text-xs">TF-IDF vectorization compares your technical skills with other users</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1 p-1.5 bg-blue-100 rounded-lg">
                                <FiHeart className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 text-sm">Interest Matching</p>
                                <p className="text-gray-500 text-xs">Cosine similarity finds users with aligned interests and goals</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="mt-1 p-1.5 bg-green-100 rounded-lg">
                                <FiLayers className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 text-sm">Overlap Detection</p>
                                <p className="text-gray-500 text-xs">Jaccard index measures exact skill overlap for precise matching</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
                            <FiCpu className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-600" />
                        </div>
                        <p className="mt-4 text-gray-500 font-medium">AI is analyzing matches...</p>
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
                                    className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-purple-200"
                                >
                                    {/* Match Score Badge */}
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                            {getMatchLabel(user.matchScore || 0)}
                                        </span>
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-sm font-bold ${getMatchColor(user.matchScore || 0)}`}>
                                            <FiZap className="w-3.5 h-3.5" />
                                            <span>{user.matchScore || 0}%</span>
                                        </div>
                                    </div>

                                    {/* User Info */}
                                    <div className="flex items-start gap-4 mb-4">
                                        {/* Avatar */}
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-xl shadow-md">
                                                {getInitials(user.name)}
                                            </div>
                                        </div>

                                        {/* Name and Role */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                {user.name || 'Anonymous'}
                                            </h3>
                                            <p className="text-sm text-gray-500 capitalize">{(user.role || 'student').toLowerCase()}</p>
                                        </div>
                                    </div>

                                    {/* AI Match Breakdown (collapsible) */}
                                    {user.matchBreakdown && (
                                        <div className="mb-4">
                                            <button
                                                onClick={() => setExpandedCard(expandedCard === user._id ? null : user._id)}
                                                className="text-xs font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1 mb-2"
                                            >
                                                <FiCpu className="w-3 h-3" />
                                                {expandedCard === user._id ? 'Hide' : 'Show'} AI Breakdown
                                            </button>
                                            {expandedCard === user._id && (
                                                <div className="bg-gray-50 rounded-lg p-3 space-y-2 animate-fadeIn">
                                                    {/* Skill Similarity */}
                                                    <div>
                                                        <div className="flex justify-between text-xs mb-1">
                                                            <span className="text-gray-600">Skill Match</span>
                                                            <span className="font-medium">{user.matchBreakdown.skillSimilarity ?? 0}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                            <div
                                                                className={`h-1.5 rounded-full transition-all duration-500 ${getScoreBarColor(user.matchBreakdown.skillSimilarity ?? 0)}`}
                                                                style={{ width: `${Math.min(user.matchBreakdown.skillSimilarity ?? 0, 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* Interest Similarity */}
                                                    <div>
                                                        <div className="flex justify-between text-xs mb-1">
                                                            <span className="text-gray-600">Interest Match</span>
                                                            <span className="font-medium">{user.matchBreakdown.interestSimilarity ?? 0}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                            <div
                                                                className={`h-1.5 rounded-full transition-all duration-500 ${getScoreBarColor(user.matchBreakdown.interestSimilarity ?? 0)}`}
                                                                style={{ width: `${Math.min(user.matchBreakdown.interestSimilarity ?? 0, 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* Skill Overlap */}
                                                    <div>
                                                        <div className="flex justify-between text-xs mb-1">
                                                            <span className="text-gray-600">Skill Overlap</span>
                                                            <span className="font-medium">{user.matchBreakdown.skillOverlap ?? 0}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                            <div
                                                                className={`h-1.5 rounded-full transition-all duration-500 ${getScoreBarColor(user.matchBreakdown.skillOverlap ?? 0)}`}
                                                                style={{ width: `${Math.min(user.matchBreakdown.skillOverlap ?? 0, 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

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

                {/* Algorithm footer note */}
                {!loading && users.length > 0 && (
                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
                            <FiCpu className="w-3 h-3" />
                            Powered by TF-IDF Cosine Similarity + Jaccard Index
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SmartMatches;
