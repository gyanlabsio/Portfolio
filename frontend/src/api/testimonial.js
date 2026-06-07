import api from './index';

export const getTestimonials = (all = false) => api.get(`/testimonials${all ? '?all=true' : ''}`);
export const getFeaturedTestimonials = () => api.get('/testimonials/featured');
export const submitTestimonial = (data) => api.post('/testimonials/submit', data);

// Admin
export const createTestimonial = (data) => api.post('/testimonials', data);
export const updateTestimonial = (id, data) => api.patch(`/testimonials/${id}`, data);
export const updateTestimonialStatus = (id, data) => api.patch(`/testimonials/${id}/status`, data);
export const deleteTestimonial = (id) => api.delete(`/testimonials/${id}`);
