import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosPrivate } from '../../api/axios';
import Header from '../../components/Header';
import {
    FiSearch,
    FiFilter,
    FiChevronLeft,
    FiChevronRight,
    FiEye,
    FiShield,
    FiSlash,
    FiCheck,
    FiTrash2,
    FiUsers
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

const AdminUserList = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 10 });
            if (search) params.set('search', search);
            if (roleFilter) params.set('role', roleFilter);
            if (statusFilter) params.set('status', statusFilter);

            const res = await axiosPrivate.get(`/admin/users?${params}`);
            if (res.data?.success) {
                setUsers(res.data.data.users);
                setTotalUsers(res.data.data.totalUsers);
                setTotalPages(res.data.data.totalPages);
                setCurrentPage(res.data.data.currentPage);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(1);
    }, [roleFilter, statusFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(1);
    };

    const handleStatusChange = async (userId, newStatus) => {
        try {
            await axiosPrivate.put(`/admin/users/${userId}/status`, { status: newStatus });
            fetchUsers(currentPage);
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await axiosPrivate.delete(`/admin/users/${userId}`);
            fetchUsers(currentPage);
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-500">
                            {totalUsers} total users
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="text-sm font-medium text-purple-600 hover:text-purple-700"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                {/* Search & Filters */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                            <div className="relative flex-1">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name or email..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                            >
                                Search
                            </button>
                        </form>
                        <div className="flex gap-2">
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                            >
                                <option value="">All Roles</option>
                                <option value="STUDENT">Student</option>
                                <option value="MENTOR">Mentor</option>
                                <option value="ORGANIZATION">Organization</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                            >
                                <option value="">All Status</option>
                                <option value="ACTIVE">Active</option>
                                <option value="PENDING">Pending</option>
                                <option value="BLOCKED">Blocked</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="py-16 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="py-16 text-center text-gray-500">
                            <FiUsers className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No users found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Joined</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm">
                                                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${ROLE_COLORS[user.role] || 'bg-gray-100 text-gray-700'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[user.status] || 'bg-gray-100 text-gray-700'}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => navigate(`/admin/users/${user._id}`)}
                                                        title="View Details"
                                                        className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                    >
                                                        <FiEye className="w-4 h-4" />
                                                    </button>
                                                    {user.status !== 'BLOCKED' ? (
                                                        <button
                                                            onClick={() => handleStatusChange(user._id, 'BLOCKED')}
                                                            title="Block User"
                                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <FiSlash className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleStatusChange(user._id, 'ACTIVE')}
                                                            title="Activate User"
                                                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        >
                                                            <FiCheck className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(user._id)}
                                                        title="Delete User"
                                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                Page {currentPage} of {totalPages}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fetchUsers(currentPage - 1)}
                                    disabled={currentPage <= 1}
                                    className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                                >
                                    <FiChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => fetchUsers(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                    className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                                >
                                    <FiChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminUserList;
