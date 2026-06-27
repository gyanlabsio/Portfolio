import { useState, useEffect } from 'react'
import { FileText, Download, Trash2, Plus, RefreshCw, X, Receipt, Building2, User, Calendar, MapPin, Calculator, BookOpen, Settings } from 'lucide-react'
import { getQuotations, getQuotation, createQuotation, updateQuotationStatus, deleteQuotation, downloadQuotationPdf } from '../../api/quotation'
import toast from 'react-hot-toast'

const QuotationsAdmin = () => {
    const [quotations, setQuotations] = useState([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState(null)
    const [isCreating, setIsCreating] = useState(false)
    const [downloading, setDownloading] = useState(false)

    // Form state
    const initialFormState = {
        clientName: '',
        clientEmail: '',
        company: '',
        clientAddress: '',
        projectTitle: '',
        projectDescription: '',
        currency: 'USD',
        issueDate: new Date().toISOString().split('T')[0],
        validUntil: '',
        notes: '',
        termsAndConditions: '',
        useGlobalTerms: true,
        discount: 0,
        discountType: 'FLAT',
        tax: 0,
        items: [{ title: '', description: '', quantity: 1, rate: 0 }]
    }
    const [formData, setFormData] = useState(initialFormState)

    const fetchAll = async () => {
        try {
            setLoading(true)
            const { data } = await getQuotations()
            setQuotations(data.data)
        } catch (error) {
            console.error(error)
            toast.error('Failed to load quotations')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAll() }, [])

    const handleSelect = async (id) => {
        try {
            const { data } = await getQuotation(id)
            setSelected(data.data)
            setIsCreating(false)
        } catch (error) {
            console.error(error)
            toast.error('Failed to load quotation details')
        }
    }

    const handleStatusChange = async (id, status) => {
        try {
            await updateQuotationStatus(id, status)
            if (selected?._id === id) {
                setSelected({ ...selected, status })
            }
            toast.success(`Status updated to ${status}`)
            fetchAll()
        } catch (error) {
            console.error(error)
            toast.error('Failed to update status')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this quotation?')) return
        try {
            await deleteQuotation(id)
            if (selected?._id === id) setSelected(null)
            toast.success('Quotation deleted')
            fetchAll()
        } catch (error) {
            console.error(error)
            toast.error('Failed to delete quotation')
        }
    }

    const handleDownloadPdf = async (id, quotationNumber) => {
        try {
            setDownloading(true)
            const response = await downloadQuotationPdf(id)
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${quotationNumber}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            toast.success('PDF Downloaded')
        } catch (error) {
            console.error(error)
            toast.error('Failed to download PDF')
        } finally {
            setDownloading(false)
        }
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            const filteredItems = formData.items.filter(item => item.title && item.quantity > 0 && item.rate >= 0)
            if (filteredItems.length === 0) return toast.error('At least one valid item is required.')

            await createQuotation({ ...formData, items: filteredItems })
            setIsCreating(false)
            setFormData(initialFormState)
            toast.success('Quotation created successfully')
            fetchAll()
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || 'Failed to create quotation')
        }
    }

    // Dynamic calculations for the Builder
    const calcSubtotal = () => formData.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.rate)), 0)
    const calcDiscount = () => formData.discountType === 'PERCENTAGE' ? calcSubtotal() * (Number(formData.discount) / 100) : Number(formData.discount)
    const calcTax = () => Number(formData.tax)
    const calcTotal = () => Math.max(0, calcSubtotal() - calcDiscount()) + calcTax()

    const getStatusColor = (status) => {
        switch (status) {
            case 'DRAFT': return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
            case 'SENT': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
            case 'VIEWED': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
            case 'ACCEPTED': return 'bg-green-500/10 text-green-500 border-green-500/20'
            case 'REJECTED': return 'bg-red-500/10 text-red-500 border-red-500/20'
            case 'EXPIRED': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
            default: return 'bg-[var(--surface)] text-[var(--ink)]'
        }
    }

    return (
        <div className='space-y-5 h-full flex flex-col'>
            {/* Header */}
            <div className='glass-card flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5 md:p-6 shrink-0'>
                <div>
                    <h1 className='font-nevera text-3xl tracking-[0.08em] text-[var(--ink)]'>Quotations</h1>
                    <p className='mt-1 text-sm text-[var(--ink-soft)]'>Professional invoicing and estimates builder.</p>
                </div>
                <div className='flex items-center gap-3'>
                    <button onClick={() => { setIsCreating(true); setSelected(null); setFormData(initialFormState); }} className='focus-ring button-pop flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent)]/90'>
                        <Plus className='h-4 w-4' /> New Quotation
                    </button>
                    <button onClick={fetchAll} className='focus-ring button-pop flex items-center gap-2 rounded-xl bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--bg-alt)]'>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                </div>
            </div>

            <div className='flex flex-col lg:flex-row gap-6 flex-1 min-h-0'>
                {/* LIST / SIDEBAR */}
                <div className='w-full lg:w-[350px] shrink-0 space-y-3 overflow-y-auto pr-2 pb-10'>
                    {loading ? (
                        <div className='glass-card rounded-2xl py-14 flex justify-center'>
                            <RefreshCw className='h-6 w-6 animate-spin text-[var(--accent)]' />
                        </div>
                    ) : quotations.length === 0 ? (
                        <div className='glass-card rounded-2xl py-16 text-center'>
                            <Receipt className='mx-auto h-8 w-8 text-[var(--accent-2)]' />
                            <p className='mt-2 text-[var(--ink-soft)]'>No quotations found.</p>
                        </div>
                    ) : quotations.map(q => (
                        <button key={q._id} onClick={() => handleSelect(q._id)}
                            className={`glass-card w-full rounded-2xl border p-4 text-left transition ${selected?._id === q._id ? 'border-[var(--accent)]/40 bg-[var(--accent)]/5 shadow-md shadow-[var(--accent)]/5' : 'border-[var(--line)] hover:border-[var(--accent-2)]/50'}`}>
                            <div className='flex items-start justify-between mb-3'>
                                <span className='font-semibold text-[var(--ink)] text-sm'>{q.quotationNumber}</span>
                                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${getStatusColor(q.status)}`}>
                                    {q.status}
                                </span>
                            </div>
                            <h3 className='text-[var(--ink)] font-medium mb-1 line-clamp-1'>{q.clientName}</h3>
                            <p className='text-xs text-[var(--ink-soft)] mb-3 line-clamp-1'>{q.projectTitle}</p>
                            
                            <div className='flex justify-between items-center pt-3 border-t border-[var(--line)]'>
                                <p className='text-sm font-bold text-[var(--accent)]'>{q.currency} {q.total.toFixed(2)}</p>
                                <p className='text-[10px] text-[var(--ink-soft)] uppercase tracking-widest'>{new Date(q.createdAt).toLocaleDateString()}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* MAIN CONTENT AREA */}
                <div className='flex-1 overflow-y-auto glass-card rounded-3xl p-6 lg:p-8 min-h-0'>
                    {!isCreating && !selected && (
                        <div className='h-full flex flex-col items-center justify-center text-center text-[var(--ink-soft)] py-20'>
                            <div className='h-20 w-20 rounded-full bg-[var(--surface)] border border-[var(--line)] flex items-center justify-center mb-4'>
                                <FileText className='h-8 w-8 text-[var(--accent-2)]' />
                            </div>
                            <h2 className='text-xl font-nevera text-[var(--ink)] mb-2'>Quotation Workspace</h2>
                            <p className='max-w-md text-sm'>Select a quotation from the list to view its details or create a new professional estimate for your clients.</p>
                        </div>
                    )}

                    {/* BUILDER MODE */}
                    {isCreating && (
                        <form onSubmit={handleCreate} className='space-y-8 animate-in fade-in zoom-in-95 duration-300'>
                            <div className='flex items-center justify-between pb-4 border-b border-[var(--line)]'>
                                <div>
                                    <h2 className='text-2xl font-semibold text-[var(--ink)]'>New Quotation</h2>
                                    <p className='text-sm text-[var(--ink-soft)]'>Build a professional estimate</p>
                                </div>
                                <button type='button' onClick={() => setIsCreating(false)} className='p-2 hover:bg-[var(--surface)] rounded-full text-[var(--ink-soft)]'>
                                    <X className='h-5 w-5' />
                                </button>
                            </div>

                            {/* Section 1: Client Details */}
                            <div className='space-y-4'>
                                <h3 className='font-semibold flex items-center gap-2 text-[var(--accent)]'><User className='h-4 w-4'/> Client Information</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <input required placeholder='Client Name *' className='input-field' value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })} />
                                    <input required type='email' placeholder='Client Email *' className='input-field' value={formData.clientEmail} onChange={e => setFormData({ ...formData, clientEmail: e.target.value })} />
                                    <input placeholder='Company Name (Optional)' className='input-field' value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
                                    <input placeholder='Client Address (Optional)' className='input-field' value={formData.clientAddress} onChange={e => setFormData({ ...formData, clientAddress: e.target.value })} />
                                </div>
                            </div>

                            {/* Section 2: Project Details */}
                            <div className='space-y-4 pt-4 border-t border-[var(--line)]'>
                                <h3 className='font-semibold flex items-center gap-2 text-[var(--accent)]'><Building2 className='h-4 w-4'/> Project Details</h3>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                    <input required placeholder='Project Title *' className='input-field md:col-span-2' value={formData.projectTitle} onChange={e => setFormData({ ...formData, projectTitle: e.target.value })} />
                                    <select className='input-field' value={formData.currency} onChange={e => setFormData({ ...formData, currency: e.target.value })}>
                                        <option value='USD'>USD ($)</option>
                                        <option value='EUR'>EUR (€)</option>
                                        <option value='GBP'>GBP (£)</option>
                                        <option value='INR'>INR (₹)</option>
                                    </select>
                                    <input type='date' required className='input-field' title='Issue Date' value={formData.issueDate} onChange={e => setFormData({ ...formData, issueDate: e.target.value })} />
                                    <input type='date' required className='input-field md:col-span-2' title='Valid Until' value={formData.validUntil} onChange={e => setFormData({ ...formData, validUntil: e.target.value })} />
                                </div>
                            </div>

                            {/* Section 3: Line Items */}
                            <div className='space-y-4 pt-4 border-t border-[var(--line)]'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='font-semibold flex items-center gap-2 text-[var(--accent)]'><Calculator className='h-4 w-4'/> Line Items</h3>
                                    <button type='button' onClick={() => setFormData({ ...formData, items: [...formData.items, { title: '', description: '', quantity: 1, rate: 0 }] })} className='text-xs font-semibold text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1.5 rounded-lg hover:bg-[var(--accent)]/20 transition'>+ Add Item</button>
                                </div>
                                <div className='space-y-3'>
                                    {formData.items.map((item, idx) => (
                                        <div key={idx} className='group flex gap-3 items-start bg-[var(--surface)]/30 p-3 rounded-xl border border-[var(--line)]'>
                                            <div className='flex-1 space-y-3'>
                                                <div className='flex gap-3'>
                                                    <input required placeholder='Service / Item Name' className='input-field flex-1' value={item.title} onChange={e => { const newItems = [...formData.items]; newItems[idx].title = e.target.value; setFormData({ ...formData, items: newItems }) }} />
                                                    <div className='w-24'>
                                                        <input required type='number' min='1' placeholder='Qty' className='input-field w-full' value={item.quantity} onChange={e => { const newItems = [...formData.items]; newItems[idx].quantity = e.target.value; setFormData({ ...formData, items: newItems }) }} />
                                                    </div>
                                                    <div className='w-32'>
                                                        <input required type='number' min='0' step='0.01' placeholder='Rate' className='input-field w-full' value={item.rate} onChange={e => { const newItems = [...formData.items]; newItems[idx].rate = e.target.value; setFormData({ ...formData, items: newItems }) }} />
                                                    </div>
                                                </div>
                                                <input placeholder='Description (Optional)' className='input-field text-sm' value={item.description} onChange={e => { const newItems = [...formData.items]; newItems[idx].description = e.target.value; setFormData({ ...formData, items: newItems }) }} />
                                            </div>
                                            <button type='button' onClick={() => { const newItems = [...formData.items]; newItems.splice(idx, 1); setFormData({ ...formData, items: newItems }) }} className='p-2 text-[var(--ink-soft)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition mt-1'>
                                                <Trash2 className='h-4 w-4' />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Section 4: Totals & Settings */}
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-[var(--line)]'>
                                {/* Terms */}
                                <div className='space-y-4'>
                                    <h3 className='font-semibold flex items-center gap-2 text-[var(--accent)]'><BookOpen className='h-4 w-4'/> Terms & Notes</h3>
                                    
                                    <label className='flex items-center gap-3 p-3 bg-[var(--surface)] border border-[var(--line)] rounded-xl cursor-pointer hover:border-[var(--accent)]/50 transition'>
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${formData.useGlobalTerms ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-[var(--ink-soft)]'}`}>
                                            {formData.useGlobalTerms && <div className='w-2 h-2 rounded-sm bg-white' />}
                                        </div>
                                        <span className='text-sm font-medium'>Use Global Default Terms (from Settings)</span>
                                        <input type="checkbox" className='hidden' checked={formData.useGlobalTerms} onChange={e => setFormData({ ...formData, useGlobalTerms: e.target.checked })} />
                                    </label>
                                    
                                    {!formData.useGlobalTerms && (
                                        <textarea placeholder='Custom Terms and Conditions...' className='input-field min-h-[100px] text-sm' value={formData.termsAndConditions} onChange={e => setFormData({ ...formData, termsAndConditions: e.target.value })} />
                                    )}
                                    <textarea placeholder='Additional Notes (Visible on PDF)' className='input-field min-h-[80px] text-sm' value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                                </div>

                                {/* Calculation Summary */}
                                <div className='bg-[var(--surface)]/50 border border-[var(--line)] rounded-2xl p-6 space-y-4'>
                                    <h3 className='font-semibold flex items-center gap-2 text-[var(--ink)] mb-4'><Settings className='h-4 w-4'/> Pricing Summary</h3>
                                    
                                    <div className='flex justify-between items-center text-sm font-medium'>
                                        <span className='text-[var(--ink-soft)]'>Subtotal</span>
                                        <span className='text-[var(--ink)]'>{formData.currency} {calcSubtotal().toFixed(2)}</span>
                                    </div>
                                    
                                    <div className='space-y-2'>
                                        <div className='flex justify-between items-center text-sm font-medium'>
                                            <span className='text-[var(--ink-soft)]'>Discount</span>
                                            <select className='bg-transparent text-xs text-[var(--accent)] font-semibold outline-none border-b border-dashed border-[var(--accent)]/50 cursor-pointer pb-0.5' value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value })}>
                                                <option value="FLAT">Flat Amount</option>
                                                <option value="PERCENTAGE">Percentage (%)</option>
                                            </select>
                                        </div>
                                        <div className='flex items-center justify-between gap-4'>
                                            <input type='number' min='0' step='0.01' className='input-field text-right w-1/2 py-1.5' value={formData.discount} onChange={e => setFormData({ ...formData, discount: e.target.value })} />
                                            <span className='text-[var(--ink)] font-medium'>- {formData.currency} {calcDiscount().toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className='space-y-2'>
                                        <div className='flex justify-between items-center text-sm font-medium'>
                                            <span className='text-[var(--ink-soft)]'>Tax Amount (Flat)</span>
                                        </div>
                                        <div className='flex items-center justify-between gap-4'>
                                            <input type='number' min='0' step='0.01' className='input-field text-right w-1/2 py-1.5' value={formData.tax} onChange={e => setFormData({ ...formData, tax: e.target.value })} />
                                            <span className='text-[var(--ink)] font-medium'>+ {formData.currency} {calcTax().toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className='pt-4 mt-4 border-t border-[var(--line)] flex justify-between items-center'>
                                        <span className='font-bold text-[var(--ink)]'>Grand Total</span>
                                        <span className='text-2xl font-black text-[var(--accent)]'>{formData.currency} {calcTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className='pt-6 border-t border-[var(--line)] flex justify-end gap-3'>
                                <button type='button' onClick={() => setIsCreating(false)} className='px-6 py-2.5 rounded-xl font-semibold text-[var(--ink-soft)] hover:bg-[var(--surface)] transition'>Cancel</button>
                                <button type='submit' className='px-8 py-2.5 rounded-xl font-bold bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 hover:shadow-lg hover:shadow-[var(--accent)]/20 transition button-pop'>
                                    Save & Generate PDF
                                </button>
                            </div>
                        </form>
                    )}

                    {/* VIEW / EDIT EXISTING MODE */}
                    {selected && !isCreating && (
                        <div className='space-y-8 animate-in fade-in duration-300'>
                            {/* Top Bar */}
                            <div className='flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[var(--line)]'>
                                <div>
                                    <div className='flex items-center gap-3 mb-1'>
                                        <h2 className='text-3xl font-bold text-[var(--ink)]'>{selected.quotationNumber}</h2>
                                        <span className={`rounded-full border px-3 py-1 text-[11px] font-bold tracking-widest ${getStatusColor(selected.status)}`}>
                                            {selected.status}
                                        </span>
                                    </div>
                                    <p className='text-[var(--ink-soft)]'>{selected.projectTitle}</p>
                                </div>
                                <div className='flex flex-col sm:flex-row items-center gap-3'>
                                    <select
                                        value={selected.status}
                                        onChange={(e) => handleStatusChange(selected._id, e.target.value)}
                                        className={`rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold focus:border-[var(--accent-2)] focus:outline-none transition ${getStatusColor(selected.status)}`}
                                    >
                                        <option value="DRAFT">DRAFT</option>
                                        <option value="SENT">SENT</option>
                                        <option value="VIEWED">VIEWED</option>
                                        <option value="ACCEPTED">ACCEPTED</option>
                                        <option value="REJECTED">REJECTED</option>
                                        <option value="EXPIRED">EXPIRED</option>
                                    </select>
                                    <button onClick={() => handleDownloadPdf(selected._id, selected.quotationNumber)} disabled={downloading} className='button-pop flex items-center gap-2 rounded-xl bg-[var(--ink)] text-[var(--bg)] px-5 py-2 text-sm font-semibold hover:opacity-90'>
                                        {downloading ? <RefreshCw className='h-4 w-4 animate-spin' /> : <Download className='h-4 w-4' />}
                                        Export PDF
                                    </button>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='bg-[var(--surface)]/30 border border-[var(--line)] rounded-2xl p-5 space-y-3'>
                                    <h3 className='font-semibold flex items-center gap-2 text-[var(--ink)] mb-1'><User className='h-4 w-4 text-[var(--accent-2)]'/> Client</h3>
                                    <div>
                                        <p className='font-bold text-lg text-[var(--ink)]'>{selected.clientName}</p>
                                        <p className='text-sm text-[var(--ink-soft)]'>{selected.clientEmail}</p>
                                        {selected.company && <p className='text-sm font-medium text-[var(--ink)] mt-1'>{selected.company}</p>}
                                    </div>
                                    {selected.clientAddress && (
                                        <div className='pt-2 flex items-start gap-2 text-sm text-[var(--ink-soft)]'>
                                            <MapPin className='h-4 w-4 mt-0.5 shrink-0'/>
                                            <p>{selected.clientAddress}</p>
                                        </div>
                                    )}
                                </div>
                                <div className='bg-[var(--surface)]/30 border border-[var(--line)] rounded-2xl p-5 space-y-3'>
                                    <h3 className='font-semibold flex items-center gap-2 text-[var(--ink)] mb-1'><Calendar className='h-4 w-4 text-[var(--accent-2)]'/> Dates</h3>
                                    <div className='space-y-2'>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-sm text-[var(--ink-soft)]'>Issue Date:</span>
                                            <span className='font-medium text-[var(--ink)]'>{new Date(selected.issueDate || selected.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-sm text-[var(--ink-soft)]'>Valid Until:</span>
                                            <span className='font-medium text-[var(--ink)]'>{new Date(selected.validUntil).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className='border border-[var(--line)] rounded-2xl overflow-hidden'>
                                <table className='w-full text-left text-sm'>
                                    <thead className='bg-[var(--surface)] text-[var(--ink-soft)] border-b border-[var(--line)]'>
                                        <tr>
                                            <th className='px-5 py-4 font-semibold'>Service / Description</th>
                                            <th className='px-5 py-4 font-semibold text-right w-24'>Qty</th>
                                            <th className='px-5 py-4 font-semibold text-right w-32'>Rate</th>
                                            <th className='px-5 py-4 font-semibold text-right w-32'>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-[var(--line)]'>
                                        {selected.items?.map((item, idx) => (
                                            <tr key={idx} className='hover:bg-[var(--surface)]/30 transition-colors'>
                                                <td className='px-5 py-4'>
                                                    <p className='font-bold text-[var(--ink)]'>{item.title}</p>
                                                    {item.description && <p className='text-xs text-[var(--ink-soft)] mt-1'>{item.description}</p>}
                                                </td>
                                                <td className='px-5 py-4 text-right text-[var(--ink-soft)]'>{item.quantity}</td>
                                                <td className='px-5 py-4 text-right text-[var(--ink-soft)]'>{selected.currency} {item.rate.toFixed(2)}</td>
                                                <td className='px-5 py-4 text-right font-bold text-[var(--ink)]'>{selected.currency} {item.amount.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary Bottom */}
                            <div className='flex flex-col md:flex-row gap-8 justify-between'>
                                <div className='flex-1 space-y-4'>
                                    {selected.notes && (
                                        <div className='p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl'>
                                            <h4 className='text-xs font-bold uppercase tracking-wider text-yellow-600 mb-2'>Notes</h4>
                                            <p className='text-sm text-[var(--ink-soft)] whitespace-pre-wrap'>{selected.notes}</p>
                                        </div>
                                    )}
                                    {selected.termsAndConditions && !selected.useGlobalTerms && (
                                        <div className='p-4 bg-[var(--surface)] border border-[var(--line)] rounded-xl'>
                                            <h4 className='text-xs font-bold uppercase tracking-wider text-[var(--ink-soft)] mb-2'>Custom Terms</h4>
                                            <p className='text-sm text-[var(--ink-soft)] whitespace-pre-wrap'>{selected.termsAndConditions}</p>
                                        </div>
                                    )}
                                    {selected.useGlobalTerms && (
                                        <div className='p-4 bg-[var(--surface)] border border-[var(--line)] rounded-xl flex items-center gap-2'>
                                            <BookOpen className='h-4 w-4 text-[var(--accent)]'/>
                                            <span className='text-sm font-medium text-[var(--ink)]'>Using Global Default Terms from Settings</span>
                                        </div>
                                    )}
                                    
                                    <button onClick={() => handleDelete(selected._id)} className='mt-8 text-sm font-semibold text-red-500 hover:underline flex items-center gap-1'>
                                        <Trash2 className='h-4 w-4'/> Delete Quotation Record
                                    </button>
                                </div>

                                <div className='w-full md:w-80 space-y-3 text-right bg-[var(--surface)]/30 p-5 rounded-2xl border border-[var(--line)] h-fit'>
                                    <div className='flex justify-between text-sm text-[var(--ink-soft)]'>
                                        <span>Subtotal:</span>
                                        <span className='font-medium'>{selected.currency} {selected.subtotal.toFixed(2)}</span>
                                    </div>
                                    
                                    {selected.discount > 0 && (
                                        <div className='flex justify-between text-sm text-[var(--ink-soft)]'>
                                            <span>Discount {selected.discountType === 'PERCENTAGE' ? `(${selected.discount}%)` : ''}:</span>
                                            <span className='font-medium text-red-500'>
                                                -{selected.currency} {selected.discountType === 'PERCENTAGE' ? (selected.subtotal * (selected.discount / 100)).toFixed(2) : selected.discount.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    
                                    <div className='flex justify-between text-sm text-[var(--ink-soft)]'>
                                        <span>Tax:</span>
                                        <span className='font-medium'>{selected.currency} {selected.tax.toFixed(2)}</span>
                                    </div>
                                    
                                    <div className='pt-3 mt-3 border-t border-[var(--line)] flex justify-between items-center'>
                                        <span className='font-bold text-[var(--ink)] uppercase tracking-wider'>Total:</span>
                                        <span className='text-2xl font-black text-[var(--accent)]'>{selected.currency} {selected.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default QuotationsAdmin
