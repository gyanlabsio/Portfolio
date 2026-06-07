import api from './index';

export const getGlobalSeo = () => api.get('/seo/global');
export const getSeoBySlug = (slug) => api.get(`/seo/${slug}`);
export const createSeo = (data) => api.post('/seo', data);
export const updateSeo = (slug, data) => api.patch(`/seo/${slug}`, data);
export const deleteSeo = (slug) => api.delete(`/seo/${slug}`);
