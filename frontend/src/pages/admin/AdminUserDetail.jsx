import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosPrivate } from '../../api/axios';
import Header from '../../components/Header';
import {
    FiArrowLeft,
    FiMail,
    FiCalendar,
    FiShield,
    FiActivity,
    FiSave
} from 'react-icons/fi';

const ROLE_COLORS = {
    STUDENT: 'bg-purple-100 text-purple-700',
    MENTOR: 'bg-blue-100 text-blue-700',
    ORGANIZATION: 'bg-sky-100 text-sky-700',
    ADMIN: 'bg-red-100 text-red-700'
};

const STATUS_COLORS = {
    ACTIVE: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    BLOCKED: 'bg-red-100 text-red-700'
};

const AdminUserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosPrivate.get(`/admin/users/${id}`);
                if (res.data?.success) {
                    setUser(res.data.data);
                    setSelectedRole(res.data.data.role);
                    setSelectedStatus(res.data.data.status);
                }
            } catch (err) {
                console.error('Error fetching user:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const handleSaveRole = async () => {
        if (selectedRole === user.role) return;
        setSaving(true);
        try {
            await axiosPrivate.put(`/admin/users/${id}/role`, { role: selectedRole });
            setUser({ ...user, role: selectedRole });
            setSuccess('Role updated successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error updating role:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveStatus = async () => {
        if (selectedStatus === user.status) return;
        setSaving(true);
        try {
            await axiosPrivate.put(`/admin/users/${id}/status`, { status: selectedStatus });
            setUser({ ...user, status: selectedStatus });
            setSuccess('Status updated successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Error updating status:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-6xl mx-auto px-4 py-16 text-center text-gray-500">
                    User not found
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                <button
                    onClick={() => navigate('/admin/users')}
                    className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700"
                >
                    <FiArrowLeft className="w-4 h-4" /> Back to Users
                </button>

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm text-center">
                        {success}
                    </div>
                )}

                {/* User Profile Card */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                    <div className="flex items-start gap-6">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl shrink-0">
                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                <div className="flex flex-wrap gap-3 mt-2">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${ROLE_COLORS[user.role]}`}>
                                        {user.role}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[user.status]}`}>
                                        {user.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <FiMail className="w-4 h-4 text-gray-400" />
                                    {user.email}
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <FiCalendar className="w-4 h-4 text-gray-400" />
                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Skills & Interests */}
                            {user.skills?.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {user.skills.map((skill, i) => (
                                            <span key={i} className="px-2 py-1 bg-purple-50 text-purple-600 rounded-md text-xs font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Mentor fields */}
                            {user.role === 'MENTOR' && (
                                <div className="space-y-2">
                                    {user.expertise?.length > 0 && (
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Expertise</p>
                                            <div className="flex flex-wrap gap-2">
                                                {user.expertise.map((e, i) => (
                                                    <span key={i} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium">{e}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {user.bio && <p className="text-sm text-gray-600"><strong>Bio:</strong> {user.bio}</p>}
                                    {user.availability && <p className="text-sm text-gray-600"><strong>Availability:</strong> {user.availability}</p>}
                                </div>
                            )}

                            {/* Organization fields */}
                            {user.role === 'ORGANIZATION' && (
                                <div className="space-y-2">
                                    {user.orgName && <p className="text-sm text-gray-600"><strong>Org Name:</strong> {user.orgName}</p>}
                                    {user.orgDescription && <p className="text-sm text-gray-600"><strong>Description:</strong> {user.orgDescription}</p>}
                                    {user.website && <p className="text-sm text-gray-600"><strong>Website:</strong> <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">{user.website}</a></p>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Role Management */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FiShield className="w-5 h-5 text-purple-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Role Management</h2>
                    </div>
                    <div className="flex items-end gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                            >
                                <option value="STUDENT">Student</option>
                                <option value="MENTOR">Mentor</option>
                                <option value="ORGANIZATION">Organization</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <button
                            onClick={handleSaveRole}
                            disabled={saving || selectedRole === user.role}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            <FiSave className="w-4 h-4" /> Save Role
                        </button>
                    </div>
                </div>

                {/* Status Management */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FiActivity className="w-5 h-5 text-purple-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Status Management</h2>
                    </div>
                    <div className="flex items-end gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                            >
                                <option value="ACTIVE">Active</option>
                                <option value="PENDING">Pending</option>
                                <option value="BLOCKED">Blocked</option>
                            </select>
                        </div>
                        <button
                            onClick={handleSaveStatus}
                            disabled={saving || selectedStatus === user.status}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            <FiSave className="w-4 h-4" /> Save Status
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminUserDetail;
