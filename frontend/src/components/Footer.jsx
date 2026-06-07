import { Link } from 'react-router-dom'
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
  const handleScrollToTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.5 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className='py-16'>
      <div className='section-wrap'>
        <div className='glass-card enter-fade rounded-[28px] p-6 md:p-10'>
          <div className='grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end'>
            <div className='space-y-4'>
              <p className='text-xs uppercase tracking-[0.22em] text-[var(--ink-soft)]'>Available for selected projects</p>
              <h2 className='display-title text-4xl leading-tight text-[var(--ink)] md:text-6xl'>
                Build Something
                <br />
                Remarkable.
              </h2>
              <a
                href='mailto:gyanlabs.io@gmail.com'
                className='focus-ring button-pop inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white hover:brightness-110'
              >
                Start Conversation
                <ArrowUpRight className='h-4 w-4' />
              </a>
            </div>

            <div className='space-y-5'>
              <nav className='stagger-children grid grid-cols-2 gap-2 text-sm font-semibold text-[var(--ink)]'>
                <Link to='/' onClick={handleScrollToTop} className='focus-ring surface-interactive rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 hover:bg-[var(--line)]'>Home</Link>
                <Link to='/Bio' onClick={handleScrollToTop} className='focus-ring surface-interactive rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 hover:bg-[var(--line)]'>Bio</Link>
                <Link to='/Projects' onClick={handleScrollToTop} className='focus-ring surface-interactive rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 hover:bg-[var(--line)]'>Projects</Link>
                <Link to='/Blog' onClick={handleScrollToTop} className='focus-ring surface-interactive rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 hover:bg-[var(--line)]'>Blog</Link>
              </nav>

              <div className='flex items-center gap-2'>
                <a href='https://github.com/gyanaranjan-das' target='_blank' rel='noopener noreferrer' className='focus-ring button-pop grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--accent-2)] hover:text-[var(--accent-2)]'>
                  <Github className='h-4 w-4' />
                </a>
                <a href='https://www.linkedin.com/in/gyanaranjan-das/' target='_blank' rel='noopener noreferrer' className='focus-ring button-pop grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--accent-2)] hover:text-[var(--accent-2)]'>
                  <Linkedin className='h-4 w-4' />
                </a>
                <a href='mailto:gyanlabs.io@gmail.com' target='_blank' rel='noopener noreferrer' className='focus-ring button-pop grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--accent-2)] hover:text-[var(--accent-2)]'>
                  <Mail className='h-4 w-4' />
                </a>
              </div>
            </div>
          </div>

          <div className='mt-8 border-t border-[var(--line)] pt-4 text-xs text-[var(--ink-soft)] md:flex md:items-center md:justify-between'>
            <p>© 2026 Gyanaranjan Das</p>
            <p>Designed and engineered at GyanLabs.io</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
