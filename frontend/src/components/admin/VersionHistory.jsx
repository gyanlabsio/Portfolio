import { useState, useEffect, useCallback } from 'react';
import { History, RefreshCw, Clock } from 'lucide-react';
import api from '../../api';

const VersionHistory = ({ contentId, onRollbackSuccess }) => {
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchVersions = useCallback(async () => {
        if (!contentId) return;
        setLoading(true);
        try {
            const { data } = await api.get(`/blog/${contentId}/versions`);
            if (data.success) {
                setVersions(data.data);
            }
        } catch (error) {
            console.error('Failed to load version history', error);
        } finally {
            setLoading(false);
        }
    }, [contentId]);

    useEffect(() => {
        fetchVersions();
    }, [fetchVersions]);

    const handleRollback = async (versionId) => {
        if (!window.confirm('Are you sure you want to rollback to this version? Your current unsaved changes will be saved as a new version snapshot.')) return;
        
        try {
            const { data } = await api.post(`/blog/${contentId}/versions/${versionId}/rollback`);
            if (data.success) {
                alert('Successfully rolled back content to draft!');
                if (onRollbackSuccess) {
                    onRollbackSuccess(data.data);
                }
                fetchVersions(); // Reload list to include the pre-rollback snapshot
            }
        } catch (error) {
            alert('Failed to rollback: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    return (
        <div className="rounded-none border border-[var(--line)] bg-[var(--surface)] p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[var(--line)] pb-3">
                <History className="h-5 w-5 text-[var(--accent)]" />
                <h3 className="font-semibold text-[var(--ink)]">Version History</h3>
            </div>

            {loading ? (
                <div className="flex justify-center py-4">
                    <RefreshCw className="h-5 w-5 animate-spin text-[var(--ink-soft)]" />
                </div>
            ) : versions.length === 0 ? (
                <p className="text-xs text-[var(--ink-soft)] text-center py-2">No past versions recorded for this post yet.</p>
            ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {versions.map((ver) => (
                        <div key={ver._id} className="rounded-none border border-[var(--line)] bg-[var(--bg)] p-3 text-xs space-y-2 hover:border-[var(--accent-2)] transition">
                            <div className="flex items-center justify-between font-semibold text-[var(--ink)]">
                                <span>Version #{ver.versionNumber}</span>
                                <button 
                                    onClick={() => handleRollback(ver._id)}
                                    className="rounded-none bg-[var(--accent)]/10 px-2 py-0.5 font-bold text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition"
                                >
                                    Restore
                                </button>
                            </div>
                            <div className="flex items-center gap-1 text-[var(--ink-soft)]">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{new Date(ver.createdAt).toLocaleString()}</span>
                            </div>
                            <p className="text-[var(--ink-soft)] truncate">Edited by: {ver.updatedBy || 'Admin'}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VersionHistory;
