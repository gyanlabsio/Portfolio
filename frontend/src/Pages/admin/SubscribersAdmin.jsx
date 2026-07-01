import { useState, useEffect, useCallback } from 'react'
import { Mail, Plus, Trash2, Send, Eye, RefreshCw, MoveUp, MoveDown, CheckCircle2, AlertCircle } from 'lucide-react'
import api from '../../api'

const SubscribersAdmin = () => {
    const [subscribers, setSubscribers] = useState([])
    const [loading, setLoading] = useState(false)
    const [subject, setSubject] = useState('')
    const [themeColor, setThemeColor] = useState('#0c7fa3')
    const [blocks, setBlocks] = useState([
        { id: '1', type: 'header', title: 'Weekly Updates', logoUrl: '' },
        { id: '2', type: 'text', content: '<p>Hi friend,</p><p>Welcome to this week\'s edition. Here is what I\'ve been building and writing about lately...</p>' }
    ])
    
    const [broadcasting, setBroadcasting] = useState(false)
    const [statusMessage, setStatusMessage] = useState('')
    const [statusType, setStatusType] = useState('success') // 'success' | 'error'

    const fetchSubscribers = useCallback(async () => {
        setLoading(true)
        try {
            const { data } = await api.get('/subscribers/admin')
            if (data.success) {
                setSubscribers(data.data)
            }
        } catch (error) {
            console.error('Failed to load subscribers', error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchSubscribers()
    }, [fetchSubscribers])

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this subscriber?')) return
        try {
            const { data } = await api.delete(`/subscribers/admin/${id}`)
            if (data.success) {
                setSubscribers(prev => prev.filter(sub => sub._id !== id))
            }
        } catch (error) {
            console.error(error)
            alert('Failed to delete subscriber')
        }
    }

    // Template Builder Actions
    const addBlock = (type) => {
        const id = Math.random().toString(36).substring(2, 9)
        let newBlock = { id, type }
        if (type === 'header') newBlock = { ...newBlock, title: 'New Header', logoUrl: '' }
        if (type === 'text') newBlock = { ...newBlock, content: '<p>Enter your rich text content here.</p>' }
        if (type === 'button') newBlock = { ...newBlock, label: 'Read More', url: 'https://' }
        if (type === 'image') newBlock = { ...newBlock, imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80' }
        if (type === 'spacer') newBlock = { ...newBlock, height: '20' }
        setBlocks(prev => [...prev, newBlock])
    }

    const deleteBlock = (id) => {
        setBlocks(prev => prev.filter(b => b.id !== id))
    }

    const moveBlock = (index, direction) => {
        const newBlocks = [...blocks]
        const targetIndex = index + direction
        if (targetIndex < 0 || targetIndex >= newBlocks.length) return
        const temp = newBlocks[index]
        newBlocks[index] = newBlocks[targetIndex]
        newBlocks[targetIndex] = temp
        setBlocks(newBlocks)
    }

    const updateBlock = (id, fields) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...fields } : b))
    }

    const handleBroadcast = async () => {
        if (!subject.trim()) {
            alert('Please specify an email subject')
            return
        }
        if (blocks.length === 0) {
            alert('Please add at least one content block')
            return
        }

        const activeSubscribers = subscribers.filter(s => s.status === 'SUBSCRIBED')
        if (activeSubscribers.length === 0) {
            alert('No subscribed recipients found')
            return
        }

        if (!window.confirm(`Broadcast this email newsletter to all ${activeSubscribers.length} subscribed users?`)) return

        setBroadcasting(true)
        setStatusMessage('')
        try {
            const { data } = await api.post('/subscribers/admin/broadcast', {
                subject,
                blocks,
                themeColor
            })
            if (data.success) {
                setStatusType('success')
                setStatusMessage(data.message)
            }
        } catch (error) {
            setStatusType('error')
            setStatusMessage(error.response?.data?.message || 'Failed to send broadcast')
        } finally {
            setBroadcasting(false)
        }
    }

    // Render local HTML preview matching backend compilation
    const renderPreviewHtml = () => {
        let contentHtml = ''
        blocks.forEach(block => {
            if (block.type === 'header') {
                contentHtml += `
                    <div style="padding: 20px 0; background-color: #f8fafc; border-bottom: 2px solid ${themeColor}; text-align: center;">
                        ${block.logoUrl ? `<img src="${block.logoUrl}" style="max-height: 40px; margin-bottom: 8px;" />` : ''}
                        <h1 style="font-size: 20px; color: #1e293b; margin: 0; font-family: sans-serif;">${block.title || 'Newsletter'}</h1>
                    </div>
                `
            }
            if (block.type === 'text') {
                contentHtml += `
                    <div style="padding: 20px; font-size: 14px; line-height: 1.6; color: #334155; font-family: sans-serif;">
                        ${block.content || ''}
                    </div>
                `
            }
            if (block.type === 'button') {
                contentHtml += `
                    <div style="padding: 15px 20px; text-align: center;">
                        <a href="${block.url}" target="_blank" style="background-color: ${themeColor}; color: white; text-decoration: none; padding: 10px 24px; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block; font-family: sans-serif;">
                            ${block.label}
                        </a>
                    </div>
                `
            }
            if (block.type === 'image') {
                contentHtml += `
                    <div style="padding: 10px 20px; text-align: center;">
                        <img src="${block.imageUrl}" style="max-width: 100%; border-radius: 8px; border: 1px solid #e2e8f0; height: auto;" />
                    </div>
                `
            }
            if (block.type === 'spacer') {
                contentHtml += `<div style="height: ${block.height || '20'}px;"></div>`
            }
        })

        return `
            <div style="background-color: #ffffff; max-width: 600px; width: 100%; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; margin: auto;">
                ${contentHtml}
                <div style="padding: 20px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b; font-family: sans-serif;">
                    <p style="margin: 0 0 5px 0;">You are receiving this email because you subscribed to our newsletter.</p>
                    <p style="margin: 0;"><a href="#" style="color: ${themeColor}; text-decoration: underline;">Unsubscribe from this list</a></p>
                </div>
            </div>
        `
    }

    const activeCount = subscribers.filter(s => s.status === 'SUBSCRIBED').length

    return (
        <div className='enter-fade space-y-6'>
            <div>
                <h1 className='display-title text-3xl text-[var(--ink)] sm:text-4xl'>Subscribers &amp; Broadcast</h1>
                <p className='mt-1 text-sm text-[var(--ink-soft)]'>Manage your mailing list and build interactive newsletters with the block template builder.</p>
            </div>

            <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
                {/* Left Panel: Subscribers List */}
                <div className='space-y-4 lg:col-span-1'>
                    <div className=' rounded-none p-5 space-y-4'>
                        <div className='flex items-center justify-between border-b border-[var(--line)] pb-3'>
                            <h2 className='font-semibold text-lg text-[var(--ink)]'>Subscribers ({activeCount})</h2>
                            <button onClick={fetchSubscribers} className='text-[var(--ink-soft)] hover:text-[var(--accent)]'>
                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {loading ? (
                            <div className='flex justify-center py-8'>
                                <div className='h-6 w-6 animate-spin rounded-none border-2 border-[var(--accent)]/30 border-t-[var(--accent)]' />
                            </div>
                        ) : subscribers.length === 0 ? (
                            <p className='text-xs text-[var(--ink-soft)] text-center py-6'>No subscribers yet.</p>
                        ) : (
                            <div className='space-y-2 max-h-[500px] overflow-y-auto pr-1'>
                                {subscribers.map(sub => (
                                    <div key={sub._id} className='flex items-center justify-between p-3 rounded-none border border-[var(--line)] bg-[var(--bg)] text-xs'>
                                        <div className='min-w-0 flex-1 space-y-0.5'>
                                            <p className='font-medium text-[var(--ink)] truncate'>{sub.email}</p>
                                            <p className={`font-bold ${sub.status === 'SUBSCRIBED' ? 'text-emerald-500' : 'text-[var(--ink-soft)]'}`}>
                                                {sub.status}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(sub._id)}
                                            className='p-1.5 text-[var(--ink-soft)] hover:text-red-500 transition rounded-none border border-[var(--line)] bg-[var(--surface)]'
                                        >
                                            <Trash2 className='h-3.5 w-3.5' />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Template Builder & Broadcast */}
                <div className='lg:col-span-2 space-y-6'>
                    {statusMessage && (
                        <div className={`p-4 rounded-none text-sm font-semibold flex items-start gap-2 border ${statusType === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                            {statusType === 'success' ? <CheckCircle2 className='h-5 w-5 shrink-0' /> : <AlertCircle className='h-5 w-5 shrink-0' />}
                            <span>{statusMessage}</span>
                        </div>
                    )}

                    <div className=' rounded-none p-6 space-y-6'>
                        <h2 className='font-semibold text-xl text-[var(--ink)] border-b border-[var(--line)] pb-3'>Interactive Template Builder</h2>

                        <div className='grid gap-6 md:grid-cols-2'>
                            {/* Editor Form */}
                            <div className='space-y-5'>
                                <div className='space-y-4'>
                                    <div>
                                        <label className='mb-1.5 block text-sm font-semibold text-[var(--ink)]'>Email Subject Line *</label>
                                        <input 
                                            type='text' 
                                            placeholder='e.g., Weekly Roundup #5' 
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            className='w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]'
                                        />
                                    </div>

                                    <div>
                                        <label className='mb-1.5 block text-sm font-semibold text-[var(--ink)]'>Theme Accent Color</label>
                                        <div className='flex items-center gap-2'>
                                            <input 
                                                type='color' 
                                                value={themeColor}
                                                onChange={(e) => setThemeColor(e.target.value)}
                                                className='h-8 w-8 cursor-pointer rounded-none border-0 bg-transparent'
                                            />
                                            <span className='text-xs font-mono text-[var(--ink-soft)] uppercase'>{themeColor}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className='border-t border-[var(--line)] pt-4 space-y-3'>
                                    <label className='block text-sm font-semibold text-[var(--ink)]'>Compose Blocks</label>
                                    <div className='flex flex-wrap gap-2'>
                                        <button onClick={() => addBlock('header')} className='rounded-none bg-[var(--bg)] border border-[var(--line)] px-3 py-1.5 text-xs font-bold text-[var(--ink)] hover:border-[var(--accent)] transition'>+ Header</button>
                                        <button onClick={() => addBlock('text')} className='rounded-none bg-[var(--bg)] border border-[var(--line)] px-3 py-1.5 text-xs font-bold text-[var(--ink)] hover:border-[var(--accent)] transition'>+ Text Block</button>
                                        <button onClick={() => addBlock('button')} className='rounded-none bg-[var(--bg)] border border-[var(--line)] px-3 py-1.5 text-xs font-bold text-[var(--ink)] hover:border-[var(--accent)] transition'>+ Button</button>
                                        <button onClick={() => addBlock('image')} className='rounded-none bg-[var(--bg)] border border-[var(--line)] px-3 py-1.5 text-xs font-bold text-[var(--ink)] hover:border-[var(--accent)] transition'>+ Image</button>
                                        <button onClick={() => addBlock('spacer')} className='rounded-none bg-[var(--bg)] border border-[var(--line)] px-3 py-1.5 text-xs font-bold text-[var(--ink)] hover:border-[var(--accent)] transition'>+ Spacer</button>
                                    </div>
                                </div>

                                <div className='space-y-4 max-h-[350px] overflow-y-auto pr-1'>
                                    {blocks.map((block, idx) => (
                                        <div key={block.id} className='rounded-none border border-[var(--line)] bg-[var(--bg)] p-4 space-y-3 relative group'>
                                            <div className='flex items-center justify-between border-b border-[var(--line)] pb-2'>
                                                <span className='text-xs font-bold uppercase tracking-wider text-[var(--accent)]'>{block.type} Block</span>
                                                <div className='flex items-center gap-1.5'>
                                                    <button onClick={() => moveBlock(idx, -1)} className='p-1 text-[var(--ink-soft)] hover:text-[var(--ink)]' disabled={idx === 0}><MoveUp className='h-3.5 w-3.5' /></button>
                                                    <button onClick={() => moveBlock(idx, 1)} className='p-1 text-[var(--ink-soft)] hover:text-[var(--ink)]' disabled={idx === blocks.length - 1}><MoveDown className='h-3.5 w-3.5' /></button>
                                                    <button onClick={() => deleteBlock(block.id)} className='p-1 text-[var(--ink-soft)] hover:text-red-500'><Trash2 className='h-3.5 w-3.5' /></button>
                                                </div>
                                            </div>

                                            {block.type === 'header' && (
                                                <div className='space-y-2 text-xs'>
                                                    <input 
                                                        type='text' 
                                                        placeholder='Header Title' 
                                                        value={block.title} 
                                                        onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                                                        className='w-full rounded-none border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1.5 text-[var(--ink)] focus:outline-none'
                                                    />
                                                    <input 
                                                        type='url' 
                                                        placeholder='Logo Image URL (optional)' 
                                                        value={block.logoUrl} 
                                                        onChange={(e) => updateBlock(block.id, { logoUrl: e.target.value })}
                                                        className='w-full rounded-none border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1.5 text-[var(--ink)] focus:outline-none'
                                                    />
                                                </div>
                                            )}

                                            {block.type === 'text' && (
                                                <div className='text-xs'>
                                                    <textarea 
                                                        rows='4'
                                                        placeholder='HTML / Raw text allowed...'
                                                        value={block.content} 
                                                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                                        className='w-full rounded-none border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1.5 text-[var(--ink)] focus:outline-none font-mono'
                                                    />
                                                </div>
                                            )}

                                            {block.type === 'button' && (
                                                <div className='space-y-2 text-xs'>
                                                    <input 
                                                        type='text' 
                                                        placeholder='Button Label' 
                                                        value={block.label} 
                                                        onChange={(e) => updateBlock(block.id, { label: e.target.value })}
                                                        className='w-full rounded-none border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1.5 text-[var(--ink)] focus:outline-none'
                                                    />
                                                    <input 
                                                        type='url' 
                                                        placeholder='Target Link (https://...)' 
                                                        value={block.url} 
                                                        onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                                                        className='w-full rounded-none border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1.5 text-[var(--ink)] focus:outline-none'
                                                    />
                                                </div>
                                            )}

                                            {block.type === 'image' && (
                                                <div className='text-xs'>
                                                    <input 
                                                        type='url' 
                                                        placeholder='Image URL (https://...)' 
                                                        value={block.imageUrl} 
                                                        onChange={(e) => updateBlock(block.id, { imageUrl: e.target.value })}
                                                        className='w-full rounded-none border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1.5 text-[var(--ink)] focus:outline-none'
                                                    />
                                                </div>
                                            )}

                                            {block.type === 'spacer' && (
                                                <div className='text-xs flex items-center gap-2'>
                                                    <span>Height (pixels):</span>
                                                    <input 
                                                        type='number' 
                                                        placeholder='20' 
                                                        value={block.height} 
                                                        onChange={(e) => updateBlock(block.id, { height: e.target.value })}
                                                        className='w-20 rounded-none border border-[var(--line)] bg-[var(--surface)] px-2 py-1 text-[var(--ink)] focus:outline-none'
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Live Preview Display */}
                            <div className='rounded-none border border-[var(--line)] bg-[var(--bg-alt)] p-4 flex flex-col'>
                                <span className='text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-3 flex items-center gap-1'>
                                    <Eye className='h-3.5 w-3.5' /> Live Email Preview
                                </span>
                                
                                <div className='flex-1 overflow-y-auto max-h-[500px] border border-[var(--line)] rounded-none bg-[#f1f5f9] p-4 flex items-center justify-center'>
                                    <div 
                                        className='w-full'
                                        dangerouslySetInnerHTML={{ __html: renderPreviewHtml() }} 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Broadcast Button */}
                        <div className='border-t border-[var(--line)] pt-5 flex justify-end'>
                            <button 
                                onClick={handleBroadcast}
                                disabled={broadcasting || activeCount === 0 || !subject.trim()}
                                className=' button-pop inline-flex items-center gap-2 rounded-none bg-[var(--accent)] px-6 py-3 text-sm font-bold text-white hover:brightness-110 disabled:opacity-50'
                            >
                                {broadcasting ? (
                                    <div className='h-4 w-4 animate-spin rounded-none border-2 border-white/30 border-t-white' />
                                ) : (
                                    <Send className='h-4 w-4' />
                                )}
                                {broadcasting ? 'Broadcasting Email...' : `Send Broadcast Newsletter (${activeCount} recipients)`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubscribersAdmin
