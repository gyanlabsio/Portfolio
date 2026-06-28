import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Briefcase, X, GripVertical } from 'lucide-react'
import { getServices, createService, updateService, deleteService, reorderServices } from '../../api/service'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const SortableServiceCard = ({ service, handleOpenForm, handleDelete }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: service._id });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className='glass-card flex flex-col justify-between rounded-2xl p-5 transition hover:border-[var(--accent)]/30 bg-[var(--bg)] z-10'>
            <div>
                <div className='flex items-start justify-between'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--accent)]'>
                        {service.iconUrl ? <img src={service.iconUrl} alt="icon" className="h-6 w-6 object-contain" /> : <Briefcase className='h-5 w-5' />}
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${service.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                            {service.status}
                        </span>
                        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-[var(--ink-soft)] hover:text-[var(--ink)]">
                            <GripVertical className='h-5 w-5' />
                        </div>
                    </div>
                </div>
                {service.thumbnail && (
                    <div className="mt-4 w-full aspect-video overflow-hidden rounded-xl bg-[var(--surface)] p-2">
                        <img src={service.thumbnail} alt={service.title} className="h-full w-full object-contain transition hover:scale-105" />
                    </div>
                )}
                <h3 className='mt-4 font-semibold text-[var(--ink)]'>{service.title}</h3>
                <p className='mt-2 line-clamp-3 text-sm text-[var(--ink-soft)]'>{service.description}</p>
            </div>
            <div className='mt-6 flex items-center justify-end gap-2 border-t border-[var(--line)] pt-4'>
                <button onClick={(e) => { e.stopPropagation(); handleOpenForm(service); }} className='rounded-lg p-2 text-[var(--ink-soft)] transition hover:bg-[var(--surface)] hover:text-[var(--ink)] z-20 relative'>
                    <Edit2 className='h-4 w-4' />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(service._id); }} className='rounded-lg p-2 text-[var(--ink-soft)] transition hover:bg-[var(--surface)] hover:text-[var(--accent)] z-20 relative'>
                    <Trash2 className='h-4 w-4' />
                </button>
            </div>
        </div>
    )
}

const ServicesAdmin = () => {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingService, setEditingService] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        iconUrl: '',
        thumbnail: '',
        status: 'ACTIVE'
    })

    const fetchAll = async () => {
        try {
            setLoading(true)
            const { data } = await getServices()
            setServices(data.data)
        } catch (error) {
            console.error('Failed to fetch services', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAll() }, [])

    const handleOpenForm = (service = null) => {
        if (service) {
            setEditingService(service)
            setFormData({
                title: service.title,
                description: service.description,
                iconUrl: service.iconUrl || '',
                thumbnail: service.thumbnail || '',
                status: service.status
            })
        } else {
            setEditingService(null)
            setFormData({ title: '', description: '', iconUrl: '', thumbnail: '', status: 'ACTIVE' })
        }
        setIsFormOpen(true)
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
        setEditingService(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingService) {
                await updateService(editingService._id, formData)
            } else {
                await createService(formData)
            }
            fetchAll()
            handleCloseForm()
        } catch (error) {
            console.error('Failed to save service', error)
            alert('Failed to save service. Check console for details.')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this service?')) return
        try {
            await deleteService(id)
            fetchAll()
        } catch (error) {
            console.error('Failed to delete service', error)
        }
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setServices((items) => {
                const oldIndex = items.findIndex((i) => i._id === active.id);
                const newIndex = items.findIndex((i) => i._id === over.id);
                const newOrder = arrayMove(items, oldIndex, newIndex);
                
                // Trigger backend update
                const orderedItems = newOrder.map((item, index) => ({ id: item._id, order: index }));
                reorderServices({ items: orderedItems }).catch(err => {
                    console.error('Failed to reorder services', err);
                    alert('Failed to save order to the server.');
                });
                
                return newOrder;
            });
        }
    }

    return (
        <div className='space-y-6'>
            <div className='glass-card flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5 md:p-6'>
                <div>
                    <h1 className='font-nevera text-3xl tracking-[0.08em] text-[var(--ink)]'>Services</h1>
                    <p className='mt-1 text-sm text-[var(--ink-soft)]'>Manage your portfolio services and offerings.</p>
                </div>
                <button onClick={() => handleOpenForm()} className='focus-ring button-pop flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-2)]'>
                    <Plus className='h-4 w-4' /> Add Service
                </button>
            </div>

            {loading ? (
                <div className='glass-card rounded-2xl py-14'>
                    <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]'></div>
                </div>
            ) : services.length === 0 ? (
                <div className='glass-card rounded-2xl py-16 text-center'>
                    <Briefcase className='mx-auto h-8 w-8 text-[var(--accent-2)]' />
                    <p className='mt-2 text-[var(--ink-soft)]'>No services added yet.</p>
                </div>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={services.map(s => s._id)} strategy={rectSortingStrategy}>
                        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                            {services.map(service => (
                                <SortableServiceCard 
                                    key={service._id} 
                                    service={service} 
                                    handleOpenForm={handleOpenForm} 
                                    handleDelete={handleDelete} 
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {isFormOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 p-4 backdrop-blur-sm'>
                    <div className='glass-card w-full max-w-lg rounded-3xl p-6'>
                        <div className='mb-6 flex items-center justify-between'>
                            <h2 className='font-nevera text-2xl text-[var(--ink)]'>{editingService ? 'Edit Service' : 'New Service'}</h2>
                            <button onClick={handleCloseForm} className='rounded-full p-2 text-[var(--ink-soft)] transition hover:bg-[var(--surface)] hover:text-[var(--ink)]'>
                                <X className='h-5 w-5' />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <div>
                                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Title</label>
                                <input required type='text' value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' />
                            </div>
                            
                            <div>
                                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Description</label>
                                <textarea required rows='3' value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' />
                            </div>

                            <div>
                                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Icon URL (Optional)</label>
                                <input type='url' value={formData.iconUrl} onChange={e => setFormData({ ...formData, iconUrl: e.target.value })} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' />
                            </div>

                            <div>
                                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Thumbnail URL (Optional)</label>
                                <input type='url' value={formData.thumbnail} onChange={e => setFormData({ ...formData, thumbnail: e.target.value })} placeholder="Paste image link from Media Gallery" className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none' />
                            </div>

                            <div>
                                <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Status</label>
                                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className='w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--accent-2)] focus:outline-none'>
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="DRAFT">DRAFT</option>
                                </select>
                            </div>

                            <div className='mt-6 flex justify-end gap-3'>
                                <button type='button' onClick={handleCloseForm} className='rounded-xl border border-[var(--line)] px-4 py-2.5 text-sm font-semibold text-[var(--ink-soft)] hover:bg-[var(--surface)] hover:text-[var(--ink)]'>Cancel</button>
                                <button type='submit' className='rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--accent-2)]'>{editingService ? 'Save Changes' : 'Create Service'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ServicesAdmin
