import React, { useState, useEffect } from 'react';
import api from '../../api/index';

const DataTable = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const res = await api.get('/analytics/visitors');
        setVisitors(res.data.data);
      } catch (error) {
        console.error('Failed to fetch visitors', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVisitors();
  }, []);

  if (loading) return <div className="p-6 text-center text-gray-500">Loading visitors...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-none  border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Top Visitors</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-none">Visitor Label</th>
              <th scope="col" className="px-6 py-3">Total Visits</th>
              <th scope="col" className="px-6 py-3">Last Visit</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((v, i) => (
              <tr key={v._id || i} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {v.userId?.name || v.visitorId}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                    {v.totalSessions || 0}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {v.lastSeen ? new Date(v.lastSeen).toLocaleString() : 'N/A'}
                </td>
              </tr>
            ))}
            {visitors.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No visitors found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
