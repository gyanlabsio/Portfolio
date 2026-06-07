import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, MessageSquare, X, CheckCircle2, Star } from 'lucide-react'
import { getTestimonials, createTestimonial, updateTestimonial, updateTestimonialStatus, deleteTestimonial } from '../../api/testimonial'

const TestimonialsAdmin = () => {
    const [testimonials, setTestimonials] = useState([])
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({
        clientName: '',
        clientRole: '',
        company: '',
        testimonial: '',
        avatar: '',
        rating: 5,
        status: 'PENDING',
        featured: false
    })

    const fetchAll = async () => {
        try {
            setLoading(true)
            const { data } = await getTestimonials(true)
            setTestimonials(data.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAll() }, [])

    const handleOpenForm = (t = null) => {
        if (t) {
            setEditingId(t._id)
            setFormData({
                clientName: t.clientName,
                clientRole: t.clientRole || '',
                company: t.company || '',
                testimonial: t.testimonial,
                avatar: t.avatar || '',
                rating: t.rating || 5,
                status: t.status,
                featured: t.featured || false
            })
        } else {
            setEditingId(null)
            setFormData({
                clientName: '', clientRole: '', company: '', testimonial: '', avatar: '', rating: 5, status: 'PENDING', featured: false
            })
        }
        setIsFormOpen(true)
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
        setEditingId(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingId) {
                await updateTestimonial(editingId, formData)
            } else {
                await createTestimonial(formData)
            }
            fetchAll()
            handleCloseForm()
        } catch (error) {
            console.error(error)
        }
    }

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'APPROVED' ? 'PENDING' : 'APPROVED'
        try {
            await updateTestimonialStatus(id, { status: newStatus })
            fetchAll()
        } catch (error) {
            console.error(error)
        }
    }

    const handleToggleFeatured = async (id, currentFeatured) => {
        try {
            await updateTestimonialStatus(id, { featured: !currentFeatured })
            fetchAll()
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteTestimonial(id)
            fetchAll()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className='space-y-6'>
            <div className='glass-card flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5 md:p-6'>
                <div>
                    <h1 className='font-nevera text-3xl tracking-[0.08em] text-[var(--ink)]'>Testimonials</h1>
                    <p className='mt-1 text-sm text-[var(--ink-soft)]'>Manage client feedback and reviews.</p>
                </div>
                <button onClick={() => handleOpenForm()} className='focus-ring button-pop flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-2)]'>
                    <Plus className='h-4 w-4' /> Add Testimonial
                </button>
            </div>

            {loading ? (
                <div className='glass-card rounded-2xl py-14'>
                    <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]'></div>
                </div>
            ) : testimonials.length === 0 ? (
                <div className='glass-card rounded-2xl py-16 text-center'>
                    <MessageSquare className='mx-auto h-8 w-8 text-[var(--accent-2)]' />
                    <p className='mt-2 text-[var(--ink-soft)]'>No testimonials added yet.</p>
                </div>
            ) : (
                <div className='grid gap-4 lg:grid-cols-2'>
                    {testimonials.map(t => (
                        <div key={t._id} className='glass-card rounded-2xl p-5 transition hover:border-[var(--accent)]/30 flex flex-col justify-between'>
                            <div>
                                <div className='flex items-start justify-between mb-4'>
                                    <div className='flex items-center gap-3'>
                                        {t.avatar ? (
                                            <img src={t.avatar} alt={t.clientName} className='h-10 w-10 rounded-full object-cover' />
                                        ) : (
                                            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] font-nevera text-lg text-[var(--accent)]'>
                                                {t.clientName?.charAt(0) || 'C'}
                                            </div>
                                        )}
                                        <div>
                                            <h3 className='font-semibold text-[var(--ink)]'>{t.clientName}</h3>
                                            <p className='text-xs text-[var(--ink-soft)]'>
                                                {t.clientRole}{t.clientRole && t.company && ' at '}{t.company}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                                            <Star key={i} className='h-3 w-3 fill-yellow-500 text-yellow-500' />
                                        ))}
                                    </div>
                                </div>
                                <p className='text-sm text-[var(--ink)] italic whitespace-pre-wrap'>"{t.testimonial}"</p>
                            </div>
                            
                            <div className='mt-6 flex items-center justify-between border-t border-[var(--line)] pt-4'>
                                <div className='flex gap-2'>
                                    <button 
                                        onClick={() => handleToggleStatus(t._id, t.status)} 
                                        className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-semibold transition ${t.status === 'APPROVED' ? 'border-green-500/20 bg-green-500/10 text-green-500 hover:bg-green-500/20' : 'border-yellow-500/20 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'}`}
                                    >
                                        <CheckCircle2 className='h-3 w-3' /> {t.status}
                                    </button>
                                    <button 
                                        onClick={() => handleToggleFeatured(t._id, t.featured)} 
                                        className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-semibold transition ${t.featured ? 'border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20' : 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink-soft)] hover:bg-[var(--bg-alt)]'}`}
                                    >
                                        <Star className={`h-3 w-3 ${t.featured ? 'fill-[var(--accent)]' : ''}`} /> FEATURED
                                    </button>
                                </div>
                                <div className='flex gap-1'>
                                    <button onClick={() => handleOpenForm(t)} className='rounded-lg p-2 text-[var(--ink-soft)] transition hover:bg-[var(--surface)] hover:text-[var(--ink)]'>
                                        <Edit2 className='h-4 w-4' />
                                    </button>
                                    <button onClick={(e) => {
                                        e.target.innerText === 'Sure?' ? handleDelete(t._id) : (e.target.innerText = 'Sure?');
                                        setTimeout(() => { if(e.target) e.target.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2 h-4 w-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>' }, 3000);
                                    }} className='rounded-lg p-2 text-[var(--ink-soft)] transition hover:bg-[var(--surface)] hover:text-[#EF3E2F] text-xs font-semibold'>
                                        <Trash2 className='h-4 w-4 pointer-events-none' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isFormOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 p-4 backdrop-blur-sm'>
                    <div className='glass-card w-full max-w-lg rounded-3xl p-6 max-h-[90vh] overflow-y-auto'>
                        <div className='mb-6 flex items-center justify-between'>
                            <h2 className='font-nevera text-2xl text-[var(--ink)]'>{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h2>
                            <button onClick={handleCloseForm} className='rounded-full p-2 text-[var(--ink-soft)] transition hover:bg-[var(--surface)] hover:text-[var(--ink)]'>
                                <X className='h-5 w-5' />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <div>
                                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Name</label>
                                <input required type='text' value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' />
                            </div>
                            
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Role</label>
                                    <input type='text' value={formData.clientRole} onChange={e => setFormData({ ...formData, clientRole: e.target.value })} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' />
                                </div>
                                <div>
                                    <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Company</label>
                                    <input type='text' value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' />
                                </div>
                            </div>

                            <div>
                                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Testimonial Content</label>
                                <textarea required rows='4' value={formData.testimonial} onChange={e => setFormData({ ...formData, testimonial: e.target.value })} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none resize-none' />
                            </div>

                            <div>
                                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Avatar URL</label>
                                <input type='url' value={formData.avatar} onChange={e => setFormData({ ...formData, avatar: e.target.value })} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' />
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Rating (1-5)</label>
                                    <input type='number' min='1' max='5' value={formData.rating} onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' />
                                </div>
                                <div>
                                    <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Status</label>
                                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none'>
                                        <option value="PENDING">PENDING</option>
                                        <option value="APPROVED">APPROVED</option>
                                    </select>
                                </div>
                            </div>

                            <label className='flex items-center gap-2 cursor-pointer mt-2'>
                                <input type="checkbox" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} className='rounded text-[var(--accent)] focus:ring-[var(--accent-2)] bg-[var(--bg)] border-[var(--line)]' />
                                <span className='text-sm font-semibold text-[var(--ink)]'>Feature on Homepage</span>
                            </label>

                            <div className='mt-8 flex justify-end gap-3'>
                                <button type='button' onClick={handleCloseForm} className='rounded-xl border border-[var(--line)] px-4 py-2.5 text-sm font-semibold text-[var(--ink-soft)] hover:bg-[var(--surface)] hover:text-[var(--ink)]'>Cancel</button>
                                <button type='submit' className='rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--accent-2)]'>{editingId ? 'Save Changes' : 'Add Testimonial'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TestimonialsAdmin
