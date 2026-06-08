import api from './index';

export const getQuotations = () => api.get('/quotations');
export const getQuotation = (id) => api.get(`/quotations/${id}`);
export const createQuotation = (data) => api.post('/quotations', data);
export const updateQuotation = (id, data) => api.patch(`/quotations/${id}`, data);
export const updateQuotationStatus = (id, status) => api.patch(`/quotations/${id}/status`, { status });
export const deleteQuotation = (id) => api.delete(`/quotations/${id}`);
export const downloadQuotationPdf = (id) => api.get(`/quotations/${id}/pdf`, { responseType: 'blob' });
