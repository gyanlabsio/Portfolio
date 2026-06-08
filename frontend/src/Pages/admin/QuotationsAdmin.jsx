import { useState, useEffect } from 'react'
import { FileText, Download, Trash2, Plus, RefreshCw, X, Receipt } from 'lucide-react'
import { getQuotations, getQuotation, createQuotation, updateQuotationStatus, deleteQuotation, downloadQuotationPdf } from '../../api/quotation'

const QuotationsAdmin = () => {
    const [quotations, setQuotations] = useState([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState(null)
    const [isCreating, setIsCreating] = useState(false)
    const [downloading, setDownloading] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        clientName: '',
        clientEmail: '',
        company: '',
        projectTitle: '',
        projectDescription: '',
        currency: 'USD',
        validUntil: '',
        notes: '',
        tax: 0,
        items: [{ title: '', description: '', quantity: 1, rate: 0 }]
    })

    const fetchAll = async () => {
        try {
            setLoading(true)
            const { data } = await getQuotations()
            setQuotations(data.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAll() }, [])

    const handleSelect = async (id) => {
        try {
            const { data } = await getQuotation(id)
            setSelected(data.data)
        } catch (error) {
            console.error(error)
        }
    }

    const handleStatusChange = async (id, status) => {
        try {
            await updateQuotationStatus(id, status)
            if (selected?._id === id) {
                setSelected({ ...selected, status })
            }
            fetchAll()
        } catch (error) {
            console.error(error)
            alert('Failed to update status')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this quotation?')) return
        try {
            await deleteQuotation(id)
            if (selected?._id === id) setSelected(null)
            fetchAll()
        } catch (error) {
            console.error(error)
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
        } catch (error) {
            console.error(error)
            alert('Failed to download PDF')
        } finally {
            setDownloading(false)
        }
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            // Filter out empty items
            const filteredItems = formData.items.filter(item => item.title && item.quantity > 0 && item.rate >= 0)
            if (filteredItems.length === 0) return alert('At least one valid item is required.')

            await createQuotation({ ...formData, items: filteredItems })
            setIsCreating(false)
            setFormData({
                clientName: '', clientEmail: '', company: '', projectTitle: '', projectDescription: '', currency: 'USD', validUntil: '', notes: '', tax: 0, items: [{ title: '', description: '', quantity: 1, rate: 0 }]
            })
            fetchAll()
        } catch (error) {
            console.error(error)
            alert(error.response?.data?.message || 'Failed to create quotation')
        }
    }

    const handleAddItem = () => {
        setFormData({ ...formData, items: [...formData.items, { title: '', description: '', quantity: 1, rate: 0 }] })
    }

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items]
        newItems[index][field] = value
        setFormData({ ...formData, items: newItems })
    }

    const handleRemoveItem = (index) => {
        const newItems = [...formData.items]
        newItems.splice(index, 1)
        setFormData({ ...formData, items: newItems })
    }

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
        <div className='space-y-5'>
            <div className='glass-card flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5 md:p-6'>
                <div>
                    <h1 className='font-nevera text-3xl tracking-[0.08em] text-[var(--ink)]'>Quotations</h1>
                    <p className='mt-1 text-sm text-[var(--ink-soft)]'>Manage project estimates and generate PDFs.</p>
                </div>
                <div className='flex items-center gap-3'>
                    <button onClick={() => setIsCreating(true)} className='focus-ring button-pop flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent)]/90'>
                        <Plus className='h-4 w-4' /> New Quotation
                    </button>
                    <button onClick={fetchAll} className='focus-ring button-pop flex items-center gap-2 rounded-xl bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--bg-alt)]'>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </button>
                </div>
            </div>

            <div className='flex flex-col lg:flex-row gap-6'>
                {/* LIST */}
                <div className='w-full space-y-2 pr-2 lg:w-1/3 lg:max-h-[75vh] lg:overflow-y-auto'>
                    {loading ? (
                        <div className='glass-card rounded-2xl py-14'>
                            <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]'></div>
                        </div>
                    ) : quotations.length === 0 ? (
                        <div className='glass-card rounded-2xl py-16 text-center'>
                            <Receipt className='mx-auto h-8 w-8 text-[var(--accent-2)]' />
                            <p className='mt-2 text-[var(--ink-soft)]'>No quotations found.</p>
                        </div>
                    ) : quotations.map(q => (
                        <button key={q._id} onClick={() => handleSelect(q._id)}
                            className={`glass-card w-full rounded-xl border p-4 text-left transition ${selected?._id === q._id ? 'border-[var(--accent)]/35 bg-[var(--accent)]/5' : 'border-[var(--line)] hover:border-[var(--accent-2)]'}`}>
                            <div className='flex items-start justify-between mb-2'>
                                <span className='font-semibold text-[var(--ink)]'>{q.quotationNumber}</span>
                                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider ${getStatusColor(q.status)}`}>
                                    {q.status}
                                </span>
                            </div>
                            <p className='text-sm text-[var(--ink)] mb-1'>{q.clientName}</p>
                            <div className='flex justify-between items-center mt-2'>
                                <p className='text-xs font-semibold text-[var(--accent)]'>{q.currency} {q.total.toFixed(2)}</p>
                                <p className='text-[10px] text-[var(--ink-soft)]/70 uppercase tracking-widest'>{new Date(q.createdAt).toLocaleDateString()}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* DETAILS */}
                <div className='w-full lg:w-2/3'>
                    {selected ? (
                        <div className='glass-card rounded-2xl p-6 flex flex-col h-full overflow-y-auto'>
                            <div className='flex flex-wrap items-start justify-between mb-6 pb-6 border-b border-[var(--line)] gap-4'>
                                <div>
                                    <h2 className='text-2xl font-semibold text-[var(--ink)]'>{selected.quotationNumber}</h2>
                                    <p className='text-sm text-[var(--ink-soft)]'>{selected.projectTitle}</p>
                                    <div className='mt-4'>
                                        <p className='font-semibold text-[var(--ink)]'>Client: {selected.clientName}</p>
                                        <p className='text-sm text-[var(--ink-soft)]'>{selected.clientEmail}</p>
                                        {selected.company && <p className='text-sm text-[var(--ink-soft)]'>{selected.company}</p>}
                                    </div>
                                </div>
                                <div className='flex flex-col items-end gap-3'>
                                    <select
                                        value={selected.status}
                                        onChange={(e) => handleStatusChange(selected._id, e.target.value)}
                                        className={`rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-1.5 text-sm font-semibold focus:border-[var(--accent-2)] focus:outline-none ${getStatusColor(selected.status)}`}
                                    >
                                        <option value="DRAFT">DRAFT</option>
                                        <option value="SENT">SENT</option>
                                        <option value="VIEWED">VIEWED</option>
                                        <option value="ACCEPTED">ACCEPTED</option>
                                        <option value="REJECTED">REJECTED</option>
                                        <option value="EXPIRED">EXPIRED</option>
                                    </select>
                                    <button onClick={() => handleDownloadPdf(selected._id, selected.quotationNumber)} disabled={downloading} className='flex items-center gap-2 text-xs font-semibold text-[var(--accent)] hover:underline'>
                                        {downloading ? <RefreshCw className='h-3 w-3 animate-spin' /> : <Download className='h-3 w-3' />}
                                        Download PDF
                                    </button>
                                    <button onClick={() => handleDelete(selected._id)} className='flex items-center gap-2 text-xs font-semibold text-[var(--ink-soft)] hover:text-[#EF3E2F]'>
                                        <Trash2 className='h-3 w-3' /> Delete
                                    </button>
                                </div>
                            </div>

                            <div className='flex-1'>
                                <h3 className='font-semibold text-[var(--ink)] mb-4 flex items-center gap-2'>
                                    <FileText className='h-4 w-4 text-[var(--accent-2)]' /> Line Items
                                </h3>
                                
                                <div className='overflow-x-auto border border-[var(--line)] rounded-xl mb-6'>
                                    <table className='w-full text-left text-sm'>
                                        <thead className='bg-[var(--surface)] text-[var(--ink-soft)]'>
                                            <tr>
                                                <th className='px-4 py-3 font-semibold'>Item</th>
                                                <th className='px-4 py-3 font-semibold text-right'>Qty</th>
                                                <th className='px-4 py-3 font-semibold text-right'>Rate</th>
                                                <th className='px-4 py-3 font-semibold text-right'>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className='divide-y divide-[var(--line)]'>
                                            {selected.items?.map((item, idx) => (
                                                <tr key={idx} className='hover:bg-[var(--surface)]/50'>
                                                    <td className='px-4 py-3'>
                                                        <p className='font-medium text-[var(--ink)]'>{item.title}</p>
                                                        {item.description && <p className='text-xs text-[var(--ink-soft)]'>{item.description}</p>}
                                                    </td>
                                                    <td className='px-4 py-3 text-right text-[var(--ink-soft)]'>{item.quantity}</td>
                                                    <td className='px-4 py-3 text-right text-[var(--ink-soft)]'>{selected.currency} {item.rate.toFixed(2)}</td>
                                                    <td className='px-4 py-3 text-right font-medium text-[var(--ink)]'>{selected.currency} {item.amount.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className='flex justify-end'>
                                    <div className='w-64 space-y-2 text-sm'>
                                        <div className='flex justify-between text-[var(--ink-soft)]'>
                                            <span>Subtotal</span>
                                            <span>{selected.currency} {selected.subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className='flex justify-between text-[var(--ink-soft)]'>
                                            <span>Tax</span>
                                            <span>{selected.currency} {selected.tax.toFixed(2)}</span>
                                        </div>
                                        <div className='flex justify-between font-bold text-[var(--ink)] pt-2 border-t border-[var(--line)]'>
                                            <span>Total</span>
                                            <span>{selected.currency} {selected.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {selected.notes && (
                                    <div className='mt-8 p-4 bg-[var(--surface)] rounded-xl text-sm'>
                                        <p className='font-semibold mb-1'>Notes:</p>
                                        <p className='text-[var(--ink-soft)] whitespace-pre-wrap'>{selected.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className='glass-card flex h-64 items-center justify-center rounded-2xl p-8'>
                            <p className='text-[var(--ink-soft)]'>Select a quotation to view details</p>
                        </div>
                    )}
                </div>
            </div>

            {/* CREATE MODAL */}
            {isCreating && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto'>
                    <div className='glass-card enter-fade w-full max-w-3xl rounded-3xl p-6 md:p-8 mt-auto mb-auto'>
                        <div className='mb-6 flex items-center justify-between'>
                            <h2 className='font-nevera text-2xl text-[var(--ink)]'>Create Quotation</h2>
                            <button onClick={() => setIsCreating(false)} className='rounded-full p-2 hover:bg-[var(--surface)]'>
                                <X className='h-5 w-5' />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className='space-y-6'>
                            {/* Client Section */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='space-y-1'>
                                    <label className='text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Client Name *</label>
                                    <input required type='text' value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none' placeholder='John Doe' />
                                </div>
                                <div className='space-y-1'>
                                    <label className='text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Client Email *</label>
                                    <input required type='email' value={formData.clientEmail} onChange={e => setFormData({ ...formData, clientEmail: e.target.value })} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none' placeholder='john@example.com' />
                                </div>
                                <div className='space-y-1'>
                                    <label className='text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Company</label>
                                    <input type='text' value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none' placeholder='Company Inc.' />
                                </div>
                                <div className='space-y-1'>
                                    <label className='text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Valid Until *</label>
                                    <input required type='date' value={formData.validUntil} onChange={e => setFormData({ ...formData, validUntil: e.target.value })} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none' />
                                </div>
                            </div>

                            {/* Project Section */}
                            <div className='space-y-1'>
                                <label className='text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Project Title *</label>
                                <input required type='text' value={formData.projectTitle} onChange={e => setFormData({ ...formData, projectTitle: e.target.value })} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none' placeholder='Website Development' />
                            </div>

                            {/* Line Items */}
                            <div className='space-y-3'>
                                <div className='flex items-center justify-between'>
                                    <label className='text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Line Items</label>
                                    <button type="button" onClick={handleAddItem} className='text-xs font-semibold text-[var(--accent)] hover:underline'>+ Add Item</button>
                                </div>
                                
                                {formData.items.map((item, idx) => (
                                    <div key={idx} className='flex gap-2 items-start border border-[var(--line)] p-3 rounded-xl bg-[var(--surface)]'>
                                        <div className='flex-1 space-y-2'>
                                            <input required placeholder='Item Title' value={item.title} onChange={e => handleItemChange(idx, 'title', e.target.value)} className='w-full rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none' />
                                            <input placeholder='Description (optional)' value={item.description} onChange={e => handleItemChange(idx, 'description', e.target.value)} className='w-full rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-xs focus:border-[var(--accent)] focus:outline-none' />
                                        </div>
                                        <div className='w-24'>
                                            <input required type='number' min='1' step='0.1' placeholder='Qty' value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', e.target.value)} className='w-full rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none' />
                                        </div>
                                        <div className='w-28'>
                                            <input required type='number' min='0' step='0.01' placeholder='Rate' value={item.rate} onChange={e => handleItemChange(idx, 'rate', e.target.value)} className='w-full rounded-lg border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none' />
                                        </div>
                                        <button type="button" onClick={() => handleRemoveItem(idx)} className='p-2 text-[var(--ink-soft)] hover:text-[#EF3E2F]'>
                                            <Trash2 className='h-4 w-4' />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div className='space-y-1'>
                                    <label className='text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Currency</label>
                                    <input required type='text' maxLength="3" value={formData.currency} onChange={e => setFormData({ ...formData, currency: e.target.value.toUpperCase() })} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none' placeholder='USD' />
                                </div>
                                <div className='space-y-1'>
                                    <label className='text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Tax Amount</label>
                                    <input required type='number' min='0' step='0.01' value={formData.tax} onChange={e => setFormData({ ...formData, tax: e.target.value })} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none' />
                                </div>
                            </div>

                            <div className='space-y-1'>
                                <label className='text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Notes (Optional)</label>
                                <textarea rows="2" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm focus:border-[var(--accent)] focus:outline-none' placeholder='Additional terms...' />
                            </div>

                            <div className='flex justify-end gap-3 pt-4 border-t border-[var(--line)]'>
                                <button type='button' onClick={() => setIsCreating(false)} className='rounded-xl px-4 py-2 text-sm font-semibold text-[var(--ink-soft)] hover:bg-[var(--surface)]'>Cancel</button>
                                <button type='submit' className='focus-ring rounded-xl bg-[var(--accent)] px-6 py-2 text-sm font-semibold text-white hover:bg-[var(--accent)]/90'>Save Quotation</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default QuotationsAdmin
