import { Link } from 'react-router-dom'
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getSettings } from '../api/settings'

const Footer = () => {
  const [config, setConfig] = useState(null)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await getSettings()
        setConfig(data.data)
      } catch (err) {
        console.error('Failed to load site config in Footer', err)
      }
    }
    fetchConfig()
  }, [])
  const handleScrollToTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.5 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const footerHeading = config?.footerHeading || 'Build Something\nRemarkable.'
  const footerSubheading = config?.footerSubheading || 'Available for selected projects'

  return (
    <footer className='py-16'>
      <div className='section-wrap'>
        <div className=' enter-fade rounded-none p-6 md:p-10'>
          <div className='grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end'>
            <div className='space-y-4'>
              <p className='text-xs uppercase tracking-[0.22em] text-[var(--ink-soft)]'>{footerSubheading}</p>
              <h2 className='display-title text-4xl leading-tight text-[var(--ink)] md:text-6xl whitespace-pre-line'>
                {footerHeading}
              </h2>
              <a
                href='mailto:gyanlabs.io@gmail.com'
                className=' button-pop inline-flex items-center gap-2 rounded-none bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white hover:brightness-110'
              >
                Start Conversation
                <ArrowUpRight className='h-4 w-4' />
              </a>
            </div>

            <div className='space-y-5'>
              <nav className='grid grid-cols-2 gap-2 text-sm font-bold text-[var(--ink)] uppercase tracking-widest'>
                <Link to='/' onClick={handleScrollToTop} className='rounded-none border border-[var(--line)] bg-[var(--surface)] px-3 py-2 hover:bg-[var(--ink)] hover:text-white transition-colors'>Home</Link>
                <Link to='/about' onClick={handleScrollToTop} className='rounded-none border border-[var(--line)] bg-[var(--surface)] px-3 py-2 hover:bg-[var(--ink)] hover:text-white transition-colors'>About</Link>
                <Link to='/Projects' onClick={handleScrollToTop} className='rounded-none border border-[var(--line)] bg-[var(--surface)] px-3 py-2 hover:bg-[var(--ink)] hover:text-white transition-colors'>Projects</Link>
                <Link to='/Blog' onClick={handleScrollToTop} className='rounded-none border border-[var(--line)] bg-[var(--surface)] px-3 py-2 hover:bg-[var(--ink)] hover:text-white transition-colors'>Blog</Link>
              </nav>

              <div className='flex items-center gap-2'>
                <a href='https://github.com/gyanaranjan-das' target='_blank' rel='noopener noreferrer' className=' button-pop grid h-10 w-10 place-items-center rounded-none border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-white transition-colors'>
                  <Github className='h-4 w-4' />
                </a>
                <a href='https://linkedin.com/in/gyanlabs' target='_blank' rel='noopener noreferrer' className=' button-pop grid h-10 w-10 place-items-center rounded-none border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-white transition-colors'>
                  <Linkedin className='h-4 w-4' />
                </a>
                <a href='mailto:gyanlabs.io@gmail.com' className=' button-pop grid h-10 w-10 place-items-center rounded-none border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-white transition-colors'>
                  <Mail className='h-4 w-4' />
                </a>
              </div>
            </div>
          </div>

          <div className='mt-8 border-t border-[var(--line)] pt-4 text-xs text-[var(--ink-soft)] md:flex md:items-center md:justify-between'>
            <div className='flex items-center gap-4 flex-wrap'>
                <p>© 2026 Gyanaranjan Das</p>
                <Link to='/privacy-policy' onClick={handleScrollToTop} className='hover:text-[var(--ink)] transition-colors'>Privacy Policy</Link>
                <span className='hidden sm:inline'>|</span>
                <Link to='/terms-and-conditions' onClick={handleScrollToTop} className='hover:text-[var(--ink)] transition-colors'>Terms & Conditions</Link>
                <span className='hidden sm:inline'>|</span>
                <Link to='/cookie-policy' onClick={handleScrollToTop} className='hover:text-[var(--ink)] transition-colors'>Cookie Policy</Link>
            </div>
            <p className='mt-2 md:mt-0'>Designed and engineered at GyanLabs.io</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
