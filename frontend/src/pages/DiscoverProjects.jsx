import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import  api  from '../api/axios.js';
import Logo from '../assets/Logo.png';
import { FiSearch, FiFilter, FiPlus, FiCalendar, FiMapPin, FiBell, FiLogOut } from 'react-icons/fi';

const DiscoverProjects = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [tagFilter, setTagFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [remoteOnly, setRemoteOnly] = useState(false);
    const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'az'

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    useEffect(() => {
        fetchProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchProjects = async (overrides = {}) => {
        const {
            search = searchQuery,
            tag = tagFilter,
            location = locationFilter,
            isRemote = remoteOnly
        } = overrides;

        try {
            setLoading(true);
            const params = {};

            if (search) params.search = search;
            if (tag) params.tags = tag;
            if (location) params.location = location;
            if (isRemote) params.isRemote = 'true';

            const response = await api.get('/project/all', { params });
            
            if (response.data.success) {
                let fetched = response.data.data.projects || [];

                // Client-side sorting for better UX
                if (sortBy === 'newest') {
                    fetched = [...fetched].sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    );
                } else if (sortBy === 'oldest') {
                    fetched = [...fetched].sort(
                        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                    );
                } else if (sortBy === 'az') {
                    fetched = [...fetched].sort((a, b) =>
                        (a.title || '').localeCompare(b.title || '')
                    );
                }

                setProjects(fetched);
            }
        } catch (err) {
            console.error('Error fetching projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProjects({ search: searchQuery });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img 
                            src={Logo} 
                            alt="CollabSphere Logo" 
                            className="h-10 w-10 object-contain"
                        />
                        <div>
                            <p className="text-lg font-semibold text-gray-900">CollabSphere</p>
                            <p className="text-xs text-gray-500">Build together, faster.</p>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                        <button 
                            onClick={() => navigate('/discover-projects')}
                            className="text-purple-600 transition-colors"
                        >
                            Projects
                        </button>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="hover:text-purple-600 transition-colors"
                        >
                            Dashboard
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                            Discover Projects
                        </h1>
                        <p className="text-lg text-gray-600">
                            Find exciting projects to collaborate on
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/create-project')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
                    >
                        <FiPlus className="w-5 h-5" />
                        Create Project
                    </button>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-6 space-y-4">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FiSearch className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search projects by title, tags, or skills..."
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="inline-flex flex-1 md:flex-none items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition"
                            >
                                Search
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center gap-2 px-4 py-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
                            >
                                <FiFilter className="w-5 h-5" />
                                Filters
                            </button>
                        </div>
                    </form>

                    {showFilters && (
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-5 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Tag / Skill filter */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                        Skill / Tag
                                    </label>
                                    <input
                                        type="text"
                                        value={tagFilter}
                                        onChange={(e) => setTagFilter(e.target.value)}
                                        placeholder="e.g. React, AI, Backend"
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Location filter */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={locationFilter}
                                        onChange={(e) => setLocationFilter(e.target.value)}
                                        placeholder="City, country, or remote"
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Sort select */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                        Sort by
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => {
                                            setSortBy(e.target.value);
                                            // Re-apply sorting on current results
                                            fetchProjects();
                                        }}
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="newest">Newest first</option>
                                        <option value="oldest">Oldest first</option>
                                        <option value="az">Title A–Z</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-1">
                                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={remoteOnly}
                                        onChange={(e) => setRemoteOnly(e.target.checked)}
                                        className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                    />
                                    <span>Show only remote-friendly projects</span>
                                </label>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTagFilter('');
                                            setLocationFilter('');
                                            setRemoteOnly(false);
                                            setSortBy('newest');
                                            fetchProjects({
                                                search: searchQuery,
                                                tag: '',
                                                location: '',
                                                isRemote: false
                                            });
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                                    >
                                        Clear filters
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            fetchProjects({
                                                search: searchQuery,
                                                tag: tagFilter,
                                                location: locationFilter,
                                                isRemote: remoteOnly
                                            })
                                        }
                                        className="px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm hover:shadow-md transition"
                                    >
                                        Apply filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-gray-500">Loading projects...</div>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <p className="text-gray-500 text-lg mb-2">No projects found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project._id}
                                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => {
                                    // TODO: Navigate to project details page
                                    console.log('Project clicked:', project._id);
                                }}
                            >
                                {/* Category/Tag */}
                                {project.tags && project.tags.length > 0 && (
                                    <div className="mb-3">
                                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
                                            {project.tags[0].toLowerCase()}
                                        </span>
                                    </div>
                                )}

                                {/* Project Title */}
                                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                                    {project.title}
                                </h3>

                                {/* Description Preview */}
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {project.description}
                                </p>

                                {/* Looking For */}
                                {project.lookingFor && project.lookingFor.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Looking for:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.lookingFor.slice(0, 3).map((role, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-block px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded"
                                                >
                                                    {role}
                                                </span>
                                            ))}
                                            {project.lookingFor.length > 3 && (
                                                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                                                    +{project.lookingFor.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Metadata */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <FiCalendar className="w-4 h-4" />
                                        <span>{formatDate(project.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <FiMapPin className="w-4 h-4" />
                                        <span className="lowercase">
                                            {project.isRemote ? 'Remote' : project.location || 'Not specified'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiscoverProjects;

