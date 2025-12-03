import axios from 'axios';

// IMPORTANT:
// - Backend exposes all routes under `/api` (see backend/server.js).
// - Set VITE_API_URL to the backend ROOT (with or without `/api`), e.g.:
//   - `https://collabsphere-backend-0np0.onrender.com`
//   - or  `https://collabsphere-backend-0np0.onrender.com/api`
// - This helper ensures the final BASE_URL always ends with `/api`.
const getBaseUrl = () => {
    let url = import.meta.env.VITE_API_URL || 'https://collabsphere-backend-0np0.onrender.com';

    // Remove trailing slash for normalization
    url = url.replace(/\/$/, '');

    // Append `/api` if it's not already there
    if (!url.endsWith('/api')) {
        url = `${url}/api`;
    }

    return url;
};

const BASE_URL = getBaseUrl();

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

// Request interceptor to add access token to headers
axiosPrivate.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken'); // Or from context/memory
        if (!config.headers['Authorization'] && token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }, (error) => Promise.reject(error)
);

// Response interceptor to handle 403 (expired token)
axiosPrivate.interceptors.response.use(
    response => response,
    async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
            prevRequest.sent = true;
            try {
                const response = await api.post('/refresh-token');
                const newAccessToken = response.data.accessToken;
                
                // Store new token
                localStorage.setItem('accessToken', newAccessToken);
                
                prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosPrivate(prevRequest);
            } catch (refreshError) {
                // Refresh token failed (expired or invalid), redirect to login
                // window.location.href = '/login'; // Or handle via context
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
