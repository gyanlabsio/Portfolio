import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './slices/projectSlice';
import blogReducer from './slices/blogSlice';
import analyticsFilterReducer from './slices/analyticsFilterSlice';
import dashboardReducer from './slices/dashboardSlice';
import metricsReducer from './slices/metricsSlice';
import chartsReducer from './slices/chartsSlice';
import uiReducer from './slices/uiSlice';
import realtimeReducer from './slices/realtimeSlice';
import crmReducer from './slices/crmSlice';
import crmFilterReducer from './slices/crmFilterSlice';
import recycleBinReducer from './slices/recycleBinSlice';
import visitorAnalyticsReducer from './slices/visitorAnalyticsSlice';
import newsletterReducer from './slices/newsletterSlice';

export const store = configureStore({
  reducer: {
    project: projectReducer,
    blog: blogReducer,
    analyticsFilter: analyticsFilterReducer,
    dashboard: dashboardReducer,
    metrics: metricsReducer,
    charts: chartsReducer,
    ui: uiReducer,
    realtime: realtimeReducer,
    crm: crmReducer,
    crmFilter: crmFilterReducer,
    recycleBin: recycleBinReducer,
    visitorAnalytics: visitorAnalyticsReducer,
    newsletter: newsletterReducer,
  },
});
