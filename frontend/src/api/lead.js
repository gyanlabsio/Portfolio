import api from './index';

export const submitLead = (data) => api.post('/leads/submit', data);

// Admin
export const getLeads = () => api.get('/leads');
export const createLead = (data) => api.post('/leads', data);
export const updateLeadStatus = (id, status) => api.patch(`/leads/${id}`, { status });
// Removed addLeadNote as the backend schema uses a single string for notes
export const deleteLead = (id) => api.delete(`/leads/${id}`);
