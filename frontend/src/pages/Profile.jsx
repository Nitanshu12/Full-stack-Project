import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { axiosPrivate } from '../api/axios';
import Logo from '../assets/Logo.png';
import { FiEdit2, FiTrash2, FiFolder, FiMapPin, FiArrowLeft } from 'react-icons/fi';

const getInitials = (name = '') => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }
    const first = parts[0]?.[0] || '';
    const last = parts[parts.length - 1]?.[0] || '';
    return (first + last).toUpperCase();
};

const Profile = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState(auth.user || null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setError('');
                // Refresh user details
                const userRes = await axiosPrivate.get('/user-details');
                if (userRes.data?.success) {
                    setUser(userRes.data.data);
                } else if (auth.user) {
                    setUser(auth.user);
                }

                // Fetch projects created by this user
                const projRes = await axiosPrivate.get('/project/mine');
                if (projRes.data?.success) {
                    setProjects(projRes.data.data.projects || []);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEditProject = (project) => {
        navigate('/create-project', { state: { projectToEdit: project } });
    };

    const handleDeleteProject = async (projectId) => {
        const confirm = window.confirm('Are you sure you want to delete this project?');
        if (!confirm) return;

        try {
            const res = await axiosPrivate.delete(`/project/${projectId}`);
            if (res.data?.success) {
                setProjects(prev => prev.filter(p => p._id !== projectId));
            } else {
                alert(res.data?.message || 'Failed to delete project');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete project');
        }
    };

    const skills = user?.skills || [];
    const interests = user?.interests || [];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header (reuse style from dashboard) */}
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
                            <p className="text-xs text-gray-500">Your creator profile</p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="hidden sm:inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-purple-500 hover:text-purple-600 transition-colors"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
                {loading && (
                    <div className="flex items-center justify-center py-16">
                        <p className="text-gray-600">Loading your profile...</p>
                    </div>
                )}

                {!loading && (
                    <>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Top section: avatar + basic info */}
                        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white text-xl md:text-2xl font-bold">
                                    {getInitials(user?.name || 'User')}
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                                        {user?.name || 'Your Profile'}
                                    </h1>
                                    <p className="text-sm text-gray-500">{user?.email}</p>
                                    <p className="mt-2 text-xs text-gray-400">
                                        Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'recently'}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Details grid */}
                        <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_2fr] gap-6">
                            {/* Left: skills & interests */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                        Skills
                                    </h2>
                                    {skills.length === 0 ? (
                                        <p className="text-sm text-gray-500">
                                            Add skills to your profile through future profile editing.
                                        </p>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                        Interests
                                    </h2>
                                    {interests.length === 0 ? (
                                        <p className="text-sm text-gray-500">
                                            Add interests to help teammates and mentors discover you.
                                        </p>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {interests.map((interest) => (
                                                <span
                                                    key={interest}
                                                    className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium"
                                                >
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                        Mentor Connections
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        You haven&apos;t sent any mentor connection requests yet. As you start
                                        connecting with mentors, they&apos;ll appear here.
                                    </p>
                                </div>
                            </div>

                            {/* Right: projects list */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-7">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                                            Your Projects
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Manage the projects you&apos;ve created on CollabSphere.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/create-project')}
                                        className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 text-xs font-semibold shadow-sm hover:shadow-md transition"
                                    >
                                        <FiFolder className="w-4 h-4" />
                                        New Project
                                    </button>
                                </div>

                                {projects.length === 0 ? (
                                    <div className="border border-dashed border-gray-200 rounded-2xl p-6 text-center">
                                        <p className="text-sm text-gray-600 mb-2">
                                            You haven&apos;t created any projects yet.
                                        </p>
                                        <button
                                            onClick={() => navigate('/create-project')}
                                            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2 text-sm font-semibold shadow-sm hover:shadow-md transition"
                                        >
                                            <FiFolder className="w-4 h-4" />
                                            Create your first project
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {projects.map((project) => (
                                            <div
                                                key={project._id}
                                                className="border border-gray-100 rounded-2xl p-4 flex flex-col gap-3 hover:border-purple-200 hover:shadow-sm transition"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <h3 className="text-base md:text-lg font-semibold text-gray-900">
                                                            {project.title}
                                                        </h3>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                            <FiMapPin className="w-3 h-3" />
                                                            {project.isRemote ? 'Remote' : (project.location || 'Location not set')}
                                                        </p>
                                                    </div>
                                                    <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 capitalize">
                                                        {project.status || 'active'}
                                                    </span>
                                                </div>

                                                <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                                                    {project.description}
                                                </p>

                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                    <div className="flex flex-wrap gap-2">
                                                        {project.tags?.slice(0, 4).map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-[11px] font-medium"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        {project.tags?.length > 4 && (
                                                            <span className="text-[11px] text-gray-400">
                                                                +{project.tags.length - 4} more
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEditProject(project)}
                                                            className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:border-purple-500 hover:text-purple-600 transition"
                                                        >
                                                            <FiEdit2 className="w-3 h-3" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteProject(project._id)}
                                                            className="inline-flex items-center gap-1 rounded-full border border-red-100 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition"
                                                        >
                                                            <FiTrash2 className="w-3 h-3" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
};

export default Profile;


