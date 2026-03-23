import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { LayoutDashboard, FolderKanban, FileText, Mail, Settings, LogOut, Home, PanelRightClose } from 'lucide-react'
import { useState } from 'react'

const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { to: '/admin/blog', label: 'Blog Posts', icon: FileText },
    { to: '/admin/contacts', label: 'Messages', icon: Mail },
    { to: '/admin/config', label: 'Site Config', icon: Settings },
]

const AdminLayout = () => {
    const { admin, logoutAdmin } = useAuth()
    const location = useLocation()
    const [open, setOpen] = useState(false)

    const isActive = (path, exact = false) => {
        if (exact) return location.pathname === path
        return location.pathname.startsWith(path)
    }

    return (
        <div className='min-h-screen bg-[#f3f0e7] text-[#162033]'>
            <div className='pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_10%,rgba(12,127,163,0.14),transparent_32%),radial-gradient(circle_at_88%_12%,rgba(239,62,47,0.16),transparent_30%)]' />

            <button
                type='button'
                onClick={() => setOpen((prev) => !prev)}
                className='focus-ring button-pop fixed right-4 top-4 z-50 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/85 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#1b2838] shadow-sm md:hidden'
            >
                <PanelRightClose className='h-4 w-4' />
                Menu
            </button>

            {open && <div className='fixed inset-0 z-40 bg-[#111827]/30 backdrop-blur-sm md:hidden' onClick={() => setOpen(false)} />}

            <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-black/10 bg-[#f7f5ef]/95 p-4 backdrop-blur-sm transition-transform md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className='glass-card enter-fade flex h-full flex-col rounded-2xl p-3'>
                    <div className='border-b border-black/10 p-4'>
                        <h1 className='font-nevera text-lg tracking-[0.14em] text-[#ef3e2f]'>CMS PANEL</h1>
                        <p className='mt-1 text-xs text-[#5d6b7a]'>{admin?.email}</p>
                    </div>

                    <nav className='stagger-children flex-1 space-y-1 overflow-y-auto p-2'>
                        {navItems.map((item) => (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setOpen(false)}
                                className={`focus-ring button-pop flex items-center gap-3 rounded-xl border px-3 py-3 text-sm font-semibold ${isActive(item.to, item.exact)
                                    ? 'border-[#ef3e2f]/35 bg-[#ef3e2f] text-white'
                                    : 'border-transparent text-[#364254] hover:border-black/10 hover:bg-white/80'
                                    }`}
                            >
                                <item.icon className='h-4 w-4' />
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className='space-y-1 border-t border-black/10 p-2'>
                        <Link to='/' onClick={() => setOpen(false)} className='focus-ring button-pop flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#364254] hover:bg-white/80'>
                            <Home className='h-4 w-4' /> View Site
                        </Link>
                        <button
                            onClick={logoutAdmin}
                            className='focus-ring button-pop flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-[#364254] hover:bg-[#ef3e2f]/10 hover:text-[#ef3e2f]'
                        >
                            <LogOut className='h-4 w-4' /> Logout
                        </button>
                    </div>
                </div>
            </aside>

            <main className='min-h-screen px-4 pb-8 pt-16 md:ml-72 md:px-8 md:pt-8'>
                <div className='section-wrap max-w-none md:w-auto'>
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default AdminLayout
