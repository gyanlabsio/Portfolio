import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, BookOpenCheck, Calendar, Pencil, Tag } from 'lucide-react'
import DOMPurify from 'dompurify'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBlog, toggleBlogLike, fetchBlogComments, addBlogComment, clearBlogState } from '../store/slices/blogSlice'
import SEO from '../components/SEO'
import Loader from '../components/Loader'
import LikeButton from '../components/interactions/LikeButton'
import CommentSection from '../components/interactions/CommentSection'

const BlogPost = () => {
    const { slug } = useParams()
    const dispatch = useDispatch()
    const { activeBlog: post, loading, error, comments, commentsLoading, commentStatus } = useSelector(state => state.blog)

    useEffect(() => {
        dispatch(fetchBlog(slug))
        return () => {
            dispatch(clearBlogState())
        }
    }, [slug, dispatch])

    useEffect(() => {
        if (post?._id) {
            dispatch(fetchBlogComments(post._id))
        }
    }, [post?._id, dispatch])

    const handleToggleLike = (visitorId) => {
        if (post?._id) {
            dispatch(toggleBlogLike({ id: post._id, visitorId }))
        }
    }

    const handleAddComment = (commentData) => {
        if (post?._id) {
            dispatch(addBlogComment({ contentId: post._id, ...commentData }))
        }
    }

    const safeContent = useMemo(() => DOMPurify.sanitize(post?.content || ''), [post?.content])

    if (loading) {
        return (
            <div className='section-wrap flex min-h-[60vh] items-center justify-center pt-16'>
                <Loader text="Loading post details..." />
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
            <SEO title={post.seoTitle || post.title} description={post.seoDescription || post.excerpt} image={post.coverImage} url={post.canonicalUrl} />
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
                        {post.readingTime && (
                            <span className='inline-flex items-center gap-1.5'>
                                &bull; ~{post.readingTime} min read
                            </span>
                        )}
                        {post.category && (
                            <span className='inline-flex items-center gap-1.5'>
                                &bull; {post.category}
                            </span>
                        )}
                        <span className='inline-flex items-center gap-1.5'>
                            <Pencil className='h-3.5 w-3.5' />
                            {post.author || 'Admin'}
                        </span>
                        {post.type === 'CASE_STUDY' && (
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

                    {post.coverImage && (
                        <div className='mt-8 overflow-hidden rounded-3xl border border-[var(--line)]'>
                            <img src={post.coverImage} alt={post.title} className='max-h-[440px] w-full object-cover' />
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
                    
                    <div className="mt-12 flex items-center justify-center border-t border-[var(--line)] pt-8">
                        <LikeButton 
                            initialLikesCount={post.likes?.length || 0}
                            initialIsLiked={post.likes?.includes(localStorage.getItem('visitorId'))}
                            onToggleLike={handleToggleLike} 
                        />
                    </div>

                    <CommentSection 
                        comments={comments} 
                        commentsLoading={commentsLoading} 
                        onAddComment={handleAddComment} 
                        commentStatus={commentStatus} 
                    />
                </div>
            </div>
        </article>
    )
}

export default BlogPost
