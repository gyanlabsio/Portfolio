import api from './index';

export const getPosts = (all = false, type = '') => {
  const params = new URLSearchParams();
  if (type) params.set('type', type);
  const qs = params.toString();
  if (all) return api.get(`/blog/admin/all${qs ? `?${qs}` : ''}`);
  return api.get(`/blog${qs ? `?${qs}` : ''}`);
};
export const getPost = (slug) => api.get(`/blog/${slug}`);

// Admin
export const createPost = (data) => api.post('/blog', data);
export const updatePost = (id, data) => api.patch(`/blog/${id}`, data);
export const deletePost = (id) => api.delete(`/blog/${id}`);
export const toggleLike = (id, data) => api.post(`/blog/${id}/like`, data);
