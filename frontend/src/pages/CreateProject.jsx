import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { axiosPrivate } from '../api/axios';
import { FiArrowLeft, FiPlus, FiX } from 'react-icons/fi';

const CreateProject = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        tags: [],
        lookingFor: [],
        location: '',
        isRemote: true,
        status: 'active'
    });
    const [tagInput, setTagInput] = useState('');
    const [roleInput, setRoleInput] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        const projectToEdit = location.state?.projectToEdit;
        if (projectToEdit) {
            setIsEditMode(true);
            setFormData({
                title: projectToEdit.title || '',
                description: projectToEdit.description || '',
                tags: projectToEdit.tags || [],
                lookingFor: projectToEdit.lookingFor || [],
                location: projectToEdit.location || '',
                isRemote: projectToEdit.isRemote ?? true,
                status: projectToEdit.status || 'active'
            });
        }
    }, [location.state]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleAddRole = () => {
        if (roleInput.trim() && !formData.lookingFor.includes(roleInput.trim())) {
            setFormData(prev => ({
                ...prev,
                lookingFor: [...prev.lookingFor, roleInput.trim()]
            }));
            setRoleInput('');
        }
    };

    const handleRemoveRole = (roleToRemove) => {
        setFormData(prev => ({
            ...prev,
            lookingFor: prev.lookingFor.filter(role => role !== roleToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let response;
            const projectToEdit = location.state?.projectToEdit;

            if (isEditMode && projectToEdit?._id) {
                response = await axiosPrivate.put(`/project/${projectToEdit._id}`, formData);
            } else {
                response = await axiosPrivate.post('/project/create', formData);
            }
            
            if (response.data.success) {
                // Navigate to dashboard with a flag to refresh stats
                navigate('/dashboard', { state: { projectCreated: true } });
            } else {
                setError(response.data.message || (isEditMode ? 'Failed to update project' : 'Failed to create project'));
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    (isEditMode ? 'An error occurred while updating the project' : 'An error occurred while creating the project')
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                {/* Back to Dashboard Link */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to Dashboard</span>
                </button>

                {/* Title Section */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-purple-700 mb-3">
                        {isEditMode ? 'Edit Project' : 'Create New Project'}
                    </h1>
                    <p className="text-lg text-gray-600">
                        {isEditMode
                            ? 'Update your project details and keep your collaborators in sync.'
                            : 'Share your project idea and find teammates to build it together.'}
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Project Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                                Project Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g., AI-Powered Study Buddy"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows={6}
                                placeholder="Describe your project, its goals, and what makes it unique..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400 resize-y"
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label htmlFor="tags" className="block text-sm font-semibold text-gray-900 mb-2">
                                Tags
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    id="tags"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddTag();
                                        }
                                    }}
                                    placeholder="Add tags (e.g., React, AI, Mobile)"
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-gray-700 font-semibold"
                                >
                                    <FiPlus className="w-5 h-5" />
                                </button>
                            </div>
                            {formData.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {formData.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="hover:text-purple-900"
                                            >
                                                <FiX className="w-4 h-4" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Looking For */}
                        <div>
                            <label htmlFor="lookingFor" className="block text-sm font-semibold text-gray-900 mb-2">
                                Looking For
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    id="lookingFor"
                                    value={roleInput}
                                    onChange={(e) => setRoleInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddRole();
                                        }
                                    }}
                                    placeholder="Add roles you need (e.g., Backend Developer)"
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddRole}
                                    className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-gray-700 font-semibold"
                                >
                                    <FiPlus className="w-5 h-5" />
                                </button>
                            </div>
                            {formData.lookingFor.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {formData.lookingFor.map((role, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                                        >
                                            {role}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveRole(role)}
                                                className="hover:text-blue-900"
                                            >
                                                <FiX className="w-4 h-4" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-semibold text-gray-900 mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="e.g., San Francisco, CA"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                            />
                        </div>

                        {/* Remote Project Toggle */}
                        <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isRemote"
                                    checked={formData.isRemote}
                                    onChange={handleInputChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                            <span className="text-sm font-medium text-gray-900">
                                This is a remote project
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-bold rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating...' : 'Create Project'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProject;

