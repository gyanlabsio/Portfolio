import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock3, Sparkles } from 'lucide-react'
import SEO from '../components/SEO'
import { getSiteConfig } from '../api/admin'
import { getFeaturedProjects } from '../api/projects'
import { getPosts } from '../api/blog'
import SplitText from '../components/effects/SplitText'
import BlurText from '../components/effects/BlurText'
import ShinyText from '../components/effects/ShinyText'

const Home = () => {
  const [config, setConfig] = useState(null)
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [latestPosts, setLatestPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [configRes, projectsRes, postsRes] = await Promise.allSettled([
          getSiteConfig(),
          getFeaturedProjects(),
          getPosts(),
        ])

        if (configRes.status === 'fulfilled') setConfig(configRes.value.data.data)
        if (projectsRes.status === 'fulfilled') setFeaturedProjects(projectsRes.value.data.data || [])
        if (postsRes.status === 'fulfilled') setLatestPosts((postsRes.value.data.data || []).slice(0, 3))
      } catch (err) {
        console.error('Failed to load home data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchHomeData()
  }, [])

  const heroTitle = config?.heroTitle || 'GYANARANJAN DAS'
  const heroSubtitle = config?.heroSubtitle || 'Full-stack developer building digital products with strong visual identity.'

  return (
    <main className='pt-8 pb-16 md:pt-14'>
      <SEO title='Home' description='Full-stack portfolio with immersive interfaces, product thinking, and robust engineering.' />

      <section className='section-wrap enter-fade'>
        <div className='relative overflow-hidden rounded-[34px] border border-white/60 bg-gradient-to-br from-white/90 via-[#f2eee5]/90 to-[#ebe6db]/90 p-6 shadow-[0_24px_80px_rgba(18,23,32,0.16)] md:p-10'>
          <div className='pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-[#ef3e2f]/20 blur-3xl' />
          <div className='pointer-events-none absolute -left-10 bottom-0 h-44 w-44 rounded-full bg-[#0c7fa3]/20 blur-3xl' />

          <div className='relative grid gap-10 lg:grid-cols-[1.35fr_0.9fr]'>
            <div className='space-y-6'>
              <div className='inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#415064]'>
                <Sparkles className='h-3.5 w-3.5 text-[#ef3e2f]' />
                Design + Engineering
              </div>

              <h1 className='display-title text-4xl text-[#142032] sm:text-6xl md:text-7xl'>
                <SplitText text={heroTitle} delay={0.2} />
              </h1>

              <p className='max-w-xl text-base leading-relaxed text-[#405063] md:text-lg'>
                <BlurText text={heroSubtitle} delay={0.8} />
              </p>

              <div className='stagger-children flex flex-wrap gap-3'>
                <Link to='/Projects' className='focus-ring button-pop inline-flex items-center gap-2 rounded-full bg-[#ef3e2f] px-5 py-3 text-sm font-semibold text-white hover:bg-[#dd2f21]'>
                  Explore Projects
                  <ArrowUpRight className='h-4 w-4' />
                </Link>
                <Link to='/Contact' className='focus-ring button-pop inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/75 px-5 py-3 text-sm font-semibold text-[#1d2838] hover:border-[#0c7fa3]/45 hover:text-[#0c7fa3]'>
                  Start a Conversation
                </Link>
              </div>
            </div>

            <aside className='glass-card float-y surface-interactive rounded-3xl p-5 md:p-6'>
              <p className='text-xs uppercase tracking-[0.2em] text-[#5a6776]'>
                <ShinyText text="Now Building" speed={3} />
              </p>
              <p className='mt-3 text-lg font-semibold text-[#172132]'>
                Scalable web experiences with narrative UI, robust APIs, and polished admin tooling.
              </p>
              <div className='mt-6 grid grid-cols-2 gap-3 text-sm'>
                <div className='rounded-2xl border border-black/10 bg-white/70 p-3'>
                  <p className='text-2xl font-bold text-[#ef3e2f]'>{featuredProjects.length || '--'}</p>
                  <p className='ink-soft'>featured builds</p>
                </div>
                <div className='rounded-2xl border border-black/10 bg-white/70 p-3'>
                  <p className='text-2xl font-bold text-[#0c7fa3]'>{latestPosts.length || '--'}</p>
                  <p className='ink-soft'>latest insights</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className='section-wrap mt-10 grid gap-6 lg:grid-cols-2'>
        <article className='glass-card surface-interactive rounded-3xl p-6 md:p-8'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='display-title text-3xl text-[#1b2636] md:text-4xl'>Featured Work</h2>
            <Link to='/Projects' className='focus-ring rounded-lg px-1 py-0.5 text-sm font-semibold text-[#0c7fa3] hover:text-[#075c76]'>See all</Link>
          </div>

          {loading ? (
            <p className='ink-soft'>Loading highlighted projects...</p>
          ) : featuredProjects.length === 0 ? (
            <p className='ink-soft'>New case studies are in progress. Check back shortly.</p>
          ) : (
            <div className='space-y-3'>
              {featuredProjects.slice(0, 3).map((project) => (
                <Link key={project._id} to='/Projects' className='group surface-interactive focus-ring block rounded-2xl border border-black/10 bg-white/70 p-4 hover:border-[#ef3e2f]/35'>
                  <p className='text-base font-semibold text-[#192336] group-hover:text-[#ef3e2f]'>{project.title}</p>
                  <p className='mt-1 text-sm leading-relaxed text-[#4f5a67]'>{project.shortDescription || project.description}</p>
                </Link>
              ))}
            </div>
          )}
        </article>

        <article className='glass-card surface-interactive rounded-3xl p-6 md:p-8'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='display-title text-3xl text-[#1b2636] md:text-4xl'>Latest Writing</h2>
            <Link to='/Blog' className='focus-ring rounded-lg px-1 py-0.5 text-sm font-semibold text-[#0c7fa3] hover:text-[#075c76]'>Read all</Link>
          </div>

          {loading ? (
            <p className='ink-soft'>Loading latest posts...</p>
          ) : latestPosts.length === 0 ? (
            <p className='ink-soft'>Thought pieces are coming soon.</p>
          ) : (
            <div className='space-y-3'>
              {latestPosts.map((post) => (
                <Link key={post._id} to={`/blog/${post.slug}`} className='group surface-interactive focus-ring block rounded-2xl border border-black/10 bg-white/70 p-4 hover:border-[#0c7fa3]/35'>
                  <p className='text-base font-semibold text-[#192336] group-hover:text-[#0c7fa3]'>{post.title}</p>
                  <p className='mt-1 line-clamp-2 text-sm text-[#4f5a67]'>{post.excerpt}</p>
                  <p className='mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.1em] text-[#6a7685]'>
                    <Clock3 className='h-3 w-3' />
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  )
}

export default Home
