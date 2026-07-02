import { Github, Linkedin, Mail, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'


const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Me' },
  { to: '/Projects', label: 'Projects' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/Blog', label: 'Blog' },
  { to: '/Testimonials', label: 'Testimonials' },
  { to: '/Contact', label: 'Contact' },
]

const SOCIALS = [
  { href: 'https://github.com/gyanlabsio', icon: Github, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/gyanlabs/', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:gyanlabs.io@gmail.com', icon: Mail, label: 'Email' },
]

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className='sticky top-0 z-50 pt-3 md:pt-4'>
      <div className='section-wrap'>
        <div className='glass-card surface-interactive rounded-2xl px-4 py-3 md:px-6 md:py-4'>
          <div className='flex items-center justify-between gap-4'>
            <Link to='/' onClick={() => setOpen(false)} className='display-title focus-ring rounded-lg px-1 py-0.5 text-xl tracking-[0.08em] text-[var(--ink)] md:text-2xl'>
              Gyanaranjan.
            </Link>

            <div className='flex items-center gap-2'>
              <div className='hidden lg:flex items-center gap-2'>

                <div className="w-[1px] h-6 bg-[var(--line)] mx-1"></div>
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={social.label}
                    className='focus-ring button-pop grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--accent-2)] hover:text-[var(--accent-2)]'
                  >
                    <social.icon className='h-4 w-4' />
                  </a>
                ))}
                <div className="w-[1px] h-6 bg-[var(--line)] mx-1"></div>
                <Link
                  to='/StartProject'
                  onClick={() => setOpen(false)}
                  className='focus-ring button-pop ml-1 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold whitespace-nowrap text-white transition hover:brightness-110'
                >
                  Start a Project
                </Link>
              </div>

              <button
                type='button'
                onClick={() => setOpen((prev) => !prev)}
                className='focus-ring button-pop grid h-10 w-10 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] lg:ml-2'
                aria-label='Toggle menu'
              >
                {open ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className='fixed inset-0 z-40 bg-[var(--ink)]/35 backdrop-blur-sm' onClick={() => setOpen(false)}>
          <aside
            className='ml-auto flex h-full w-[84vw] max-w-sm flex-col gap-6 border-l border-[var(--line)] bg-[var(--bg)] p-6 enter-fade'
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className='display-title text-2xl text-[var(--ink)]'>Explore</p>
              <button
                onClick={() => setOpen(false)}
                className="focus-ring button-pop rounded-full p-2 text-[var(--ink-soft)] hover:bg-[var(--surface)] hover:text-[var(--ink)]"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className='stagger-children flex flex-col gap-2'>
              {NAV_ITEMS.map((item) => {
                const active = location.pathname === item.to
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`focus-ring button-pop rounded-xl border px-4 py-3 text-base font-semibold ${active ? 'border-[var(--accent)]/40 bg-[var(--accent)] text-white' : 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]'}`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>

            <div className='mt-auto flex items-center gap-3 lg:hidden'>
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={social.label}
                  className='focus-ring button-pop grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]'
                >
                  <social.icon className='h-4 w-4' />
                </a>
              ))}
            </div>
            
            <Link
              to='/StartProject'
              onClick={() => setOpen(false)}
              className='focus-ring button-pop mt-2 flex w-full justify-center rounded-xl bg-[var(--accent)] px-4 py-3 text-base font-semibold text-white transition hover:brightness-110 lg:hidden'
            >
              Start a Project
            </Link>
          </aside>
        </div>
      )}
    </header>
  )
}

export default Navbar
