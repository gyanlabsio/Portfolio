import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock3, Sparkles, ArrowRight, Download, Github, Linkedin, Mail, Twitter, ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react'
import SEO from '../components/SEO'
import { getSettings } from '../api/settings'
import { getServices } from '../api/service'
import { getFeaturedTestimonials } from '../api/testimonial'
import { getFeaturedProjects } from '../api/projects'
import { getPosts } from '../api/blog'
import { getFeaturedDesigns } from '../api/design'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import SplitText from '../components/effects/SplitText'
import BlurText from '../components/effects/BlurText'
import ShinyText from '../components/effects/ShinyText'
import Loader from '../components/Loader'
import GalleryLightbox from '../components/GalleryLightbox'

const Home = () => {
  const [config, setConfig] = useState(null)
  const [services, setServices] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [latestPosts, setLatestPosts] = useState([])
  const [featuredDesigns, setFeaturedDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeDomainIndex, setActiveDomainIndex] = useState(0)
  const [expandedDomain, setExpandedDomain] = useState(null)

  const [activeDesignIndex, setActiveDesignIndex] = useState(0)
  const [isDesignsPaused, setIsDesignsPaused] = useState(false)
  const [selectedDesign, setSelectedDesign] = useState(null)

  // Extract unique domains
  const domains = [...new Set(services.map(s => s.domain || 'Web Development'))]

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [configRes, servicesRes, testRes, projectsRes, postsRes, designsRes] = await Promise.allSettled([
          getSettings(),
          getServices(),
          getFeaturedTestimonials(),
          getFeaturedProjects(),
          getPosts(),
          getFeaturedDesigns(),
        ])

        if (configRes.status === 'fulfilled') setConfig(configRes.value.data.data)
        if (servicesRes.status === 'fulfilled') setServices(servicesRes.value.data.data || [])
        if (testRes.status === 'fulfilled') setTestimonials(testRes.value.data.data || [])
        if (projectsRes.status === 'fulfilled') setFeaturedProjects(projectsRes.value.data.data || [])
        if (postsRes.status === 'fulfilled') setLatestPosts((postsRes.value.data.data || []).slice(0, 3))
        if (designsRes.status === 'fulfilled') setFeaturedDesigns(designsRes.value.data.data || [])
      } catch (err) {
        console.error('Failed to load home data', err)
      } finally {
        setLoading(false)
      }
    }
    fetchHomeData()
  }, [])

  useEffect(() => {
    if (featuredDesigns.length <= 1 || isDesignsPaused) return;
    
    const interval = setInterval(() => {
      setActiveDesignIndex((prev) => (prev + 1) % featuredDesigns.length);
    }, 3000); 
    
    return () => clearInterval(interval);
  }, [featuredDesigns.length, isDesignsPaused]);

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
          
          {/* DOMAINS CAROUSEL VIEW */}
          <div className='px-6 md:px-10 overflow-hidden'>
            <div className='mb-12 flex flex-col items-center justify-center text-center'>
              <span className='mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--accent)]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--accent)]'>
                Expertise
              </span>
              <h2 className='display-title text-4xl text-[var(--ink)] md:text-5xl'>My Domains</h2>
            </div>
            <div className='flex flex-wrap justify-center items-start gap-6 max-w-6xl mx-auto'>
              {domains.map((domain) => {
                const domainServices = services.filter(s => (s.domain || 'Web Development') === domain);
                const isExpanded = expandedDomain === domain;

                return (
                  <div 
                    key={domain}
                    className={`relative rounded-3xl border transition-all duration-500 bg-[var(--surface)] p-6 overflow-hidden w-[calc(100vw-3rem)] sm:w-[350px] ${isExpanded ? 'border-[var(--accent)]/50 shadow-2xl' : 'border-[var(--line)] shadow-lg hover:border-[var(--line-strong)]'}`}
                  >
                    <div className='flex items-center justify-between gap-4'>
                      <h3 className={`font-nevera text-xl tracking-wide transition-colors ${isExpanded ? 'text-[var(--accent)]' : 'text-[var(--ink)]'}`}>
                        {domain}
                      </h3>
                      <button 
                        onClick={() => setExpandedDomain(isExpanded ? null : domain)}
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--bg)] border border-[var(--line)] transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-[var(--accent)] text-white border-[var(--accent)]' : 'text-[var(--ink)] hover:bg-[var(--line)]'}`}
                      >
                        <ChevronDown className='h-4 w-4' />
                      </button>
                    </div>
                    
                    <p className='mt-1 text-xs text-[var(--ink-soft)]'>
                      {domainServices.length} {domainServices.length === 1 ? 'Service' : 'Services'}
                    </p>

                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="pt-4 pb-2 space-y-3">
                        {domainServices.map((service) => (
                          <div key={service._id} className='rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3 flex gap-3 items-start'>
                            {service.thumbnail && (
                              <img src={service.thumbnail} alt={service.title} className='w-12 h-12 rounded-lg object-cover border border-[var(--line)] shrink-0' />
                            )}
                            <div>
                              <p className='font-semibold text-[var(--ink)] text-sm'>{service.title}</p>
                              <p className='text-xs text-[var(--ink-soft)] line-clamp-3 mt-1'>{service.description}</p>
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

      {featuredDesigns.length > 0 && (
        <section className='mt-16 mb-24 overflow-hidden'>
          <div className='px-6 md:px-10 mb-10 flex items-center justify-between'>
            <div>
              <span className='mb-2 inline-flex items-center gap-2 rounded-full bg-[var(--accent-2)]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--accent-2)]'>
                Gallery
              </span>
              <h2 className='display-title text-3xl text-[var(--ink)] md:text-4xl'>Creative Works</h2>
            </div>
            <Link to='/gallery' className='focus-ring rounded-lg px-2 py-1 text-sm font-semibold text-[var(--accent-2)] hover:brightness-110'>
              View Gallery
            </Link>
          </div>
          
          <div 
            className='relative h-[400px] md:h-[450px] flex items-center justify-center max-w-6xl mx-auto w-full'
            onMouseEnter={() => setIsDesignsPaused(true)}
            onMouseLeave={() => setIsDesignsPaused(false)}
          >
            {featuredDesigns.map((design, index) => {
              let offset = index - activeDesignIndex;
              if (offset < -Math.floor(featuredDesigns.length / 2)) offset += featuredDesigns.length;
              if (offset > Math.floor(featuredDesigns.length / 2)) offset -= featuredDesigns.length;
              
              const isCenter = offset === 0;
              const zIndex = 100 - Math.abs(offset);
              const scale = isCenter ? 1 : Math.max(0.75, 1 - Math.abs(offset) * 0.1);
              const x = offset * (window.innerWidth < 768 ? 80 : 200); 
              const opacity = Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.2;

              return (
                <motion.div 
                  key={design._id} 
                  onClick={() => {
                    if (isCenter) {
                      setSelectedDesign(design);
                    } else {
                      setActiveDesignIndex(index);
                    }
                  }}
                  animate={{ x, scale, zIndex, opacity }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className={`absolute cursor-pointer rounded-3xl overflow-hidden border border-[var(--line)] bg-[var(--surface)] transition-all duration-500 w-[280px] md:w-[400px] h-[350px] md:h-[420px] ${isCenter ? 'shadow-[0_20px_40px_rgba(0,0,0,0.25)] border-[var(--accent-2)]/50' : 'brightness-50'}`}
                  style={{ pointerEvents: isCenter ? 'auto' : opacity > 0 ? 'auto' : 'none' }}
                >
                  <img src={design.thumbnail} alt={design.title} className={`w-full h-full object-cover transition-transform duration-700 ${isCenter ? 'hover:scale-105' : ''}`} />
                  <div className={`absolute inset-0 bg-gradient-to-t from-[#0a0d14]/90 via-[#0a0d14]/20 to-transparent transition-opacity duration-500 ${isCenter ? 'opacity-80' : 'opacity-40'}`} />
                  
                  <div className={`absolute bottom-0 left-0 right-0 p-6 transition-all duration-500 ${isCenter ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <p className='mb-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-2)]'>{design.category}</p>
                    <h3 className='text-xl font-semibold text-white mb-2'>{design.title}</h3>
                    <div className='inline-flex items-center gap-1 text-xs font-medium text-white/70'>
                      View in Lightbox <ArrowUpRight className='h-3 w-3' />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>
      )}

      {/* LIGHTBOX FOR DESIGNS */}
      <GalleryLightbox 
        isOpen={!!selectedDesign}
        design={selectedDesign}
        onClose={() => setSelectedDesign(null)}
      />
    </main>
  )
}

export default Home
