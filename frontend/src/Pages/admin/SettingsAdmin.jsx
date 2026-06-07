import { useState, useEffect } from 'react'
import { Save, Settings, Layout, Link as LinkIcon, User } from 'lucide-react'
import { getSettings, updateSettings } from '../../api/settings'

const SettingsAdmin = () => {
    const [settings, setSettings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const fetchAll = async () => {
        try {
            setLoading(true)
            const { data } = await getSettings()
            if (data.data) {
                setSettings(data.data)
            } else {
                // Default fallback if strictly necessary
                setSettings({
                    siteTitle: '', tagline: '', heroBadge: 'Design + Engineering', description: '', email: '', phone: '',
                    aboutImage: '', bioText: '',
                    bioSkills: [
                        { title: 'Product Direction', icon: 'Compass' },
                        { title: 'Design Thinking', icon: 'Lightbulb' },
                        { title: 'Fast Execution', icon: 'Rocket' }
                    ],
                    logoUrl: '', faviconUrl: '', resumeUrl: '',
                    availabilityStatus: 'AVAILABLE',
                    socialLinks: { github: '', linkedin: '', twitter: '', instagram: '' },
                    homepageSections: { projects: true, services: true, testimonials: true, content: true, contact: true }
                })
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAll() }, [])

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }))
    }

    const handleNestedChange = (parent, field, value) => {
        setSettings(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value
            }
        }))
    }

    const handleAddSkill = () => {
        setSettings(prev => ({
            ...prev,
            bioSkills: [...(prev.bioSkills || []), { title: '', icon: 'Compass' }]
        }))
    }

    const handleRemoveSkill = (index) => {
        setSettings(prev => ({
            ...prev,
            bioSkills: prev.bioSkills.filter((_, i) => i !== index)
        }))
    }

    const handleSkillChange = (index, field, value) => {
        setSettings(prev => {
            const newSkills = [...(prev.bioSkills || [])]
            newSkills[index] = { ...newSkills[index], [field]: value }
            return { ...prev, bioSkills: newSkills }
        })
    }

    const AVAILABLE_ICONS = ['Compass', 'Lightbulb', 'Rocket', 'Code', 'Database', 'Cpu', 'Monitor', 'PenTool', 'Layout', 'Layers', 'Globe', 'Smartphone', 'Server', 'Zap', 'Award', 'Briefcase', 'Star', 'Heart', 'Shield']

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setSaving(true)
            await updateSettings(settings)
            alert('Settings saved successfully!')
        } catch (error) {
            console.error(error)
            alert('Failed to save settings.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className='glass-card rounded-2xl py-14'>
                <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]'></div>
            </div>
        )
    }

    return (
        <div className='space-y-6'>
            <div className='glass-card flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5 md:p-6'>
                <div>
                    <h1 className='font-nevera text-3xl tracking-[0.08em] text-[var(--ink)]'>Site Settings</h1>
                    <p className='mt-1 text-sm text-[var(--ink-soft)]'>Manage your global configuration, identity, and features.</p>
                </div>
                <button onClick={handleSubmit} disabled={saving} className='focus-ring button-pop flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-2)] disabled:opacity-50'>
                    {saving ? <div className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white'></div> : <Save className='h-4 w-4' />} 
                    Save Changes
                </button>
            </div>

            <form onSubmit={handleSubmit} className='grid gap-6 lg:grid-cols-2'>
                {/* Brand & Identity */}
                <div className='glass-card rounded-2xl p-6'>
                    <h2 className='font-nevera text-xl text-[var(--ink)] mb-4 flex items-center gap-2'><User className='h-5 w-5 text-[var(--accent)]' /> Brand & Identity</h2>
                    <div className='space-y-4'>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Site Title</label>
                            <input type='text' required value={settings.siteTitle || ''} onChange={e => handleChange('siteTitle', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none' />
                        </div>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Tagline</label>
                            <input type='text' value={settings.tagline || ''} onChange={e => handleChange('tagline', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none' />
                        </div>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Hero Badge Text</label>
                            <input type='text' value={settings.heroBadge || ''} onChange={e => handleChange('heroBadge', e.target.value)} placeholder="Design + Engineering" className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none' />
                        </div>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Description</label>
                            <textarea rows="3" value={settings.description || ''} onChange={e => handleChange('description', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none resize-none' />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Contact Email</label>
                                <input type='email' required value={settings.email || ''} onChange={e => handleChange('email', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none' />
                            </div>
                            <div>
                                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Phone</label>
                                <input type='text' value={settings.phone || ''} onChange={e => handleChange('phone', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none' />
                            </div>
                        </div>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Availability Status</label>
                            <select value={settings.availabilityStatus || 'AVAILABLE'} onChange={e => handleChange('availabilityStatus', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none'>
                                <option value="AVAILABLE">AVAILABLE (Open to work)</option>
                                <option value="BUSY">BUSY (Limited capacity)</option>
                                <option value="UNAVAILABLE">UNAVAILABLE (Not taking clients)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Biography */}
                <div className='glass-card rounded-2xl p-6'>
                    <h2 className='font-nevera text-xl text-[var(--ink)] mb-4 flex items-center gap-2'><User className='h-5 w-5 text-[var(--accent)]' /> Biography</h2>
                    <div className='space-y-4'>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Bio Image URL</label>
                            <input type='url' value={settings.aboutImage || ''} onChange={e => handleChange('aboutImage', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none' placeholder="https://" />
                        </div>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Biography Text (Supports multi-line)</label>
                            <textarea rows="6" value={settings.bioText || ''} onChange={e => handleChange('bioText', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none resize-none' placeholder="I am a full-stack developer..." />
                        </div>
                        
                        <div className='pt-4 border-t border-[var(--line)] mt-4'>
                            <div className='flex items-center justify-between mb-3'>
                                <label className='block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Bio Skills</label>
                                <button type="button" onClick={handleAddSkill} className='text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-2)] transition'>+ Add Skill</button>
                            </div>
                            <div className='space-y-3'>
                                {(settings.bioSkills || []).map((skill, index) => (
                                    <div key={index} className='flex gap-3 items-start'>
                                        <div className='flex-1'>
                                            <input type='text' value={skill.title} onChange={e => handleSkillChange(index, 'title', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none' placeholder="Skill Title" />
                                        </div>
                                        <div className='w-32'>
                                            <select value={skill.icon} onChange={e => handleSkillChange(index, 'icon', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none'>
                                                {AVAILABLE_ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                                            </select>
                                        </div>
                                        <button type="button" onClick={() => handleRemoveSkill(index)} className='p-2 text-[var(--ink-soft)] hover:text-red-500 transition rounded-xl bg-[var(--surface)] border border-[var(--line)]'>
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Media Links */}
                <div className='glass-card rounded-2xl p-6'>
                    <h2 className='font-nevera text-xl text-[var(--ink)] mb-4 flex items-center gap-2'><LinkIcon className='h-5 w-5 text-[var(--accent)]' /> External Links & Media</h2>
                    <div className='space-y-4'>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Logo URL</label>
                            <input type='url' value={settings.logoUrl || ''} onChange={e => handleChange('logoUrl', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none' placeholder="https://" />
                        </div>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Favicon URL</label>
                            <input type='url' value={settings.faviconUrl || ''} onChange={e => handleChange('faviconUrl', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none' placeholder="https://" />
                        </div>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Resume URL (PDF link)</label>
                            <input type='url' value={settings.resumeUrl || ''} onChange={e => handleChange('resumeUrl', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none' placeholder="https://" />
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className='glass-card rounded-2xl p-6'>
                    <h2 className='font-nevera text-xl text-[var(--ink)] mb-4 flex items-center gap-2'><LinkIcon className='h-5 w-5 text-[var(--accent)]' /> Social Profiles</h2>
                    <div className='space-y-4'>
                        {['github', 'linkedin', 'twitter', 'instagram'].map(platform => (
                            <div key={platform}>
                                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>{platform}</label>
                                <input type='url' value={settings.socialLinks?.[platform] || ''} onChange={e => handleNestedChange('socialLinks', platform, e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none' placeholder={`https://${platform}.com/...`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Homepage Toggles */}
                <div className='glass-card rounded-2xl p-6'>
                    <h2 className='font-nevera text-xl text-[var(--ink)] mb-4 flex items-center gap-2'><Layout className='h-5 w-5 text-[var(--accent)]' /> Homepage Sections</h2>
                    <p className='text-sm text-[var(--ink-soft)] mb-6'>Toggle these to dynamically show or hide sections on your frontend homepage.</p>
                    <div className='space-y-4'>
                        {['projects', 'services', 'testimonials', 'content', 'contact'].map(section => (
                            <label key={section} className='flex items-center justify-between cursor-pointer rounded-xl bg-[var(--surface)] p-3 hover:bg-[var(--bg-alt)] transition'>
                                <span className='text-sm font-semibold text-[var(--ink)] capitalize'>{section}</span>
                                <input 
                                    type="checkbox" 
                                    checked={settings.homepageSections?.[section] || false} 
                                    onChange={e => handleNestedChange('homepageSections', section, e.target.checked)} 
                                    className='h-5 w-5 rounded text-[var(--accent)] focus:ring-[var(--accent)] bg-[var(--bg)] border-[var(--line)]' 
                                />
                            </label>
                        ))}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default SettingsAdmin
