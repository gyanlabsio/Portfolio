import { useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Github, Layers3 } from 'lucide-react'
import DOMPurify from 'dompurify'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProject, toggleProjectLike, fetchProjectComments, addProjectComment, clearProjectState } from '../store/slices/projectSlice'
import SEO from '../components/SEO'
import Loader from '../components/Loader'
import LikeButton from '../components/interactions/LikeButton'
import CommentSection from '../components/interactions/CommentSection'

const ProjectDetails = () => {
    const { slug } = useParams()
    const dispatch = useDispatch()
    const { activeProject: project, loading, error, comments, commentsLoading, commentStatus } = useSelector(state => state.project)

    useEffect(() => {
        dispatch(fetchProject(slug))
        return () => {
            dispatch(clearProjectState())
        }
    }, [slug, dispatch])

    useEffect(() => {
        if (project?._id) {
            dispatch(fetchProjectComments(project._id))
        }
    }, [project?._id, dispatch])

    const handleToggleLike = (visitorId) => {
        if (project?._id) {
            dispatch(toggleProjectLike({ id: project._id, visitorId }))
        }
    }

    const handleAddComment = (commentData) => {
        if (project?._id) {
            dispatch(addProjectComment({ projectId: project._id, ...commentData }))
        }
    }

    const safeDescription = useMemo(() => DOMPurify.sanitize(project?.description || ''), [project?.description])

    if (loading) {
        return <div className="min-h-screen pt-32 pb-16 section-wrap flex items-center justify-center"><Loader text="Loading project details..." /></div>
    }

    if (error || !project) {
        return (
            <div className='section-wrap flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center'>
                <p className='text-lg text-[var(--ink-soft)]'>{error || 'Project not found'}</p>
                <Link to='/Projects' className='inline-flex items-center gap-2 rounded-none border border-[var(--line)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]'>
                    <ArrowLeft className='h-4 w-4' />
                    Back to Projects
                </Link>
            </div>
        )
    }

    return (
        <article className='pb-16 pt-8 md:pt-12'>
            <SEO title={project.title} description={project.description?.substring(0, 160)} image={project.coverImage} />
            <div className='max-w-4xl mx-auto px-6 md:px-10'>
                <Link to='/Projects' className='inline-flex items-center gap-2 border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-white'>
                    <ArrowLeft className='h-3.5 w-3.5' />
                    Back to Projects
                </Link>

                <div className='mt-12'>
                    <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-6'>
                        <div>
                            <h1 className='text-5xl font-black uppercase tracking-tighter text-[var(--ink)] sm:text-6xl md:text-7xl'>
                                {project.title}
                            </h1>
                            {project.category && (
                                <p className='mt-4 text-xs font-bold uppercase tracking-widest text-[var(--ink-soft)]'>
                                    {project.category.replace('_', ' ')}
                                </p>
                            )}
                        </div>

                        <div className='flex items-center gap-3 shrink-0'>
                            {project.githubLink && (
                                <a
                                    href={project.githubLink}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='inline-flex items-center gap-2 border border-[var(--ink)] bg-[var(--bg)] px-4 py-3 text-xs font-bold uppercase tracking-widest text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-white'
                                >
                                    <Github className='h-4 w-4' />
                                    Source
                                </a>
                            )}
                            {project.liveLink && (
                                <a
                                    href={project.liveLink}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='inline-flex items-center gap-2 border border-[var(--accent)] bg-[var(--accent)] px-4 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--ink)] hover:border-[var(--ink)]'
                                >
                                    <ExternalLink className='h-4 w-4' />
                                    Live Demo
                                </a>
                            )}
                        </div>
                    </div>

                    {project.techStack && project.techStack.length > 0 && (
                        <div className='mt-10 flex flex-wrap gap-2'>
                            {project.techStack.map((tech) => (
                                <span key={tech} className='border border-[var(--line)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--ink)]'>
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}

                    {project.coverImage && (
                        <div className='mt-12 overflow-hidden border border-[var(--line)]'>
                            <img src={project.coverImage} alt={project.title} className='w-full object-cover max-h-[600px] grayscale' />
                        </div>
                    )}

                    {/* The description acts as the full case study text */}
                    <div
                        className='prose prose-lg mt-16 max-w-none text-[var(--ink)]
              prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-[var(--ink)]
              prose-p:font-light prose-p:leading-relaxed prose-a:text-[var(--accent)]
              prose-strong:font-bold prose-code:rounded-none prose-code:bg-[var(--bg-alt)]
              prose-code:px-1 prose-pre:rounded-none prose-pre:border prose-pre:border-[var(--line)] prose-pre:bg-[var(--bg-alt)] prose-pre:text-[var(--ink)]
              prose-blockquote:border-l-[var(--accent)] prose-blockquote:text-[var(--ink-soft)]'
                        dangerouslySetInnerHTML={{ __html: safeDescription }}
                    />
                    
                    <div className="mt-12 flex items-center justify-center border-t border-[var(--line)] pt-8">
                        <LikeButton 
                            initialLikesCount={project.likes?.length || 0}
                            initialIsLiked={project.likes?.includes(localStorage.getItem('visitorId'))}
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

export default ProjectDetails
