import { Link } from 'react-router-dom'
import { ArrowLeft, Orbit } from 'lucide-react'
import SEO from '../components/SEO'

const NotFound = () => {
    return (
        <section className='section-wrap flex min-h-[78vh] items-center justify-center py-10'>
            <SEO title='404 | Page Not Found' description="The page you're looking for doesn't exist." />

            <div className='relative w-full max-w-3xl overflow-hidden rounded-[34px] border border-[var(--line)] bg-[var(--surface)] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.16)] md:p-12'>
                <div className='pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[var(--accent)]/18 blur-3xl' />
                <div className='pointer-events-none absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-[var(--accent-2)]/18 blur-3xl' />

                <div className='relative'>
                    <Orbit className='mx-auto h-9 w-9 text-[var(--accent-2)]' />
                    <p className='mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]'>Route Missed</p>
                    <h1 className='display-title mt-2 text-6xl text-[var(--ink)] sm:text-8xl'>404</h1>
                    <p className='mx-auto mt-3 max-w-md text-[var(--ink-soft)]'>
                        The page you requested cannot be found. It may have moved or no longer exists.
                    </p>

                    <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
                        <Link to='/' className='inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-[var(--bg)] transition hover:-translate-y-0.5 hover:opacity-90'>
                            <ArrowLeft className='h-4 w-4' />
                            Back Home
                        </Link>
                        <Link to='/Projects' className='inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]'>
                            Explore Projects
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default NotFound
