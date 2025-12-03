import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
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

const ProtectedRoute = ({ children }) => {
    const { auth, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
    }

    if (!auth.accessToken) {
        return <Navigate to="/login" />;
    }

    return children;
};

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/create-project"
                element={
                    <ProtectedRoute>
                        <CreateProject />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/discover-projects"
                element={
                    <ProtectedRoute>
                        <DiscoverProjects />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/smart-matches"
                element={
                    <ProtectedRoute>
                        <SmartMatches />
                    </ProtectedRoute>
                }
            />
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
            <Route
                path="/mentors"
                element={
                    <ProtectedRoute>
                        <Mentors />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
