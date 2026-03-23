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
                <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#ef3e2f]/30 border-t-[#ef3e2f]'></div>
            </div>
        )
    }

    if (!config) return <p className='text-[#5b6978]'>Failed to load config.</p>

    const inputClass = 'w-full rounded-2xl border border-black/10 bg-white/90 px-4 py-3 text-[#1f2937] placeholder:text-[#748295] focus:border-[#0c7fa3]/55 focus:outline-none'

    return (
        <div className='space-y-6'>
            <div className='glass-card flex flex-wrap items-center justify-between gap-3 rounded-3xl p-5 md:p-6'>
                <div>
                    <h1 className='font-nevera text-3xl tracking-[0.08em] text-[#152132]'>Site Configuration</h1>
                    <p className='mt-1 text-sm text-[#556575]'>Update hero, biography, media references, and public profile links.</p>
                </div>
                <button onClick={handleSave} disabled={saving}
                    className='inline-flex items-center gap-2 rounded-full bg-[#ef3e2f] px-6 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#d92f22] disabled:opacity-50'>
                    <Save className='w-4 h-4' /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {status && (
                <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${status.type === 'success' ? 'border-emerald-600/20 bg-emerald-600/10 text-emerald-600' : 'border-red-600/20 bg-red-600/10 text-red-600'
                    }`}>{status.message}</div>
            )}

            <div className='space-y-8'>
                <div className='glass-card rounded-3xl p-6'>
                    <h2 className='mb-4 flex items-center gap-2 font-nevera text-xl tracking-[0.06em] text-[#1a2535]'><Settings2 className='h-5 w-5 text-[#ef3e2f]' />Hero Section</h2>
                    <div className='space-y-4'>
                        <div>
                            <label className='mb-1 block text-sm font-semibold text-[#475767]'>Hero Title</label>
                            <input type='text' value={config.heroTitle || ''} onChange={(e) => updateField('heroTitle', e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className='mb-1 block text-sm font-semibold text-[#475767]'>Hero Subtitle</label>
                            <input type='text' value={config.heroSubtitle || ''} onChange={(e) => updateField('heroSubtitle', e.target.value)} className={inputClass} />
                        </div>
                    </div>
                </div>

                <div className='glass-card rounded-3xl p-6'>
                    <h2 className='mb-4 font-nevera text-xl tracking-[0.06em] text-[#1a2535]'>About Section</h2>
                    <div className='space-y-4'>
                        <div>
                            <label className='mb-1 block text-sm font-semibold text-[#475767]'>About Text</label>
                            <textarea value={config.aboutText || ''} onChange={(e) => updateField('aboutText', e.target.value)} rows={4} className={`${inputClass} resize-none`} />
                        </div>
                        <div>
                            <label className='mb-1 block text-sm font-semibold text-[#475767]'>Bio Text</label>
                            <textarea value={config.bioText || ''} onChange={(e) => updateField('bioText', e.target.value)} rows={16} className={`${inputClass} resize-y`} />
                        </div>
                    </div>
                </div>

                <div className='glass-card rounded-3xl p-6'>
                    <h2 className='mb-4 font-nevera text-xl tracking-[0.06em] text-[#1a2535]'>Social Links</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {['github', 'linkedin', 'instagram', 'email'].map((field) => (
                            <div key={field}>
                                <label className='mb-1 block text-sm font-semibold capitalize text-[#475767]'>{field}</label>
                                <input type='text' value={config.socialLinks?.[field] || ''} onChange={(e) => updateSocial(field, e.target.value)} className={inputClass} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className='glass-card rounded-3xl p-6'>
                    <h2 className='mb-4 font-nevera text-xl tracking-[0.06em] text-[#1a2535]'>Other and Media</h2>
                    <div className='space-y-4'>
                        <div>
                            <label className='mb-1 block text-sm font-semibold text-[#475767]'>Resume URL</label>
                            <input type='url' value={config.resumeUrl || ''} onChange={(e) => updateField('resumeUrl', e.target.value)} className={inputClass} placeholder='https://drive.google.com/...' />
                        </div>
                        <div>
                            <label className='mb-1 block text-sm font-semibold text-[#475767]'>Hero Image URL</label>
                            <input type='text' value={config.heroImage || ''} onChange={(e) => updateField('heroImage', e.target.value)} className={inputClass} placeholder='/uploads/...' />
                        </div>
                        <div>
                            <label className='mb-1 block text-sm font-semibold text-[#475767]'>About Image URL</label>
                            <input type='text' value={config.aboutImage || ''} onChange={(e) => updateField('aboutImage', e.target.value)} className={inputClass} placeholder='/uploads/...' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SiteConfigAdmin
