import { useState, useEffect } from 'react'
import { Save, Settings2 } from 'lucide-react'
import { getSiteConfig, updateSiteConfig } from '../../api/admin'

const SiteConfigAdmin = () => {
    const [config, setConfig] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [status, setStatus] = useState(null)

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const { data } = await getSiteConfig()
                setConfig(data.data)
            } catch { /* empty */ } finally { setLoading(false) }
        }
        fetchConfig()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        setStatus(null)
        try {
            await updateSiteConfig(config)
            setStatus({ type: 'success', message: 'Config saved!' })
        } catch (err) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to save' })
        } finally {
            setSaving(false)
        }
    }

    const updateField = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }))
    }

    const updateSocial = (field, value) => {
        setConfig(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [field]: value }
        }))
    }

    if (loading) {
        return (
            <div className='glass-card rounded-2xl py-14'>
                <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]'></div>
            </div>
        )
    }

    if (!config) return <p className='text-[var(--ink-soft)]'>Failed to load config.</p>

    const inputClass = 'w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--accent-2)]/55 focus:outline-none'

    return (
        <div className='space-y-6'>
            <div className='glass-card flex flex-wrap items-center justify-between gap-3 rounded-3xl p-5 md:p-6'>
                <div>
                    <h1 className='font-nevera text-3xl tracking-[0.08em] text-[var(--ink)]'>Site Configuration</h1>
                    <p className='mt-1 text-sm text-[var(--ink-soft)]'>Update hero, biography, media references, and public profile links.</p>
                </div>
                <button onClick={handleSave} disabled={saving}
                    className='inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-50'>
                    <Save className='w-4 h-4' /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {status && (
                <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${status.type === 'success' ? 'border-emerald-600/20 bg-emerald-600/10 text-emerald-600' : 'border-red-600/20 bg-red-600/10 text-red-600'
                    }`}>{status.message}</div>
            )}

            <div className='space-y-8'>
                <div className='glass-card rounded-3xl p-6'>
                    <h2 className='mb-4 flex items-center gap-2 font-nevera text-xl tracking-[0.06em] text-[var(--ink)]'><Settings2 className='h-5 w-5 text-[var(--accent)]' />Hero Section</h2>
                    <div className='space-y-4'>
                        <div>
                            <label className='mb-1 block text-sm font-semibold text-[var(--ink-soft)]'>Hero Title</label>
                            <input type='text' value={config.heroTitle || ''} onChange={(e) => updateField('heroTitle', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className='mb-1 block text-sm font-semibold text-[var(--ink-soft)]'>Hero Subtitle</label>
                            <input type='text' value={config.heroSubtitle || ''} onChange={(e) => updateField('heroSubtitle', e.target.value)} className={inputClass} />
                        </div>
                    </div>
                </div>

                <div className='glass-card rounded-3xl p-6'>
                    <h2 className='mb-4 font-nevera text-xl tracking-[0.06em] text-[var(--ink)]'>About Section</h2>
                    <div className='space-y-4'>
                        <div>
                            <label className='mb-1 block text-sm font-semibold text-[var(--ink-soft)]'>About Text</label>
                            <textarea value={config.aboutText || ''} onChange={(e) => updateField('aboutText', e.target.value)} rows={4} className={`${inputClass} resize-none`} />
                        </div>
                        <div>
                            <label className='mb-1 block text-sm font-semibold text-[var(--ink-soft)]'>Bio Text</label>
                            <textarea value={config.bioText || ''} onChange={(e) => updateField('bioText', e.target.value)} rows={16} className={`${inputClass} resize-y`} />
                        </div>
                    </div>
                </div>

                <div className='glass-card rounded-3xl p-6'>
                    <h2 className='mb-4 font-nevera text-xl tracking-[0.06em] text-[var(--ink)]'>Social Links</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {['github', 'linkedin', 'instagram', 'email'].map((field) => (
                            <div key={field}>
                                <label className='mb-1 block text-sm font-semibold capitalize text-[var(--ink-soft)]'>{field}</label>
                                <input type='text' value={config.socialLinks?.[field] || ''} onChange={(e) => updateSocial(field, e.target.value)} className={inputClass} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className='glass-card rounded-3xl p-6'>
                    <h2 className='mb-4 font-nevera text-xl tracking-[0.06em] text-[var(--ink)]'>Other and Media</h2>
                    <div className='space-y-4'>
                        <div>
                            <label className='mb-1 block text-sm font-semibold text-[var(--ink-soft)]'>Resume URL</label>
                            <input type='url' value={config.resumeUrl || ''} onChange={(e) => updateField('resumeUrl', e.target.value)} className={inputClass} placeholder='https://drive.google.com/...' />
                        </div>
                        <div>
                            <label className='mb-1 block text-sm font-semibold text-[var(--ink-soft)]'>Hero Image URL</label>
                            <input type='text' value={config.heroImage || ''} onChange={(e) => updateField('heroImage', e.target.value)} className={inputClass} placeholder='/uploads/...' />
                        </div>
                        <div>
                            <label className='mb-1 block text-sm font-semibold text-[var(--ink-soft)]'>About Image URL</label>
                            <input type='text' value={config.aboutImage || ''} onChange={(e) => updateField('aboutImage', e.target.value)} className={inputClass} placeholder='/uploads/...' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SiteConfigAdmin
