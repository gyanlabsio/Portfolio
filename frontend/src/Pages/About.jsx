import { useEffect, useState } from 'react'
import SEO from '../components/SEO'
import { getSettings } from '../api/settings'
import SplitText from '../components/effects/SplitText'
import BlurText from '../components/effects/BlurText'
import Loader from '../components/Loader'
import { ArrowUpRight } from 'lucide-react'

const About = () => {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await getSettings()
        setConfig(data.data)
      } catch (err) {
        console.error('Failed to load site config in Bio', err)
      } finally {
        setLoading(false)
      }
    }
    fetchConfig()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader text="Loading..." />
      </main>
    )
  }

  // Fallbacks
  const heroHeading = config?.aboutHeroHeading || 'WHERE DESIGN MEETS ENGINEERING'
  const heroSubheading = config?.aboutHeroSubheading || 'GET TO KNOW ME CLOSELY'
  const heroBrandName = config?.aboutHeroBrandName || 'GYANARANJAN'
  
  const statsHeading = config?.aboutStatsHeading || 'MY IMPACT IN NUMBERS'
  const statsSubheading = config?.aboutStatsSubheading || 'BUT WHY US?'
  const statsImage = config?.aboutStatsImage || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3'
  
  const stats = (config?.aboutStats && config.aboutStats.length > 0) ? config.aboutStats : [
    { value: '48+', label: 'SUCCESSFUL PROJECTS', description: 'Delivering impactful digital solutions that combine creativity, precision, and innovation.' },
    { value: '35+', label: 'SATISFIED CLIENTS', description: 'Building long-term partnerships through trust, design excellence, and a commitment to crafting experiences.' },
    { value: '62%', label: 'AVG. INCREASE IN SALES', description: 'Helping businesses achieve measurable growth through strategic design, seamless functionality.' },
    { value: '45%', label: 'COST EFFICIENCY', description: 'Optimizing resources and development processes to ensure maximum value, high performance.' }
  ]

  return (
    <main className='pb-16 pt-8 md:pt-12'>
      <SEO title='About' description='Get to know us closely. Turning visualization into reality.' />

      {/* Hero Section */}
      <section className='section-wrap enter-fade mb-16 md:mb-24'>
        <div className='flex flex-col gap-6 md:gap-8'>
          <div className='flex items-center gap-4'>
            <div className='h-[1px] w-12 bg-[var(--accent)]'></div>
            <p className='text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]'>
              {heroSubheading}
            </p>
          </div>
          
          <div className='max-w-4xl'>
            <h1 className='display-title text-4xl text-[var(--ink)] sm:text-5xl md:text-6xl lg:text-[4rem] leading-[1.1]'>
              <SplitText text={heroHeading} delay={0.2} />
            </h1>
          </div>
          
          {/* Bento Images Grid */}
          <div className='mt-8 grid h-[400px] gap-4 md:h-[500px] md:grid-cols-3'>
            <div className='group relative hidden overflow-hidden rounded-none md:block'>
              <img 
                src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=1200&ixlib=rb-4.0.3" 
                alt="Workspace" 
                className='h-full w-full object-cover transition duration-700 group-hover:scale-105'
              />
            </div>
            <div className='group relative col-span-2 overflow-hidden rounded-none md:col-span-1'>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200&ixlib=rb-4.0.3" 
                alt="Team working" 
                className='h-full w-full object-cover transition duration-700 group-hover:scale-105'
              />
              {/* Brand Name Overlay */}
              <div className='absolute inset-0 flex items-center justify-center bg-[var(--ink)]/40 group-hover:bg-[var(--ink)]/80 transition-colors duration-500'>
                <div className='border-2 border-white px-8 py-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500'>
                  <span className='text-xl font-black tracking-widest text-white uppercase'>{heroBrandName}</span>
                </div>
              </div>
            </div>
            <div className='group relative hidden overflow-hidden rounded-none md:block'>
              <img 
                src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1200&ixlib=rb-4.0.3" 
                alt="Design details" 
                className='h-full w-full object-cover transition duration-700 group-hover:scale-105'
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact in Numbers Section */}
      <section className='mb-40 border-t border-[var(--line)] pt-16 enter-fade-up delay-200'>
        <div className='px-6 md:px-10 lg:px-16'>
          <div className='grid gap-12 lg:grid-cols-2 lg:gap-20'>
            {/* Left side: Heading & Image */}
            <div className='flex flex-col gap-8'>
              <div>
                <p className='mb-4 text-xs font-bold uppercase tracking-widest text-[var(--ink)]'>{statsSubheading}</p>
                <h2 className='text-4xl font-black uppercase tracking-tighter text-[var(--ink)] sm:text-5xl lg:text-6xl'>{statsHeading}</h2>
              </div>
              
              <div className='group relative mt-auto h-[400px] overflow-hidden rounded-none border border-[var(--line)]'>
                <img 
                  src={statsImage} 
                  alt="Impact" 
                  className='h-full w-full object-cover transition duration-700 group-hover:scale-105'
                />
              </div>
            </div>
            
            {/* Right side: Stats Grid */}
            <div className='grid gap-8 sm:grid-cols-2 lg:pt-16'>
              {stats.map((stat, idx) => (
                <div key={idx} className='flex flex-col gap-3 border-l border-[var(--ink)] pl-6'>
                  <div className='text-5xl font-black tracking-tighter text-[var(--ink)] lg:text-6xl'>{stat.value}</div>
                  <div className='text-xs font-bold uppercase tracking-widest text-[var(--ink)]'>{stat.label}</div>
                  <p className='text-sm font-light leading-relaxed text-[var(--ink-soft)]'>
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}

export default About
