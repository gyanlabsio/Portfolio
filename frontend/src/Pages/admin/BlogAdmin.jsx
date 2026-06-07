import { useEffect, useState } from 'react'
import { BookOpenCheck, Edit, Eye, EyeOff, PenSquare, Plus, Trash2, X } from 'lucide-react'
import { createPost, deletePost, getPosts, updatePost } from '../../api/blog'

const BlogAdmin = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState({
        title: '', content: '', excerpt: '', tags: '', status: 'DRAFT', type: 'ARTICLE', coverImage: '', author: 'Admin'
    })

    const fetchAll = async () => {
        try {
            const { data } = await getPosts(true)
            setPosts(data.data || [])
        } catch {
            setPosts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAll()
    }, [])

    const resetForm = () => {
        setForm({ title: '', content: '', excerpt: '', tags: '', status: 'DRAFT', type: 'ARTICLE', coverImage: '', author: 'Admin' })
        setEditingId(null)
        setShowForm(false)
    }

    const handleEdit = (post) => {
        setForm({
            title: post.title,
            content: post.content,
            excerpt: post.excerpt || '',
            tags: (post.tags || []).join(', '),
            status: post.status || 'DRAFT',
            type: post.type || 'ARTICLE',
            coverImage: post.coverImage || '',
            author: post.author || 'Admin',
        })
        setEditingId(post._id)
        setShowForm(true)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const payload = {
            ...form,
            tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        }

        try {
            if (editingId) {
                await updatePost(editingId, payload)
            } else {
                await createPost(payload)
            }
            resetForm()
            fetchAll()
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this blog post?')) return
        try {
            await deletePost(id)
            fetchAll()
        } catch {
            // no-op
        }
    }

    const togglePublish = async (post) => {
        try {
            await updatePost(post._id, { status: post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' })
            fetchAll()
        } catch {
            // no-op
        }
    }

    const inputClass = 'w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--accent-2)]/55 focus:outline-none'

    return (
        <div className='space-y-5'>
            <div className='glass-card enter-fade flex flex-wrap items-center justify-between gap-3 rounded-3xl p-5 md:p-6'>
                <div>
                    <h1 className='font-nevera text-3xl tracking-[0.08em] text-[var(--ink)]'>Blog Posts</h1>
                    <p className='mt-1 text-sm text-[var(--ink-soft)]'>Write, edit, and publish updates with tags and rich content.</p>
                </div>
                <button
                    onClick={() => {
                        resetForm()
                        setShowForm(true)
                    }}
                    className='focus-ring button-pop inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:brightness-110'
                >
                    <Plus className='h-4 w-4' /> New Post
                </button>
            </div>

            {showForm && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 p-4 backdrop-blur-sm'>
                    <div className='glass-card enter-fade max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl p-6'>
                        <div className='mb-6 flex items-center justify-between'>
                            <h2 className='font-nevera text-2xl tracking-[0.06em] text-[var(--ink)]'>{editingId ? 'Edit Post' : 'New Post'}</h2>
                            <button onClick={resetForm} className='focus-ring button-pop rounded-full border border-[var(--line)] bg-[var(--surface)] p-2 text-[var(--ink-soft)] hover:text-[var(--accent)]'>
                                <X className='h-5 w-5' />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <input
                                type='text'
                                placeholder='Post Title'
                                value={form.title}
                                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                                required
                                className={`${inputClass} focus-ring text-lg`}
                            />
                            <input
                                type='text'
                                placeholder='Excerpt (short summary)'
                                value={form.excerpt}
                                onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
                                className={`${inputClass} focus-ring`}
                            />
                            <div>
                                <label className='mb-2 block text-sm font-semibold text-[var(--ink-soft)]'>Content (HTML supported)</label>
                                <textarea
                                    placeholder='Write your post content here... HTML tags like <h2>, <p>, <code> are supported.'
                                    value={form.content}
                                    onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
                                    required
                                    rows={12}
                                    className='focus-ring w-full resize-none rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 font-mono text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--accent-2)]/55 focus:outline-none'
                                />
                            </div>
                            <input
                                type='text'
                                placeholder='Tags (comma-separated)'
                                value={form.tags}
                                onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
                                className={`${inputClass} focus-ring`}
                            />
                            <input
                                type='url'
                                placeholder='Cover Image URL'
                                value={form.coverImage}
                                onChange={(event) => setForm((prev) => ({ ...prev, coverImage: event.target.value }))}
                                className={`${inputClass} focus-ring`}
                            />
                            <div className='flex gap-3'>
                                <label className='surface-interactive flex flex-1 cursor-pointer items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--ink-soft)]'>
                                    <input
                                        type='checkbox'
                                        checked={form.status === 'PUBLISHED'}
                                        onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.checked ? 'PUBLISHED' : 'DRAFT' }))}
                                        className='h-4 w-4 accent-[var(--accent)]'
                                    />
                                    Publish immediately
                                </label>
                                <label className='surface-interactive flex flex-1 cursor-pointer items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--ink-soft)]'>
                                    <input
                                        type='checkbox'
                                        checked={form.type === 'CASE_STUDY'}
                                        onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.checked ? 'CASE_STUDY' : 'ARTICLE' }))}
                                        className='h-4 w-4 accent-[var(--accent-2)]'
                                    />
                                    Case Study
                                </label>
                            </div>
                            <button type='submit' className='focus-ring button-pop w-full rounded-full bg-[var(--accent)] py-3 text-sm font-bold uppercase tracking-[0.12em] text-white hover:brightness-110'>
                                {editingId ? 'Update Post' : 'Create Post'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div className='glass-card rounded-2xl py-14'>
                    <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]'></div>
                </div>
            ) : posts.length === 0 ? (
                <div className='glass-card rounded-2xl py-16 text-center'>
                    <PenSquare className='mx-auto h-8 w-8 text-[var(--accent-2)]' />
                    <p className='mt-2 text-[var(--ink-soft)]'>No blog posts yet.</p>
                </div>
            ) : (
                <div className='stagger-children space-y-3'>
                    {posts.map((post) => (
                        <div key={post._id} className='glass-card surface-interactive flex items-center justify-between gap-4 rounded-2xl p-4'>
                            <div className='min-w-0 flex-1'>
                                <div className='flex items-center gap-2'>
                                    <h3 className='truncate font-semibold text-[var(--ink)]'>{post.title}</h3>
                                    {post.type === 'CASE_STUDY' && (
                                        <span className='inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--accent-2)]/20 bg-[var(--accent-2)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-2)]'>
                                            <BookOpenCheck className='h-3 w-3' /> Case Study
                                        </span>
                                    )}
                                </div>
                                <p className='text-xs text-[var(--ink-soft)]'>
                                    {(post.tags || []).join(' · ')} · {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className='flex shrink-0 items-center gap-2'>
                                <button
                                    onClick={() => togglePublish(post)}
                                    className={`focus-ring button-pop flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${post.status === 'PUBLISHED'
                                        ? 'border-emerald-600/20 bg-emerald-600/10 text-emerald-600'
                                        : 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink-soft)]'
                                        }`}
                                >
                                    {post.status === 'PUBLISHED' ? <><Eye className='h-3 w-3' /> Published</> : <><EyeOff className='h-3 w-3' /> Draft</>}
                                </button>
                                <button onClick={() => handleEdit(post)} className='focus-ring button-pop rounded-full border border-[var(--line)] bg-[var(--surface)] p-2 text-[var(--ink-soft)] hover:text-[var(--accent-2)]'>
                                    <Edit className='h-4 w-4' />
                                </button>
                                <button onClick={() => handleDelete(post._id)} className='focus-ring button-pop rounded-full border border-[var(--line)] bg-[var(--surface)] p-2 text-[var(--ink-soft)] hover:text-[var(--accent)]'>
                                    <Trash2 className='h-4 w-4' />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default BlogAdmin
