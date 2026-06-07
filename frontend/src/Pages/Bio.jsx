import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowUpRight, Compass, Lightbulb, Rocket, Code, Database, Cpu, 
  Monitor, PenTool, Layout, Layers, Globe, Smartphone, 
  Server, Zap, Award, Briefcase, Star, Heart, Shield
} from 'lucide-react'

const iconMap = {
  Compass, Lightbulb, Rocket, Code, Database, Cpu, 
  Monitor, PenTool, Layout, Layers, Globe, Smartphone, 
  Server, Zap, Award, Briefcase, Star, Heart, Shield
}
import SEO from '../components/SEO'
import { getSettings } from '../api/settings'
import bioProfileImage from '../assets/download.png'
import SplitText from '../components/effects/SplitText'
import BlurText from '../components/effects/BlurText'
import DOMPurify from 'dompurify'

const Bio = () => {
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

  const bioParagraphs = useMemo(() => {
    if (config?.bioText) {
      return config.bioText
        .split('\n')
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    }

    return [
      'I am a full-stack developer focused on building expressive, reliable web experiences that feel as good as they perform.',
      'My approach sits between product thinking, engineering discipline, and visual storytelling. I care deeply about details because details shape trust.',
      'I enjoy turning rough ideas into polished systems, from API contracts and admin workflows to the final interaction rhythm on the frontend.',
      'This space is where I share what I build, what I learn, and what I am exploring next.'
    ]
  }, [config?.bioText])

  const bioSkills = useMemo(() => {
    if (config?.bioSkills && config.bioSkills.length > 0) {
      return config.bioSkills;
    }
    return [
      { title: 'Product Direction', icon: 'Compass' },
      { title: 'Design Thinking', icon: 'Lightbulb' },
      { title: 'Fast Execution', icon: 'Rocket' }
    ]
  }, [config?.bioSkills])

  const displayImage = loading ? null : (config?.aboutImage || bioProfileImage);
  const bioHeadingText = config?.bioHeading || "Biography";
  const bioSubheadingText = config?.bioSubheading || "Thoughtful engineering. Character-rich interfaces. Relentless iteration.";

  return (
    <main className='pb-16 pt-8 md:pt-12'>
      <SEO title='Bio' description='The story, philosophy, and craft behind the portfolio work.' />

      <section className='section-wrap enter-fade'>
        <div className='grid gap-8 lg:grid-cols-[0.95fr_1.05fr]'>
          <article className='glass-card rounded-[30px] p-4 md:p-6'>
            <div className='relative overflow-hidden rounded-[24px] border border-[var(--line)] h-full bg-[var(--surface)]'>
              {displayImage && <img src={displayImage} alt='Portrait' className='h-full w-full object-cover' />}
              <div className='absolute inset-0 bg-gradient-to-t from-[#131b2dcc] to-transparent' />
              <div className='absolute bottom-0 left-0 right-0 p-5 text-white'>
                <p className='text-xs uppercase tracking-[0.16em] text-white/75'>Based in India</p>
                <p className='display-title text-3xl'>Builder of Digital Worlds</p>
              </div>
            </div>
          </article>

          <article className='glass-card rounded-[30px] p-6 md:p-8'>
            <h1 className='display-title text-4xl text-[var(--ink)] sm:text-5xl'>
              <SplitText text={bioHeadingText} delay={0.2} />
            </h1>
            <p className='mt-3 max-w-xl text-sm uppercase tracking-[0.14em] text-[var(--ink-soft)]'>
              <BlurText text={bioSubheadingText} delay={0.6} />
            </p>

            <div className='mt-7 space-y-4 text-base leading-relaxed text-[var(--ink-soft)] [&_p]:mb-4 [&_a]:text-[var(--accent)] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[var(--ink)] [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--ink)] [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[var(--ink)]'>
              {loading ? (
                <p className='ink-soft'>Loading biography...</p>
              ) : (
                config?.bioText && config.bioText.includes('<') ? (
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(config.bioText) }} />
                ) : (
                  bioParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
                )
              )}
            </div>

            <div className='mt-8 grid gap-3 sm:grid-cols-3'>
              {bioSkills.map((skill, index) => {
                const IconComponent = iconMap[skill.icon] || iconMap.Compass;
                const accentColors = ['text-[var(--accent-2)]', 'text-[var(--accent)]', 'text-[var(--accent-3)]']
                const iconColor = accentColors[index % accentColors.length]
                
                return (
                  <div key={index} className='rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3'>
                    <IconComponent className={`h-5 w-5 ${iconColor}`} />
                    <p className='mt-2 text-sm font-semibold text-[var(--ink)]'>{skill.title}</p>
                  </div>
                )
              })}
            </div>

            <div className='mt-8 flex flex-wrap gap-4'>
              <Link to='/Projects' className='inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-[var(--bg)] transition hover:-translate-y-0.5 hover:brightness-110'>
                View Selected Work
                <ArrowUpRight className='h-4 w-4' />
              </Link>
              {config?.readmeContent && (
                <Link to='/readme' className='inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:-translate-y-0.5 hover:bg-[var(--bg-alt)]'>
                  Read Readme
                  <ArrowUpRight className='h-4 w-4' />
                </Link>
              )}
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Bio
