import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import StudentDashboard from './pages/StudentDashboard';
import MentorDashboard from './pages/MentorDashboard';
import OrganizationDashboard from './pages/OrganizationDashboard';
import CreateProject from './pages/CreateProject';
import DiscoverProjects from './pages/DiscoverProjects';
import SmartMatches from './pages/SmartMatches';
import CommunityFeed from './pages/CommunityFeed';
import Profile from './pages/Profile';
import Mentors from './pages/Mentors';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserList from './pages/admin/AdminUserList';
import AdminUserDetail from './pages/admin/AdminUserDetail';

// Simple auth-only guard (no role check)
const ProtectedRoute = ({ children }) => {
    const { auth, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (!auth.accessToken) {
        return <Navigate to="/login" />;
    }

    return children;
};

// Smart redirect: sends logged-in users to their role dashboard
const DashboardRedirect = () => {
    const { auth, getDashboardPath } = useAuth();
    const role = auth.user?.role || 'STUDENT';
    return <Navigate to={getDashboardPath(role)} replace />;
};

function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            {/* Legacy /dashboard redirect → role-based dashboard */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardRedirect />
                    </ProtectedRoute>
                }
            />

            {/* ============ STUDENT ROUTES ============ */}
            <Route
                path="/student/dashboard"
                element={
                    <RoleProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                        <StudentDashboard />
                    </RoleProtectedRoute>
                }
            />
            <Route
                path="/student/create-project"
                element={
                    <RoleProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                        <CreateProject />
                    </RoleProtectedRoute>
                }
            />
            <Route
                path="/student/discover-projects"
                element={
                    <RoleProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                        <DiscoverProjects />
                    </RoleProtectedRoute>
                }
            />
            <Route
                path="/student/smart-matches"
                element={
                    <RoleProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                        <SmartMatches />
                    </RoleProtectedRoute>
                }
            />
            <Route
                path="/student/mentors"
                element={
                    <RoleProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                        <Mentors />
                    </RoleProtectedRoute>
                }
            />

            {/* ============ MENTOR ROUTES ============ */}
            <Route
                path="/mentor/dashboard"
                element={
                    <RoleProtectedRoute allowedRoles={['MENTOR', 'ADMIN']}>
                        <MentorDashboard />
                    </RoleProtectedRoute>
                }
            />

            {/* ============ ORGANIZATION ROUTES ============ */}
            <Route
                path="/organization/dashboard"
                element={
                    <RoleProtectedRoute allowedRoles={['ORGANIZATION', 'ADMIN']}>
                        <OrganizationDashboard />
                    </RoleProtectedRoute>
                }
            />

            {/* ============ ADMIN ROUTES ============ */}
            <Route
                path="/admin/dashboard"
                element={
                    <RoleProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminDashboard />
                    </RoleProtectedRoute>
                }
            />
            <Route
                path="/admin/users"
                element={
                    <RoleProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminUserList />
                    </RoleProtectedRoute>
                }
            />
            <Route
                path="/admin/users/:id"
                element={
                    <RoleProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminUserDetail />
                    </RoleProtectedRoute>
                }
            />

            {/* ============ SHARED ROUTES ============ */}
            <Route
                path="/feed"
                element={
                    <ProtectedRoute>
                        <CommunityFeed />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            {/* Legacy routes → redirect to student scoped versions */}
            <Route path="/create-project" element={<Navigate to="/student/create-project" replace />} />
            <Route path="/discover-projects" element={<Navigate to="/student/discover-projects" replace />} />
            <Route path="/smart-matches" element={<Navigate to="/student/smart-matches" replace />} />
            <Route path="/mentors" element={<Navigate to="/student/mentors" replace />} />
        </Routes>
    );
}

export default App;
