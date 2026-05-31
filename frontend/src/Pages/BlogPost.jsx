import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, BookOpenCheck, Calendar, Pencil, Tag } from 'lucide-react'
import DOMPurify from 'dompurify'
import SEO from '../components/SEO'
import { getPost } from '../api/blog'

const BlogPost = () => {
    const { slug } = useParams()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await getPost(slug)
                setPost(data.data)
            } catch (err) {
                setError(err.response?.status === 404 ? 'Post not found' : 'Failed to load post')
            } finally {
                setLoading(false)
            }
        }
        fetchPost()
    }, [slug])

    const safeContent = useMemo(() => DOMPurify.sanitize(post?.content || ''), [post?.content])

    if (loading) {
        return (
            <div className='section-wrap flex min-h-[60vh] items-center justify-center pt-16'>
                <div className='h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]'></div>
            </div>
        )
    }

    if (error || !post) {
        return (
            <div className='section-wrap flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center'>
                <p className='text-lg text-[var(--ink-soft)]'>{error || 'Post not found'}</p>
                <Link to='/Blog' className='inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]'>
                    <ArrowLeft className='h-4 w-4' />
                    Back to Blog
                </Link>
            </div>
        )
    }

    return (
        <article className='pb-16 pt-8 md:pt-12'>
            <SEO title={post.title} description={post.excerpt} image={post.featuredImage} />
            <div className='section-wrap'>
                <Link to='/Blog' className='inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink)] transition hover:border-[var(--accent-2)] hover:text-[var(--accent-2)]'>
                    <ArrowLeft className='h-3.5 w-3.5' />
                    Back to Blog
                </Link>

                <div className='glass-card mt-5 rounded-[30px] p-6 md:p-10'>
                    <h1 className='display-title text-3xl leading-tight text-[var(--ink)] sm:text-5xl'>
                        {post.title}
                    </h1>

                    <div className='mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[0.09em] text-[var(--ink-soft)]'>
                        <span className='inline-flex items-center gap-1.5'>
                            <Calendar className='h-3.5 w-3.5' />
                            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className='inline-flex items-center gap-1.5'>
                            <Pencil className='h-3.5 w-3.5' />
                            {post.author}
                        </span>
                        {post.isCaseStudy && (
                            <span className='inline-flex items-center gap-1.5 rounded-full border border-[var(--accent-2)]/20 bg-[var(--accent-2)]/10 px-2.5 py-1 text-[10px] font-bold text-[var(--accent-2)]'>
                                <BookOpenCheck className='h-3.5 w-3.5' /> Case Study
                            </span>
                        )}
                    </div>

                    {post.tags && post.tags.length > 0 && (
                        <div className='mt-5 flex flex-wrap gap-2'>
                            {post.tags.map((tag) => (
                                <span key={tag} className='inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--ink)]'>
                                    <Tag className='h-3 w-3' />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {post.featuredImage && (
                        <div className='mt-8 overflow-hidden rounded-3xl border border-[var(--line)]'>
                            <img src={post.featuredImage} alt={post.title} className='max-h-[440px] w-full object-cover' />
                        </div>
                    )}

                    <div
                        className='prose prose-lg mt-10 max-w-none text-[var(--ink)]
              prose-headings:font-nevera prose-headings:text-[var(--ink)]
              prose-p:leading-relaxed prose-a:text-[var(--accent-2)]
              prose-strong:text-[var(--ink)] prose-code:rounded prose-code:bg-[var(--bg-alt)]
              prose-code:px-1 prose-pre:border prose-pre:border-[var(--line)] prose-pre:bg-[var(--bg-alt)] prose-pre:text-[var(--ink)]
              prose-blockquote:border-l-[var(--accent)] prose-blockquote:text-[var(--ink-soft)]'
                        dangerouslySetInnerHTML={{ __html: safeContent }}
                    />
                </div>
            </div>
        </article>
    )
}

export default BlogPost
