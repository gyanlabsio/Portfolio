import api from './index';

// Auth
export const login = (email, password) => api.post('/auth/login', { email, password });
export const getMe = () => api.get('/auth/me');
export const logout = () => api.post('/auth/logout');



// Upload
export const uploadImage = (file, moduleName = 'PROJECT') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('module', moduleName);
    return api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
