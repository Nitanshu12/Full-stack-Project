import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

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
        </Routes>
    );
}

export default App;
