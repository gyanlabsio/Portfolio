import React from 'react';
import { useSelector } from 'react-redux';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export const TimeSeriesLineChart = () => {
  const { timeSeriesData, loading } = useSelector((state) => state.charts);

  if (loading) return <div className="h-64 flex items-center justify-center">Loading chart...</div>;
  if (!timeSeriesData || timeSeriesData.length === 0) return <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>;

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Activity Overview</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend iconType="circle" />
            <Area type="monotone" dataKey="pageViews" name="Page Views" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPageViews)" />
            <Area type="monotone" dataKey="clicks" name="Clicks" stroke="#10b981" strokeWidth={2} fillOpacity={0.1} fill="#10b981" />
            <Area type="monotone" dataKey="formSubmissions" name="Form Subs" stroke="#f59e0b" strokeWidth={2} fillOpacity={0.1} fill="#f59e0b" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const ModulesBarChart = () => {
  const { modulesData, loading } = useSelector((state) => state.charts);

  if (loading) return <div className="h-64 flex items-center justify-center">Loading chart...</div>;
  if (!modulesData || modulesData.length === 0) return <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>;

  // Aggregate by module
  const aggData = modulesData.reduce((acc, curr) => {
    const mod = curr._id.module || 'UNKNOWN';
    if (!acc[mod]) acc[mod] = { module: mod, count: 0 };
    acc[mod].count += curr.count;
    return acc;
  }, {});
  const data = Object.values(aggData);

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Module Popularity</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <XAxis dataKey="module" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip 
              cursor={{ fill: 'rgba(237, 242, 247, 0.4)' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Bar dataKey="count" name="Interactions" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
