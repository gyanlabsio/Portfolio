import { Github, Linkedin, Mail, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/Bio', label: 'Bio' },
  { to: '/Projects', label: 'Projects' },
  { to: '/Blog', label: 'Blog' },
  { to: '/Contact', label: 'Contact' },
]

const SOCIALS = [
  { href: 'https://github.com/gyanaranjan-das', icon: Github, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/gyanaranjan-das/', icon: Linkedin, label: 'LinkedIn' },
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
            <Link to='/' onClick={() => setOpen(false)} className='display-title focus-ring rounded-lg px-1 py-0.5 text-xl tracking-[0.08em] text-[#1f2a38] md:text-2xl'>
              Gyanaranjan.
            </Link>

            <nav className='hidden lg:flex items-center gap-2 rounded-full border border-black/10 bg-white/60 p-1'>
              {NAV_ITEMS.map((item) => {
                const active = location.pathname === item.to
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`focus-ring rounded-full px-4 py-2 text-sm font-semibold transition-all ${active ? 'bg-[#ef3e2f] text-white shadow-sm' : 'text-[#2a3442] hover:bg-black/5'}`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className='hidden lg:flex items-center gap-2'>
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={social.label}
                  className='focus-ring button-pop grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/70 text-[#1e2735] hover:border-[#0c7fa3] hover:text-[#0c7fa3]'
                >
                  <social.icon className='h-4 w-4' />
                </a>
              ))}
            </div>

            <button
              type='button'
              onClick={() => setOpen((prev) => !prev)}
              className='focus-ring button-pop grid h-10 w-10 place-items-center rounded-xl border border-black/10 bg-white/70 text-[#1e2735] lg:hidden'
              aria-label='Toggle menu'
            >
              {open ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className='fixed inset-0 z-40 bg-[#121720]/35 backdrop-blur-sm lg:hidden' onClick={() => setOpen(false)}>
          <aside
            className='ml-auto flex h-full w-[84vw] max-w-sm flex-col gap-6 border-l border-black/10 bg-[#f7f5ef] p-6 enter-fade'
            onClick={(event) => event.stopPropagation()}
          >
            <p className='display-title text-2xl text-[#1f2a38]'>Explore</p>

            <div className='stagger-children flex flex-col gap-2'>
              {NAV_ITEMS.map((item) => {
                const active = location.pathname === item.to
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`focus-ring button-pop rounded-xl border px-4 py-3 text-base font-semibold ${active ? 'border-[#ef3e2f]/40 bg-[#ef3e2f] text-white' : 'border-black/10 bg-white/70 text-[#1e2735]'}`}
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
                  className='focus-ring button-pop grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white text-[#1e2735]'
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
