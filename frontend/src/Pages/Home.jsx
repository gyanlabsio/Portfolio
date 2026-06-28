import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock3, Sparkles, ArrowRight, Download, Github, Linkedin, Mail, Twitter, ChevronRight, ChevronLeft } from 'lucide-react'
import SEO from '../components/SEO'
import { getSettings } from '../api/settings'
import { getServices } from '../api/service'
import { getFeaturedTestimonials } from '../api/testimonial'
import { getFeaturedProjects } from '../api/projects'
import { getPosts } from '../api/blog'
import SplitText from '../components/effects/SplitText'
import BlurText from '../components/effects/BlurText'
import ShinyText from '../components/effects/ShinyText'
import Loader from '../components/Loader'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const Home = () => {
  const [config, setConfig] = useState(null)
  const [services, setServices] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [latestPosts, setLatestPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeDomain, setActiveDomain] = useState(null)

  // Extract unique domains
  const domains = [...new Set(services.map(s => s.domain || 'Web Development'))]

  const servicesRef = useRef(null)
  const servicesContainerRef = useRef(null)
  const domainGridRef = useRef(null)

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [configRes, servicesRes, testRes, projectsRes, postsRes] = await Promise.allSettled([
          getSettings(),
          getServices(),
          getFeaturedTestimonials(),
          getFeaturedProjects(),
          getPosts(),
        ])

        if (configRes.status === 'fulfilled') setConfig(configRes.value.data.data)
        if (servicesRes.status === 'fulfilled') setServices(servicesRes.value.data.data || [])
        if (testRes.status === 'fulfilled') setTestimonials(testRes.value.data.data || [])
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

  const heroTitle = config?.siteTitle || 'GYANARANJAN DAS'
  const heroTagline = config?.tagline || 'Full-stack developer building digital products with strong visual identity.'
  const heroDescription = config?.description || ''

  // Toggles
  const showProjects = config?.homepageSections?.projects !== false;
  const showServices = config?.homepageSections?.services !== false;
  const showTestimonials = config?.homepageSections?.testimonials !== false;
  const showContent = config?.homepageSections?.content !== false;

  return (
    <main className='pt-8 pb-16 md:pt-14'>
      <SEO title='Home' description='Full-stack portfolio with immersive interfaces, product thinking, and robust engineering.' />

      <section className='section-wrap enter-fade'>
        <div className='relative overflow-hidden rounded-[34px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.16)] md:p-10'>
          <div className='pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-[var(--accent)]/20 blur-3xl' />
          <div className='pointer-events-none absolute -left-10 bottom-0 h-44 w-44 rounded-full bg-[var(--accent-2)]/20 blur-3xl' />

          <div className='relative grid gap-10 lg:grid-cols-[1.35fr_0.9fr]'>
            <div className='space-y-6'>
              <div className='inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]'>
                <Sparkles className='h-3.5 w-3.5 text-[var(--accent)]' />
                {config?.heroBadge || 'Design + Engineering'}
              </div>

              <h1 className='display-title text-3xl text-[var(--ink)] sm:text-4xl md:text-5xl'>
                <SplitText text={heroTitle} delay={0.2} />
              </h1>

              <p className='max-w-xl text-lg font-medium leading-relaxed text-[var(--ink)] md:text-xl'>
                <BlurText text={heroTagline} delay={0.6} />
              </p>

              {heroDescription && (
                <p className='max-w-xl text-base leading-relaxed text-[var(--ink-soft)]'>
                  <BlurText text={heroDescription} delay={0.8} />
                </p>
              )}

              <div className='stagger-children flex flex-wrap gap-3'>
                <Link to='/Projects' className='focus-ring button-pop inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white hover:brightness-110'>
                  Explore Projects
                  <ArrowUpRight className='h-4 w-4' />
                </Link>
                <Link to='/Contact' className='focus-ring button-pop inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--ink)] hover:border-[var(--accent-2)] hover:text-[var(--accent-2)]'>
                  Start a Conversation
                </Link>
              </div>
            </div>

            <aside className='glass-card float-y surface-interactive rounded-3xl p-5 md:p-6'>
              <p className='text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]'>
                <ShinyText text="Now Building" speed={3} />
              </p>
              <p className='mt-3 text-lg font-semibold text-[var(--ink)]'>
                Scalable web experiences with narrative UI, robust APIs, and polished admin tooling.
              </p>
              <div className='mt-6 grid grid-cols-2 gap-3 text-sm'>
                <div className='rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3'>
                  <p className='text-2xl font-bold text-[var(--accent)]'>{featuredProjects.length || '--'}</p>
                  <p className='ink-soft'>featured builds</p>
                </div>
                <div className='rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3'>
                  <p className='text-2xl font-bold text-[var(--accent-2)]'>{latestPosts.length || '--'}</p>
                  <p className='ink-soft'>latest insights</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className='section-wrap mt-10 grid gap-6 lg:grid-cols-2'>
        {showProjects && (
          <article className='glass-card surface-interactive rounded-3xl p-6 md:p-8'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='display-title text-3xl text-[var(--ink)] md:text-4xl'>Featured Work</h2>
              <Link to='/Projects' className='focus-ring rounded-lg px-1 py-0.5 text-sm font-semibold text-[var(--accent-2)] hover:brightness-110'>See all</Link>
            </div>

            {loading ? (
              <Loader text="Loading highlighted projects..." />
            ) : featuredProjects.length > 0 ? (
              <div className='space-y-3'>
                {featuredProjects.slice(0, 3).map((project) => (
                  <Link key={project._id} to='/Projects' className='group surface-interactive focus-ring block rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 hover:border-[var(--accent)]'>
                    <p className='text-base font-semibold text-[var(--ink)] group-hover:text-[var(--accent)]'>{project.title}</p>
                    <p className='mt-1 text-sm leading-relaxed text-[var(--ink-soft)]'>{project.description}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className='ink-soft'>New case studies are in progress. Check back shortly.</p>
            )}
          </article>
        )}

        {showContent && (
          <article className='glass-card surface-interactive rounded-3xl p-6 md:p-8'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='display-title text-3xl text-[var(--ink)] md:text-4xl'>Latest Writing</h2>
              <Link to='/Blog' className='focus-ring rounded-lg px-1 py-0.5 text-sm font-semibold text-[var(--accent-2)] hover:brightness-110'>Read all</Link>
            </div>

            {loading ? (
              <Loader text="Loading latest posts..." />
            ) : latestPosts.length > 0 ? (
              <div className='space-y-3'>
                {latestPosts.map((post) => (
                  <Link key={post._id} to={`/blog/${post.slug}`} className='group surface-interactive focus-ring block rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 hover:border-[var(--accent-2)]'>
                    <p className='text-base font-semibold text-[var(--ink)] group-hover:text-[var(--accent-2)]'>{post.title}</p>
                    <p className='mt-1 line-clamp-2 text-sm text-[var(--ink-soft)]'>{post.excerpt}</p>
                    <p className='mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--ink-soft)]'>
                      <Clock3 className='h-3 w-3' />
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className='ink-soft'>Thought pieces are coming soon.</p>
            )}
          </article>
        )}
      </section>

      {showTestimonials && testimonials.length > 0 && (
        <section className='section-wrap mt-10 enter-fade'>
          <h2 className='display-title text-3xl text-[var(--ink)] md:text-4xl text-center mb-8'>Client Feedback</h2>
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {testimonials.map(t => (
              <div key={t._id} className='glass-card rounded-2xl p-6'>
                <p className='text-sm text-[var(--ink)] italic mb-6'>"{t.testimonial}"</p>
                <div className='flex items-center gap-3'>
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.clientName} className='h-10 w-10 rounded-full object-cover border border-[var(--line)]' />
                  ) : (
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] font-nevera text-lg text-[var(--accent)]'>
                      {t.clientName?.charAt(0) || 'C'}
                    </div>
                  )}
                  <div>
                    <p className='text-sm font-semibold text-[var(--ink)]'>{t.clientName}</p>
                    <p className='text-xs text-[var(--ink-soft)]'>{t.clientRole}{t.clientRole && t.company && ' at '}{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {showServices && services.length > 0 && (
        <section className='mt-16 mb-16 overflow-hidden min-h-[400px]'>
          
          {/* DOMAINS ACCORDION VIEW */}
          <div ref={domainGridRef} className='px-6 md:px-10'>
            <div className='mb-12 flex flex-col items-center justify-center text-center'>
              <span className='mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--accent)]'>
                Expertise
              </span>
              <h2 className='display-title text-4xl text-[var(--ink)] md:text-5xl'>My Domains</h2>
            </div>
            
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto'>
              {domains.map(domain => {
                const domainServices = services.filter(s => (s.domain || 'Web Development') === domain);
                const coverImage = domainServices.find(s => s.thumbnail)?.thumbnail;
                const isActive = activeDomain === domain;

                return (
                  <div 
                    key={domain}
                    onClick={() => setActiveDomain(isActive ? null : domain)}
                    onMouseLeave={() => setActiveDomain(null)}
                    className={`group cursor-pointer flex flex-col justify-start rounded-[32px] border border-[var(--line)] bg-[var(--surface)] p-8 transition-all duration-500 ease-in-out hover:border-[var(--accent)]/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] overflow-hidden ${isActive ? 'col-span-full min-h-[400px]' : 'h-64 hover:-translate-y-2'}`}
                  >
                    <div className='flex justify-between items-start'>
                      {coverImage ? (
                        <div className='h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg)]'>
                          <img src={coverImage} alt={domain} className='block w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110' />
                        </div>
                      ) : (
                        <div className='h-16 w-16 shrink-0 rounded-2xl border border-[var(--line)] bg-[var(--bg)]' />
                      )}
                      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg)] border border-[var(--line)] transition-all duration-500 group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] group-hover:text-white text-[var(--ink)] ${isActive ? 'rotate-90 bg-[var(--accent)] border-[var(--accent)] text-white' : ''}`}>
                        <ArrowRight className='h-5 w-5' />
                      </div>
                    </div>
                    
                    <div className='mt-auto pt-6'>
                      <h3 className='mb-2 font-nevera text-2xl tracking-wide text-[var(--ink)] transition-colors duration-500 ease-out group-hover:text-[var(--accent)]'>
                        {domain}
                      </h3>
                      <p className='text-sm text-[var(--ink-soft)]'>
                        {domainServices.length} {domainServices.length === 1 ? 'Service' : 'Services'}
                      </p>
                    </div>

                    {/* EXPANDED SERVICES LIST */}
                    <div className={`transition-all duration-700 ease-in-out transform ${isActive ? 'mt-8 max-h-[800px] opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-8'}`}>
                      <div className="flex overflow-x-auto gap-6 pb-6 pt-2 snap-x snap-mandatory scrollbar-hide">
                        {domainServices.map((service) => (
                          <div 
                            key={service._id} 
                            className='w-[280px] md:w-[320px] shrink-0 snap-start relative flex flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg)] transition-all duration-500 hover:border-[var(--accent)]/50'
                          >
                            {service.thumbnail && (
                              <div className='w-full h-40 overflow-hidden border-b border-[var(--line)] relative'>
                                <div className='absolute inset-0 bg-gradient-to-t from-[var(--bg)] to-transparent z-10' />
                                <img src={service.thumbnail} alt={service.title} className='block w-full h-full object-cover' />
                              </div>
                            )}
                            
                            <div className='flex flex-col flex-1 p-5 relative'>
                              <h4 className='mb-2 font-nevera text-lg text-[var(--ink)]'>
                                {service.title}
                              </h4>
                              
                              <p className='text-xs leading-relaxed text-[var(--ink-soft)] line-clamp-4'>
                                {service.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

export default Home
