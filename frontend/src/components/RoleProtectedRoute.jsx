import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * A route guard that checks both authentication AND role authorization.
 * 
 * Props:
 *   - allowedRoles: array of roles that can access this route
 *   - children: the component to render if authorized
 */
const RoleProtectedRoute = ({ allowedRoles, children }) => {
    const { auth, loading, getDashboardPath } = useAuth();

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

    // Not logged in → redirect to login
    if (!auth.accessToken) {
        return <Navigate to="/login" />;
    }

    const userRole = auth.user?.role || 'STUDENT';

    // Logged in but wrong role → redirect to their own dashboard
    if (!allowedRoles.includes(userRole)) {
        return <Navigate to={getDashboardPath(userRole)} replace />;
    }

    return children;
};

export default RoleProtectedRoute;
