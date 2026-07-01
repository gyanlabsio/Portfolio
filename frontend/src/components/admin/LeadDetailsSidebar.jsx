import { useState, useEffect, useCallback } from 'react'
import { X, Calendar, Phone, Mail, Building, Plus, Trash2, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react'
import api from '../../api'

const LeadDetailsSidebar = ({ lead, onClose, onUpdateLead }) => {
    const [editForm, setEditForm] = useState({
        name: '', email: '', phone: '', company: '', projectType: 'WEB_APP', budget: 'NOT_SPECIFIED', status: 'NEW', dealValue: 0, notes: ''
    })
    const [activities, setActivities] = useState([])
    const [tasks, setTasks] = useState([])
    const [loadingLogs, setLoadingLogs] = useState(false)
    const [newLog, setNewLog] = useState({ type: 'NOTE', content: '' })
    const [newTask, setNewTask] = useState({ title: '', dueDate: '' })

    const fetchLeadInteractions = useCallback(async () => {
        if (!lead?._id) return
        setLoadingLogs(true)
        try {
            const [activitiesRes, tasksRes] = await Promise.all([
                api.get(`/leads/${lead._id}/activities`),
                api.get(`/leads/${lead._id}/tasks`)
            ])
            setActivities(activitiesRes.data.data)
            setTasks(tasksRes.data.data)
        } catch (error) {
            console.error('Failed to load lead timeline', error)
        } finally {
            setLoadingLogs(false)
        }
    }, [lead?._id])

    useEffect(() => {
        if (lead) {
            setEditForm({
                name: lead.name || '',
                email: lead.email || '',
                phone: lead.phone || '',
                company: lead.company || '',
                projectType: lead.projectType || 'WEB_APP',
                budget: lead.budget || 'NOT_SPECIFIED',
                status: lead.status || 'NEW',
                dealValue: lead.dealValue || 0,
                notes: lead.notes || ''
            })
            fetchLeadInteractions()
        }
    }, [lead, fetchLeadInteractions])

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await api.patch(`/leads/${lead._id}`, editForm)
            if (data.success && onUpdateLead) {
                onUpdateLead(data.data)
                alert('Lead profile updated!')
            }
        } catch (error) {
            console.error(error)
            alert('Failed to update lead profile')
        }
    }

    const handleLogSubmit = async (e) => {
        e.preventDefault()
        if (!newLog.content.trim()) return
        try {
            const { data } = await api.post(`/leads/${lead._id}/activities`, newLog)
            if (data.success) {
                setActivities(prev => [data.data, ...prev])
                setNewLog({ type: 'NOTE', content: '' })
            }
        } catch (error) {
            console.error(error)
            alert('Failed to log activity')
        }
    }

    const handleTaskSubmit = async (e) => {
        e.preventDefault()
        if (!newTask.title.trim() || !newTask.dueDate) return
        try {
            const { data } = await api.post(`/leads/${lead._id}/tasks`, newTask)
            if (data.success) {
                setTasks(prev => [...prev, data.data])
                setNewTask({ title: '', dueDate: '' })
            }
        } catch (error) {
            console.error(error)
            alert('Failed to add task')
        }
    }

    const handleTaskToggle = async (task) => {
        try {
            const { data } = await api.patch(`/leads/${lead._id}/tasks/${task._id}`, { completed: !task.completed })
            if (data.success) {
                setTasks(prev => prev.map(t => t._id === task._id ? data.data : t))
            }
        } catch (error) {
            console.error(error)
            alert('Failed to update task')
        }
    }

    const handleTaskDelete = async (taskId) => {
        try {
            const { data } = await api.delete(`/leads/${lead._id}/tasks/${taskId}`)
            if (data.success) {
                setTasks(prev => prev.filter(t => t._id !== taskId))
            }
        } catch (error) {
            console.error(error)
            alert('Failed to delete task')
        }
    }

    const inputClass = 'w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-3 py-1.5 text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]'

    return (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-[var(--bg-alt)] border-l border-[var(--line)]  flex flex-col backdrop-blur-sm">
            {/* Header */}
            <div className="p-4 border-b border-[var(--line)] flex items-center justify-between bg-[var(--surface)]">
                <div>
                    <h3 className="font-semibold text-lg text-[var(--ink)]">{editForm.name}</h3>
                    <p className="text-xs text-[var(--ink-soft)]">{editForm.company || 'Individual Lead'}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-[var(--line)]/50 rounded-none transition">
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                
                {/* 1. Edit Profile Form */}
                <form onSubmit={handleFormSubmit} className=" p-4 rounded-none space-y-4">
                    <h4 className="font-bold text-sm text-[var(--ink)] border-b border-[var(--line)] pb-2 flex items-center gap-1.5">
                        <Building className="h-4 w-4 text-[var(--accent)]" /> Profile Details
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-[var(--ink-soft)]">Lead Name</label>
                            <input type="text" value={editForm.name} onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))} className={inputClass} required />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-[var(--ink-soft)]">Email</label>
                            <input type="email" value={editForm.email} onChange={(e) => setEditForm(p => ({ ...p, email: e.target.value }))} className={inputClass} required />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-[var(--ink-soft)]">Phone</label>
                            <input type="text" value={editForm.phone} onChange={(e) => setEditForm(p => ({ ...p, phone: e.target.value }))} className={inputClass} />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-[var(--ink-soft)]">Company</label>
                            <input type="text" value={editForm.company} onChange={(e) => setEditForm(p => ({ ...p, company: e.target.value }))} className={inputClass} />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-[var(--ink-soft)]">Project Type</label>
                            <select value={editForm.projectType} onChange={(e) => setEditForm(p => ({ ...p, projectType: e.target.value }))} className={inputClass}>
                                <option value="WEB_APP">Web App</option>
                                <option value="SAAS">SaaS</option>
                                <option value="DASHBOARD">Dashboard</option>
                                <option value="E_COMMERCE">E-Commerce</option>
                                <option value="MOBILE">Mobile App</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-[var(--ink-soft)]">Status</label>
                            <select value={editForm.status} onChange={(e) => setEditForm(p => ({ ...p, status: e.target.value }))} className={inputClass}>
                                <option value="NEW">New</option>
                                <option value="CONTACTED">Contacted</option>
                                <option value="IN_DISCUSSION">In Discussion</option>
                                <option value="WON">Won (Deal Closed)</option>
                                <option value="LOST">Lost</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-[var(--ink-soft)]">Budget Tier</label>
                            <select value={editForm.budget} onChange={(e) => setEditForm(p => ({ ...p, budget: e.target.value }))} className={inputClass}>
                                <option value="UNDER_1000">Under $1,000</option>
                                <option value="1000_5000">$1,000 - $5,000</option>
                                <option value="5000_10000">$5,000 - $10,000</option>
                                <option value="10000_PLUS">$10,000+</option>
                                <option value="NOT_SPECIFIED">Not Specified</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-[var(--ink-soft)]">Deal Value ($)</label>
                            <input type="number" min="0" value={editForm.dealValue} onChange={(e) => setEditForm(p => ({ ...p, dealValue: parseFloat(e.target.value) || 0 }))} className={inputClass} />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] uppercase font-bold text-[var(--ink-soft)]">Profile Notes / Details</label>
                        <textarea rows="3" value={editForm.notes} onChange={(e) => setEditForm(p => ({ ...p, notes: e.target.value }))} className={`${inputClass} resize-none`} />
                    </div>

                    <div className="flex justify-end pt-1">
                        <button type="submit" className="rounded-none bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white hover:brightness-110">
                            Save Profile
                        </button>
                    </div>
                </form>

                {/* 2. Tasks & Follow-ups */}
                <div className=" p-4 rounded-none space-y-4">
                    <h4 className="font-bold text-sm text-[var(--ink)] border-b border-[var(--line)] pb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-[var(--accent)]" /> CRM Tasks &amp; Reminders
                    </h4>

                    <form onSubmit={handleTaskSubmit} className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Set follow-up task..." 
                            value={newTask.title} 
                            onChange={(e) => setNewTask(p => ({ ...p, title: e.target.value }))}
                            className={`${inputClass} flex-1`}
                            required
                        />
                        <input 
                            type="date" 
                            value={newTask.dueDate} 
                            onChange={(e) => setNewTask(p => ({ ...p, dueDate: e.target.value }))}
                            className="rounded-none border border-[var(--line)] bg-[var(--bg)] px-2 py-1 text-xs text-[var(--ink)] focus:outline-none"
                            required
                        />
                        <button type="submit" className="p-2 bg-[var(--accent)] text-white rounded-none hover:brightness-110">
                            <Plus className="h-4 w-4" />
                        </button>
                    </form>

                    <div className="space-y-2">
                        {tasks.length === 0 ? (
                            <p className="text-xs text-[var(--ink-soft)] py-2 text-center">No pending tasks for this lead.</p>
                        ) : (
                            tasks.map(task => (
                                <div key={task._id} className="flex items-center justify-between p-2.5 rounded-none border border-[var(--line)] bg-[var(--bg)] text-xs">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <input 
                                            type="checkbox" 
                                            checked={task.completed} 
                                            onChange={() => handleTaskToggle(task)}
                                            className="h-4 w-4 rounded border-[var(--line)] accent-[var(--accent)]"
                                        />
                                        <span className={`truncate ${task.completed ? 'line-through text-[var(--ink-soft)]' : 'text-[var(--ink)]'}`}>
                                            {task.title}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-[10px] text-[var(--ink-soft)] bg-[var(--surface)] px-2 py-0.5 rounded border border-[var(--line)]">
                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                        <button onClick={() => handleTaskDelete(task._id)} className="text-[var(--ink-soft)] hover:text-red-500">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 3. Activity Log */}
                <div className=" p-4 rounded-none space-y-4">
                    <h4 className="font-bold text-sm text-[var(--ink)] border-b border-[var(--line)] pb-2 flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4 text-[var(--accent)]" /> Interaction Timeline
                    </h4>

                    <form onSubmit={handleLogSubmit} className="space-y-3">
                        <div className="flex gap-2">
                            <select 
                                value={newLog.type} 
                                onChange={(e) => setNewLog(p => ({ ...p, type: e.target.value }))}
                                className="rounded-none border border-[var(--line)] bg-[var(--bg)] px-2 py-1 text-xs text-[var(--ink)] focus:outline-none"
                            >
                                <option value="NOTE">Note</option>
                                <option value="CALL">Call Log</option>
                                <option value="EMAIL">Email Sent</option>
                                <option value="MEETING">Meeting</option>
                            </select>
                            <input 
                                type="text" 
                                placeholder="Log interaction details..." 
                                value={newLog.content} 
                                onChange={(e) => setNewLog(p => ({ ...p, content: e.target.value }))}
                                className={`${inputClass} flex-1`}
                                required
                            />
                            <button type="submit" className="p-2 bg-[var(--accent)] text-white rounded-none hover:brightness-110">
                                Log Action
                            </button>
                        </div>
                    </form>

                    <div className="space-y-3 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--line)]">
                        {loadingLogs ? (
                            <div className="flex justify-center py-4">
                                <div className="h-5 w-5 animate-spin rounded-none border-2 border-[var(--accent)]/30 border-t-[var(--accent)]" />
                            </div>
                        ) : activities.length === 0 ? (
                            <p className="text-xs text-[var(--ink-soft)] py-2 text-center">No logged interactions yet.</p>
                        ) : (
                            activities.map(act => (
                                <div key={act._id} className="relative pl-10 text-xs">
                                    <div className="absolute left-3.5 top-1.5 h-3.5 w-3.5 -translate-x-1/2 rounded-none border-2 border-[var(--accent)] bg-[var(--bg-alt)]" />
                                    <div className="rounded-none border border-[var(--line)] bg-[var(--bg)] p-3 space-y-1">
                                        <div className="flex justify-between font-semibold">
                                            <span className="text-[var(--accent)]">{act.type} Logged</span>
                                            <span className="text-[10px] text-[var(--ink-soft)]">{new Date(act.createdAt).toLocaleString()}</span>
                                        </div>
                                        <p className="text-[var(--ink-soft)]">{act.content}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default LeadDetailsSidebar
