import api from './index';

export const getPosts = (all = false, type = '') => {
  const params = new URLSearchParams();
  if (all) params.set('all', 'true');
  if (type) params.set('type', type);
  const qs = params.toString();
  return api.get(`/blog${qs ? `?${qs}` : ''}`);
};
export const getPost = (slug) => api.get(`/blog/${slug}`);

// Admin
export const createPost = (data) => api.post('/blog', data);
export const updatePost = (id, data) => api.put(`/blog/${id}`, data);
export const deletePost = (id) => api.delete(`/blog/${id}`);
