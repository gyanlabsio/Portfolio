import { useState, useEffect, useCallback } from 'react'
import { Image, Search, Trash2, Copy, Upload, Check, FolderOpen } from 'lucide-react'
import api from '../../api'

const MediaAdmin = () => {
    const [files, setFiles] = useState([])
    const [total, setTotal] = useState(0)
    const [pages, setPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState('')
    const [selectedModule, setSelectedModule] = useState('')
    const [loading, setLoading] = useState(false)
    const [copiedId, setCopiedId] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [uploadModule, setUploadModule] = useState('PROJECT')
    const [uploadFolder, setUploadFolder] = useState('root')
    const [message, setMessage] = useState('')
    const [selectedFiles, setSelectedFiles] = useState([])

    const fetchFiles = useCallback(async () => {
        setLoading(true)
        try {
            const { data } = await api.get('/upload', {
                params: {
                    page: currentPage,
                    module: selectedModule || undefined,
                    search: search || undefined,
                    limit: 12
                }
            })
            if (data.success) {
                setFiles(data.data)
                setTotal(data.total)
                setPages(data.pages)
            }
        } catch (error) {
            console.error('Failed to load files', error)
        } finally {
            setLoading(false)
        }
    }, [currentPage, selectedModule, search])

    useEffect(() => {
        fetchFiles()
    }, [fetchFiles])

    const handleCopy = (url, id) => {
        navigator.clipboard.writeText(url)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this file permanently?')) return
        try {
            const { data } = await api.delete(`/upload/${id}`)
            if (data.success) {
                setFiles(prev => prev.filter(file => file._id !== id))
                setTotal(prev => prev - 1)
                setSelectedFiles(prev => prev.filter(selectedId => selectedId !== id))
            }
        } catch (error) {
            alert('Failed to delete file')
        }
    }

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedFiles.length} files permanently?`)) return
        try {
            const { data } = await api.post(`/upload/bulk-delete`, { ids: selectedFiles })
            if (data.success) {
                setFiles(prev => prev.filter(file => !selectedFiles.includes(file._id)))
                setTotal(prev => prev - selectedFiles.length)
                setSelectedFiles([])
            }
        } catch (error) {
            alert('Failed to delete files')
        }
    }

    const toggleSelection = (id) => {
        setSelectedFiles(prev => 
            prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
        )
    }

    const selectAll = () => {
        if (selectedFiles.length === files.length) {
            setSelectedFiles([])
        } else {
            setSelectedFiles(files.map(f => f._id))
        }
    }

    const handleUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        setMessage('')
        const formData = new FormData()
        formData.append('file', file)
        formData.append('module', uploadModule)
        formData.append('folder', uploadFolder)

        try {
            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            if (data.success) {
                setMessage('Uploaded successfully!')
                fetchFiles()
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Upload failed')
        } finally {
            setUploading(false)
            e.target.value = '' // Clear input
            setTimeout(() => setMessage(''), 3000)
        }
    }

    return (
        <div className='enter-fade space-y-6'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                    <h1 className='display-title text-3xl text-[var(--ink)] sm:text-4xl'>Media Library</h1>
                    <p className='mt-1 text-sm text-[var(--ink-soft)]'>Manage all uploaded assets across your portfolio modules.</p>
                </div>

                <div className='flex flex-wrap items-center gap-3'>
                    {selectedFiles.length > 0 && (
                        <button 
                            onClick={handleBulkDelete}
                            className='focus-ring button-pop inline-flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/20'
                        >
                            <Trash2 className='h-4 w-4' /> Delete Selected ({selectedFiles.length})
                        </button>
                    )}
                    <input 
                        type="text" 
                        value={uploadFolder} 
                        onChange={(e) => setUploadFolder(e.target.value)} 
                        className='w-32 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none'
                        placeholder='Folder (e.g. root)'
                    />
                    <select 
                        value={uploadModule} 
                        onChange={(e) => setUploadModule(e.target.value)} 
                        className='rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none cursor-pointer'
                    >
                        <option value="PROJECT">Project</option>
                        <option value="CONTENT">Content (Blog)</option>
                        <option value="TESTIMONIAL">Testimonial</option>
                        <option value="SERVICE">Service</option>
                        <option value="GENERAL">General</option>
                    </select>

                    <label className='flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-110'>
                        {uploading ? (
                            <div className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white' />
                        ) : (
                            <Upload className='h-4 w-4' />
                        )}
                        {uploading ? 'Uploading...' : 'Upload Asset'}
                        <input type='file' accept='image/*,application/pdf' onChange={handleUpload} className='hidden' disabled={uploading} />
                    </label>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-xl text-sm font-semibold border ${message.includes('successfully') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                    {message}
                </div>
            )}

            {/* Filter and Search controls */}
            <div className='flex items-center justify-between mb-2'>
                <div className='flex items-center gap-4'>
                    <label className='flex items-center gap-2 text-sm font-semibold text-[var(--ink)] cursor-pointer'>
                        <input 
                            type="checkbox" 
                            checked={files.length > 0 && selectedFiles.length === files.length}
                            onChange={selectAll}
                            className='h-4 w-4 rounded border-[var(--line)] text-[var(--accent)] focus:ring-[var(--accent)]'
                        />
                        Select All
                    </label>
                </div>
            </div>
            <div className='glass-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center'>
                <div className='relative flex-1'>
                    <Search className='absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-soft)]' />
                    <input 
                        type='text' 
                        placeholder='Search files by original filename...' 
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] py-2.5 pl-10 pr-4 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none'
                    />
                </div>
                
                <div className='flex items-center gap-3'>
                    <select 
                        value={selectedModule} 
                        onChange={(e) => { setSelectedModule(e.target.value); setCurrentPage(1); }}
                        className='rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--ink)] focus:outline-none'
                    >
                        <option value="">All Categories</option>
                        <option value="PROJECT">Projects</option>
                        <option value="CONTENT">Blogs & Content</option>
                        <option value="TESTIMONIAL">Testimonials</option>
                        <option value="SERVICE">Services</option>
                    </select>
                </div>
            </div>

            {/* Grid display */}
            {loading ? (
                <div className='flex h-[40vh] items-center justify-center'>
                    <div className='h-8 w-8 animate-spin rounded-full border-4 border-[var(--accent)]/30 border-t-[var(--accent)]' />
                </div>
            ) : files.length === 0 ? (
                <div className='flex h-[40vh] flex-col items-center justify-center border border-dashed border-[var(--line)] rounded-3xl p-8 text-center'>
                    <FolderOpen className='h-12 w-12 text-[var(--ink-soft)] mb-2' />
                    <p className='text-[var(--ink-soft)] font-medium'>No assets found matching your criteria.</p>
                </div>
            ) : (
                <>
                    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                        {files.map(file => (
                            <div key={file._id} className='group glass-card overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent-2)] transition'>
                                <div className='relative aspect-video w-full bg-[var(--bg-alt)] flex items-center justify-center overflow-hidden border-b border-[var(--line)]'>
                                    {file.fileType === 'IMAGE' ? (
                                        <img src={file.url} alt={file.originalName} className='h-full w-full object-cover group-hover:scale-105 transition duration-500' />
                                    ) : (
                                        <div className='flex flex-col items-center gap-2 p-4'>
                                            <FolderOpen className='h-10 w-10 text-[var(--accent)]' />
                                            <span className='text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)]'>PDF Document</span>
                                        </div>
                                    )}
                                    <div className='absolute left-3 top-3 flex flex-col gap-1'>
                                        <span className='rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm'>
                                            {file.module}
                                        </span>
                                        {file.folder && file.folder !== 'root' && (
                                            <span className='rounded-full bg-[var(--accent)]/90 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm flex items-center gap-1'>
                                                <FolderOpen className='h-3 w-3' /> {file.folder}
                                            </span>
                                        )}
                                    </div>
                                    <div className='absolute right-3 top-3 z-10'>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedFiles.includes(file._id)}
                                            onChange={() => toggleSelection(file._id)}
                                            className='h-5 w-5 rounded border-[var(--line)] text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer shadow-sm'
                                        />
                                    </div>
                                </div>

                                <div className='p-4 space-y-3'>
                                    <p className='truncate text-sm font-semibold text-[var(--ink)]' title={file.originalName}>
                                        {file.originalName}
                                    </p>
                                    
                                    <div className='flex gap-2'>
                                        <button 
                                            onClick={() => handleCopy(file.url, file._id)}
                                            className='flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] py-1.5 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--accent)] transition'
                                        >
                                            {copiedId === file._id ? <Check className='h-3.5 w-3.5 text-emerald-500' /> : <Copy className='h-3.5 w-3.5' />}
                                            {copiedId === file._id ? 'Copied' : 'Copy URL'}
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(file._id)}
                                            className='inline-flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 p-1.5 text-red-500 hover:bg-red-500/10 transition'
                                        >
                                            <Trash2 className='h-3.5 w-3.5' />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pages > 1 && (
                        <div className='flex justify-center gap-2 pt-4'>
                            {Array.from({ length: pages }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentPage(idx + 1)}
                                    className={`h-8 w-8 rounded-lg text-xs font-semibold border transition ${
                                        currentPage === idx + 1 
                                        ? 'bg-[var(--accent)] border-[var(--accent)] text-white' 
                                        : 'bg-[var(--surface)] border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--ink)]'
                                    }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default MediaAdmin
