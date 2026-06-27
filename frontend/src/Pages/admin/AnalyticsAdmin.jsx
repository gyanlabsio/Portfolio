import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { useAnalytics } from '../../hooks/useAnalytics';
import { setConnected, setLastUpdate } from '../../store/slices/realtimeSlice';
import GlobalFilters from '../../components/analytics/GlobalFilters';
import KpiCard from '../../components/analytics/KpiCard';
import { TimeSeriesLineChart, ModulesBarChart } from '../../components/analytics/Charts';
import DataTable from '../../components/analytics/DataTable';
import VisitorAnalytics from '../../components/analytics/VisitorAnalytics';
import { Eye, MousePointerClick, Send, Users } from 'lucide-react';

const AnalyticsAdmin = () => {
  const dispatch = useDispatch();
  useAnalytics();

  const [activeTab, setActiveTab] = useState('overview');

  const { kpis } = useSelector((state) => state.metrics);
  const { connected } = useSelector((state) => state.realtime);

  useEffect(() => {
    const socketURL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const socket = io(socketURL, { withCredentials: true });

    socket.on('connect', () => {
      dispatch(setConnected(true));
      socket.emit('join_admin');
    });

    socket.on('disconnect', () => {
      dispatch(setConnected(false));
    });

    socket.on('analytics_event_recorded', () => {
      dispatch(setLastUpdate(new Date().toISOString()));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <div id="analytics-dashboard" className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time tracking and conversion metrics. {connected ? <span className="text-green-500 ml-2">● Live</span> : <span className="text-red-500 ml-2">● Disconnected</span>}
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-4 px-4 font-semibold ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('visitors')}
          className={`pb-4 px-4 font-semibold ${activeTab === 'visitors' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Visitor Tracking
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="mb-8">
            <GlobalFilters />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KpiCard title="Page Views" value={kpis?.pageViews || 0} growth={12.5} icon={<Eye className="w-6 h-6" />} />
            <KpiCard title="Clicks" value={kpis?.clicks || 0} growth={-2.4} icon={<MousePointerClick className="w-6 h-6" />} />
            <KpiCard title="Form Submissions" value={kpis?.formSubmissions || 0} growth={5.1} icon={<Send className="w-6 h-6" />} />
            <KpiCard title="Unique Visitors" value={kpis?.visitors || 0} icon={<Users className="w-6 h-6" />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <TimeSeriesLineChart />
            <ModulesBarChart />
          </div>

          <DataTable />
        </>
      )}

      {activeTab === 'visitors' && (
        <VisitorAnalytics />
      )}
    </div>
  );
};

export default AnalyticsAdmin;
