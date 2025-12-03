import { createContext, useState, useEffect } from "react";
import api, { axiosPrivate } from "../api/axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true);

    // Persist login on refresh
    useEffect(() => {
        const verifyUser = async () => {
            try {
                // Try to get a new access token using the refresh token (cookie)
                // Backend route: POST /api/refresh-token
                const response = await api.post('/refresh-token');
                const accessToken = response.data.accessToken;
                
                // Decode token to get user info if needed, or fetch user details
                // For now, let's just assume we get user info from a separate endpoint or decode token
                // But wait, refresh token endpoint only returns accessToken. 
                // We should probably fetch user details too.
                
                localStorage.setItem('accessToken', accessToken);
                
                // Fetch user details
                const userRes = await axiosPrivate.get('/user-details');

                setAuth({ 
                    user: userRes.data.data, 
                    accessToken 
                });
            } catch {
                console.log("Not logged in or session expired");
                setAuth({});
            } finally {
                setLoading(false);
            }
        }

        verifyUser();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/signin', { email, password });
        const { success, data, message, error } = response.data;

        // Backend always returns 200 with success flag, so guard against missing data
        if (!success || !data) {
            return { success: false, message: message || "Login failed", error: error ?? true };
        }

        const { accessToken, user } = data;
        
        localStorage.setItem('accessToken', accessToken);
        setAuth({ user, accessToken });
        return { success: true, message, data, error: false };
    };

    const signup = async (name, email, password) => {
        const response = await api.post('/signup', { name, email, password });
        const { success, message, data, error } = response.data;

        return {
            success,
            message,
            data,
            error
        };
    };

    const logout = async () => {
        try {
            await api.get('/userLogout');
            setAuth({});
            localStorage.removeItem('accessToken');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
