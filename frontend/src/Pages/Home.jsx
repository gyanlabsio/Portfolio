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
        if (postsRes.status === 'fulfilled') setLatestPosts((postsRes.value.data.data || []).slice(0, 5))
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

      <section className='mb-40 pt-16' style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
        {showProjects && (
          <article className='max-w-[1400px] mx-auto px-6'>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className='mb-16 text-center flex flex-col items-center border-t border-[var(--line)] pt-16'
            >
              <span className='text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink-soft)] mb-4 border border-[var(--line)] px-4 py-1.5 rounded-full'>
                Selected Work
              </span>
              <h2 className='text-4xl md:text-5xl font-black text-[var(--ink)] tracking-tight'>
                Recent Projects
              </h2>
            </motion.div>

            {loading ? (
              <Loader text="Loading projects..." />
            ) : featuredProjects.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className='w-full bg-[#e2dfd5] p-6 md:p-12 lg:p-16 rounded-none border border-[var(--line)] shadow-2xl relative overflow-hidden'
              >
                {/* Decorative theory text on the card background */}
                <div className='absolute top-0 right-0 p-8 text-[160px] font-black text-[var(--ink)]/5 leading-none pointer-events-none hidden md:block'>
                  01
                </div>
                <div className='grid grid-cols-1 md:grid-cols-12 gap-10 auto-rows-[200px] md:auto-rows-[180px]'>
                  {featuredProjects.slice(0, 6).map((project, index) => {
                    // Variant 1: Full width (35/65 split)
                    if (index === 0) {
                      return (
                        <Link to={`/project/${project.slug}`} key={project._id} className="md:col-span-12 md:row-span-2 flex flex-col md:flex-row bg-[var(--surface)] group overflow-hidden border border-[var(--line)]">
                          <div className="w-full md:w-[35%] p-8 md:p-12 relative flex flex-col justify-center">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 origin-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink-soft)] hidden md:block whitespace-nowrap">
                              Featured Work
                            </span>
                            <div className="md:pl-8">
                              <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.9] text-[var(--ink)] mb-6">
                                {project.title}
                              </h3>
                              <p className="text-xs md:text-sm text-[var(--ink-soft)] line-clamp-3 leading-relaxed max-w-sm">
                                {project.description}
                              </p>
                            </div>
                          </div>
                          <div className="w-full md:w-[65%] h-[200px] md:h-full overflow-hidden">
                            <img src={project.thumbnail || project.coverImage} alt={project.title} className="w-full h-full object-cover grayscale-[30%] contrast-125 group-hover:scale-105 transition-transform duration-700" />
                          </div>
                        </Link>
                      )
                    }
                    
                    // Variant 2: 7 cols (Image dominant, solid text block bottom left)
                    if (index === 1) {
                      return (
                        <Link to={`/project/${project.slug}`} key={project._id} className="md:col-span-7 md:row-span-2 relative group overflow-hidden border border-[var(--line)] bg-[var(--surface)]">
                          <img src={project.thumbnail || project.coverImage} alt={project.title} className="absolute inset-0 w-full h-full object-cover grayscale-[30%] contrast-125 group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute bottom-0 left-0 bg-[var(--ink)] text-[var(--surface)] p-8 md:p-10 w-[85%] md:w-[70%]">
                            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-[0.9] mb-4">
                              {project.title}
                            </h3>
                            <p className="text-xs text-[var(--surface)]/70 line-clamp-2 leading-relaxed">
                              {project.description}
                            </p>
                          </div>
                        </Link>
                      )
                    }

                    // Variant 3: 5 cols (Image top, text bottom)
                    if (index === 2) {
                      return (
                        <Link to={`/project/${project.slug}`} key={project._id} className="md:col-span-5 md:row-span-2 flex flex-col bg-[var(--surface)] group overflow-hidden border border-[var(--line)]">
                          <div className="h-[60%] overflow-hidden relative">
                            <img src={project.thumbnail || project.coverImage} alt={project.title} className="absolute inset-0 w-full h-full object-cover grayscale-[30%] contrast-125 group-hover:scale-105 transition-transform duration-700" />
                          </div>
                          <div className="h-[40%] p-8 relative flex flex-col justify-center bg-[var(--surface)]">
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 -rotate-90 origin-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink-soft)] hidden md:block whitespace-nowrap">
                              Case Study
                            </span>
                            <div className="md:pr-8">
                              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-[0.9] text-[var(--ink)] mb-4">
                                {project.title}
                              </h3>
                              <p className="text-xs text-[var(--ink-soft)] line-clamp-3 leading-relaxed">
                                {project.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      )
                    }

                    // Variant 4: 4 cols (Tall portrait)
                    if (index === 3) {
                      return (
                        <Link to={`/project/${project.slug}`} key={project._id} className="md:col-span-4 md:row-span-2 relative group overflow-hidden border border-[var(--line)] bg-[var(--surface)]">
                          <img src={project.thumbnail || project.coverImage} alt={project.title} className="absolute inset-0 w-full h-full object-cover grayscale-[30%] contrast-125 group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/90 via-[var(--ink)]/20 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-8">
                            <h3 className="text-2xl font-black uppercase tracking-tight leading-[0.9] text-[var(--surface)] mb-3">
                              {project.title}
                            </h3>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--surface)]/70">
                              View Project →
                            </span>
                          </div>
                        </Link>
                      )
                    }

                    // Variant 5: 8 cols (Text left, wide image right)
                    if (index === 4) {
                      return (
                        <Link to={`/project/${project.slug}`} key={project._id} className="md:col-span-8 md:row-span-2 flex flex-col md:flex-row bg-[var(--ink)] text-[var(--surface)] group overflow-hidden border border-[var(--ink)]">
                          <div className="w-full md:w-[45%] p-8 md:p-12 relative flex flex-col justify-center">
                            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-[0.9] mb-6">
                              {project.title}
                            </h3>
                            <p className="text-xs text-[var(--surface)]/70 line-clamp-3 leading-relaxed">
                              {project.description}
                            </p>
                          </div>
                          <div className="w-full md:w-[55%] h-[200px] md:h-full overflow-hidden">
                            <img src={project.thumbnail || project.coverImage} alt={project.title} className="w-full h-full object-cover grayscale-[30%] contrast-125 group-hover:scale-105 transition-transform duration-700" />
                          </div>
                        </Link>
                      )
                    }

                    // Variant 6: Full width (60/40 reverse split)
                    if (index === 5) {
                      return (
                        <Link to={`/project/${project.slug}`} key={project._id} className="md:col-span-12 md:row-span-2 flex flex-col md:flex-row-reverse bg-[var(--surface)] group overflow-hidden border border-[var(--line)]">
                          <div className="w-full md:w-[40%] p-8 md:p-16 relative flex flex-col justify-center bg-white">
                            <span className="absolute right-8 top-8 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink-soft)] hidden md:block">
                              Archive
                            </span>
                            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-[0.9] text-[var(--ink)] mb-6">
                              {project.title}
                            </h3>
                            <p className="text-xs md:text-sm text-[var(--ink-soft)] line-clamp-3 leading-relaxed">
                              {project.description}
                            </p>
                          </div>
                          <div className="w-full md:w-[60%] h-[200px] md:h-full overflow-hidden">
                            <img src={project.thumbnail || project.coverImage} alt={project.title} className="w-full h-full object-cover grayscale-[30%] contrast-125 group-hover:scale-105 transition-transform duration-700" />
                          </div>
                        </Link>
                      )
                    }

                    return null;
                  })}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
                  className='mt-16 flex justify-center'
                >
                  <Link to='/Projects' className='bg-[var(--ink)] text-[var(--surface)] px-10 py-4 text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity shadow-lg'>
                    See All Projects
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <p className='text-[var(--ink-soft)] font-light text-center'>New case studies are in progress. Check back shortly.</p>
            )}
          </article>
        )}
      </section>

      {config?.homepageSections?.aboutMyWork !== false && config?.aboutMyWorkText && (
        <section className='mb-40 pt-16' style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
          <article className='max-w-[1400px] mx-auto px-6'>
            <div className='border-t border-[var(--line)] pt-16'>
              <div className='max-w-4xl mx-auto'>
                <div className='grid md:grid-cols-2 gap-16'>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className='text-sm font-bold uppercase tracking-widest text-[var(--ink)]'>
                {config.aboutMyWorkHeading || 'ABOUT MY WORK'}
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className='flex flex-col gap-12'
            >
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
            </motion.div>
                  </div>
                </div>
              </div>
          </article>
        </section>
      )}


      {showServices && services.length > 0 && (
        <section className='mb-40 pt-16' style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
          <article className='max-w-[1400px] mx-auto px-6'>
            <div className='border-t border-[var(--line)] pt-16'>
              <div className='max-w-4xl mx-auto'>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className='mb-12'
                >
                  <h2 className='text-sm font-bold uppercase tracking-widest text-[var(--ink)]'>Services I Provide</h2>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                  className='flex flex-col gap-6 max-w-4xl mx-auto'
                >
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
                  </motion.div>
                </div>
              </div>
          </article>
        </section>
      )}

      {featuredDesigns.length > 0 && <CreativeWorksScrollSection featuredDesigns={featuredDesigns} />}

      {showContent && (
        <section className='mb-16' style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
          <article className='max-w-[1400px] mx-auto px-6'>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className='mb-8 flex items-center justify-between border-t border-[var(--line)] pt-16'
            >
              <h2 className='text-sm font-bold uppercase tracking-widest text-[var(--ink)]'>Latest Writing</h2>
              <Link to='/Blog' className='text-xs font-bold uppercase tracking-widest text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors'>Read all</Link>
            </motion.div>

            {loading ? (
              <Loader text="Loading latest posts..." />
            ) : latestPosts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className='w-full'
              >
                {/* Featured Lead (Anchor) */}
                {latestPosts[0] && (
                  <Link to={`/blog/${latestPosts[0].slug}`} className='block bg-[#f0ece1] rounded-none p-8 md:p-12 lg:p-16 mb-12 group transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]'>
                    <div className='flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-center'>
                      <div className='flex-1 w-full'>
                        <div className='flex flex-wrap items-center gap-4 text-[#1a1a1a]/60 mb-6 tracking-[0.13em] uppercase text-[10px] font-bold' style={{ fontFamily: "'Manrope', sans-serif" }}>
                          <span className='text-[#1a1a1a]'>{latestPosts[0].category || 'Writing'}</span>
                          <span className='w-1 h-1 rounded-full bg-[#1a1a1a]/20'></span>
                          <span>{new Date(latestPosts[0].createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          <span className='w-1 h-1 rounded-full bg-[#1a1a1a]/20'></span>
                          <span className='text-[#1a1a1a]'>{latestPosts[0].readTime || '6 MIN'} READ</span>
                        </div>
                        <h3 className='text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-[#1a1a1a] leading-[1.1] tracking-tight mb-6'>
                          {latestPosts[0].title}
                        </h3>
                        <p className='text-base md:text-lg text-[#1a1a1a]/70 font-light leading-relaxed mb-8'>
                          {latestPosts[0].excerpt}
                        </p>
                        <div>
                          <span className='inline-flex items-center gap-3 bg-[#1a1a1a] text-white px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors'>
                            Read Article
                            <ArrowRight className='h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1' />
                          </span>
                        </div>
                      </div>
                      
                      {(latestPosts[0].coverImage || latestPosts[0].image) && (
                        <div className='flex-1 w-full'>
                          <div className='w-full h-[300px] md:h-[400px] relative overflow-hidden rounded-none bg-[var(--line)]/50'>
                            <img 
                              src={latestPosts[0].coverImage || latestPosts[0].image} 
                              alt={latestPosts[0].title} 
                              className='absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105' 
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                )}

                {/* Compact Previews */}
                {latestPosts.length > 1 && (
                  <div className='grid grid-cols-1 md:grid-cols-2'>
                    {latestPosts.slice(1, 5).map((post, index) => (
                      <Link 
                        key={post._id} 
                        to={`/blog/${post.slug}`} 
                        className={`group block 
                          ${index % 2 === 0 ? 'md:pr-12 md:border-r border-[var(--line)]' : 'md:pl-12'} 
                          ${index < 2 ? 'pb-10 border-b border-[var(--line)] mb-10' : ''}
                        `}
                      >
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
              </motion.div>
            ) : (
              <p className='text-[var(--ink-soft)] font-light'>Thought pieces are coming soon.</p>
            )}
          </article>
        </section>
      )}

      {showTestimonials && testimonials.length > 0 && (
        <section className='mb-16 pt-16' style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
          <article className='max-w-[1400px] mx-auto px-6'>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className='border-t border-[var(--line)] pt-16'
            >
              <div className='max-w-4xl mx-auto'>
                <TestimonialInfiniteCard testimonials={testimonials} />
              </div>
            </motion.div>
          </article>
        </section>
      )}

      {/* FAQ & Contact Section */}
      <section className='mb-16 pt-16' style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
        <article className='max-w-[1400px] mx-auto px-6'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className='border-t border-[var(--line)] pt-16'
          >
            <div className='max-w-4xl mx-auto'>
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
            </div>
          </motion.div>
        </article>
      </section>

    </main>
  )
}

export default Home
