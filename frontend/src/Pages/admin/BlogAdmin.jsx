import { useEffect, useState } from 'react'
import { Edit, Eye, EyeOff, PenSquare, Plus, Trash2, X } from 'lucide-react'
import { createPost, deletePost, getPosts, updatePost } from '../../api/blog'

const BlogAdmin = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState({
        title: '', content: '', excerpt: '', tags: '', published: false, featuredImage: '',
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
        setForm({ title: '', content: '', excerpt: '', tags: '', published: false, featuredImage: '' })
        setEditingId(null)
        setShowForm(false)
    }

    const handleEdit = (post) => {
        setForm({
            title: post.title,
            content: post.content,
            excerpt: post.excerpt || '',
            tags: (post.tags || []).join(', '),
            published: post.published,
            featuredImage: post.featuredImage || '',
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
            await updatePost(post._id, { published: !post.published })
            fetchAll()
        } catch {
            // no-op
        }
    }

    const inputClass = 'w-full rounded-2xl border border-black/10 bg-white/90 px-4 py-3 text-[#1f2937] placeholder:text-[#748295] focus:border-[#0c7fa3]/55 focus:outline-none'

    return (
        <div className='space-y-5'>
            <div className='glass-card enter-fade flex flex-wrap items-center justify-between gap-3 rounded-3xl p-5 md:p-6'>
                <div>
                    <h1 className='font-nevera text-3xl tracking-[0.08em] text-[#152132]'>Blog Posts</h1>
                    <p className='mt-1 text-sm text-[#556575]'>Write, edit, and publish updates with tags and rich content.</p>
                </div>
                <button
                    onClick={() => {
                        resetForm()
                        setShowForm(true)
                    }}
                    className='focus-ring button-pop inline-flex items-center gap-2 rounded-full bg-[#ef3e2f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#d92f22]'
                >
                    <Plus className='h-4 w-4' /> New Post
                </button>
            </div>

            {showForm && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 p-4 backdrop-blur-sm'>
                    <div className='glass-card enter-fade max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl p-6'>
                        <div className='mb-6 flex items-center justify-between'>
                            <h2 className='font-nevera text-2xl tracking-[0.06em] text-[#182335]'>{editingId ? 'Edit Post' : 'New Post'}</h2>
                            <button onClick={resetForm} className='focus-ring button-pop rounded-full border border-black/10 bg-white/80 p-2 text-[#4e5d6d] hover:text-[#ef3e2f]'>
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
                                <label className='mb-2 block text-sm font-semibold text-[#475767]'>Content (HTML supported)</label>
                                <textarea
                                    placeholder='Write your post content here... HTML tags like <h2>, <p>, <code> are supported.'
                                    value={form.content}
                                    onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
                                    required
                                    rows={12}
                                    className='focus-ring w-full resize-none rounded-2xl border border-black/10 bg-white/90 px-4 py-3 font-mono text-sm text-[#1f2937] placeholder:text-[#748295] focus:border-[#0c7fa3]/55 focus:outline-none'
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
                                placeholder='Featured Image URL'
                                value={form.featuredImage}
                                onChange={(event) => setForm((prev) => ({ ...prev, featuredImage: event.target.value }))}
                                className={`${inputClass} focus-ring`}
                            />
                            <label className='surface-interactive flex cursor-pointer items-center gap-3 rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm font-semibold text-[#475767]'>
                                <input
                                    type='checkbox'
                                    checked={form.published}
                                    onChange={(event) => setForm((prev) => ({ ...prev, published: event.target.checked }))}
                                    className='h-4 w-4 accent-[#ef3e2f]'
                                />
                                Publish immediately
                            </label>
                            <button type='submit' className='focus-ring button-pop w-full rounded-full bg-[#ef3e2f] py-3 text-sm font-bold uppercase tracking-[0.12em] text-white hover:bg-[#d92f22]'>
                                {editingId ? 'Update Post' : 'Create Post'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div className='glass-card rounded-2xl py-14'>
                    <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#ef3e2f]/30 border-t-[#ef3e2f]'></div>
                </div>
            ) : posts.length === 0 ? (
                <div className='glass-card rounded-2xl py-16 text-center'>
                    <PenSquare className='mx-auto h-8 w-8 text-[#0c7fa3]' />
                    <p className='mt-2 text-[#5b6978]'>No blog posts yet.</p>
                </div>
            ) : (
                <div className='stagger-children space-y-3'>
                    {posts.map((post) => (
                        <div key={post._id} className='glass-card surface-interactive flex items-center justify-between gap-4 rounded-2xl p-4'>
                            <div className='min-w-0 flex-1'>
                                <h3 className='truncate font-semibold text-[#1d2838]'>{post.title}</h3>
                                <p className='text-xs text-[#667587]'>
                                    {(post.tags || []).join(' · ')} · {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className='flex shrink-0 items-center gap-2'>
                                <button
                                    onClick={() => togglePublish(post)}
                                    className={`focus-ring button-pop flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${post.published
                                        ? 'border-emerald-600/20 bg-emerald-600/10 text-emerald-600'
                                        : 'border-black/10 bg-white/70 text-[#5d6a79]'
                                        }`}
                                >
                                    {post.published ? <><Eye className='h-3 w-3' /> Published</> : <><EyeOff className='h-3 w-3' /> Draft</>}
                                </button>
                                <button onClick={() => handleEdit(post)} className='focus-ring button-pop rounded-full border border-black/10 bg-white/80 p-2 text-[#4f5f6f] hover:text-[#0c7fa3]'>
                                    <Edit className='h-4 w-4' />
                                </button>
                                <button onClick={() => handleDelete(post._id)} className='focus-ring button-pop rounded-full border border-black/10 bg-white/80 p-2 text-[#4f5f6f] hover:text-[#ef3e2f]'>
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
