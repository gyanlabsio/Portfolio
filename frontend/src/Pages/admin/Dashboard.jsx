import { useState, useEffect } from 'react'
import { ArrowUpRight, FileText, FolderKanban, Mail, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getProjects } from '../../api/projects'
import { getPosts } from '../../api/blog'
import { getContacts } from '../../api/contact'

const Dashboard = () => {
    const [stats, setStats] = useState({ projects: 0, posts: 0, contacts: 0 })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [projRes, postRes, contactRes] = await Promise.allSettled([
                    getProjects(),
                    getPosts(true),
                    getContacts(),
                ])
                setStats({
                    projects: projRes.status === 'fulfilled' ? projRes.value.data.count : 0,
                    posts: postRes.status === 'fulfilled' ? postRes.value.data.count : 0,
                    contacts: contactRes.status === 'fulfilled' ? contactRes.value.data.count : 0,
                })
            } catch {
                // stats remain 0
            }
        }
        fetchStats()
    }, [])

    const cards = [
        { label: 'Projects', value: stats.projects, icon: FolderKanban, color: 'text-[var(--accent)]', tint: 'bg-[var(--accent)]/12' },
        { label: 'Blog Posts', value: stats.posts, icon: FileText, color: 'text-[var(--accent-2)]', tint: 'bg-[var(--accent-2)]/12' },
        { label: 'Messages', value: stats.contacts, icon: Mail, color: 'text-[var(--accent-3)]', tint: 'bg-[var(--accent-3)]/16' }
    ]

    return (
        <div className='space-y-6'>
            <header className=' enter-fade rounded-none p-6 md:p-8'>
                <div className='inline-flex items-center gap-2 rounded-none border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-soft)]'>
                    <Sparkles className='h-3.5 w-3.5 text-[var(--accent)]' />
                    Admin Center
                </div>
                <h1 className='mt-3 font-nevera text-4xl tracking-[0.08em] text-[var(--ink)]'>Dashboard</h1>
                <p className='mt-2 max-w-2xl text-sm text-[var(--ink-soft)]'>Overview of portfolio content, publishing status, and incoming messages.</p>
            </header>

            <div className='stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {cards.map((card) => (
                    <div key={card.label} className='  rounded-none border border-[var(--line)] p-5'>
                        <div className='flex items-center gap-4'>
                            <div className={`grid h-12 w-12 place-items-center rounded-none border border-[var(--line)] ${card.tint}`}>
                                <card.icon className={`h-5 w-5 ${card.color}`} />
                            </div>
                            <div>
                                <p className='font-nevera text-3xl text-[var(--ink)]'>{card.value}</p>
                                <p className='text-sm font-semibold text-[var(--ink-soft)]'>{card.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <section className='  rounded-none p-6 md:p-8'>
                <h2 className='font-nevera text-2xl tracking-[0.06em] text-[var(--ink)]'>Quick Actions</h2>
                <div className='mt-4 grid gap-3 sm:grid-cols-3'>
                    <Link to='/admin/projects' className='group   rounded-none border border-[var(--line)] bg-[var(--surface)] p-4 hover:border-[var(--accent)]/35'>
                        <p className='text-sm font-semibold text-[var(--ink)]'>New Project</p>
                        <p className='mt-1 text-xs text-[var(--ink-soft)]'>Add and publish a project case study.</p>
                        <ArrowUpRight className='mt-3 h-4 w-4 text-[var(--accent)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                    </Link>
                    <Link to='/admin/blog' className='group   rounded-none border border-[var(--line)] bg-[var(--surface)] p-4 hover:border-[var(--accent-2)]/35'>
                        <p className='text-sm font-semibold text-[var(--ink)]'>New Blog Post</p>
                        <p className='mt-1 text-xs text-[var(--ink-soft)]'>Draft, edit, and publish new writing.</p>
                        <ArrowUpRight className='mt-3 h-4 w-4 text-[var(--accent-2)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                    </Link>
                    <Link to='/admin/config' className='group   rounded-none border border-[var(--line)] bg-[var(--surface)] p-4 hover:border-[var(--accent-3)]/35'>
                        <p className='text-sm font-semibold text-[var(--ink)]'>Edit Site Config</p>
                        <p className='mt-1 text-xs text-[var(--ink-soft)]'>Update hero, bio, media, and social links.</p>
                        <ArrowUpRight className='mt-3 h-4 w-4 text-[var(--accent-3)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default Dashboard
