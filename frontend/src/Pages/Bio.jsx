import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Compass, Lightbulb, Rocket } from 'lucide-react'
import SEO from '../components/SEO'
import { getSiteConfig } from '../api/admin'
import bioProfileImage from '../assets/ChatGPT Image Mar 2, 2026, 09_49_15 PM.png'

const Bio = () => {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await getSiteConfig()
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

  return (
    <main className='pb-16 pt-8 md:pt-12'>
      <SEO title='Bio' description='The story, philosophy, and craft behind the portfolio work.' />

      <section className='section-wrap enter-fade'>
        <div className='grid gap-8 lg:grid-cols-[0.95fr_1.05fr]'>
          <article className='glass-card rounded-[30px] p-4 md:p-6'>
            <div className='relative overflow-hidden rounded-[24px] border border-black/10'>
              <img src={config?.aboutImage || bioProfileImage} alt='Portrait' className='h-full w-full object-cover' />
              <div className='absolute inset-0 bg-gradient-to-t from-[#131b2dcc] to-transparent' />
              <div className='absolute bottom-0 left-0 right-0 p-5 text-white'>
                <p className='text-xs uppercase tracking-[0.16em] text-white/75'>Based in India</p>
                <p className='display-title text-3xl'>Builder of Digital Worlds</p>
              </div>
            </div>
          </article>

          <article className='glass-card rounded-[30px] p-6 md:p-8'>
            <h1 className='display-title text-4xl text-[#182335] sm:text-5xl'>Biography</h1>
            <p className='mt-3 max-w-xl text-sm uppercase tracking-[0.14em] text-[#526172]'>
              Thoughtful engineering. Character-rich interfaces. Relentless iteration.
            </p>

            <div className='mt-7 space-y-4 text-base leading-relaxed text-[#405063]'>
              {loading ? (
                <p className='ink-soft'>Loading biography...</p>
              ) : (
                bioParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
              )}
            </div>

            <div className='mt-8 grid gap-3 sm:grid-cols-3'>
              <div className='rounded-2xl border border-black/10 bg-white/75 p-3'>
                <Compass className='h-5 w-5 text-[#0c7fa3]' />
                <p className='mt-2 text-sm font-semibold text-[#1d2838]'>Product Direction</p>
              </div>
              <div className='rounded-2xl border border-black/10 bg-white/75 p-3'>
                <Lightbulb className='h-5 w-5 text-[#ef3e2f]' />
                <p className='mt-2 text-sm font-semibold text-[#1d2838]'>Design Thinking</p>
              </div>
              <div className='rounded-2xl border border-black/10 bg-white/75 p-3'>
                <Rocket className='h-5 w-5 text-[#f3a712]' />
                <p className='mt-2 text-sm font-semibold text-[#1d2838]'>Fast Execution</p>
              </div>
            </div>

            <div className='mt-8'>
              <Link to='/Projects' className='inline-flex items-center gap-2 rounded-full bg-[#182335] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#101827]'>
                View Selected Work
                <ArrowUpRight className='h-4 w-4' />
              </Link>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Bio
