import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import { Toaster } from 'sonner';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
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

const DashboardRedirect = () => {
    return <Navigate to="/dashboard" replace />;
};

function App() {
    return (
        <>
            <Toaster position="top-center" richColors />
            <Routes>
                {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            {/* Dashboard route */}
            <Route
                path="/dashboard"
                element={
                    <RoleProtectedRoute allowedRoles={['STUDENT', 'ADMIN']}>
                        <Dashboard />
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

            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/projects" element={<DiscoverProjects />} />
            <Route path="/discover-projects" element={<DiscoverProjects />} />
            <Route path="/smart-matches" element={<SmartMatches />} />
            <Route path="/mentors" element={<Mentors />} />
        </Routes>
        </>
    );
}

export default App;
