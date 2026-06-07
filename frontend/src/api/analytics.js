import api from './index';

export const recordEvent = (data) => {
    if (localStorage.getItem('admin_token')) {
        return Promise.resolve({ success: true, message: 'Ignored Admin traffic' });
    }
    return api.post('/analytics', data);
};
export const getEvents = (params) => api.get('/analytics', { params });
export const getAnalyticsSummary = () => api.get('/analytics/summary');
export const getModulesSummary = () => api.get('/analytics/modules');
export const getTimeseries = (params) => api.get('/analytics/timeseries', { params });
export const getVisitors = () => api.get('/analytics/visitors');
