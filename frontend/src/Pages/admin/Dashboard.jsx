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
        { label: 'Projects', value: stats.projects, icon: FolderKanban, color: 'text-[#ef3e2f]', tint: 'bg-[#ef3e2f]/12' },
        { label: 'Blog Posts', value: stats.posts, icon: FileText, color: 'text-[#0c7fa3]', tint: 'bg-[#0c7fa3]/12' },
        { label: 'Messages', value: stats.contacts, icon: Mail, color: 'text-[#f3a712]', tint: 'bg-[#f3a712]/16' }
    ]

    return (
        <div className='space-y-6'>
            <header className='glass-card enter-fade rounded-3xl p-6 md:p-8'>
                <div className='inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#4f5f70]'>
                    <Sparkles className='h-3.5 w-3.5 text-[#ef3e2f]' />
                    Admin Center
                </div>
                <h1 className='mt-3 font-nevera text-4xl tracking-[0.08em] text-[#152132]'>Dashboard</h1>
                <p className='mt-2 max-w-2xl text-sm text-[#566575]'>Overview of portfolio content, publishing status, and incoming messages.</p>
            </header>

            <div className='stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {cards.map((card) => (
                    <div key={card.label} className='glass-card surface-interactive rounded-2xl border border-white/70 p-5'>
                        <div className='flex items-center gap-4'>
                            <div className={`grid h-12 w-12 place-items-center rounded-xl border border-black/10 ${card.tint}`}>
                                <card.icon className={`h-5 w-5 ${card.color}`} />
                            </div>
                            <div>
                                <p className='font-nevera text-3xl text-[#172234]'>{card.value}</p>
                                <p className='text-sm font-semibold text-[#516071]'>{card.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <section className='glass-card surface-interactive rounded-3xl p-6 md:p-8'>
                <h2 className='font-nevera text-2xl tracking-[0.06em] text-[#182436]'>Quick Actions</h2>
                <div className='mt-4 grid gap-3 sm:grid-cols-3'>
                    <Link to='/admin/projects' className='group surface-interactive focus-ring rounded-2xl border border-black/10 bg-white/80 p-4 hover:border-[#ef3e2f]/35'>
                        <p className='text-sm font-semibold text-[#1d2938]'>New Project</p>
                        <p className='mt-1 text-xs text-[#5b6978]'>Add and publish a project case study.</p>
                        <ArrowUpRight className='mt-3 h-4 w-4 text-[#ef3e2f] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                    </Link>
                    <Link to='/admin/blog' className='group surface-interactive focus-ring rounded-2xl border border-black/10 bg-white/80 p-4 hover:border-[#0c7fa3]/35'>
                        <p className='text-sm font-semibold text-[#1d2938]'>New Blog Post</p>
                        <p className='mt-1 text-xs text-[#5b6978]'>Draft, edit, and publish new writing.</p>
                        <ArrowUpRight className='mt-3 h-4 w-4 text-[#0c7fa3] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                    </Link>
                    <Link to='/admin/config' className='group surface-interactive focus-ring rounded-2xl border border-black/10 bg-white/80 p-4 hover:border-[#f3a712]/35'>
                        <p className='text-sm font-semibold text-[#1d2938]'>Edit Site Config</p>
                        <p className='mt-1 text-xs text-[#5b6978]'>Update hero, bio, media, and social links.</p>
                        <ArrowUpRight className='mt-3 h-4 w-4 text-[#f3a712] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default Dashboard
