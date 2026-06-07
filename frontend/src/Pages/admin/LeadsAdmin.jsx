import { useState, useEffect } from 'react'
import { Trash2, User, Phone, Mail, StickyNote, Activity, RefreshCw } from 'lucide-react'
import { getLeads, updateLeadStatus, deleteLead } from '../../api/lead'

const LeadsAdmin = () => {
    const [leads, setLeads] = useState([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState(null)

    const fetchAll = async () => {
        try {
            setLoading(true)
            const { data } = await getLeads()
            setLeads(data.data)
            if (selected) {
                const updatedSelected = data.data.find(l => l._id === selected._id)
                setSelected(updatedSelected)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchAll() }, [])

    const handleStatusChange = async (id, status) => {
        try {
            await updateLeadStatus(id, status)
            fetchAll()
        } catch (error) {
            console.error(error)
        }
    }



    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this lead?')) return
        try {
            await deleteLead(id)
            setSelected(null)
            fetchAll()
        } catch (error) {
            console.error(error)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'NEW': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
            case 'CONTACTED': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
            case 'IN_PROGRESS': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
            case 'CLOSED': return 'bg-green-500/10 text-green-500 border-green-500/20'
            default: return 'bg-[var(--surface)] text-[var(--ink)]'
        }
    }

    return (
        <div className='space-y-5'>
            <div className='glass-card flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5 md:p-6'>
                <div>
                    <h1 className='font-nevera text-3xl tracking-[0.08em] text-[var(--ink)]'>Leads CRM</h1>
                    <p className='mt-1 text-sm text-[var(--ink-soft)]'>Track client inquiries and deal stages.</p>
                </div>
                <button onClick={fetchAll} className='focus-ring button-pop flex items-center gap-2 rounded-xl bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--bg-alt)]'>
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
            </div>

            <div className='flex flex-col lg:flex-row gap-6'>
                <div className='w-full space-y-2 pr-2 lg:w-1/3 lg:max-h-[75vh] lg:overflow-y-auto'>
                    {loading ? (
                        <div className='glass-card rounded-2xl py-14'>
                            <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]'></div>
                        </div>
                    ) : leads.length === 0 ? (
                        <div className='glass-card rounded-2xl py-16 text-center'>
                            <User className='mx-auto h-8 w-8 text-[var(--accent-2)]' />
                            <p className='mt-2 text-[var(--ink-soft)]'>No leads found.</p>
                        </div>
                    ) : leads.map(lead => (
                        <button key={lead._id} onClick={() => setSelected(lead)}
                            className={`glass-card w-full rounded-xl border p-4 text-left transition ${selected?._id === lead._id ? 'border-[var(--accent)]/35 bg-[var(--accent)]/5' : 'border-[var(--line)] hover:border-[var(--accent-2)]'}`}>
                            <div className='flex items-start justify-between mb-2'>
                                <span className='font-semibold text-[var(--ink)]'>{lead.name}</span>
                                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider ${getStatusColor(lead.status)}`}>
                                    {lead.status}
                                </span>
                            </div>
                            {lead.company && <p className='text-xs text-[var(--accent-2)] mb-1'>{lead.company}</p>}
                            <p className='text-xs text-[var(--ink-soft)] truncate'>{lead.email}</p>
                            <p className='mt-2 text-[10px] text-[var(--ink-soft)]/70 uppercase tracking-widest'>{new Date(lead.createdAt).toLocaleDateString()}</p>
                        </button>
                    ))}
                </div>

                <div className='w-full lg:w-2/3'>
                    {selected ? (
                        <div className='glass-card rounded-2xl p-6 flex flex-col h-full'>
                            <div className='flex items-start justify-between mb-6 pb-6 border-b border-[var(--line)]'>
                                <div>
                                    <h2 className='text-2xl font-semibold text-[var(--ink)]'>{selected.name}</h2>
                                    {selected.company && <p className='text-[var(--accent-2)]'>{selected.company}</p>}
                                    <div className='mt-4 space-y-2'>
                                        <div className='flex items-center gap-2 text-sm text-[var(--ink-soft)]'>
                                            <Mail className='h-4 w-4' /> <a href={`mailto:${selected.email}`} className='hover:text-[var(--accent)]'>{selected.email}</a>
                                        </div>
                                        {selected.phone && (
                                            <div className='flex items-center gap-2 text-sm text-[var(--ink-soft)]'>
                                                <Phone className='h-4 w-4' /> <a href={`tel:${selected.phone}`} className='hover:text-[var(--accent)]'>{selected.phone}</a>
                                            </div>
                                        )}
                                        {selected.source && (
                                            <div className='flex items-center gap-2 text-sm text-[var(--ink-soft)]'>
                                                <Activity className='h-4 w-4' /> Source: {selected.source}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='flex flex-col items-end gap-3'>
                                    <select 
                                        value={selected.status} 
                                        onChange={(e) => handleStatusChange(selected._id, e.target.value)}
                                        className={`rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-1.5 text-sm font-semibold focus:border-[var(--accent)] focus:outline-none ${getStatusColor(selected.status)}`}
                                    >
                                        <option value="NEW">NEW</option>
                                        <option value="CONTACTED">CONTACTED</option>
                                        <option value="IN_PROGRESS">IN PROGRESS</option>
                                        <option value="CLOSED">CLOSED</option>
                                    </select>
                                    <button onClick={() => handleDelete(selected._id)} className='flex items-center gap-2 text-xs font-semibold text-[var(--ink-soft)] hover:text-[#EF3E2F]'>
                                        <Trash2 className='h-3 w-3' /> Delete
                                    </button>
                                </div>
                            </div>

                            <div className='flex-1 flex flex-col'>
                                <h3 className='font-semibold text-[var(--ink)] mb-4 flex items-center gap-2'>
                                    <StickyNote className='h-4 w-4 text-[var(--accent-2)]' /> Project Details
                                </h3>
                                <div className='flex-1 overflow-y-auto space-y-4 mb-4 pr-2'>
                                    {selected.notes ? (
                                        <div className='rounded-xl bg-[var(--surface)] p-4 text-sm text-[var(--ink)]'>
                                            <p className='whitespace-pre-wrap'>{selected.notes}</p>
                                        </div>
                                    ) : (
                                        <p className='text-sm text-[var(--ink-soft)] italic'>No details provided.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='glass-card flex h-64 items-center justify-center rounded-2xl p-8'>
                            <p className='text-[var(--ink-soft)]'>Select a lead to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default LeadsAdmin
