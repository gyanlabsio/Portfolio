import { useState, useEffect } from 'react'
import { BarChart3, MousePointerClick, Eye, MessageSquare, Briefcase, FileText, Star, RefreshCw, Users, Clock } from 'lucide-react'
import { getEvents, getAnalyticsSummary, getModulesSummary, getTimeseries, getVisitors } from '../../api/analytics'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts'

const AnalyticsAdmin = () => {
    const [events, setEvents] = useState([])
    const [summary, setSummary] = useState(null)
    const [modules, setModules] = useState([])
    const [timeseries, setTimeseries] = useState([])
    const [visitors, setVisitors] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterType, setFilterType] = useState('')

    const fetchAll = async () => {
        try {
            setLoading(true)
            const [eventsRes, summaryRes, modulesRes, timeseriesRes, visitorsRes] = await Promise.all([
                getEvents(filterType ? { type: filterType } : {}),
                getAnalyticsSummary(),
                getModulesSummary(),
                getTimeseries(),
                getVisitors()
            ])
            setEvents(eventsRes.data.data)
            setSummary(summaryRes.data.data)
            setModules(modulesRes.data.data)
            setTimeseries(timeseriesRes.data.data)
            setVisitors(visitorsRes.data.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAll() }, [filterType])

    const getModuleIcon = (moduleName) => {
        switch (moduleName) {
            case 'PROJECT': return <Briefcase className='h-5 w-5' />
            case 'CONTENT': return <FileText className='h-5 w-5' />
            case 'TESTIMONIAL': return <Star className='h-5 w-5' />
            case 'CONTACT': return <MessageSquare className='h-5 w-5' />
            default: return <BarChart3 className='h-5 w-5' />
        }
    }

    return (
        <div className='space-y-6'>
            <div className='glass-card flex flex-wrap items-center justify-between gap-4 rounded-3xl p-5 md:p-6'>
                <div>
                    <h1 className='font-nevera text-3xl tracking-[0.08em] text-[var(--ink)]'>Analytics</h1>
                    <p className='mt-1 text-sm text-[var(--ink-soft)]'>Track engagement, views, and clicks across your portfolio.</p>
                </div>
                <button onClick={fetchAll} className='focus-ring button-pop flex items-center gap-2 rounded-xl bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--bg-alt)]'>
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
            </div>

            {loading && !summary ? (
                <div className='glass-card rounded-2xl py-14'>
                    <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)]/30 border-t-[var(--accent)]'></div>
                </div>
            ) : (
                <>
                    {/* Top Level Summary Cards */}
                    {summary && (
                        <div className='grid gap-4 md:grid-cols-3'>
                            <div className='glass-card rounded-2xl p-5 flex items-center gap-4'>
                                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500'>
                                    <Eye className='h-6 w-6' />
                                </div>
                                <div>
                                    <p className='text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Total Views</p>
                                    <h3 className='text-2xl font-bold text-[var(--ink)]'>{summary.totalPageViews}</h3>
                                </div>
                            </div>
                            <div className='glass-card rounded-2xl p-5 flex items-center gap-4'>
                                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500'>
                                    <MousePointerClick className='h-6 w-6' />
                                </div>
                                <div>
                                    <p className='text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Total Clicks</p>
                                    <h3 className='text-2xl font-bold text-[var(--ink)]'>{summary.totalClicks}</h3>
                                </div>
                            </div>
                            <div className='glass-card rounded-2xl p-5 flex items-center gap-4'>
                                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-500'>
                                    <MessageSquare className='h-6 w-6' />
                                </div>
                                <div>
                                    <p className='text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]'>Form Submissions</p>
                                    <h3 className='text-2xl font-bold text-[var(--ink)]'>{summary.totalFormSubmissions}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Time Series Chart */}
                    {timeseries.length > 0 && (
                        <div className='glass-card rounded-3xl p-6 md:p-8'>
                            <h2 className='font-nevera text-2xl tracking-[0.05em] text-[var(--ink)] mb-6'>Traffic Overview (Last 30 Days)</h2>
                            <div className='h-[350px] w-full'>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={timeseries} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
                                        <XAxis dataKey="date" stroke="var(--ink-soft)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} />
                                        <YAxis stroke="var(--ink-soft)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                        <RechartsTooltip 
                                            contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--line)', borderRadius: '16px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)' }}
                                            itemStyle={{ color: 'var(--ink)' }}
                                            labelStyle={{ color: 'var(--ink-soft)', marginBottom: '8px' }}
                                        />
                                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                        <Line type="monotone" name="Page Views" dataKey="pageViews" stroke="var(--accent)" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                                        <Line type="monotone" name="Clicks" dataKey="clicks" stroke="var(--accent-2)" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                                        <Line type="monotone" name="Forms" dataKey="formSubmissions" stroke="var(--accent-3)" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    <div className='grid gap-6 lg:grid-cols-3'>
                        {/* Modules Breakdown */}
                        <div className='glass-card rounded-2xl p-6 lg:col-span-1'>
                            <h2 className='font-nevera text-xl text-[var(--ink)] mb-4'>By Module</h2>
                            <div className='space-y-3'>
                                {modules.length > 0 ? modules.map(m => (
                                    <div key={m._id} className='flex items-center justify-between rounded-xl bg-[var(--surface)] p-3'>
                                        <div className='flex items-center gap-3'>
                                            <div className='text-[var(--accent-2)]'>
                                                {getModuleIcon(m._id)}
                                            </div>
                                            <span className='text-sm font-semibold text-[var(--ink)]'>{m._id}</span>
                                        </div>
                                        <span className='font-bold text-[var(--ink)]'>{m.count}</span>
                                    </div>
                                )) : (
                                    <p className='text-sm text-[var(--ink-soft)]'>No module data available.</p>
                                )}
                            </div>
                        </div>

                        {/* Recent Events Log */}
                        <div className='glass-card rounded-2xl p-6 lg:col-span-2 overflow-x-auto'>
                            <div className='flex items-center justify-between mb-4'>
                                <h2 className='font-nevera text-xl text-[var(--ink)]'>Recent Events</h2>
                                <select 
                                    value={filterType} 
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className='rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]'
                                >
                                    <option value="">All Types</option>
                                    <option value="PAGE_VIEW">Page Views</option>
                                    <option value="CLICK">Clicks</option>
                                    <option value="FORM_SUBMISSION">Form Submissions</option>
                                </select>
                            </div>
                            
                            <table className='w-full text-left text-sm text-[var(--ink)]'>
                                <thead className='text-xs uppercase text-[var(--ink-soft)] border-b border-[var(--line)]'>
                                    <tr>
                                        <th className='pb-3 font-semibold'>Event</th>
                                        <th className='pb-3 font-semibold'>Module</th>
                                        <th className='pb-3 font-semibold'>Page/Element</th>
                                        <th className='pb-3 font-semibold text-right'>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.length > 0 ? events.map(ev => (
                                        <tr key={ev._id} className='border-b border-[var(--line)]/50 last:border-0 hover:bg-[var(--surface)]'>
                                            <td className='py-3'>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ev.type === 'PAGE_VIEW' ? 'bg-blue-500/10 text-blue-500' : ev.type === 'CLICK' ? 'bg-purple-500/10 text-purple-500' : 'bg-green-500/10 text-green-500'}`}>
                                                    {ev.type}
                                                </span>
                                            </td>
                                            <td className='py-3 font-medium'>{ev.module}</td>
                                            <td className='py-3'>
                                                <div className='truncate max-w-[200px]'>
                                                    {ev.page} {ev.element && <span className='text-[var(--ink-soft)] ml-1'>({ev.element})</span>}
                                                </div>
                                            </td>
                                            <td className='py-3 text-right text-xs text-[var(--ink-soft)]'>
                                                {new Date(ev.createdAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className='py-8 text-center text-[var(--ink-soft)]'>No events found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Unique Visitors List */}
                    <div className='glass-card rounded-2xl p-6 overflow-x-auto mt-6'>
                        <div className='flex items-center gap-3 mb-6'>
                            <Users className='h-6 w-6 text-[var(--accent)]' />
                            <h2 className='font-nevera text-2xl tracking-[0.05em] text-[var(--ink)]'>Unique Visitors</h2>
                        </div>
                        
                        <table className='w-full text-left text-sm text-[var(--ink)]'>
                            <thead className='text-xs uppercase text-[var(--ink-soft)] border-b border-[var(--line)]'>
                                <tr>
                                    <th className='pb-3 font-semibold'>Identity</th>
                                    <th className='pb-3 font-semibold'>System</th>
                                    <th className='pb-3 font-semibold text-center'>Page Views</th>
                                    <th className='pb-3 font-semibold text-center'>Total Events</th>
                                    <th className='pb-3 font-semibold text-right'>First Seen / Last Seen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visitors.length > 0 ? visitors.map(v => (
                                    <tr key={v._id} className='border-b border-[var(--line)]/50 last:border-0 hover:bg-[var(--surface)]'>
                                        <td className='py-4'>
                                            {v.realName ? (
                                                <div className='flex items-center gap-2'>
                                                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-white font-bold text-xs'>
                                                        {v.realName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className='font-bold text-[var(--accent)]'>{v.realName}</span>
                                                </div>
                                            ) : (
                                                <span className='font-medium text-[var(--ink-soft)] font-mono text-xs'>Anon: {v._id ? v._id.split('-')[0] : 'Legacy'}</span>
                                            )}
                                        </td>
                                        <td className='py-4 text-[var(--ink)]'>
                                            {v.visitorLabel}
                                        </td>
                                        <td className='py-4 text-center font-bold'>
                                            {v.pageViews}
                                        </td>
                                        <td className='py-4 text-center font-bold text-[var(--accent-2)]'>
                                            {v.totalEvents}
                                        </td>
                                        <td className='py-4 text-right text-xs text-[var(--ink-soft)]'>
                                            <div className='flex flex-col items-end gap-1'>
                                                <span title="First seen">{new Date(v.firstVisit).toLocaleDateString()}</span>
                                                <span title="Last seen" className='flex items-center gap-1 text-[var(--accent)]'><Clock className='h-3 w-3'/> {new Date(v.lastVisit).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className='py-8 text-center text-[var(--ink-soft)]'>No visitors tracked yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    )
}

export default AnalyticsAdmin
