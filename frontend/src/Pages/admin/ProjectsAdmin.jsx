import { useState, useEffect } from 'react'
import { Trash2, Edit, Plus, X, ImagePlus, Star } from 'lucide-react'
import { getProjects, createProject, updateProject, deleteProject } from '../../api/projects'
import { uploadImage } from '../../api/admin'

const ProjectsAdmin = () => {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState({
        title: '', description: '', techStack: '',
        githubLink: '', liveLink: '', featured: false, coverImage: '',
    })

    const fetchAll = async () => {
        try {
            const { data } = await getProjects()
            setProjects(data.data)
        } catch { /* empty */ } finally { setLoading(false) }
    }

    useEffect(() => { fetchAll() }, [])

    const resetForm = () => {
        setForm({ title: '', description: '', techStack: '', githubLink: '', liveLink: '', featured: false, coverImage: '' })
        setEditingId(null)
        setShowForm(false)
    }

    const handleEdit = (project) => {
        setForm({
            title: project.title,
            description: project.description,
            techStack: (project.techStack || []).join(', '),
            githubLink: project.githubLink || '',
            liveLink: project.liveLink || '',
            featured: project.featured,
            coverImage: project.coverImage || '',
        })
        setEditingId(project._id)
        setShowForm(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const payload = {
            ...form,
            techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean),
        }
        try {
            if (editingId) {
                await updateProject(editingId, payload)
            } else {
                await createProject(payload)
            }
            resetForm()
            fetchAll()
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this project?')) return
        try {
            await deleteProject(id)
            fetchAll()
        } catch { /* empty */ }
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        try {
            const { data } = await uploadImage(file)
            setForm(prev => ({ ...prev, coverImage: data.data.url }))
        } catch {
            alert('Image upload failed')
        }
    }

    const inputClass = 'w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--accent-2)]/55 focus:outline-none'

    return (
        <div className='space-y-5'>
            <div className='glass-card flex flex-wrap items-center justify-between gap-3 rounded-3xl p-5 md:p-6'>
                <div>
                    <h1 className='font-nevera text-3xl tracking-[0.08em] text-[var(--ink)]'>Projects</h1>
                    <p className='mt-1 text-sm text-[var(--ink-soft)]'>Manage featured builds, links, stack, and publishing order.</p>
                </div>
                <button onClick={() => { resetForm(); setShowForm(true) }}
                    className='inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110'>
                    <Plus className='w-4 h-4' /> New Project
                </button>
            </div>

            {showForm && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 p-4 backdrop-blur-sm'>
                    <div className='glass-card max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6'>
                        <div className='flex items-center justify-between mb-6'>
                            <h2 className='font-nevera text-2xl tracking-[0.06em] text-[var(--ink)]'>{editingId ? 'Edit Project' : 'New Project'}</h2>
                            <button onClick={resetForm} className='rounded-full border border-[var(--line)] bg-[var(--surface)] p-2 text-[var(--ink-soft)] transition hover:text-[var(--accent)]'><X className='w-5 h-5' /></button>
                        </div>
                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <input type='text' placeholder='Title' value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} required
                                className={inputClass} />
                            <textarea placeholder='Full Description' value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} required rows={4}
                                className={`${inputClass} resize-none`} />
                            <input type='text' placeholder='Tech Stack (comma-separated)' value={form.techStack} onChange={(e) => setForm(p => ({ ...p, techStack: e.target.value }))}
                                className={inputClass} />
                            <div className='grid grid-cols-2 gap-4'>
                                <input type='url' placeholder='GitHub URL' value={form.githubLink} onChange={(e) => setForm(p => ({ ...p, githubLink: e.target.value }))}
                                    className={inputClass} />
                                <input type='url' placeholder='Live URL' value={form.liveLink} onChange={(e) => setForm(p => ({ ...p, liveLink: e.target.value }))}
                                    className={inputClass} />
                            </div>
                            <div>
                                <label className='flex cursor-pointer items-center gap-3 w-fit rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--ink-soft)]'>
                                    <input type='checkbox' checked={form.featured} onChange={(e) => setForm(p => ({ ...p, featured: e.target.checked }))}
                                        className='h-4 w-4 accent-[var(--accent)]' />
                                    Featured project
                                </label>
                            </div>
                            <div>
                                <label className='mb-2 block text-sm font-semibold text-[var(--ink-soft)]'>Featured Image</label>
                                <div className='rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-4'>
                                    <div className='flex flex-wrap items-center gap-3'>
                                        <input 
                                            type='url' 
                                            placeholder='Paste image URL...' 
                                            value={form.coverImage} 
                                            onChange={(e) => setForm(p => ({ ...p, coverImage: e.target.value }))}
                                            className='flex-1 min-w-[200px] rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--accent-2)]/55 focus:outline-none'
                                        />
                                        <span className='text-[var(--ink-soft)] text-xs font-bold uppercase'>OR</span>
                                        <label className='inline-flex cursor-pointer whitespace-nowrap items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]'>
                                            <ImagePlus className='h-4 w-4' /> Upload Local File
                                            <input type='file' accept='image/*' onChange={handleImageUpload} className='hidden' />
                                        </label>
                                    </div>
                                    {form.coverImage && <img src={form.coverImage} alt='preview' className='mt-4 h-32 w-full max-w-[200px] rounded-xl border border-[var(--line)] object-cover' />}
                                </div>
                            </div>
                            <button type='submit' className='w-full rounded-full bg-[var(--accent)] py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:brightness-110'>
                                {editingId ? 'Update Project' : 'Create Project'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Projects Table */}
            {loading ? (
                <div className='glass-card rounded-2xl py-14'>
                    <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]'></div>
                </div>
            ) : projects.length === 0 ? (
                <p className='glass-card rounded-2xl py-16 text-center text-[var(--ink-soft)]'>No projects yet. Create your first one!</p>
            ) : (
                <div className='space-y-3'>
                    {projects.map((p) => (
                        <div key={p._id} className='glass-card flex items-center justify-between gap-4 rounded-2xl p-4'>
                            <div className='flex items-center gap-4 flex-1 min-w-0'>
                                {p.coverImage && <img src={p.coverImage} alt='' className='h-12 w-16 shrink-0 rounded-lg border border-[var(--line)] object-cover' />}
                                <div className='min-w-0'>
                                    <h3 className='truncate font-semibold text-[var(--ink)]'>{p.title}</h3>
                                    <p className='text-xs text-[var(--ink-soft)]'>{(p.techStack || []).join(' · ')}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-2 shrink-0'>
                                {p.featured && <span className='inline-flex items-center gap-1 rounded-full border border-[var(--accent)]/25 bg-[var(--accent)]/10 px-2 py-0.5 text-xs font-semibold text-[var(--accent)]'><Star className='h-3 w-3' /> Featured</span>}
                                <button onClick={() => handleEdit(p)} className='rounded-full border border-[var(--line)] bg-[var(--surface)] p-2 text-[var(--ink-soft)] transition hover:text-[var(--accent-2)]'><Edit className='w-4 h-4' /></button>
                                <button onClick={() => handleDelete(p._id)} className='rounded-full border border-[var(--line)] bg-[var(--surface)] p-2 text-[var(--ink-soft)] transition hover:text-[var(--accent)]'><Trash2 className='w-4 h-4' /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProjectsAdmin
