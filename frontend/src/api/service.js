import api from './index';

export const getServices = () => api.get('/services');
export const createService = (data) => api.post('/services', data);
export const updateService = (id, data) => api.patch(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);
export const reorderServices = (data) => api.put('/services/reorder', data);
