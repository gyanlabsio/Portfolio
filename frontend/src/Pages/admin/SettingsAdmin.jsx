import { useState, useEffect } from 'react'
import { Save, Settings, Layout, Link as LinkIcon, User, FileText } from 'lucide-react'
import { getSettings, updateSettings } from '../../api/settings'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

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
                    aboutImage: '', bioHeading: 'Biography', bioSubheading: 'Thoughtful engineering. Character-rich interfaces. Relentless iteration.', bioText: '', readmeContent: '',
                    footerHeading: 'Build Something\nRemarkable.', footerSubheading: 'Available for selected projects',
                    bioSkills: [
                        { title: 'Product Direction', icon: 'Compass' },
                        { title: 'Design Thinking', icon: 'Lightbulb' },
                        { title: 'Fast Execution', icon: 'Rocket' }
                    ],
                    logoUrl: '', faviconUrl: '', resumeUrl: '',
                    availabilityStatus: 'AVAILABLE',
                    socialLinks: { github: '', linkedin: '', twitter: '', instagram: '' },
                    homepageSections: { projects: true, services: true, testimonials: true, content: true, contact: true, aboutMyWork: true },
                    aboutMyWorkHeading: 'ABOUT OUR COMPANY', aboutMyWorkText: '',
                    aboutMyWorkDropdowns: [
                        { title: 'OUR MISSION', content: 'To deliver exceptional digital experiences.' },
                        { title: 'OUR VISION', content: 'To be the leading engineering partner for growth.' },
                        { title: 'OUR JOURNEY', content: 'Started as a solo developer, now partnering with global brands.' }
                    ]
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

    const handleAddStat = () => {
        setSettings(prev => ({
            ...prev,
            aboutStats: [...(prev.aboutStats || []), { value: '', label: '', description: '' }]
        }))
    }

    const handleRemoveStat = (index) => {
        setSettings(prev => ({
            ...prev,
            aboutStats: prev.aboutStats.filter((_, i) => i !== index)
        }))
    }

    const handleStatChange = (index, field, value) => {
        setSettings(prev => {
            const newStats = [...(prev.aboutStats || [])]
            newStats[index] = { ...newStats[index], [field]: value }
            return { ...prev, aboutStats: newStats }
        })
    }

    const handleAddDropdown = () => {
        setSettings(prev => ({
            ...prev,
            aboutMyWorkDropdowns: [...(prev.aboutMyWorkDropdowns || []), { title: '', content: '' }]
        }))
    }

    const handleRemoveDropdown = (index) => {
        setSettings(prev => ({
            ...prev,
            aboutMyWorkDropdowns: prev.aboutMyWorkDropdowns.filter((_, i) => i !== index)
        }))
    }

    const handleDropdownChange = (index, field, value) => {
        setSettings(prev => {
            const newDropdowns = [...(prev.aboutMyWorkDropdowns || [])]
            newDropdowns[index] = { ...newDropdowns[index], [field]: value }
            return { ...prev, aboutMyWorkDropdowns: newDropdowns }
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
            <div className=' rounded-none py-14'>
                <div className='mx-auto h-8 w-8 animate-spin rounded-none border-2 border-[var(--accent)]/30 border-t-[var(--accent)]'></div>
            </div>
        )
    }

    return (
        <div className='space-y-6'>
            <div className=' flex flex-wrap items-center justify-between gap-4 rounded-none p-5 md:p-6'>
                <div>
                    <h1 className='font-nevera text-3xl tracking-[0.08em] text-[var(--ink)]'>Site Settings</h1>
                    <p className='mt-1 text-sm text-[var(--ink-soft)]'>Manage your global configuration, identity, and features.</p>
                </div>
                <button onClick={handleSubmit} disabled={saving} className=' button-pop flex items-center gap-2 rounded-none bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-2)] disabled:opacity-50'>
                    {saving ? <div className='h-4 w-4 animate-spin rounded-none border-2 border-white/30 border-t-white'></div> : <Save className='h-4 w-4' />} 
                    Save Changes
                </button>
            </div>

            <form onSubmit={handleSubmit} className='grid gap-6 lg:grid-cols-2'>
                {/* Brand & Identity */}
                <div className=' rounded-none p-6'>
                    <h2 className='font-nevera text-xl text-[var(--ink)] mb-4 flex items-center gap-2'><User className='h-5 w-5 text-[var(--accent)]' /> Brand & Identity</h2>
                    <div className='space-y-4'>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Site Title</label>
                            <input type='text' required value={settings.siteTitle || ''} onChange={e => handleChange('siteTitle', e.target.value)} className='w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' />
                        </div>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Tagline</label>
                            <input type='text' value={settings.tagline || ''} onChange={e => handleChange('tagline', e.target.value)} className='w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' />
                        </div>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Hero Badge Text</label>
                            <input type='text' value={settings.heroBadge || ''} onChange={e => handleChange('heroBadge', e.target.value)} placeholder="Design + Engineering" className='w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' />
                        </div>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Description</label>
                            <textarea rows="3" value={settings.description || ''} onChange={e => handleChange('description', e.target.value)} className='w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none resize-none' />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Contact Email</label>
                                <input type='email' required value={settings.email || ''} onChange={e => handleChange('email', e.target.value)} className='w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' />
                            </div>
                            <div>
                                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Phone</label>
                                <input type='text' value={settings.phone || ''} onChange={e => handleChange('phone', e.target.value)} className='w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' />
                            </div>
                        </div>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Availability Status</label>
                            <select value={settings.availabilityStatus || 'AVAILABLE'} onChange={e => handleChange('availabilityStatus', e.target.value)} className='w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none'>
                                <option value="AVAILABLE">AVAILABLE (Open to work)</option>
                                <option value="BUSY">BUSY (Limited capacity)</option>
                                <option value="UNAVAILABLE">UNAVAILABLE (Not taking clients)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* About Page Details */}
                <div className=' rounded-none p-6 lg:col-span-2'>
                    <h2 className='font-nevera text-xl text-[var(--ink)] mb-4 flex items-center gap-2'><User className='h-5 w-5 text-[var(--accent)]' /> About Page Details</h2>
                    <div className='grid gap-6 md:grid-cols-2'>
                        {/* Hero Section */}
                        <div className='space-y-4'>
                            <h3 className='text-sm font-bold text-[var(--ink)] border-b border-[var(--line)] pb-2'>Hero Section</h3>
                            <div>
                                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Heading</label>
                                <input type='text' value={settings.aboutHeroHeading || ''} onChange={e => handleChange('aboutHeroHeading', e.target.value)} className='w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' placeholder="WHERE DESIGN MEETS ENGINEERING" />
                            </div>
                            <div>
                                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Subheading</label>
                                <input type='text' value={settings.aboutHeroSubheading || ''} onChange={e => handleChange('aboutHeroSubheading', e.target.value)} className='w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' placeholder="GET TO KNOW ME CLOSELY" />
                            </div>
                            <div>
                                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Brand Name / Logo Text</label>
                                <input type='text' value={settings.aboutHeroBrandName || ''} onChange={e => handleChange('aboutHeroBrandName', e.target.value)} className='w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' placeholder="GYANARANJAN" />
                            </div>
                        </div>

                        {/* Impact / Stats Section */}
                        <div className='space-y-4'>
                            <h3 className='text-sm font-bold text-[var(--ink)] border-b border-[var(--line)] pb-2'>Impact in Numbers</h3>
                            <div>
                                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Stats Heading</label>
                                <input type='text' value={settings.aboutStatsHeading || ''} onChange={e => handleChange('aboutStatsHeading', e.target.value)} className='w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' placeholder="OUR IMPACT IN NUMBERS" />
                            </div>
                            <div>
                                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Stats Image URL</label>
                                <input type='url' value={settings.aboutStatsImage || ''} onChange={e => handleChange('aboutStatsImage', e.target.value)} className='w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' placeholder="https://" />
                            </div>
                            
                            <div className='pt-2'>
                                <div className='flex items-center justify-between mb-3'>
                                    <label className='block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Stat Cards</label>
                                    <button type="button" onClick={handleAddStat} className='text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-2)] transition'>+ Add Stat</button>
                                </div>
                                <div className='space-y-3'>
                                    {(settings.aboutStats || []).map((stat, index) => (
                                        <div key={index} className='flex gap-3 items-start border border-[var(--line)] rounded-none p-3 bg-[var(--surface)]'>
                                            <div className='flex-1 space-y-2'>
                                                <div className='flex gap-2'>
                                                    <input type='text' value={stat.value} onChange={e => handleStatChange(index, 'value', e.target.value)} className='w-1/3 rounded-none border border-[var(--line)] bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' placeholder="e.g. 48+" />
                                                    <input type='text' value={stat.label} onChange={e => handleStatChange(index, 'label', e.target.value)} className='w-2/3 rounded-none border border-[var(--line)] bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' placeholder="SUCCESSFUL PROJECTS" />
                                                </div>
                                                <textarea rows="2" value={stat.description} onChange={e => handleStatChange(index, 'description', e.target.value)} className='w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none resize-none' placeholder="Description..." />
                                            </div>
                                            <button type="button" onClick={() => handleRemoveStat(index)} className='p-2 text-[var(--ink-soft)] hover:text-red-500 transition rounded-none bg-[var(--bg)] border border-[var(--line)]'>
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About My Work */}
                <div className=' rounded-none p-6'>
                    <h2 className='font-nevera text-xl text-[var(--ink)] mb-4 flex items-center gap-2'><FileText className='h-5 w-5 text-[var(--accent)]' /> About My Work Section</h2>
                    <div className='space-y-4'>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Heading</label>
                            <input type='text' value={settings.aboutMyWorkHeading || ''} onChange={e => handleChange('aboutMyWorkHeading', e.target.value)} className='w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' placeholder="ABOUT OUR COMPANY" />
                        </div>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Description Text</label>
                            <textarea rows="4" value={settings.aboutMyWorkText || ''} onChange={e => handleChange('aboutMyWorkText', e.target.value)} className='w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none resize-none' placeholder="At our studio, we're more than just developers..." />
                        </div>
                        
                        <div className='pt-4 border-t border-[var(--line)] mt-4'>
                            <div className='flex items-center justify-between mb-3'>
                                <label className='block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Dropdowns (Right side)</label>
                                <button type="button" onClick={handleAddDropdown} className='text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-2)] transition'>+ Add Dropdown</button>
                            </div>
                            <div className='space-y-4'>
                                {(settings.aboutMyWorkDropdowns || []).map((dropdown, index) => (
                                    <div key={index} className='flex gap-3 items-start p-3 border border-[var(--line)] rounded-none bg-[var(--bg)] relative'>
                                        <div className='flex-1 space-y-3'>
                                            <input type='text' value={dropdown.title} onChange={e => handleDropdownChange(index, 'title', e.target.value)} className='w-full rounded-none border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' placeholder="Dropdown Title (e.g. OUR MISSION)" />
                                            <textarea rows="2" value={dropdown.content} onChange={e => handleDropdownChange(index, 'content', e.target.value)} className='w-full rounded-none border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none resize-none' placeholder="Dropdown Content" />
                                        </div>
                                        <button type="button" onClick={() => handleRemoveDropdown(index)} className='p-2 text-[var(--ink-soft)] hover:text-red-500 transition rounded-none bg-[var(--surface)] border border-[var(--line)]'>
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Media Links */}
                <div className=' rounded-none p-6'>
                    <h2 className='font-nevera text-xl text-[var(--ink)] mb-4 flex items-center gap-2'><LinkIcon className='h-5 w-5 text-[var(--accent)]' /> External Links & Media</h2>
                    <div className='space-y-4'>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Logo URL</label>
                            <input type='url' value={settings.logoUrl || ''} onChange={e => handleChange('logoUrl', e.target.value)} className='w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' placeholder="https://" />
                        </div>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Favicon URL</label>
                            <input type='url' value={settings.faviconUrl || ''} onChange={e => handleChange('faviconUrl', e.target.value)} className='w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' placeholder="https://" />
                        </div>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Resume URL (PDF link)</label>
                            <input type='url' value={settings.resumeUrl || ''} onChange={e => handleChange('resumeUrl', e.target.value)} className='w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' placeholder="https://" />
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className=' rounded-none p-6'>
                    <h2 className='font-nevera text-xl text-[var(--ink)] mb-4 flex items-center gap-2'><LinkIcon className='h-5 w-5 text-[var(--accent)]' /> Social Profiles</h2>
                    <div className='space-y-4'>
                        {['github', 'linkedin', 'twitter', 'instagram'].map(platform => (
                            <div key={platform}>
                                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>{platform}</label>
                                <input type='url' value={settings.socialLinks?.[platform] || ''} onChange={e => handleNestedChange('socialLinks', platform, e.target.value)} className='w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' placeholder={`https://${platform}.com/...`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Homepage Toggles */}
                <div className=' rounded-none p-6'>
                    <h2 className='font-nevera text-xl text-[var(--ink)] mb-4 flex items-center gap-2'><Layout className='h-5 w-5 text-[var(--accent)]' /> Homepage Sections</h2>
                    <p className='text-sm text-[var(--ink-soft)] mb-6'>Toggle these to dynamically show or hide sections on your frontend homepage.</p>
                    <div className='space-y-4'>
                        {['projects', 'services', 'testimonials', 'content', 'contact', 'aboutMyWork'].map(section => (
                            <label key={section} className='flex items-center justify-between cursor-pointer rounded-none bg-[var(--surface)] p-3 hover:bg-[var(--bg-alt)] transition'>
                                <span className='text-sm font-semibold text-[var(--ink)] capitalize'>{section}</span>
                                <input 
                                    type="checkbox" 
                                    checked={settings.homepageSections?.[section] || false} 
                                    onChange={e => handleNestedChange('homepageSections', section, e.target.checked)} 
                                    className='h-5 w-5 rounded text-[var(--accent)] focus:ring-[var(--accent-2)] bg-[var(--bg)] border-[var(--line)]' 
                                />
                            </label>
                        ))}
                    </div>
                </div>
                {/* Footer Settings */}
                <div className=' rounded-none p-6'>
                    <h2 className='font-nevera text-xl text-[var(--ink)] mb-4 flex items-center gap-2'><Layout className='h-5 w-5 text-[var(--accent)]' /> Footer Settings</h2>
                    <div className='space-y-4'>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Footer Heading</label>
                            <textarea rows="2" value={settings.footerHeading || ''} onChange={e => handleChange('footerHeading', e.target.value)} className='w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none resize-none' placeholder="Build Something&#10;Remarkable." />
                        </div>
                        <div>
                            <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Footer Subheading</label>
                            <input type='text' value={settings.footerSubheading || ''} onChange={e => handleChange('footerSubheading', e.target.value)} className='w-full rounded-none border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' placeholder="Available for selected projects" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default SettingsAdmin
