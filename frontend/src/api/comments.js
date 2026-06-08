import api from './index';

export const getPostComments = (contentId) => api.get(`/comments/post/${contentId}`);
export const addComment = (data) => api.post('/comments', data);

// Admin
export const getAllComments = () => api.get('/comments');
export const updateCommentStatus = (id, data) => api.patch(`/comments/${id}/status`, data);
export const deleteComment = (id) => api.delete(`/comments/${id}`);
