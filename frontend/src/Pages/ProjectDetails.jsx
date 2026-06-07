import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Github, Layers3 } from 'lucide-react'
import DOMPurify from 'dompurify'
import SEO from '../components/SEO'
import { getProject } from '../api/projects'
import Loader from '../components/Loader'

const ProjectDetails = () => {
    const { slug } = useParams()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const { data } = await getProject(slug)
                setProject(data.data)
            } catch (err) {
                setError(err.response?.status === 404 ? 'Project not found' : 'Failed to load project')
            } finally {
                setLoading(false)
            }
        }
        fetchProject()
    }, [slug])

    const safeDescription = useMemo(() => DOMPurify.sanitize(project?.description || ''), [project?.description])

    if (loading) {
        return <div className="min-h-screen pt-32 pb-16 section-wrap flex items-center justify-center"><Loader text="Loading project details..." /></div>
    }

    if (error || !project) {
        return (
            <div className='section-wrap flex min-h-[70vh] flex-col items-center justify-center gap-4 text-center'>
                <p className='text-lg text-[var(--ink-soft)]'>{error || 'Project not found'}</p>
                <Link to='/Projects' className='inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]'>
                    <ArrowLeft className='h-4 w-4' />
                    Back to Projects
                </Link>
            </div>
        )
    }

    return (
        <article className='pb-16 pt-8 md:pt-12'>
            <SEO title={project.title} description={project.shortDescription || project.description.substring(0, 160)} image={project.coverImage || project.featuredImage} />
            <div className='section-wrap'>
                <Link to='/Projects' className='inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--ink)] transition hover:border-[var(--accent-2)] hover:text-[var(--accent-2)]'>
                    <ArrowLeft className='h-3.5 w-3.5' />
                    Back to Projects
                </Link>

                <div className='glass-card mt-5 rounded-[30px] p-6 md:p-10'>
                    <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-6'>
                        <div>
                            <h1 className='display-title text-3xl leading-tight text-[var(--ink)] sm:text-5xl'>
                                {project.title}
                            </h1>
                            {project.category && (
                                <p className='mt-3 text-sm font-semibold uppercase tracking-wider text-[var(--accent-2)]'>
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
                                    className='inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition hover:-translate-y-0.5 hover:border-[var(--accent-2)] hover:text-[var(--accent-2)]'
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
                                    className='inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110'
                                >
                                    <ExternalLink className='h-4 w-4' />
                                    Live Demo
                                </a>
                            )}
                        </div>
                    </div>

                    {project.techStack && project.techStack.length > 0 && (
                        <div className='mt-6 flex flex-wrap gap-2'>
                            {project.techStack.map((tech) => (
                                <span key={tech} className='inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--ink)]'>
                                    <Layers3 className='h-3.5 w-3.5 text-[var(--accent)]' />
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}

                    {project.coverImage && (
                        <div className='mt-8 overflow-hidden rounded-3xl border border-[var(--line)]'>
                            <img src={project.coverImage} alt={project.title} className='w-full object-cover max-h-[500px]' />
                        </div>
                    )}

                    {/* The description acts as the full case study text */}
                    <div
                        className='prose prose-lg mt-10 max-w-none text-[var(--ink)]
              prose-headings:font-nevera prose-headings:text-[var(--ink)]
              prose-p:leading-relaxed prose-a:text-[var(--accent-2)]
              prose-strong:text-[var(--ink)] prose-code:rounded prose-code:bg-[var(--bg-alt)]
              prose-code:px-1 prose-pre:border prose-pre:border-[var(--line)] prose-pre:bg-[var(--bg-alt)] prose-pre:text-[var(--ink)]
              prose-blockquote:border-l-[var(--accent)] prose-blockquote:text-[var(--ink-soft)]'
                        dangerouslySetInnerHTML={{ __html: safeDescription }}
                    />
                </div>
            </div>
        </article>
    )
}

export default ProjectDetails
