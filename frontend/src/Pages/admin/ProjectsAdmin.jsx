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
        title: '', description: '', shortDescription: '', techStack: '',
        githubUrl: '', liveUrl: '', featured: false, order: 0, featuredImage: '',
    })

    const fetchAll = async () => {
        try {
            const { data } = await getProjects()
            setProjects(data.data)
        } catch { /* empty */ } finally { setLoading(false) }
    }

    useEffect(() => { fetchAll() }, [])

    const resetForm = () => {
        setForm({ title: '', description: '', shortDescription: '', techStack: '', githubUrl: '', liveUrl: '', featured: false, order: 0, featuredImage: '' })
        setEditingId(null)
        setShowForm(false)
    }

    const handleEdit = (project) => {
        setForm({
            title: project.title,
            description: project.description,
            shortDescription: project.shortDescription || '',
            techStack: (project.techStack || []).join(', '),
            githubUrl: project.githubUrl || '',
            liveUrl: project.liveUrl || '',
            featured: project.featured,
            order: project.order || 0,
            featuredImage: project.featuredImage || '',
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
            setForm(prev => ({ ...prev, featuredImage: data.data.url }))
        } catch {
            alert('Image upload failed')
        }
    }

    const inputClass = 'w-full rounded-2xl border border-black/10 bg-white/90 px-4 py-3 text-[#1f2937] placeholder:text-[#748295] focus:border-[#0c7fa3]/55 focus:outline-none'

    return (
        <div className='space-y-5'>
            <div className='glass-card flex flex-wrap items-center justify-between gap-3 rounded-3xl p-5 md:p-6'>
                <div>
                    <h1 className='font-nevera text-3xl tracking-[0.08em] text-[#152132]'>Projects</h1>
                    <p className='mt-1 text-sm text-[#556575]'>Manage featured builds, links, stack, and publishing order.</p>
                </div>
                <button onClick={() => { resetForm(); setShowForm(true) }}
                    className='inline-flex items-center gap-2 rounded-full bg-[#ef3e2f] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#d92f22]'>
                    <Plus className='w-4 h-4' /> New Project
                </button>
            </div>

            {showForm && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 p-4 backdrop-blur-sm'>
                    <div className='glass-card max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6'>
                        <div className='flex items-center justify-between mb-6'>
                            <h2 className='font-nevera text-2xl tracking-[0.06em] text-[#182335]'>{editingId ? 'Edit Project' : 'New Project'}</h2>
                            <button onClick={resetForm} className='rounded-full border border-black/10 bg-white/80 p-2 text-[#4e5d6d] transition hover:text-[#ef3e2f]'><X className='w-5 h-5' /></button>
                        </div>
                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <input type='text' placeholder='Title' value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} required
                                className={inputClass} />
                            <input type='text' placeholder='Short Description' value={form.shortDescription} onChange={(e) => setForm(p => ({ ...p, shortDescription: e.target.value }))}
                                className={inputClass} />
                            <textarea placeholder='Full Description' value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} required rows={4}
                                className={`${inputClass} resize-none`} />
                            <input type='text' placeholder='Tech Stack (comma-separated)' value={form.techStack} onChange={(e) => setForm(p => ({ ...p, techStack: e.target.value }))}
                                className={inputClass} />
                            <div className='grid grid-cols-2 gap-4'>
                                <input type='url' placeholder='GitHub URL' value={form.githubUrl} onChange={(e) => setForm(p => ({ ...p, githubUrl: e.target.value }))}
                                    className={inputClass} />
                                <input type='url' placeholder='Live URL' value={form.liveUrl} onChange={(e) => setForm(p => ({ ...p, liveUrl: e.target.value }))}
                                    className={inputClass} />
                            </div>
                            <div className='grid grid-cols-2 gap-4'>
                                <input type='number' placeholder='Order' value={form.order} onChange={(e) => setForm(p => ({ ...p, order: parseInt(e.target.value) || 0 }))}
                                    className={inputClass} />
                                <label className='flex cursor-pointer items-center gap-3 rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm font-semibold text-[#475767]'>
                                    <input type='checkbox' checked={form.featured} onChange={(e) => setForm(p => ({ ...p, featured: e.target.checked }))}
                                        className='h-4 w-4 accent-[#ef3e2f]' />
                                    Featured project
                                </label>
                            </div>
                            <div>
                                <label className='mb-2 block text-sm font-semibold text-[#475767]'>Featured Image</label>
                                <div className='rounded-2xl border border-dashed border-black/20 bg-white/70 p-4'>
                                    <label className='inline-flex cursor-pointer items-center gap-2 rounded-full border border-black/10 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#2f3d4f]'>
                                        <ImagePlus className='h-4 w-4 text-[#0c7fa3]' /> Upload image
                                        <input type='file' accept='image/*' onChange={handleImageUpload} className='hidden' />
                                    </label>
                                    {form.featuredImage && <img src={form.featuredImage} alt='preview' className='mt-3 h-32 rounded-xl border border-black/10 object-cover' />}
                                </div>
                            </div>
                            <button type='submit' className='w-full rounded-full bg-[#ef3e2f] py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#d92f22]'>
                                {editingId ? 'Update Project' : 'Create Project'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Projects Table */}
            {loading ? (
                <div className='glass-card rounded-2xl py-14'>
                    <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#ef3e2f]/30 border-t-[#ef3e2f]'></div>
                </div>
            ) : projects.length === 0 ? (
                <p className='glass-card rounded-2xl py-16 text-center text-[#5b6978]'>No projects yet. Create your first one!</p>
            ) : (
                <div className='space-y-3'>
                    {projects.map((p) => (
                        <div key={p._id} className='glass-card flex items-center justify-between gap-4 rounded-2xl p-4'>
                            <div className='flex items-center gap-4 flex-1 min-w-0'>
                                {p.featuredImage && <img src={p.featuredImage} alt='' className='h-12 w-16 shrink-0 rounded-lg border border-black/10 object-cover' />}
                                <div className='min-w-0'>
                                    <h3 className='truncate font-semibold text-[#1d2838]'>{p.title}</h3>
                                    <p className='text-xs text-[#667587]'>{(p.techStack || []).join(' · ')}</p>
                                </div>
                            </div>
                            <div className='flex items-center gap-2 shrink-0'>
                                {p.featured && <span className='inline-flex items-center gap-1 rounded-full border border-[#ef3e2f]/25 bg-[#ef3e2f]/10 px-2 py-0.5 text-xs font-semibold text-[#ef3e2f]'><Star className='h-3 w-3' /> Featured</span>}
                                <button onClick={() => handleEdit(p)} className='rounded-full border border-black/10 bg-white/80 p-2 text-[#4f5f6f] transition hover:text-[#0c7fa3]'><Edit className='w-4 h-4' /></button>
                                <button onClick={() => handleDelete(p._id)} className='rounded-full border border-black/10 bg-white/80 p-2 text-[#4f5f6f] transition hover:text-[#ef3e2f]'><Trash2 className='w-4 h-4' /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProjectsAdmin
