import { Github, Linkedin, Mail, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/Bio', label: 'Bio' },
  { to: '/Projects', label: 'Projects' },
  { to: '/Blog', label: 'Blog' },
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

            <nav className='hidden lg:flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] p-1'>
              {NAV_ITEMS.map((item) => {
                const active = location.pathname === item.to
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`focus-ring rounded-full px-4 py-2 text-sm font-semibold transition-all ${active ? 'bg-[var(--accent)] text-white shadow-sm' : 'text-[var(--ink)] hover:bg-[var(--line)]'}`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className='hidden lg:flex items-center gap-2'>
              <ThemeToggle />
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
            </div>

            <button
              type='button'
              onClick={() => setOpen((prev) => !prev)}
              className='focus-ring button-pop grid h-10 w-10 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] lg:hidden'
              aria-label='Toggle menu'
            >
              {open ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className='fixed inset-0 z-40 bg-[var(--ink)]/35 backdrop-blur-sm lg:hidden' onClick={() => setOpen(false)}>
          <aside
            className='ml-auto flex h-full w-[84vw] max-w-sm flex-col gap-6 border-l border-[var(--line)] bg-[var(--bg)] p-6 enter-fade'
            onClick={(event) => event.stopPropagation()}
          >
            <p className='display-title text-2xl text-[var(--ink)]'>Explore</p>

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

            <div className='mt-auto flex items-center gap-3'>
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
          </aside>
        </div>
      )}
    </header>
  )
}

export default Navbar
