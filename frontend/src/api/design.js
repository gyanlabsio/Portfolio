import api from './index';

export const getDesigns = () => api.get('/designs');
export const getFeaturedDesigns = () => api.get('/designs/featured');
export const getDesign = (slug) => api.get(`/designs/${slug}`);

// Admin
export const createDesign = (data) => api.post('/designs', data);
export const updateDesign = (id, data) => api.put(`/designs/${id}`, data);
export const deleteDesign = (id) => api.delete(`/designs/${id}`);
