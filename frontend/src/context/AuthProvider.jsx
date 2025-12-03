import { createContext, useState, useEffect } from "react";
import api, { axiosPrivate } from "../api/axios";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await api.post('/refresh-token');
                const accessToken = response.data.accessToken;
                
                localStorage.setItem('accessToken', accessToken);
                
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

        if (!success || !data) {
            return { success: false, message: message || "Login failed", error: error ?? true };
        }

        const { accessToken, user } = data;
        
        localStorage.setItem('accessToken', accessToken);
        setAuth({ user, accessToken });
        return { success: true, message, data, error: false };
    };

    const loginWithGoogle = async (idToken) => {
        const response = await api.post('/google-signin', { idToken });
        const { success, data, message, error } = response.data;

        if (!success || !data) {
            return { success: false, message: message || "Login with Google failed", error: error ?? true };
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
        <AuthContext.Provider value={{ auth, setAuth, login, loginWithGoogle, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
