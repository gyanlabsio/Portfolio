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

      <section className='mb-24 border-b border-[var(--line)] pb-16'>
        <div className='px-6 md:px-10 lg:px-16'>
          <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
            <div>
              <p className='mb-4 text-xs font-bold uppercase tracking-widest text-[var(--ink)]'>
                Case Studies
              </p>
              <h1 className='text-6xl font-black uppercase tracking-tighter text-[var(--ink)] md:text-8xl'>
                <SplitText text='Projects' delay={0.2} />
              </h1>
            </div>

            <div className='text-sm font-bold uppercase tracking-widest text-[var(--ink-soft)]'>
              <p className='text-[var(--ink)]'>{projects.length || 0} builds</p>
              <p>shipped</p>
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
          <div className=' rounded-none p-10 text-center'>
            <Code2 className='mx-auto h-12 w-12 text-[var(--accent)]' />
            <h3 className='display-title mt-4 text-3xl text-[var(--ink)]'>Coming Soon</h3>
            <p className='mx-auto mt-3 max-w-lg text-[var(--ink-soft)]'>
              New projects are being prepared right now. This gallery will update as soon as fresh builds are ready.
            </p>
          </div>
        )}

        {!loading && projects.length > 0 && (
          <div className='grid grid-cols-1 gap-16 px-6 md:px-10 lg:px-16'>
            {projects.map((project) => (
              <Link
                to={`/project/${project.slug}`}
                key={project._id}
                className='group block focus:outline-none'
              >
                <div className='grid lg:grid-cols-2 gap-8 lg:gap-16 items-center'>
                  {project.coverImage && (
                    <div className='relative w-full overflow-hidden border border-[var(--line)]'>
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className='w-full object-cover transition duration-700 group-hover:scale-105'
                      />
                    </div>
                  )}

                  <div className='flex flex-col gap-6'>
                    <h3 className='text-4xl font-black uppercase tracking-tighter text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors md:text-5xl'>
                      {project.title}
                    </h3>

                    <p className='text-base font-light leading-relaxed text-[var(--ink-soft)] max-w-xl'>
                      {project.description}
                    </p>

                    {project.techStack && project.techStack.length > 0 && (
                      <div className='flex flex-wrap gap-2'>
                        {project.techStack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className='border border-[var(--line)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--ink)]'
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
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
