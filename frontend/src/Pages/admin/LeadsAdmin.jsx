import { useState, useEffect, useCallback, useRef } from 'react'
import { User, RefreshCw, Kanban, List, BarChart3, Plus, Trash2, ArrowRight, DollarSign, Target, Percent, Upload, Download } from 'lucide-react'
import Papa from 'papaparse'
import api from '../../api'
import LeadDetailsSidebar from '../../components/admin/LeadDetailsSidebar'

const PIPELINE_STAGES = [
    { key: 'NEW', label: 'New Lead', color: 'border-blue-500/20 bg-blue-500/5 text-blue-500' },
    { key: 'CONTACTED', label: 'Contacted', color: 'border-yellow-500/20 bg-yellow-500/5 text-yellow-500' },
    { key: 'IN_DISCUSSION', label: 'In Discussion', color: 'border-purple-500/20 bg-purple-500/5 text-purple-500' },
    { key: 'WON', label: 'Won / Closed', color: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500' },
    { key: 'LOST', label: 'Lost', color: 'border-red-500/20 bg-red-500/5 text-red-500' },
]

const LeadsAdmin = () => {
    const [leads, setLeads] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('pipeline') // 'pipeline' | 'list' | 'analytics'
    const [selectedLead, setSelectedLead] = useState(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newLeadForm, setNewLeadForm] = useState({
        name: '', email: '', phone: '', company: '', projectType: 'WEB_APP', budget: 'NOT_SPECIFIED', dealValue: 0, notes: ''
    })
    const fileInputRef = useRef(null)

    const handleExport = async () => {
        try {
            const { data } = await api.get('/leads/export');
            if (data.success) {
                const csv = Papa.unparse(data.data);
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'leads_export.csv');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Failed to export leads', error);
            alert('Export failed');
        }
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    const payload = results.data.map(row => ({
                        name: row.name || row.Name || row.NAME,
                        email: row.email || row.Email || row.EMAIL,
                        phone: row.phone || row.Phone || row.PHONE,
                        company: row.company || row.Company || row.COMPANY,
                        projectType: row.projectType || 'OTHER',
                        budget: row.budget || 'NOT_SPECIFIED',
                        source: row.source || 'OTHER',
                        notes: row.notes || 'Imported from CSV'
                    })).filter(r => r.email);

                    if (payload.length === 0) {
                        return alert('No valid rows found. Ensure CSV has an email column.');
                    }

                    const { data } = await api.post('/leads/import', payload);
                    if (data.success) {
                        alert(data.message);
                        fetchAllLeads();
                    }
                } catch (error) {
                    console.error('Import failed', error);
                    alert('Import failed');
                }
                // Reset input
                e.target.value = null;
            }
        });
    };

    const fetchAllLeads = useCallback(async () => {
        setLoading(true)
        try {
            const { data } = await api.get('/leads')
            if (data.success) {
                setLeads(data.data)
                // Keep selected lead data synced if sidebar is open
                if (selectedLead) {
                    const refreshed = data.data.find(l => l._id === selectedLead._id)
                    if (refreshed) setSelectedLead(refreshed)
                }
            }
        } catch (error) {
            console.error('Failed to fetch leads', error)
        } finally {
            setLoading(false)
        }
    }, [selectedLead])

    useEffect(() => {
        fetchAllLeads()
    }, [fetchAllLeads])

    const handleCreateLead = async (e) => {
        e.preventDefault()
        try {
            const { data } = await api.post('/leads', newLeadForm)
            if (data.success) {
                setLeads(prev => [data.data, ...prev])
                setShowCreateModal(false)
                setNewLeadForm({
                    name: '', email: '', phone: '', company: '', projectType: 'WEB_APP', budget: 'NOT_SPECIFIED', dealValue: 0, notes: ''
                })
            }
        } catch (error) {
            alert('Failed to create lead')
        }
    }

    const handleDeleteLead = async (id, e) => {
        e.stopPropagation()
        if (!window.confirm('Are you sure you want to delete this lead?')) return
        try {
            const { data } = await api.delete(`/leads/${id}`)
            if (data.success) {
                setLeads(prev => prev.filter(l => l._id !== id))
                if (selectedLead?._id === id) setSelectedLead(null)
            }
        } catch (error) {
            alert('Failed to delete lead')
        }
    }

    const handleStageChange = async (id, newStatus) => {
        try {
            const { data } = await api.patch(`/leads/${id}`, { status: newStatus })
            if (data.success) {
                setLeads(prev => prev.map(l => l._id === id ? data.data : l))
            }
        } catch (error) {
            alert('Failed to update stage')
        }
    }

    // Analytics Computations
    const computeStats = () => {
        const totalPipelineValue = leads.reduce((sum, l) => sum + (l.dealValue || 0), 0)
        
        const wonLeads = leads.filter(l => l.status === 'WON')
        const lostLeads = leads.filter(l => l.status === 'LOST')
        const totalClosed = wonLeads.length + lostLeads.length
        const winRate = totalClosed > 0 ? ((wonLeads.length / totalClosed) * 100).toFixed(0) : '0'

        const averageDealSize = leads.length > 0 ? (totalPipelineValue / leads.length).toFixed(0) : '0'

        return { totalPipelineValue, winRate, averageDealSize }
    }

    const stats = computeStats()

    return (
        <div className='enter-fade space-y-6 relative min-h-[85vh]'>
            {/* Top Header */}
            <div className='glass-card flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5 md:p-6'>
                <div>
                    <h1 className='display-title text-3xl text-[var(--ink)] sm:text-4xl'>Leads &amp; CRM</h1>
                    <p className='mt-1 text-sm text-[var(--ink-soft)]'>Manage customers, track sales pipelines, and follow up on deals.</p>
                </div>
                <div className='flex gap-3 flex-wrap'>
                    <input 
                        type="file" 
                        accept=".csv" 
                        ref={fileInputRef} 
                        onChange={handleImport} 
                        style={{ display: 'none' }} 
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()} 
                        className='focus-ring button-pop inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--ink-soft)] hover:text-[var(--ink)]'
                    >
                        <Upload className='h-4 w-4' /> Import CSV
                    </button>
                    <button 
                        onClick={handleExport} 
                        className='focus-ring button-pop inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--ink-soft)] hover:text-[var(--ink)]'
                    >
                        <Download className='h-4 w-4' /> Export
                    </button>
                    <button 
                        onClick={() => setShowCreateModal(true)} 
                        className='focus-ring button-pop inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110'
                    >
                        <Plus className='h-4 w-4' /> Add Lead
                    </button>
                    <button 
                        onClick={fetchAllLeads} 
                        className='focus-ring button-pop inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-sm font-semibold text-[var(--ink-soft)] hover:text-[var(--ink)]'
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                <div className='glass-card p-5 rounded-2xl flex items-center gap-4'>
                    <div className='h-12 w-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center'><DollarSign className='h-6 w-6' /></div>
                    <div>
                        <p className='text-xs font-semibold text-[var(--ink-soft)] uppercase tracking-wider'>Pipeline Value</p>
                        <h4 className='text-xl font-bold text-[var(--ink)]'>${stats.totalPipelineValue.toLocaleString()}</h4>
                    </div>
                </div>
                <div className='glass-card p-5 rounded-2xl flex items-center gap-4'>
                    <div className='h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center'><Percent className='h-6 w-6' /></div>
                    <div>
                        <p className='text-xs font-semibold text-[var(--ink-soft)] uppercase tracking-wider'>Closed Win Rate</p>
                        <h4 className='text-xl font-bold text-[var(--ink)]'>{stats.winRate}%</h4>
                    </div>
                </div>
                <div className='glass-card p-5 rounded-2xl flex items-center gap-4'>
                    <div className='h-12 w-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center'><Target className='h-6 w-6' /></div>
                    <div>
                        <p className='text-xs font-semibold text-[var(--ink-soft)] uppercase tracking-wider'>Average Deal Size</p>
                        <h4 className='text-xl font-bold text-[var(--ink)]'>${parseFloat(stats.averageDealSize).toLocaleString()}</h4>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className='flex border-b border-[var(--line)] gap-6'>
                <button 
                    onClick={() => setActiveTab('pipeline')}
                    className={`pb-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'pipeline' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--ink-soft)]'}`}
                >
                    <span className='flex items-center gap-1.5'><Kanban className='h-4 w-4' /> Pipeline Board</span>
                </button>
                <button 
                    onClick={() => setActiveTab('list')}
                    className={`pb-3 font-semibold text-sm transition-all border-b-2 ${activeTab === 'list' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--ink-soft)]'}`}
                >
                    <span className='flex items-center gap-1.5'><List className='h-4 w-4' /> Leads List</span>
                </button>
            </div>

            {/* Tab Contents */}
            {loading ? (
                <div className='flex h-[40vh] items-center justify-center'>
                    <div className='h-8 w-8 animate-spin rounded-full border-4 border-[var(--accent)]/30 border-t-[var(--accent)]' />
                </div>
            ) : activeTab === 'pipeline' ? (
                /* PIPELINE BOARD */
                <div className='grid grid-cols-1 gap-4 md:grid-cols-5 items-start'>
                    {PIPELINE_STAGES.map(stage => {
                        const stageLeads = leads.filter(l => l.status === stage.key)
                        return (
                            <div key={stage.key} className='glass-card p-3 rounded-2xl bg-[var(--surface)] border border-[var(--line)] space-y-4'>
                                <div className={`flex items-center justify-between border-b pb-2 ${stage.color.split(' ')[0]}`}>
                                    <h3 className='font-bold text-xs uppercase tracking-wider'>{stage.label}</h3>
                                    <span className='rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-bold text-[var(--ink-soft)]'>{stageLeads.length}</span>
                                </div>

                                <div className='space-y-3 max-h-[60vh] overflow-y-auto pr-1'>
                                    {stageLeads.length === 0 ? (
                                        <p className='text-[10px] text-[var(--ink-soft)] text-center py-4 border border-dashed border-[var(--line)] rounded-xl'>No deals here</p>
                                    ) : (
                                        stageLeads.map(lead => (
                                            <div 
                                                key={lead._id}
                                                onClick={() => setSelectedLead(lead)}
                                                className='group rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3 space-y-2 hover:border-[var(--accent-2)] transition cursor-pointer relative'
                                            >
                                                <div className='flex items-start justify-between min-w-0'>
                                                    <h4 className='font-semibold text-xs text-[var(--ink)] truncate group-hover:text-[var(--accent)] pr-4'>{lead.name}</h4>
                                                    <button onClick={(e) => handleDeleteLead(lead._id, e)} className='opacity-0 group-hover:opacity-100 p-0.5 text-[var(--ink-soft)] hover:text-red-500 transition absolute right-2 top-2'>
                                                        <Trash2 className='h-3.5 w-3.5' />
                                                    </button>
                                                </div>
                                                {lead.company && <p className='text-[10px] text-[var(--accent-2)] truncate'>{lead.company}</p>}
                                                <div className='flex justify-between items-center text-[10px] text-[var(--ink-soft)] border-t border-[var(--line)]/50 pt-2'>
                                                    <span>{lead.projectType?.replace('_', ' ')}</span>
                                                    <span className='font-bold text-[var(--ink)]'>${(lead.dealValue || 0).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                /* LEADS LIST (TABLE VIEW) */
                <div className='glass-card rounded-[24px] overflow-hidden border border-[var(--line)] bg-[var(--surface)]'>
                    <div className='overflow-x-auto'>
                        <table className='w-full border-collapse text-left text-xs'>
                            <thead>
                                <tr className='border-b border-[var(--line)] bg-[var(--bg-alt)]/50 text-[var(--ink-soft)] uppercase font-semibold tracking-wider'>
                                    <th className='p-4'>Lead Profile</th>
                                    <th className='p-4'>Project Info</th>
                                    <th className='p-4'>Deal Value</th>
                                    <th className='p-4'>Pipeline Stage</th>
                                    <th className='p-4 text-right'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-10 text-[var(--ink-soft)]">No CRM leads found.</td>
                                    </tr>
                                ) : (
                                    leads.map(lead => (
                                        <tr 
                                            key={lead._id} 
                                            onClick={() => setSelectedLead(lead)}
                                            className='border-b border-[var(--line)] hover:bg-[var(--line)]/10 transition cursor-pointer'
                                        >
                                            <td className='p-4'>
                                                <div className='font-semibold text-[var(--ink)] text-sm'>{lead.name}</div>
                                                <div className='text-[var(--ink-soft)] text-[10px]'>{lead.email} · {lead.phone || 'No Phone'}</div>
                                            </td>
                                            <td className='p-4'>
                                                <div className='font-medium text-[var(--ink)]'>{lead.company || 'Individual'}</div>
                                                <div className='text-[var(--ink-soft)] text-[10px]'>{lead.projectType?.replace('_', ' ')}</div>
                                            </td>
                                            <td className='p-4 font-bold text-[var(--ink)]'>
                                                ${(lead.dealValue || 0).toLocaleString()}
                                            </td>
                                            <td className='p-4'>
                                                <select 
                                                    value={lead.status}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onChange={(e) => handleStageChange(lead._id, e.target.value)}
                                                    className='rounded-lg border border-[var(--line)] bg-[var(--bg)] px-2 py-1 text-[10px] font-semibold focus:outline-none'
                                                >
                                                    <option value="NEW">New</option>
                                                    <option value="CONTACTED">Contacted</option>
                                                    <option value="IN_DISCUSSION">In Discussion</option>
                                                    <option value="WON">Won</option>
                                                    <option value="LOST">Lost</option>
                                                </select>
                                            </td>
                                            <td className='p-4 text-right' onClick={(e) => e.stopPropagation()}>
                                                <button 
                                                    onClick={(e) => handleDeleteLead(lead._id, e)}
                                                    className='rounded-lg border border-red-500/20 bg-red-500/5 p-1.5 text-red-500 hover:bg-red-500/10 transition'
                                                >
                                                    <Trash2 className='h-3.5 w-3.5' />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Sidebar Details Panel */}
            {selectedLead && (
                <LeadDetailsSidebar 
                    lead={selectedLead} 
                    onClose={() => setSelectedLead(null)} 
                    onUpdateLead={(updated) => {
                        setLeads(prev => prev.map(l => l._id === updated._id ? updated : l))
                        setSelectedLead(updated)
                    }} 
                />
            )}

            {/* Create Lead Modal */}
            {showCreateModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 p-4 backdrop-blur-sm'>
                    <div className='glass-card enter-fade w-full max-w-lg rounded-[24px] p-6 space-y-4'>
                        <h3 className='font-bold text-lg text-[var(--ink)] border-b border-[var(--line)] pb-3'>Add New Lead</h3>
                        <form onSubmit={handleCreateLead} className='space-y-4 text-xs'>
                            <div className='grid grid-cols-2 gap-3'>
                                <div>
                                    <label className='mb-1 block font-semibold text-[var(--ink-soft)]'>Name *</label>
                                    <input type='text' required value={newLeadForm.name} onChange={(e) => setNewLeadForm(p => ({ ...p, name: e.target.value }))} className='w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-[var(--ink)] focus:outline-none' />
                                </div>
                                <div>
                                    <label className='mb-1 block font-semibold text-[var(--ink-soft)]'>Email *</label>
                                    <input type='email' required value={newLeadForm.email} onChange={(e) => setNewLeadForm(p => ({ ...p, email: e.target.value }))} className='w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-[var(--ink)] focus:outline-none' />
                                </div>
                                <div>
                                    <label className='mb-1 block font-semibold text-[var(--ink-soft)]'>Phone</label>
                                    <input type='text' value={newLeadForm.phone} onChange={(e) => setNewLeadForm(p => ({ ...p, phone: e.target.value }))} className='w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-[var(--ink)] focus:outline-none' />
                                </div>
                                <div>
                                    <label className='mb-1 block font-semibold text-[var(--ink-soft)]'>Company</label>
                                    <input type='text' value={newLeadForm.company} onChange={(e) => setNewLeadForm(p => ({ ...p, company: e.target.value }))} className='w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-[var(--ink)] focus:outline-none' />
                                </div>
                                <div>
                                    <label className='mb-1 block font-semibold text-[var(--ink-soft)]'>Project Type</label>
                                    <select value={newLeadForm.projectType} onChange={(e) => setNewLeadForm(p => ({ ...p, projectType: e.target.value }))} className='w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-[var(--ink)] focus:outline-none'>
                                        <option value="WEB_APP">Web App</option>
                                        <option value="SAAS">SaaS</option>
                                        <option value="DASHBOARD">Dashboard</option>
                                        <option value="E_COMMERCE">E-Commerce</option>
                                        <option value="MOBILE">Mobile App</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className='mb-1 block font-semibold text-[var(--ink-soft)]'>Deal Value ($)</label>
                                    <input type='number' min='0' value={newLeadForm.dealValue} onChange={(e) => setNewLeadForm(p => ({ ...p, dealValue: parseFloat(e.target.value) || 0 }))} className='w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-[var(--ink)] focus:outline-none' />
                                </div>
                            </div>

                            <div>
                                <label className='mb-1 block font-semibold text-[var(--ink-soft)]'>Notes</label>
                                <textarea rows='3' value={newLeadForm.notes} onChange={(e) => setNewLeadForm(p => ({ ...p, notes: e.target.value }))} className='w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-[var(--ink)] focus:outline-none resize-none' />
                            </div>

                            <div className='flex justify-end gap-2 pt-2 border-t border-[var(--line)]'>
                                <button type='button' onClick={() => setShowCreateModal(false)} className='rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-[var(--ink-soft)] hover:text-[var(--ink)]'>Cancel</button>
                                <button type='submit' className='rounded-lg bg-[var(--accent)] px-4 py-2 text-white hover:brightness-110'>Save Lead</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LeadsAdmin
