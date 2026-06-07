import { useEffect, useState, useMemo } from 'react'
import { BookOpenCheck, Edit, Eye, EyeOff, PenSquare, Plus, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react'
import { createPost, deletePost, getPosts, updatePost } from '../../api/blog'

const BlogAdmin = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [sections, setSections] = useState({ seo: false, advanced: false })
    const [form, setForm] = useState({
        title: '', slug: '', content: '', excerpt: '', tags: '', status: 'DRAFT', type: 'ARTICLE', coverImage: '', author: 'Admin',
        seoTitle: '', seoDescription: '', canonicalUrl: '', category: '', featured: false
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
        setForm({ title: '', slug: '', content: '', excerpt: '', tags: '', status: 'DRAFT', type: 'ARTICLE', coverImage: '', author: 'Admin', seoTitle: '', seoDescription: '', canonicalUrl: '', category: '', featured: false })
        setEditingId(null)
        setShowForm(false)
        setSections({ seo: false, advanced: false })
    }

    const handleEdit = (post) => {
        setForm({
            title: post.title || '',
            slug: post.slug || '',
            content: post.content || '',
            excerpt: post.excerpt || '',
            tags: (post.tags || []).join(', '),
            status: post.status || 'DRAFT',
            type: post.type || 'ARTICLE',
            coverImage: post.coverImage || '',
            author: post.author || 'Admin',
            seoTitle: post.seoTitle || '',
            seoDescription: post.seoDescription || '',
            canonicalUrl: post.canonicalUrl || '',
            category: post.category || '',
            featured: post.featured || false,
        })
        setEditingId(post._id)
        setShowForm(true)
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setForm((prev) => {
            const updated = { ...prev, [name]: val };
            if (name === 'title' && !editingId) {
                updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }
            return updated;
        });
    };

    const wordCount = useMemo(() => form.content.trim().split(/\s+/).filter(Boolean).length, [form.content]);
    const readingTime = Math.ceil(wordCount / 200) || 1;

    const handleSubmit = async (event) => {
        event.preventDefault()
        const payload = {
            ...form,
            tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
            readingTime
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
            // ignore error
        }
    }

    const togglePublish = async (post) => {
        try {
            await updatePost(post._id, { status: post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' })
            fetchAll()
        } catch {
            // ignore error
        }
    }

    const inputClass = 'w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]'

    return (
        <div className='space-y-5'>
            <div className='glass-card enter-fade flex flex-wrap items-center justify-between gap-3 rounded-3xl p-5 md:p-6'>
                <div>
                    <h1 className='font-nevera text-3xl tracking-[0.08em] text-[var(--ink)]'>Blog Posts</h1>
                    <p className='mt-1 text-sm text-[var(--ink-soft)]'>Write, edit, and publish updates with tags and rich content.</p>
                </div>
                <button onClick={() => { resetForm(); setShowForm(true) }} className='focus-ring button-pop inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:brightness-110'>
                    <Plus className='h-4 w-4' /> New Post
                </button>
            </div>

            {showForm && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/45 p-4 backdrop-blur-sm'>
                    <div className='glass-card enter-fade max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[30px] p-6 md:p-8'>
                        <div className='mb-6 flex items-center justify-between border-b border-[var(--line)] pb-4'>
                            <h2 className='font-nevera text-2xl tracking-[0.06em] text-[var(--ink)]'>{editingId ? 'Edit Post' : 'Create New Post'}</h2>
                            <button onClick={resetForm} className='focus-ring button-pop rounded-full border border-[var(--line)] bg-[var(--surface)] p-2 text-[var(--ink-soft)] hover:text-[var(--accent)]'>
                                <X className='h-5 w-5' />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className='grid gap-8 lg:grid-cols-3'>
                            <div className='space-y-6 lg:col-span-2'>
                                <div>
                                    <label className='mb-2 block text-sm font-semibold text-[var(--ink)]'>Post Title *</label>
                                    <input type='text' name='title' required value={form.title} onChange={handleChange} className={inputClass} placeholder='Enter post title' />
                                </div>
                                <div>
                                    <label className='mb-2 block text-sm font-semibold text-[var(--ink)]'>Excerpt (short summary)</label>
                                    <input type='text' name='excerpt' value={form.excerpt} onChange={handleChange} className={inputClass} placeholder='Optional short summary' />
                                </div>
                                <div>
                                    <label className='mb-2 block text-sm font-semibold text-[var(--ink)]'>Content (HTML supported) *</label>
                                    <textarea name='content' required rows='12' value={form.content} onChange={handleChange} className={`${inputClass} font-mono resize-y`} placeholder='Write your post content here... HTML tags like <h2>, <p>, <code> are supported.' />
                                    <p className='mt-2 text-xs font-medium text-[var(--ink-soft)]'>
                                        {wordCount} words &bull; ~{readingTime} min read
                                    </p>
                                </div>

                                <div className='rounded-xl border border-[var(--line)] bg-[var(--surface)] overflow-hidden'>
                                    <button type='button' onClick={() => setSections(p => ({ ...p, seo: !p.seo }))} className='flex w-full items-center justify-between bg-[var(--surface)] px-5 py-4 text-left font-semibold text-[var(--ink)] hover:bg-[var(--line)]/30 transition'>
                                        SEO Settings
                                        {sections.seo ? <ChevronUp className='h-5 w-5' /> : <ChevronDown className='h-5 w-5' />}
                                    </button>
                                    {sections.seo && (
                                        <div className='space-y-4 p-5 border-t border-[var(--line)]'>
                                            <div>
                                                <label className='mb-1.5 block text-sm font-medium text-[var(--ink)]'>URL Slug</label>
                                                <input type='text' name='slug' value={form.slug} onChange={handleChange} className={inputClass} placeholder='auto-generated-slug' />
                                            </div>
                                            <div>
                                                <label className='mb-1.5 block text-sm font-medium text-[var(--ink)]'>SEO Title</label>
                                                <input type='text' name='seoTitle' value={form.seoTitle} onChange={handleChange} className={inputClass} placeholder={form.title} />
                                            </div>
                                            <div>
                                                <div className='mb-1.5 flex justify-between'>
                                                    <label className='text-sm font-medium text-[var(--ink)]'>Meta Description</label>
                                                    <span className={`text-xs font-medium ${form.seoDescription.length > 160 ? 'text-red-500' : 'text-[var(--ink-soft)]'}`}>
                                                        {form.seoDescription.length} / 160
                                                    </span>
                                                </div>
                                                <textarea name='seoDescription' rows='3' value={form.seoDescription} onChange={handleChange} className={`${inputClass} resize-none`} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className='rounded-xl border border-[var(--line)] bg-[var(--surface)] overflow-hidden'>
                                    <button type='button' onClick={() => setSections(p => ({ ...p, advanced: !p.advanced }))} className='flex w-full items-center justify-between bg-[var(--surface)] px-5 py-4 text-left font-semibold text-[var(--ink)] hover:bg-[var(--line)]/30 transition'>
                                        Advanced Settings
                                        {sections.advanced ? <ChevronUp className='h-5 w-5' /> : <ChevronDown className='h-5 w-5' />}
                                    </button>
                                    {sections.advanced && (
                                        <div className='space-y-4 p-5 border-t border-[var(--line)]'>
                                            <div>
                                                <label className='mb-1.5 block text-sm font-medium text-[var(--ink)]'>Canonical URL</label>
                                                <input type='url' name='canonicalUrl' value={form.canonicalUrl} onChange={handleChange} className={inputClass} placeholder='https://example.com/original-post' />
                                                <p className='mt-1 text-xs text-[var(--ink-soft)]'>Optional: Used if this content was published elsewhere first.</p>
                                            </div>
                                            <div>
                                                <label className='mb-1.5 block text-sm font-medium text-[var(--ink)]'>Cover Image URL</label>
                                                <input type='url' name='coverImage' value={form.coverImage} onChange={handleChange} className={inputClass} placeholder='https://...' />
                                            </div>
                                            <div>
                                                <label className='mb-1.5 block text-sm font-medium text-[var(--ink)]'>Tags (comma-separated)</label>
                                                <input type='text' name='tags' value={form.tags} onChange={handleChange} className={inputClass} placeholder='react, architecture, design' />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className='space-y-6'>
                                <div className='rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5'>
                                    <h3 className='mb-4 font-semibold text-[var(--ink)] border-b border-[var(--line)] pb-3'>Publishing</h3>
                                    
                                    <div className='space-y-4'>
                                        <div>
                                            <label className='mb-1.5 block text-sm font-medium text-[var(--ink-soft)]'>Status</label>
                                            <select name='status' value={form.status} onChange={handleChange} className={`${inputClass} bg-transparent py-2`}>
                                                <option value='DRAFT'>Draft</option>
                                                <option value='REVIEW'>Ready for Review</option>
                                                <option value='PUBLISHED'>Published</option>
                                                <option value='ARCHIVED'>Archived</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className='mb-1.5 block text-sm font-medium text-[var(--ink-soft)]'>Post Type</label>
                                            <select name='type' value={form.type} onChange={handleChange} className={`${inputClass} bg-transparent py-2`}>
                                                <option value='ARTICLE'>Article</option>
                                                <option value='BLOG'>Blog</option>
                                                <option value='CASE_STUDY'>Case Study</option>
                                                <option value='NOTE'>Note</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className='mb-1.5 block text-sm font-medium text-[var(--ink-soft)]'>Category</label>
                                            <select name='category' value={form.category} onChange={handleChange} className={`${inputClass} bg-transparent py-2`}>
                                                <option value=''>Select Category</option>
                                                <option value='engineering'>Engineering</option>
                                                <option value='design'>Design</option>
                                                <option value='product'>Product</option>
                                                <option value='tutorial'>Tutorial</option>
                                            </select>
                                        </div>

                                        <label className='flex items-center gap-3 pt-2 cursor-pointer'>
                                            <input type='checkbox' name='featured' checked={form.featured} onChange={handleChange} className='h-4 w-4 rounded border-[var(--line)] bg-[var(--surface)] accent-[var(--accent)]' />
                                            <span className='text-sm font-medium text-[var(--ink)]'>Feature this post</span>
                                        </label>
                                    </div>

                                    <div className='mt-6 pt-5 border-t border-[var(--line)]'>
                                        <button type='submit' className='focus-ring button-pop w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-bold tracking-wide text-white hover:brightness-110'>
                                            {editingId ? 'Save Changes' : 'Publish Post'}
                                        </button>
                                    </div>
                                </div>
                            </div>
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
                                    {post.featured && (
                                        <span className='inline-flex shrink-0 items-center gap-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-yellow-600'>
                                            Featured
                                        </span>
                                    )}
                                </div>
                                <p className='text-xs text-[var(--ink-soft)]'>
                                    {(post.tags || []).join(' · ')} · {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className='flex shrink-0 items-center gap-2'>
                                <button onClick={() => togglePublish(post)} className={`focus-ring button-pop flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${post.status === 'PUBLISHED' ? 'border-emerald-600/20 bg-emerald-600/10 text-emerald-600' : 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink-soft)]'}`}>
                                    {post.status === 'PUBLISHED' ? <><Eye className='h-3 w-3' /> Published</> : <><EyeOff className='h-3 w-3' /> {post.status}</>}
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
