import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const csrfClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});
const csrfMethods = new Set(['post', 'put', 'patch', 'delete']);

let csrfToken = null;
let csrfPromise = null;

const ensureCsrfToken = async () => {
    if (csrfToken) return csrfToken;
    if (!csrfPromise) {
        csrfPromise = csrfClient.get('/auth/csrf-token')
            .then(({ data }) => {
                csrfToken = data?.csrfToken || null;
                return csrfToken;
            })
            .finally(() => {
                csrfPromise = null;
            });
    }
    return csrfPromise;
};

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const method = (config.method || 'get').toLowerCase();
    if (!csrfMethods.has(method)) return config;

    const token = await ensureCsrfToken();
    if (token) {
        config.headers['X-CSRF-Token'] = token;
    }

    return config;
});

// Response interceptor — handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 403 && error.response?.data?.code === 'EBADCSRFTOKEN') {
            csrfToken = null;
        }
        if (error.response?.status === 401) {
            // Redirect to login if on admin page
            if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
