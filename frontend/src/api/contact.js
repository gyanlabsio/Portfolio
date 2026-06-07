import api from './index';

export const submitContact = (data) => api.post('/contact', data);

// Admin
export const getContacts = () => api.get('/contact');
export const markAsRead = (id) => api.patch(`/contact/${id}/read`);
export const deleteContact = (id) => api.delete(`/contact/${id}`);
