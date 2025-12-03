import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { axiosPrivate } from '../api/axios';
import api from '../api/axios';
import Header from '../components/Header';
import {
    FiSend,
    FiHeart,
    FiMessageCircle
} from 'react-icons/fi';

const CommunityFeed = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [postContent, setPostContent] = useState('');
    const [commentTexts, setCommentTexts] = useState({});
    const [showComments, setShowComments] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/post/all');
            if (response.data.success) {
                setPosts(response.data.data || []);
            }
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!postContent.trim()) return;

        try {
            setSubmitting(true);
            const response = await axiosPrivate.post('/post/create', {
                content: postContent.trim()
            });

            if (response.data.success) {
                setPostContent('');
                fetchPosts(); // Refresh posts
            }
        } catch (err) {
            console.error('Error creating post:', err);
            alert('Failed to create post. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            const response = await axiosPrivate.post(`/post/${postId}/like`);
            if (response.data.success) {
                // Update the post in the list
                setPosts(posts.map(post => 
                    post._id === postId ? response.data.data : post
                ));
            }
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    const handleComment = async (postId) => {
        const commentText = commentTexts[postId]?.trim();
        if (!commentText) return;

        try {
            const response = await axiosPrivate.post(`/post/${postId}/comment`, {
                text: commentText
            });

            if (response.data.success) {
                // Clear comment input
                setCommentTexts({ ...commentTexts, [postId]: '' });
                // Update the post in the list
                setPosts(posts.map(post => 
                    post._id === postId ? response.data.data : post
                ));
                // Show comments if hidden
                setShowComments({ ...showComments, [postId]: true });
            }
        } catch (err) {
            console.error('Error commenting:', err);
            alert('Failed to add comment. Please try again.');
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const isLiked = (post) => {
        if (!auth.user || !post.likes) return false;
        return post.likes.some(like => 
            (typeof like === 'object' ? like._id : like) === auth.user._id
        );
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Community Feed
                    </h1>
                    <p className="text-gray-600 text-base md:text-lg">
                        Share updates, achievements, and connect with the community
                    </p>
                </div>

                {/* Create Post Section */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
                    <form onSubmit={handleCreatePost}>
                        <textarea
                            value={postContent}
                            onChange={(e) => setPostContent(e.target.value)}
                            placeholder="Share something with the community..."
                            className="w-full min-h-[120px] p-4 border border-gray-200 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                            rows="4"
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                type="submit"
                                disabled={!postContent.trim() || submitting}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiSend className="w-4 h-4" />
                                Post
                            </button>
                        </div>
                    </form>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                )}

                {/* Posts List */}
                {!loading && (
                    <div className="space-y-6">
                        {posts.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No posts yet. Be the first to share!</p>
                            </div>
                        ) : (
                            posts.map((post) => (
                                <div
                                    key={post._id}
                                    className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
                                >
                                    {/* User Info */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                            {getInitials(post.author?.name)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">
                                                {post.author?.name || 'Anonymous'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {formatDate(post.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Post Content */}
                                    <div className="mb-4">
                                        <p className="text-gray-900 whitespace-pre-wrap break-words">
                                            {post.content}
                                        </p>
                                    </div>

                                    {/* Interactions */}
                                    <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => handleLike(post._id)}
                                            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                                                isLiked(post)
                                                    ? 'text-red-500 hover:text-red-600'
                                                    : 'text-gray-600 hover:text-purple-600'
                                            }`}
                                        >
                                            <FiHeart className={`w-5 h-5 ${isLiked(post) ? 'fill-current' : ''}`} />
                                            <span>{post.likes?.length || 0}</span>
                                        </button>
                                        <button
                                            onClick={() => setShowComments({
                                                ...showComments,
                                                [post._id]: !showComments[post._id]
                                            })}
                                            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors"
                                        >
                                            <FiMessageCircle className="w-5 h-5" />
                                            <span>Comment</span>
                                        </button>
                                    </div>

                                    {/* Comments Section */}
                                    {showComments[post._id] && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            {/* Existing Comments */}
                                            {post.comments && post.comments.length > 0 && (
                                                <div className="space-y-4 mb-4">
                                                    {post.comments.map((comment, idx) => (
                                                        <div key={idx} className="flex items-start gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                                                {getInitials(comment.user?.name)}
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-medium text-sm text-gray-900">
                                                                    {comment.user?.name || 'Anonymous'}
                                                                </p>
                                                                <p className="text-gray-700 text-sm mt-1">
                                                                    {comment.text}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Add Comment */}
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={commentTexts[post._id] || ''}
                                                    onChange={(e) => setCommentTexts({
                                                        ...commentTexts,
                                                        [post._id]: e.target.value
                                                    })}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleComment(post._id);
                                                        }
                                                    }}
                                                    placeholder="Write a comment..."
                                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
                                                />
                                                <button
                                                    onClick={() => handleComment(post._id)}
                                                    disabled={!commentTexts[post._id]?.trim()}
                                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                                >
                                                    Post
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default CommunityFeed;

