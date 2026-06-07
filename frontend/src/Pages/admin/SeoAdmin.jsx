import { useState, useEffect } from 'react'
import { Save, Search, SearchCode, Globe, Trash2 } from 'lucide-react'
import { getGlobalSeo, getSeoBySlug, createSeo, updateSeo, deleteSeo } from '../../api/seo'

const SeoAdmin = () => {
    const [seoData, setSeoData] = useState({
        pageSlug: 'global',
        siteName: '',
        seoTitle: '',
        seoDescription: '',
        canonicalUrl: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        twitterCard: 'summary_large_image',
        twitterTitle: '',
        twitterDescription: ''
    })
    
    const [currentSlug, setCurrentSlug] = useState('global')
    const [searchSlug, setSearchSlug] = useState('global')
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [isNewRecord, setIsNewRecord] = useState(false)

    const fetchSeo = async (slug) => {
        try {
            setLoading(true)
            const fetchFn = slug === 'global' ? getGlobalSeo : () => getSeoBySlug(slug)
            const { data } = await fetchFn()
            
            if (data.data && data.data._id) {
                setSeoData(data.data)
                setIsNewRecord(false)
            } else {
                // Not found or empty global
                setSeoData({
                    pageSlug: slug, siteName: '', seoTitle: '', seoDescription: '', canonicalUrl: '',
                    ogTitle: '', ogDescription: '', ogImage: '', twitterCard: 'summary_large_image', twitterTitle: '', twitterDescription: ''
                })
                setIsNewRecord(true)
            }
            setCurrentSlug(slug)
        } catch (error) {
            console.error(error)
            if (error.response?.status === 404) {
                setSeoData({
                    pageSlug: slug, siteName: '', seoTitle: '', seoDescription: '', canonicalUrl: '',
                    ogTitle: '', ogDescription: '', ogImage: '', twitterCard: 'summary_large_image', twitterTitle: '', twitterDescription: ''
                })
                setIsNewRecord(true)
                setCurrentSlug(slug)
            } else {
                alert('Failed to fetch SEO data')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchSeo('global') }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchSlug.trim()) {
            fetchSeo(searchSlug.trim())
        }
    }

    const handleChange = (field, value) => {
        setSeoData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setSaving(true)
            if (isNewRecord) {
                await createSeo(seoData)
                setIsNewRecord(false)
            } else {
                await updateSeo(currentSlug, seoData)
            }
            alert('SEO Data saved successfully!')
        } catch (error) {
            console.error(error)
            alert('Failed to save SEO data.')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (currentSlug === 'global') {
            alert('Cannot delete global fallback. Just clear the fields and save.')
            return
        }
        if (!confirm(`Delete SEO data for "${currentSlug}"?`)) return
        try {
            await deleteSeo(currentSlug)
            fetchSeo('global')
            setSearchSlug('global')
        } catch (error) {
            console.error(error)
            alert('Failed to delete')
        }
    }

    return (
        <div className='space-y-6'>
            <div className='glass-card flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5 md:p-6'>
                <div>
                    <h1 className='font-nevera text-3xl tracking-[0.08em] text-[var(--ink)]'>SEO Management</h1>
                    <p className='mt-1 text-sm text-[var(--ink-soft)]'>Control metadata and social sharing cards for any route.</p>
                </div>
            </div>

            <div className='flex flex-col lg:flex-row gap-6'>
                {/* Sidebar Search */}
                <div className='w-full lg:w-1/3 space-y-4'>
                    <div className='glass-card rounded-2xl p-6'>
                        <h2 className='font-nevera text-xl text-[var(--ink)] mb-4 flex items-center gap-2'><Search className='h-5 w-5 text-[var(--accent)]' /> Find Route</h2>
                        <form onSubmit={handleSearch} className='flex gap-2'>
                            <input 
                                type="text" 
                                value={searchSlug} 
                                onChange={e => setSearchSlug(e.target.value)} 
                                placeholder="e.g. global, projects, blog-post-1" 
                                className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none' 
                            />
                            <button type="submit" className='rounded-xl bg-[var(--surface)] px-4 py-2 text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--bg-alt)]'>Go</button>
                        </form>
                        <div className='mt-4 pt-4 border-t border-[var(--line)]'>
                            <p className='text-xs text-[var(--ink-soft)] mb-2'>Quick Links:</p>
                            <button onClick={() => { setSearchSlug('global'); fetchSeo('global') }} className='w-full text-left px-3 py-2 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--surface)] rounded-xl flex items-center gap-2'>
                                <Globe className='h-4 w-4 text-[var(--accent)]' /> global (Default Fallback)
                            </button>
                        </div>
                    </div>

                    <div className='glass-card rounded-2xl p-6 border-l-4 border-l-[var(--accent)]'>
                        <h3 className='font-semibold text-[var(--ink)]'>Current Selection: <span className='text-[var(--accent)]'>{currentSlug}</span></h3>
                        <p className='text-xs text-[var(--ink-soft)] mt-1'>
                            {isNewRecord ? "No data exists yet for this route. Fill the form to create it." : "Editing existing SEO data for this route."}
                        </p>
                    </div>
                </div>

                {/* Main Form */}
                <div className='w-full lg:w-2/3'>
                    {loading ? (
                        <div className='glass-card rounded-2xl py-14'>
                            <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]'></div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className='glass-card rounded-2xl p-6 space-y-6'>
                            <div className='flex items-center justify-between border-b border-[var(--line)] pb-4'>
                                <h2 className='font-nevera text-xl text-[var(--ink)] flex items-center gap-2'>
                                    <SearchCode className='h-5 w-5 text-[var(--accent)]' /> Metadata Configuration
                                </h2>
                                <div className='flex items-center gap-2'>
                                    {!isNewRecord && currentSlug !== 'global' && (
                                        <button type="button" onClick={handleDelete} className='p-2 text-[var(--ink-soft)] hover:bg-red-500/10 hover:text-red-500 rounded-lg transition'>
                                            <Trash2 className='h-4 w-4' />
                                        </button>
                                    )}
                                    <button type="submit" disabled={saving} className='focus-ring button-pop flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-2)] disabled:opacity-50'>
                                        {saving ? <div className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white'></div> : <Save className='h-4 w-4' />} 
                                        Save Meta
                                    </button>
                                </div>
                            </div>

                            {/* Standard SEO */}
                            <div className='space-y-4'>
                                <h3 className='font-semibold text-[var(--ink)] text-sm uppercase tracking-wider'>Standard SEO</h3>
                                {currentSlug === 'global' && (
                                    <div>
                                        <label className='mb-1.5 block text-xs font-semibold text-[var(--ink-soft)]'>Site Name (Global Only)</label>
                                        <input type='text' value={seoData.siteName || ''} onChange={e => handleChange('siteName', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none' />
                                    </div>
                                )}
                                <div>
                                    <label className='mb-1.5 block text-xs font-semibold text-[var(--ink-soft)]'>SEO Title (&lt;title&gt;)</label>
                                    <input type='text' value={seoData.seoTitle || ''} onChange={e => handleChange('seoTitle', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none' />
                                </div>
                                <div>
                                    <label className='mb-1.5 block text-xs font-semibold text-[var(--ink-soft)]'>SEO Description (meta name="description")</label>
                                    <textarea rows="2" value={seoData.seoDescription || ''} onChange={e => handleChange('seoDescription', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none resize-none' />
                                </div>
                                <div>
                                    <label className='mb-1.5 block text-xs font-semibold text-[var(--ink-soft)]'>Canonical URL</label>
                                    <input type='url' value={seoData.canonicalUrl || ''} onChange={e => handleChange('canonicalUrl', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none' placeholder="https://" />
                                </div>
                            </div>

                            {/* Open Graph */}
                            <div className='space-y-4 pt-4 border-t border-[var(--line)]'>
                                <h3 className='font-semibold text-[var(--ink)] text-sm uppercase tracking-wider'>Open Graph (Facebook / LinkedIn)</h3>
                                <div>
                                    <label className='mb-1.5 block text-xs font-semibold text-[var(--ink-soft)]'>OG Title</label>
                                    <input type='text' value={seoData.ogTitle || ''} onChange={e => handleChange('ogTitle', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none' />
                                </div>
                                <div>
                                    <label className='mb-1.5 block text-xs font-semibold text-[var(--ink-soft)]'>OG Description</label>
                                    <textarea rows="2" value={seoData.ogDescription || ''} onChange={e => handleChange('ogDescription', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none resize-none' />
                                </div>
                                <div>
                                    <label className='mb-1.5 block text-xs font-semibold text-[var(--ink-soft)]'>OG Image URL</label>
                                    <input type='url' value={seoData.ogImage || ''} onChange={e => handleChange('ogImage', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none' placeholder="https://" />
                                </div>
                            </div>

                            {/* Twitter Card */}
                            <div className='space-y-4 pt-4 border-t border-[var(--line)]'>
                                <h3 className='font-semibold text-[var(--ink)] text-sm uppercase tracking-wider'>Twitter</h3>
                                <div>
                                    <label className='mb-1.5 block text-xs font-semibold text-[var(--ink-soft)]'>Twitter Card Type</label>
                                    <select value={seoData.twitterCard || 'summary_large_image'} onChange={e => handleChange('twitterCard', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none'>
                                        <option value="summary_large_image">summary_large_image</option>
                                        <option value="summary">summary</option>
                                    </select>
                                </div>
                                <div>
                                    <label className='mb-1.5 block text-xs font-semibold text-[var(--ink-soft)]'>Twitter Title</label>
                                    <input type='text' value={seoData.twitterTitle || ''} onChange={e => handleChange('twitterTitle', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none' />
                                </div>
                                <div>
                                    <label className='mb-1.5 block text-xs font-semibold text-[var(--ink-soft)]'>Twitter Description</label>
                                    <textarea rows="2" value={seoData.twitterDescription || ''} onChange={e => handleChange('twitterDescription', e.target.value)} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none resize-none' />
                                </div>
                            </div>

                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SeoAdmin
