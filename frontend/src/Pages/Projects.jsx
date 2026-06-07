import { useState, useEffect } from 'react'
import { Code2, ExternalLink, Github, Layers3, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import SEO from '../components/SEO'
import { getProjects } from '../api/projects'
import SplitText from '../components/effects/SplitText'
import Loader from '../components/Loader'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await getProjects()
        setProjects(data.data || [])
      } catch (err) {
        console.error('Failed to load projects', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  return (
    <main className='pb-16 pt-8 md:pt-12'>
      <SEO title='Projects' description='Featured projects built with modern web technologies and product intent.' />

      <section className='section-wrap enter-fade'>
        <div className='relative overflow-hidden rounded-[32px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.16)] md:p-10'>
          <div className='pointer-events-none absolute -left-14 -top-14 h-44 w-44 rounded-full bg-[var(--accent-2)]/20 blur-3xl' />
          <div className='pointer-events-none absolute -right-14 bottom-0 h-44 w-44 rounded-full bg-[var(--accent)]/20 blur-3xl' />

          <div className='relative flex flex-wrap items-center justify-between gap-4'>
            <div>
              <div className='inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-soft)]'>
                <Sparkles className='h-3.5 w-3.5 text-[var(--accent)]' />
                Case Studies
              </div>
              <h1 className='display-title mt-3 text-4xl text-[var(--ink)] sm:text-6xl'>
                <SplitText text='Projects' delay={0.2} />
              </h1>
            </div>

            <div className='rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink-soft)]'>
              <p className='font-semibold text-[var(--ink)]'>{projects.length || 0} builds</p>
              <p>crafted and shipped</p>
            </div>
          </div>
        </div>
      </section>

      <section className='section-wrap mt-8'>
        {loading && (
          <div className='flex items-center justify-center py-20'>
            <Loader text="Loading projects..." />
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className='glass-card rounded-3xl p-10 text-center'>
            <Code2 className='mx-auto h-12 w-12 text-[var(--accent)]' />
            <h3 className='display-title mt-4 text-3xl text-[var(--ink)]'>Coming Soon</h3>
            <p className='mx-auto mt-3 max-w-lg text-[var(--ink-soft)]'>
              New projects are being prepared right now. This gallery will update as soon as fresh builds are ready.
            </p>
          </div>
        )}

        {!loading && projects.length > 0 && (
          <div className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3'>
            {projects.map((project) => (
              <Link
                to={`/project/${project.slug}`}
                key={project._id}
                className='glass-card group block enter-fade rounded-3xl p-4 md:p-5 hover:border-[var(--accent)] transition-colors'
              >
                {project.featuredImage && (
                  <div className='relative overflow-hidden rounded-2xl border border-[var(--line)]'>
                    <img
                      src={project.featuredImage}
                      alt={project.title}
                      className='h-52 w-full object-cover transition duration-500 group-hover:scale-[1.03]'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-[#111a2e99] to-transparent' />
                  </div>
                )}

                <div className='mt-4 space-y-4'>
                  <h3 className='display-title text-2xl text-[var(--ink)] group-hover:text-[var(--accent)]'>
                    {project.title}
                  </h3>

                  <p className='line-clamp-3 text-sm leading-relaxed text-[var(--ink-soft)]'>
                    {project.shortDescription || project.description}
                  </p>

                  {project.techStack && project.techStack.length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className='inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--ink)]'
                        >
                          <Layers3 className='h-3 w-3 text-[var(--accent-2)]' />
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className='flex gap-3 pt-2'>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] transition hover:-translate-y-0.5 hover:border-[var(--accent-2)] hover:text-[var(--accent-2)]'
                        aria-label={`Open ${project.title} on GitHub`}
                      >
                        <Github className='w-4 h-4' />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]'
                        aria-label={`Open live demo of ${project.title}`}
                      >
                        <ExternalLink className='w-4 h-4' />
                      </a>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Projects
