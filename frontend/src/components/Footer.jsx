import { Link } from 'react-router-dom'
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className='py-16'>
      <div className='section-wrap'>
        <div className='glass-card enter-fade rounded-[28px] p-6 md:p-10'>
          <div className='grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end'>
            <div className='space-y-4'>
              <p className='text-xs uppercase tracking-[0.22em] text-[#4f5a67]'>Available for selected projects</p>
              <h2 className='display-title text-4xl leading-tight text-[#1a2533] md:text-6xl'>
                Build Something
                <br />
                Remarkable.
              </h2>
              <a
                href='mailto:gyanlabs.io@gmail.com'
                className='focus-ring button-pop inline-flex items-center gap-2 rounded-full bg-[#ef3e2f] px-5 py-3 text-sm font-semibold text-white hover:bg-[#dd2f21]'
              >
                Start Conversation
                <ArrowUpRight className='h-4 w-4' />
              </a>
            </div>

            <div className='space-y-5'>
              <nav className='stagger-children grid grid-cols-2 gap-2 text-sm font-semibold text-[#2d3948]'>
                <Link to='/' className='focus-ring surface-interactive rounded-xl bg-white/70 px-3 py-2 hover:bg-white'>Home</Link>
                <Link to='/Bio' className='focus-ring surface-interactive rounded-xl bg-white/70 px-3 py-2 hover:bg-white'>Bio</Link>
                <Link to='/Projects' className='focus-ring surface-interactive rounded-xl bg-white/70 px-3 py-2 hover:bg-white'>Projects</Link>
                <Link to='/Blog' className='focus-ring surface-interactive rounded-xl bg-white/70 px-3 py-2 hover:bg-white'>Blog</Link>
              </nav>

              <div className='flex items-center gap-2'>
                <a href='https://github.com/gyanaranjan-das' target='_blank' rel='noopener noreferrer' className='focus-ring button-pop grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/80 text-[#1f2a38] hover:text-[#0c7fa3]'>
                  <Github className='h-4 w-4' />
                </a>
                <a href='https://www.linkedin.com/in/gyanaranjan-das/' target='_blank' rel='noopener noreferrer' className='focus-ring button-pop grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/80 text-[#1f2a38] hover:text-[#0c7fa3]'>
                  <Linkedin className='h-4 w-4' />
                </a>
                <a href='mailto:gyanlabs.io@gmail.com' target='_blank' rel='noopener noreferrer' className='focus-ring button-pop grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/80 text-[#1f2a38] hover:text-[#0c7fa3]'>
                  <Mail className='h-4 w-4' />
                </a>
              </div>
            </div>
          </div>

          <div className='mt-8 border-t border-black/10 pt-4 text-xs text-[#5a6675] md:flex md:items-center md:justify-between'>
            <p>© 2026 Gyanaranjan Das</p>
            <p>Designed and engineered at GyanLabs.io</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
