import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVisitors, fetchVisitorDetails, setVisitorFilter, clearSelectedVisitor } from '../../store/slices/visitorAnalyticsSlice';
import DataTable from './DataTable';
import { X } from 'lucide-react';

const VisitorAnalytics = () => {
  const dispatch = useDispatch();
  const { list, loading, filters, selectedVisitor } = useSelector(state => state.visitorAnalytics);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchVisitors(filters.type));
  }, [dispatch, filters.type]);

  const handleRowClick = (visitor) => {
    dispatch(fetchVisitorDetails(visitor.visitorId));
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    dispatch(clearSelectedVisitor());
  };

  const columns = [
    { 
      key: 'identity', 
      label: 'Visitor Identity',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-none flex items-center justify-center text-white font-bold ${row.isIdentified ? 'bg-blue-600' : 'bg-gray-400'}`}>
            {row.isIdentified ? (row.userId?.name?.charAt(0) || 'U') : 'A'}
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.isIdentified ? row.userId?.name : 'Anonymous Visitor'}</div>
            <div className="text-xs text-gray-500">{row.isIdentified ? row.userId?.email : row.visitorId.substring(0, 8) + '...'}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'role', 
      label: 'Role',
      render: (_, row) => row.isIdentified ? <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-none">{row.userId?.role}</span> : <span className="text-gray-400">N/A</span>
    },
    { key: 'totalSessions', label: 'Total Sessions', sortable: true },
    { 
      key: 'lastSeen', 
      label: 'Last Seen', 
      sortable: true,
      render: (val) => new Date(val).toLocaleString()
    },
    { 
      key: 'ip', 
      label: 'IP Address',
      render: (_, row) => (
        <span className="text-gray-700 font-mono text-xs">{row.lastKnownIp || 'Unknown'}</span>
      )
    },
    { 
      key: 'device', 
      label: 'Device & Browser',
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="text-gray-900">{row.lastKnownDevice?.browser || 'Unknown'}</span>
          <span className="text-gray-500 text-xs">{row.lastKnownDevice?.os} - {row.lastKnownDevice?.deviceType}</span>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-none  border">
        <h2 className="text-lg font-semibold text-gray-800">Visitor Tracking</h2>
        <select 
          value={filters.type} 
          onChange={(e) => dispatch(setVisitorFilter(e.target.value))}
          className="px-4 py-2 border rounded-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Visitors</option>
          <option value="identified">Identified Users</option>
          <option value="anonymous">Anonymous Visitors</option>
        </select>
      </div>

      <div className="bg-white rounded-none  border overflow-hidden p-6">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-none h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="cursor-pointer">
             {/* Using DataTable but handling row click isn't directly supported by it easily unless we modify it, so we'll wrap a raw table or if DataTable supports it, use it. For simplicity, we just use DataTable, but it might not have onRowClick. Let's assume we can map it manually for now, or just add a View button */}
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr>
                     {columns.map(c => (
                       <th key={c.key} className="p-3 border-b font-semibold text-sm text-gray-600">{c.label}</th>
                     ))}
                     <th className="p-3 border-b font-semibold text-sm text-gray-600">Action</th>
                   </tr>
                 </thead>
                 <tbody>
                   {list.map(row => (
                     <tr key={row._id} className="hover:bg-gray-50 border-b last:border-0 transition-colors">
                       {columns.map(c => (
                         <td key={c.key} className="p-3 text-sm">
                           {c.render ? c.render(row[c.key], row) : row[c.key]}
                         </td>
                       ))}
                       <td className="p-3 text-sm">
                         <button 
                           onClick={() => handleRowClick(row)}
                           className="text-blue-600 hover:underline"
                         >
                           View Details
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-30" onClick={closeDrawer}></div>
          <div className="absolute inset-y-0 right-0 w-full max-w-xl bg-white  transform transition-transform">
            <div className="h-full flex flex-col">
              <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold">Visitor Profile</h2>
                <button onClick={closeDrawer} className="p-2 hover:bg-gray-200 rounded-none">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {selectedVisitor.loading ? (
                   <div className="flex justify-center p-8"><div className="animate-spin rounded-none h-8 w-8 border-b-2 border-blue-600"></div></div>
                ) : selectedVisitor.profile ? (
                  <div className="space-y-8">
                    {/* Identity Block */}
                    <div className="flex items-center gap-4 bg-blue-50 p-6 rounded-none border border-blue-100">
                      <div className={`w-16 h-16 rounded-none flex items-center justify-center text-white text-2xl font-bold ${selectedVisitor.profile.isIdentified ? 'bg-blue-600' : 'bg-gray-400'}`}>
                        {selectedVisitor.profile.isIdentified ? (selectedVisitor.profile.userId?.name?.charAt(0) || 'U') : 'A'}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{selectedVisitor.profile.isIdentified ? selectedVisitor.profile.userId?.name : 'Anonymous Visitor'}</h3>
                        <p className="text-gray-600">{selectedVisitor.profile.isIdentified ? selectedVisitor.profile.userId?.email : `ID: ${selectedVisitor.profile.visitorId}`}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-none border">
                        <div className="text-sm text-gray-500">Total Sessions</div>
                        <div className="text-2xl font-semibold">{selectedVisitor.profile.totalSessions}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-none border">
                        <div className="text-sm text-gray-500">First Seen</div>
                        <div className="text-xl font-semibold">{new Date(selectedVisitor.profile.firstSeen).toLocaleDateString()}</div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h4 className="text-lg font-bold mb-4 border-b pb-2">Activity Timeline</h4>
                      <div className="space-y-4">
                        {selectedVisitor.timeline.map((event, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-3 h-3 bg-blue-500 rounded-none mt-1"></div>
                              {i !== selectedVisitor.timeline.length - 1 && <div className="w-0.5 h-full bg-gray-200 my-1"></div>}
                            </div>
                            <div className="pb-4">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-800">{event.type}</span>
                                <span className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</span>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {event.page}
                              </div>
                              {event.metadata && Object.keys(event.metadata).length > 0 && (
                                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600 overflow-x-auto">
                                  {JSON.stringify(event.metadata, null, 2)}
                                </pre>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>No details found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorAnalytics;
