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
import KineticCarousel from '../components/effects/KineticCarousel'
import TestimonialInfiniteCard from '../components/effects/TestimonialInfiniteCard'
import CreativeWorksScrollSection from '../components/effects/CreativeWorksScrollSection'
import FAQ from '../components/FAQ'
import ContactForm from '../components/ContactForm'

const Home = () => {
  const [config, setConfig] = useState(null)
  const [services, setServices] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [latestPosts, setLatestPosts] = useState([])
  const [featuredDesigns, setFeaturedDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedDomain, setExpandedDomain] = useState(null)
  const [openAboutDropdown, setOpenAboutDropdown] = useState(null)

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

  const heroTitle = config?.siteTitle || ''
  const heroTagline = config?.tagline || ''
  const heroDescription = config?.description || ''
  const heroBadge = config?.heroBadge || ''

  // Toggles
  const showProjects = config?.homepageSections?.projects !== false;
  const showServices = config?.homepageSections?.services !== false;
  const showTestimonials = config?.homepageSections?.testimonials !== false;
  const showContent = config?.homepageSections?.content !== false;

  return (
    <main className='py-24 max-w-4xl mx-auto px-6'>
      <SEO title='Home' description='Full-stack portfolio with immersive interfaces, product thinking, and robust engineering.' />

      {/* HERO: Pure Typography & Whitespace */}
      <section className='mb-40 flex flex-col items-start gap-8'>
        {heroBadge && (
          <div className='inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--ink-soft)]'>
            {heroBadge}
          </div>
        )}

        {heroTitle && (
          <h1 className='text-5xl font-black text-[var(--ink)] sm:text-6xl md:text-7xl tracking-tighter leading-tight min-h-[4rem]'>
            <SplitText text={heroTitle} delay={0.2} />
          </h1>
        )}

        {heroTagline && (
          <p className='max-w-2xl text-xl font-light leading-relaxed text-[var(--ink-soft)] md:text-2xl min-h-[2rem]'>
            <BlurText text={heroTagline} delay={0.6} />
          </p>
        )}

        {heroDescription && (
          <p className='max-w-xl text-base font-light leading-relaxed text-[var(--ink-soft)]'>
            <BlurText text={heroDescription} delay={0.8} />
          </p>
        )}

        <div className='mt-8 flex gap-6'>
          <Link to='/Projects' className='bg-[var(--accent)] text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity'>
            Explore Projects
          </Link>
          <Link to='/Contact' className='px-8 py-4 text-sm font-bold uppercase tracking-widest text-[var(--ink)] hover:text-[var(--ink-soft)] transition-colors'>
            Start a Conversation
          </Link>
        </div>
      </section>

      <section className='mb-40 grid gap-16 border-t border-[var(--line)] pt-16'>
        {showProjects && (
          <article>
            <div className='mb-8 flex items-center justify-between'>
              <h2 className='text-sm font-bold uppercase tracking-widest text-[var(--ink)]'>Featured Work</h2>
              <Link to='/Projects' className='text-xs font-bold uppercase tracking-widest text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors'>See all</Link>
            </div>

            {loading ? (
              <Loader text="Loading highlighted projects..." />
            ) : featuredProjects.length > 0 ? (
              <div className='w-full mt-4'>
                <KineticCarousel projects={featuredProjects.slice(0, 5)} />
              </div>
            ) : (
              <p className='text-[var(--ink-soft)] font-light'>New case studies are in progress. Check back shortly.</p>
            )}
          </article>
        )}
      </section>

      {config?.homepageSections?.aboutMyWork !== false && config?.aboutMyWorkText && (
        <section className='mb-40 border-t border-[var(--line)] pt-16'>
          <div className='grid md:grid-cols-2 gap-16'>
            <div>
              <h2 className='text-sm font-bold uppercase tracking-widest text-[var(--ink)]'>
                {config.aboutMyWorkHeading || 'ABOUT MY WORK'}
              </h2>
            </div>
            <div className='flex flex-col gap-12'>
              <div className='text-xl font-light text-[var(--ink-soft)] leading-relaxed'>
                {config.aboutMyWorkText}
              </div>
              <div className='flex flex-col'>
                {(config?.aboutMyWorkDropdowns || []).map((dropdown, idx) => (
                  <div key={idx} className={`border-b border-[var(--line)] last:border-0 ${idx === 0 ? 'pt-0' : 'pt-6'} pb-6`}>
                    <button 
                      onClick={() => setOpenAboutDropdown(openAboutDropdown === idx ? null : idx)} 
                      className='w-full flex items-center justify-between text-left focus:outline-none group'
                    >
                      <h3 className='text-sm font-bold tracking-widest uppercase text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors'>
                        {dropdown.title}
                      </h3>
                      <div className={`transform transition-transform duration-300 ${openAboutDropdown === idx ? 'rotate-180' : ''}`}>
                        <ChevronDown size={18} className='text-[var(--ink-soft)] group-hover:text-[var(--accent)] transition-colors' />
                      </div>
                    </button>
                    <AnimatePresence>
                      {openAboutDropdown === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className='overflow-hidden'
                        >
                          <p className='pt-6 text-base font-light text-[var(--ink-soft)] leading-relaxed'>
                            {dropdown.content}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}


      {showServices && services.length > 0 && (
        <section className='mb-40 border-t border-[var(--line)] pt-16'>
          <div className='mb-12'>
            <h2 className='text-sm font-bold uppercase tracking-widest text-[var(--ink)]'>Services I Provide</h2>
          </div>
          <div className='flex flex-col gap-6 max-w-4xl mx-auto'>
            {domains.map((domain) => {
              const domainServices = services.filter(s => (s.domain || 'Web Development') === domain);
              const isExpanded = expandedDomain === domain;

              return (
                <div key={domain} className='border-b border-[var(--line)] pb-6 last:border-0'>
                  <div className='flex items-center justify-between gap-4'>
                    <h3 className={`text-2xl font-black uppercase tracking-tight transition-colors ${isExpanded ? 'text-[var(--accent)]' : 'text-[var(--ink)]'}`}>
                      {domain}
                    </h3>
                    <div className='flex items-center gap-4'>
                      <p className='text-xs font-bold uppercase tracking-widest text-[var(--ink-soft)]'>
                        {domainServices.length} {domainServices.length === 1 ? 'Service' : 'Services'}
                      </p>
                      <button 
                        onClick={() => setExpandedDomain(isExpanded ? null : domain)}
                        className={`flex h-8 w-8 shrink-0 items-center justify-center border border-[var(--ink)] transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-[var(--accent)] text-[var(--surface)] border-[var(--accent)]' : 'text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--surface)]'}`}
                      >
                        <ChevronDown className='h-4 w-4' />
                      </button>
                    </div>
                  </div>

                  <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1200px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
                    <div className="grid md:grid-cols-2 gap-8">
                      {domainServices.map((service) => (
                        <div key={service._id} className='flex gap-4 items-start'>
                          {service.thumbnail && (
                            <img src={service.thumbnail} alt={service.title} className='w-16 h-16 object-cover shrink-0' />
                          )}
                          <div>
                            <p className='font-bold text-[var(--ink)] text-base uppercase tracking-tight'>{service.title}</p>
                            <p className='text-sm font-light text-[var(--ink-soft)] leading-relaxed mt-2'>{service.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {featuredDesigns.length > 0 && <CreativeWorksScrollSection featuredDesigns={featuredDesigns} />}

      {showContent && (
        <section className='mb-16 border-t border-[var(--line)] pt-16'>
          <article>
            <div className='mb-8 flex items-center justify-between'>
              <h2 className='text-sm font-bold uppercase tracking-widest text-[var(--ink)]'>Latest Writing</h2>
              <Link to='/Blog' className='text-xs font-bold uppercase tracking-widest text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors'>Read all</Link>
            </div>

            {loading ? (
              <Loader text="Loading latest posts..." />
            ) : latestPosts.length > 0 ? (
              <div className='w-full'>
                {/* Featured Lead (Anchor) */}
                {latestPosts[0] && (
                  <Link to={`/blog/${latestPosts[0].slug}`} className='block bg-[#f0ece1] rounded-xl p-8 md:p-16 mb-12 group'>
                    <div className='flex flex-col md:flex-row gap-8 md:gap-16'>
                      <div className='flex-1'>
                        <div className='flex flex-wrap items-center gap-4 text-[#1a1a1a]/60 mb-6 tracking-[0.13em] uppercase text-[10px] font-bold' style={{ fontFamily: "'Manrope', sans-serif" }}>
                          <span className='text-[#1a1a1a]'>{latestPosts[0].category || 'Writing'}</span>
                          <span className='w-1 h-1 rounded-full bg-[#1a1a1a]/20'></span>
                          <span>{new Date(latestPosts[0].createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          <span className='w-1 h-1 rounded-full bg-[#1a1a1a]/20'></span>
                          <span className='text-[#1a1a1a]'>{latestPosts[0].readTime || '6 MIN'} READ</span>
                        </div>
                        <h3 className='text-4xl md:text-[3.5rem] font-bold text-[#1a1a1a] leading-[1.1] tracking-tight'>
                          {latestPosts[0].title}
                        </h3>
                      </div>
                      <div className='flex-1 flex flex-col justify-center'>
                        <p className='text-base md:text-lg text-[#1a1a1a]/70 font-light leading-relaxed mb-8'>
                          {latestPosts[0].excerpt}
                        </p>
                        <div>
                          <span className='inline-block bg-[#1a1a1a] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-black'>
                            Read Article
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Compact Previews */}
                {latestPosts.length > 1 && (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0'>
                    {latestPosts.slice(1, 5).map((post) => (
                      <Link key={post._id} to={`/blog/${post.slug}`} className='group block border-t border-[var(--line)] py-10'>
                        <div className='flex items-center justify-between text-[var(--ink-soft)] mb-6 tracking-[0.13em] uppercase text-[10px] font-bold' style={{ fontFamily: "'Manrope', sans-serif" }}>
                          <div className='flex items-center gap-3'>
                            <span className='text-[var(--ink)]'>{post.category || 'Writing'}</span>
                            <span className='w-1 h-1 rounded-full bg-[var(--line)]'></span>
                            <span>{new Date(post.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          </div>
                          <span className='text-[var(--ink)]'>{post.readTime || '4 MIN'} READ</span>
                        </div>
                        <h3 className='text-2xl font-bold text-[var(--ink)] leading-tight mb-4 group-hover:text-[var(--accent)] transition-colors'>
                          {post.title}
                        </h3>
                        <p className='text-sm font-light text-[var(--ink-soft)] leading-relaxed line-clamp-2'>
                          {post.excerpt}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className='text-[var(--ink-soft)] font-light'>Thought pieces are coming soon.</p>
            )}
          </article>
        </section>
      )}

      {showTestimonials && testimonials.length > 0 && (
        <section className='mb-16 border-t border-[var(--line)] pt-16'>
          <TestimonialInfiniteCard testimonials={testimonials} />
        </section>
      )}

      {/* FAQ & Contact Section */}
      <section className='mb-16 border-t border-[var(--line)] pt-16'>
        <div className='grid md:grid-cols-2 gap-16'>
          {/* Left Side: FAQ */}
          <div>
            <h2 className='text-sm font-bold uppercase tracking-widest text-[var(--ink)] mb-12'>Frequently Asked Questions</h2>
            <FAQ />
          </div>

          {/* Right Side: Contact Form */}
          <div>
            <h2 className='text-sm font-bold uppercase tracking-widest text-[var(--ink)] mb-12'>Get in Touch</h2>
            <ContactForm />
          </div>
        </div>
      </section>

    </main>
  )
}

export default Home
