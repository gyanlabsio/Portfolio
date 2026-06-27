import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrash, removeItemsLocally } from '../../store/slices/recycleBinSlice';
import api from '../../api';
import DataTable from '../../components/analytics/DataTable';
import { Trash2, RefreshCcw, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const RecycleBinAdmin = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(state => state.recycleBin);
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const modules = ['project', 'service', 'testimonial', 'contact', 'comment', 'lead', 'content', 'file'];

  useEffect(() => {
    dispatch(fetchTrash(selectedModule));
  }, [dispatch, selectedModule]);

  const handleRestore = async (id, moduleName) => {
    try {
      setIsActionLoading(true);
      await api.put(`/trash/restore/${moduleName}/${id}`);
      toast.success('Item restored successfully');
      dispatch(removeItemsLocally([id]));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to restore item');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handlePermanentDelete = async (id, moduleName) => {
    if (!window.confirm('Are you sure you want to permanently delete this item? This action cannot be undone.')) return;
    try {
      setIsActionLoading(true);
      await api.delete(`/trash/permanent/${moduleName}/${id}`);
      toast.success('Item permanently deleted');
      dispatch(removeItemsLocally([id]));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete item');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleBulkRestore = async () => {
    if (selectedIds.length === 0) return;
    try {
      setIsActionLoading(true);
      const itemsToRestore = items.filter(i => selectedIds.includes(i._id)).map(i => ({ id: i._id, module: i.module }));
      await api.post('/trash/bulk-restore', { items: itemsToRestore });
      toast.success(`Restored ${selectedIds.length} items`);
      dispatch(removeItemsLocally(selectedIds));
      setSelectedIds([]);
    } catch (err) {
      toast.error('Failed to restore items');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to permanently delete ${selectedIds.length} items?`)) return;
    try {
      setIsActionLoading(true);
      const itemsToDelete = items.filter(i => selectedIds.includes(i._id)).map(i => ({ id: i._id, module: i.module }));
      await api.post('/trash/bulk-delete', { items: itemsToDelete });
      toast.success(`Permanently deleted ${selectedIds.length} items`);
      dispatch(removeItemsLocally(selectedIds));
      setSelectedIds([]);
    } catch (err) {
      toast.error('Failed to delete items');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/trash/export');
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(response.data.data, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "recycle_bin_export.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      toast.success('Export started');
    } catch (err) {
      toast.error('Failed to export data');
    }
  };

  const columns = [
    { key: 'module', label: 'Module', sortable: true },
    { key: 'title', label: 'Title / Identifier', sortable: true },
    { key: 'deletedBy', label: 'Deleted By' },
    { key: 'deletedAt', label: 'Deleted Date', sortable: true, render: (val) => new Date(val).toLocaleDateString() },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleRestore(row._id, row.module)}
            disabled={isActionLoading}
            className="p-1 text-green-500 hover:bg-green-100 rounded"
            title="Restore"
          >
            <RefreshCcw size={16} />
          </button>
          <button
            onClick={() => handlePermanentDelete(row._id, row.module)}
            disabled={isActionLoading}
            className="p-1 text-red-500 hover:bg-red-100 rounded"
            title="Delete Permanently"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recycle Bin</h1>
          <p className="text-sm text-gray-500">Manage soft-deleted items across all modules. Items are permanently deleted after 60 days.</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Modules</option>
            {modules.map(mod => (
              <option key={mod} value={mod}>{mod.charAt(0).toUpperCase() + mod.slice(1)}</option>
            ))}
          </select>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={20} />
            Export
          </button>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between border border-blue-100">
          <span className="text-blue-800 font-medium">{selectedIds.length} items selected</span>
          <div className="flex gap-3">
            <button
              onClick={handleBulkRestore}
              disabled={isActionLoading}
              className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Restore Selected
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={isActionLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden p-6">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center p-12 text-gray-500">
            <Trash2 size={48} className="mx-auto mb-4 opacity-20" />
            <p>The recycle bin is empty.</p>
          </div>
        ) : (
          <DataTable
            data={items}
            columns={columns}
            searchable={true}
            searchField="title"
            selectable={true}
            onSelectionChange={setSelectedIds}
          />
        )}
      </div>
    </div>
  );
};

export default RecycleBinAdmin;
