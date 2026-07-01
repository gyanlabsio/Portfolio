import { useState, useEffect } from 'react'
import { Trash2, Edit, Plus, X, ImagePlus, Star, Link as LinkIcon, MoveUp, MoveDown } from 'lucide-react'
import { getDesigns, createDesign, updateDesign, deleteDesign } from '../../api/design'
import { uploadImage } from '../../api/admin'

const DesignsAdmin = () => {
    const [designs, setDesigns] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState({
        title: '', subtitle: '', description: '', thumbnail: '', category: 'Branding',
        role: '', tools: '', client: '', year: '', linkType: 'popup', externalUrl: '', featured: false, order: 0
    })

    const fetchAll = async () => {
        try {
            const { data } = await getDesigns()
            setDesigns(data.data)
        } catch { /* empty */ } finally { setLoading(false) }
    }

    useEffect(() => { fetchAll() }, [])

    const resetForm = () => {
        setForm({
            title: '', subtitle: '', description: '', thumbnail: '', category: 'Branding',
            role: '', tools: '', client: '', year: '', linkType: 'popup', externalUrl: '', featured: false, order: 0
        })
        setEditingId(null)
        setShowForm(false)
    }

    const handleEdit = (design) => {
        setForm({
            title: design.title,
            subtitle: design.subtitle || '',
            description: design.description || '',
            thumbnail: design.thumbnail || '',
            category: design.category,
            role: design.role || '',
            tools: (design.tools || []).join(', '),
            client: design.client || '',
            year: design.year || '',
            linkType: design.linkType,
            externalUrl: design.externalUrl || '',
            featured: design.featured,
            order: design.order || 0
        })
        setEditingId(design._id)
        setShowForm(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const payload = {
            ...form,
            tools: form.tools.split(',').map(t => t.trim()).filter(Boolean),
        }
        try {
            if (editingId) {
                await updateDesign(editingId, payload)
            } else {
                await createDesign(payload)
            }
            resetForm()
            fetchAll()
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this design?')) return
        try {
            await deleteDesign(id)
            fetchAll()
        } catch { /* empty */ }
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        try {
            const { data } = await uploadImage(file)
            setForm(prev => ({ ...prev, thumbnail: data.data.url }))
        } catch {
            alert('Image upload failed')
        }
    }

    const inputClass = 'w-full rounded-none border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--accent-2)]/55 focus:outline-none'
    const labelClass = 'mb-2 block text-sm font-semibold text-[var(--ink-soft)]'

    return (
        <div className='space-y-5'>
            <div className=' flex flex-wrap items-center justify-between gap-3 rounded-none p-5 md:p-6'>
                <div>
                    <h1 className='font-nevera text-3xl tracking-[0.08em] text-[var(--ink)]'>Design Gallery</h1>
                    <p className='mt-1 text-sm text-[var(--ink-soft)]'>Manage UI/UX, posters, and visual projects.</p>
                </div>
                <button onClick={() => { resetForm(); setShowForm(true) }}
                    className='inline-flex items-center gap-2 rounded-none bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110'>
                    <Plus className='w-4 h-4' /> New Design
                </button>
            </div>

            {showForm && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 p-4 backdrop-blur-sm'>
                    <div className=' max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-none p-6'>
                        <div className='flex items-center justify-between mb-6'>
                            <h2 className='font-nevera text-2xl tracking-[0.06em] text-[var(--ink)]'>{editingId ? 'Edit Design' : 'New Design'}</h2>
                            <button onClick={resetForm} className='rounded-none border border-[var(--line)] bg-[var(--surface)] p-2 text-[var(--ink-soft)] transition hover:text-[var(--accent)]'><X className='w-5 h-5' /></button>
                        </div>
                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className={labelClass}>Title *</label>
                                    <input type='text' placeholder='e.g. Modern UI Kit' value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} required className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Category *</label>
                                    <select value={form.category} onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))} required className={inputClass}>
                                        <option value="UI/UX">UI/UX</option>
                                        <option value="Branding">Branding</option>
                                        <option value="Web Design">Web Design</option>
                                        <option value="Motion">Motion</option>
                                        <option value="Print">Print</option>
                                        <option value="Case Study">Case Study</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className={labelClass}>Subtitle / Short Context</label>
                                <input type='text' placeholder='One-line context' value={form.subtitle} onChange={(e) => setForm(p => ({ ...p, subtitle: e.target.value }))} className={inputClass} />
                            </div>

                            <div>
                                <label className={labelClass}>Full Description</label>
                                <textarea placeholder='Detailed description (optional)' value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} rows={4} className={`${inputClass} resize-none`} />
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className={labelClass}>Tools (comma-separated)</label>
                                    <input type='text' placeholder='Figma, Illustrator' value={form.tools} onChange={(e) => setForm(p => ({ ...p, tools: e.target.value }))} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Role</label>
                                    <input type='text' placeholder='Lead Designer' value={form.role} onChange={(e) => setForm(p => ({ ...p, role: e.target.value }))} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Client</label>
                                    <input type='text' placeholder='Client Name' value={form.client} onChange={(e) => setForm(p => ({ ...p, client: e.target.value }))} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Year</label>
                                    <input type='text' placeholder='2024' value={form.year} onChange={(e) => setForm(p => ({ ...p, year: e.target.value }))} className={inputClass} />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className={labelClass}>Action / Link Type</label>
                                    <select value={form.linkType} onChange={(e) => setForm(p => ({ ...p, linkType: e.target.value }))} className={inputClass}>
                                        <option value="popup">Lightbox / Popup</option>
                                        <option value="detail">Internal Detail Page</option>
                                        <option value="external">External Link</option>
                                    </select>
                                </div>
                                {form.linkType === 'external' && (
                                    <div>
                                        <label className={labelClass}>External URL</label>
                                        <input type='url' placeholder='https://dribbble.com/...' value={form.externalUrl} onChange={(e) => setForm(p => ({ ...p, externalUrl: e.target.value }))} required className={inputClass} />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className={labelClass}>Thumbnail Image *</label>
                                <div className='rounded-none border border-dashed border-[var(--line)] bg-[var(--surface)] p-4'>
                                    <div className='flex flex-wrap items-center gap-3'>
                                        <input 
                                            type='url' 
                                            placeholder='Paste image URL...' 
                                            value={form.thumbnail} 
                                            onChange={(e) => setForm(p => ({ ...p, thumbnail: e.target.value }))}
                                            required
                                            className='flex-1 min-w-[200px] rounded-none border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--accent-2)]/55 focus:outline-none'
                                        />
                                        <span className='text-[var(--ink-soft)] text-xs font-bold uppercase'>OR</span>
                                        <label className='inline-flex cursor-pointer whitespace-nowrap items-center gap-2 rounded-none border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]'>
                                            <ImagePlus className='h-4 w-4' /> Upload File
                                            <input type='file' accept='image/*' onChange={handleImageUpload} className='hidden' />
                                        </label>
                                    </div>
                                    {form.thumbnail && (
                                        <div className='mt-4 flex items-end gap-3'>
                                            <img src={form.thumbnail} alt='preview' className='h-32 w-full max-w-[200px] rounded-none border border-[var(--line)] object-cover' />
                                            <button
                                                type='button'
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigator.clipboard.writeText(form.thumbnail);
                                                    alert('Image link copied to clipboard!');
                                                }}
                                                className='inline-flex items-center gap-2 rounded-none border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-xs font-semibold text-[var(--ink)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]'
                                            >
                                                <LinkIcon className='h-4 w-4' /> Copy Link
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className='flex gap-4'>
                                <label className='flex cursor-pointer items-center gap-3 w-fit rounded-none border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--ink-soft)]'>
                                    <input type='checkbox' checked={form.featured} onChange={(e) => setForm(p => ({ ...p, featured: e.target.checked }))}
                                        className='h-4 w-4 accent-[var(--accent)]' />
                                    Featured Design
                                </label>
                            </div>

                            <button type='submit' className='w-full rounded-none bg-[var(--accent)] py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:brightness-110'>
                                {editingId ? 'Update Design' : 'Create Design'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Designs Table */}
            {loading ? (
                <div className=' rounded-none py-14'>
                    <div className='mx-auto h-8 w-8 animate-spin rounded-none border-2 border-[var(--accent)]/30 border-t-[var(--accent)]'></div>
                </div>
            ) : designs.length === 0 ? (
                <p className=' rounded-none py-16 text-center text-[var(--ink-soft)]'>No designs yet. Create your first one!</p>
            ) : (
                <div className='space-y-3'>
                    {designs.map((p) => (
                        <div key={p._id} className=' flex items-center justify-between gap-4 rounded-none p-4'>
                            <div className='flex items-center gap-4 flex-1 min-w-0'>
                                {p.thumbnail && <img src={p.thumbnail} alt='' className='h-12 w-16 shrink-0 rounded-none border border-[var(--line)] object-cover' />}
                                <div className='min-w-0'>
                                    <h3 className='truncate font-semibold text-[var(--ink)]'>{p.title}</h3>
                                    <p className='text-xs text-[var(--ink-soft)]'>{p.category} {(p.tools || []).length > 0 ? `· ${(p.tools || []).join(', ')}` : ''}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-2 shrink-0'>
                                {p.featured && <span className='inline-flex items-center gap-1 rounded-none border border-[var(--accent)]/25 bg-[var(--accent)]/10 px-2 py-0.5 text-xs font-semibold text-[var(--accent)]'><Star className='h-3 w-3' /> Featured</span>}
                                {p.linkType === 'external' && <span className='inline-flex items-center gap-1 rounded-none border border-[var(--line)] bg-[var(--surface)] px-2 py-0.5 text-xs font-semibold text-[var(--ink-soft)]'><LinkIcon className='h-3 w-3' /> External</span>}
                                <button onClick={() => handleEdit(p)} className='rounded-none border border-[var(--line)] bg-[var(--surface)] p-2 text-[var(--ink-soft)] transition hover:text-[var(--accent-2)]'><Edit className='w-4 h-4' /></button>
                                <button onClick={() => handleDelete(p._id)} className='rounded-none border border-[var(--line)] bg-[var(--surface)] p-2 text-[var(--ink-soft)] transition hover:text-[var(--accent)]'><Trash2 className='w-4 h-4' /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default DesignsAdmin
