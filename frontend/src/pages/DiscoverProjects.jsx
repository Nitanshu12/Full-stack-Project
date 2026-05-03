import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../api/axios.js';
import Header from '../components/Header';
import { MagnifyingGlass, Funnel, Plus, CalendarBlank, MapPin, Users, ArrowRight } from '@phosphor-icons/react';

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
    const [sortBy, setSortBy] = useState('newest'); 

    useEffect(() => {
        fetchProjects();
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
        
        if (diffDays === 1) return '1 d';
        if (diffDays < 7) return `${diffDays} d`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} w`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} mo`;
        return `${Math.floor(diffDays / 365)} y`;
    };

    return (
        <div className="min-h-screen">
            <Header />

            <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-10">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4">
                    <div>
                        <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-[var(--cs-primary)]">§ explore</div>
                        <h1 className="font-display text-4xl md:text-5xl tracking-tighter mt-1 text-[var(--cs-ink)]">
                            Discover Projects
                        </h1>
                        <p className="text-muted-ink mt-2">
                            Find exciting projects to collaborate on.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/create-project')}
                        className="btn-brutal bg-[var(--cs-primary)] text-white px-5 py-3 font-semibold inline-flex items-center gap-2"
                    >
                        <Plus weight="bold" size={16} /> Create Project
                    </button>
                </div>

                <div className="mb-8 space-y-4">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <MagnifyingGlass className="w-5 h-5 text-muted-ink" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search projects by title, tags, or skills..."
                                className="w-full pl-12 pr-4 py-4 border-2 border-[var(--cs-ink)] bg-white focus:outline-none placeholder-muted-ink"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="inline-flex flex-1 md:flex-none items-center justify-center px-6 py-4 btn-brutal bg-[var(--cs-ink)] text-white font-semibold"
                            >
                                Search
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`inline-flex items-center gap-2 px-6 py-4 border-2 border-[var(--cs-ink)] font-semibold shadow-brutal transition-colors ${showFilters ? 'bg-[var(--cs-yellow)]' : 'bg-white hover:bg-[var(--cs-yellow)]'}`}
                            >
                                <Funnel weight="bold" className="w-5 h-5" /> Filters
                            </button>
                        </div>
                    </form>

                    {showFilters && (
                        <div className="bg-white border-2 border-[var(--cs-ink)] shadow-brutal p-5 md:p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {/* Tag / Skill filter */}
                                <div className="flex flex-col gap-2">
                                    <label className="font-mono-cs text-[10px] tracking-[0.2em] uppercase text-[var(--cs-ink)]">
                                        Skill / Tag
                                    </label>
                                    <input
                                        type="text"
                                        value={tagFilter}
                                        onChange={(e) => setTagFilter(e.target.value)}
                                        placeholder="e.g. React, AI"
                                        className="px-4 py-3 border-2 border-[var(--cs-ink)] focus:outline-none"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="font-mono-cs text-[10px] tracking-[0.2em] uppercase text-[var(--cs-ink)]">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={locationFilter}
                                        onChange={(e) => setLocationFilter(e.target.value)}
                                        placeholder="City or country"
                                        className="px-4 py-3 border-2 border-[var(--cs-ink)] focus:outline-none"
                                    />
                                </div>

                                {/* Sort select */}
                                <div className="flex flex-col gap-2">
                                    <label className="font-mono-cs text-[10px] tracking-[0.2em] uppercase text-[var(--cs-ink)]">
                                        Sort by
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => {
                                            setSortBy(e.target.value);
                                            fetchProjects();
                                        }}
                                        className="px-4 py-3 border-2 border-[var(--cs-ink)] bg-white focus:outline-none"
                                    >
                                        <option value="newest">Newest first</option>
                                        <option value="oldest">Oldest first</option>
                                        <option value="az">Title A–Z</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
                                <label className="inline-flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={remoteOnly}
                                        onChange={(e) => setRemoteOnly(e.target.checked)}
                                        className="w-5 h-5 border-2 border-[var(--cs-ink)] rounded-none text-[var(--cs-primary)] focus:ring-0 focus:ring-offset-0 bg-white"
                                    />
                                    <span className="font-semibold text-sm">Show only remote-friendly projects</span>
                                </label>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTagFilter('');
                                            setLocationFilter('');
                                            setRemoteOnly(false);
                                            setSortBy('newest');
                                            fetchProjects({ search: searchQuery, tag: '', location: '', isRemote: false });
                                        }}
                                        className="px-5 py-2 font-semibold border-2 border-[var(--cs-ink)] bg-white hover:bg-gray-50"
                                    >
                                        Clear
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => fetchProjects({ search: searchQuery, tag: tagFilter, location: locationFilter, isRemote: remoteOnly })}
                                        className="px-5 py-2 font-semibold btn-brutal bg-[var(--cs-primary)] text-white"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({length:6}).map((_,i) => <div key={i} className="h-64 border-2 border-[var(--cs-ink)] bg-white animate-pulse" />)}
                    </div>
                ) : projects.length === 0 ? (
                    <div className="border-2 border-[var(--cs-ink)] bg-white p-12 text-center shadow-brutal">
                        <div className="font-display text-3xl mb-2">No projects found.</div>
                        <p className="text-muted-ink">Try adjusting your search or filters, or be the first to start something new.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div 
                                key={project._id} 
                                className="border-2 border-[var(--cs-ink)] bg-white p-6 shadow-brutal hover:shadow-brutal-lg transition-shadow flex flex-col cursor-pointer group" 
                                data-testid={`project-card-${project._id}`}
                                onClick={() => {
                                    // Could navigate to details here if needed
                                    console.log('Project clicked:', project._id);
                                }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="w-12 h-12 grid place-items-center border border-[var(--cs-ink)] bg-[var(--cs-yellow)] text-2xl group-hover:scale-105 transition-transform">
                                        {"🚀"}
                                    </div>
                                    <div className="text-right">
                                        <span className="font-mono-cs text-[10px] tracking-widest uppercase bg-[var(--cs-primary)] text-white px-2 py-0.5 block">
                                            {project.status || "Idea"}
                                        </span>
                                        <div className="font-mono-cs text-[10px] tracking-[0.22em] uppercase text-muted-ink mt-2">
                                            <Users size={12} weight="fill" className="inline mr-1 -mt-0.5" /> {(project.members || []).length + 1}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h3 className="font-display text-xl tracking-tight leading-tight line-clamp-2">
                                        {project.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-muted-ink line-clamp-3">
                                        {project.description}
                                    </p>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-1.5">
                                    {(project.tags || []).slice(0, 3).map(t => (
                                        <span key={t} className="border border-[var(--cs-ink)] px-2 py-0.5 text-[10px] font-semibold bg-white text-[var(--cs-ink)]">
                                            {t}
                                        </span>
                                    ))}
                                    {project.tags && project.tags.length > 3 && (
                                        <span className="border border-[var(--cs-ink)] px-2 py-0.5 text-[10px] font-semibold bg-gray-100 text-[var(--cs-ink)]">
                                            +{project.tags.length - 3}
                                        </span>
                                    )}
                                </div>

                                {project.lookingFor && project.lookingFor.length > 0 && (
                                    <div className="mt-4 pt-4 border-t-2 border-dotted border-[var(--cs-ink)]/20">
                                        <div className="font-mono-cs text-[10px] tracking-widest uppercase text-[var(--cs-ink)] mb-2">Looking for:</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {project.lookingFor.slice(0, 2).map((role, index) => (
                                                <span key={index} className="px-2 py-0.5 bg-[var(--cs-ink)] text-white text-[10px] font-semibold">
                                                    {role}
                                                </span>
                                            ))}
                                            {project.lookingFor.length > 2 && (
                                                <span className="px-2 py-0.5 border border-[var(--cs-ink)] text-[10px] font-semibold">
                                                    +{project.lookingFor.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-auto pt-5 flex items-center justify-between text-xs font-semibold text-muted-ink">
                                    <div className="flex items-center gap-1.5">
                                        <CalendarBlank size={14} weight="bold" />
                                        <span>{formatDate(project.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={14} weight="bold" />
                                        <span className="truncate max-w-[100px]">
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

