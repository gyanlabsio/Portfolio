import { useState, useEffect } from 'react'
import { Trash2, Mail, MailOpen, MessageSquareText } from 'lucide-react'
import { getContacts, markAsRead, deleteContact } from '../../api/contact'

const ContactsAdmin = () => {
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState(null)

    const fetchAll = async () => {
        try {
            const { data } = await getContacts()
            setContacts(data.data)
        } catch { /* empty */ } finally { setLoading(false) }
    }

    useEffect(() => { fetchAll() }, [])

    const handleMarkRead = async (id) => {
        try {
            await markAsRead(id)
            fetchAll()
        } catch { /* empty */ }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this message?')) return
        try {
            await deleteContact(id)
            setSelected(null)
            fetchAll()
        } catch { /* empty */ }
    }

    const unreadCount = contacts.filter(c => !c.read).length

    return (
        <div className='space-y-5'>
            <div className='glass-card flex flex-wrap items-center gap-3 rounded-3xl p-5 md:p-6'>
                <h1 className='font-nevera text-3xl tracking-[0.08em] text-[var(--ink)]'>Messages</h1>
                {unreadCount > 0 && (
                    <span className='rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--accent)]'>
                        {unreadCount} unread
                    </span>
                )}
                <p className='w-full text-sm text-[var(--ink-soft)]'>Read, track, and clear incoming contact messages.</p>
            </div>

            <div className='flex flex-col lg:flex-row gap-6'>
                <div className='w-full space-y-2 pr-2 lg:w-1/2 lg:max-h-[70vh] lg:overflow-y-auto'>
                    {loading ? (
                        <div className='glass-card rounded-2xl py-14'>
                            <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]'></div>
                        </div>
                    ) : contacts.length === 0 ? (
                        <div className='glass-card rounded-2xl py-16 text-center'>
                            <MessageSquareText className='mx-auto h-8 w-8 text-[var(--accent-2)]' />
                            <p className='mt-2 text-[var(--ink-soft)]'>No messages yet.</p>
                        </div>
                    ) : contacts.map((c) => (
                        <button key={c._id} onClick={() => { setSelected(c); if (!c.read) handleMarkRead(c._id) }}
                            className={`glass-card w-full rounded-xl border p-4 text-left transition ${selected?._id === c._id ? 'border-[var(--accent)]/35 bg-[var(--accent)]/5' : 'border-[var(--line)] hover:border-[var(--accent-2)]'
                                }`}>
                            <div className='flex items-center gap-2 mb-1'>
                                {c.read ? <MailOpen className='h-3 w-3 text-[var(--ink-soft)]' /> : <Mail className='h-3 w-3 text-[var(--accent)]' />}
                                <span className={`text-sm font-semibold ${c.read ? 'text-[var(--ink-soft)]' : 'text-[var(--ink)]'}`}>{c.name}</span>
                                <span className='ml-auto text-xs text-[var(--ink-soft)]'>{new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className='truncate text-xs text-[var(--ink-soft)]'>{c.subject} - {c.message}</p>
                        </button>
                    ))}
                </div>

                <div className='w-full lg:w-1/2'>
                    {selected ? (
                        <div className='glass-card rounded-2xl p-6'>
                            <div className='flex items-start justify-between mb-6'>
                                <div>
                                    <h2 className='text-xl font-semibold text-[var(--ink)]'>{selected.name}</h2>
                                    <p className='text-sm text-[var(--accent-2)]'>{selected.email}</p>
                                    <p className='mt-1 text-xs text-[var(--ink-soft)]'>
                                        {new Date(selected.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <button onClick={() => handleDelete(selected._id)} className='rounded-full border border-[var(--line)] bg-[var(--surface)] p-2 text-[var(--ink-soft)] transition hover:text-[var(--accent)]'>
                                    <Trash2 className='w-4 h-4' />
                                </button>
                            </div>
                            <div className='border-t border-[var(--line)] pt-4'>
                                <p className='mb-2 text-sm font-semibold text-[var(--ink-soft)]'>{selected.subject}</p>
                                <p className='whitespace-pre-wrap leading-relaxed text-[var(--ink)]'>{selected.message}</p>
                            </div>
                        </div>
                    ) : (
                        <div className='glass-card flex h-64 items-center justify-center rounded-2xl p-8'>
                            <p className='text-[var(--ink-soft)]'>Select a message to read</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ContactsAdmin
