import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpenCheck, Calendar, Code2, NotebookTabs, Tag } from 'lucide-react'
import SEO from '../components/SEO'
import { getPosts } from '../api/blog'
import SplitText from '../components/effects/SplitText'
import BlurText from '../components/effects/BlurText'
import Loader from '../components/Loader'

const FILTERS = [
  { key: '', label: 'All' },
  { key: 'article', label: 'Articles' },
  { key: 'casestudy', label: 'Case Studies' },
]

const Blog = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('')

  const fetchPosts = useCallback(async (type) => {
    setLoading(true)
    try {
      const { data } = await getPosts(false, type)
      setPosts(data.data || [])
    } catch (err) {
      console.error('Failed to load blog posts', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts(activeFilter)
  }, [activeFilter, fetchPosts])

  const handleFilterChange = (key) => {
    if (key !== activeFilter) setActiveFilter(key)
  }

  return (
    <main className='pb-16 pt-8 md:pt-12'>
      <SEO title='Blog' description='Thoughts on web development, design systems, and product architecture.' />

      <section className='section-wrap enter-fade'>
        <div className='relative overflow-hidden rounded-[32px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.16)] md:p-10'>
          <div className='pointer-events-none absolute -left-12 top-0 h-44 w-44 rounded-full bg-[var(--accent-3)]/16 blur-3xl' />
          <div className='pointer-events-none absolute -right-12 bottom-0 h-44 w-44 rounded-full bg-[var(--accent-2)]/18 blur-3xl' />

          <div className='relative flex flex-wrap items-center justify-between gap-4'>
            <div>
              <div className='inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-soft)]'>
                <NotebookTabs className='h-3.5 w-3.5 text-[var(--accent-2)]' />
                Writing &amp; Ideas
              </div>
              <h1 className='display-title mt-3 text-4xl text-[var(--ink)] sm:text-6xl'>
                <SplitText text='Blog' delay={0.2} />
              </h1>
              <div className='mt-2 max-w-2xl text-sm uppercase tracking-[0.11em] text-[var(--ink-soft)]'>
                <BlurText text='Notes on architecture, interfaces, and building things that ship.' delay={0.8} />
              </div>
            </div>
            <div className='rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink-soft)]'>
              <p className='font-semibold text-[var(--ink)]'>{posts.length || 0} posts</p>
              <p>currently published</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter Tabs ── */}
      <section className='section-wrap mt-6'>
        <div className='flex items-center gap-2 overflow-x-auto'>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => handleFilterChange(f.key)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
                activeFilter === f.key
                  ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                  : 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink-soft)] hover:border-[var(--accent-2)] hover:text-[var(--accent-2)]'
              }`}
            >
              {f.key === 'casestudy' && <BookOpenCheck className='h-3.5 w-3.5' />}
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <section className='section-wrap mt-6'>
        {loading && (
          <div className='flex items-center justify-center py-20'>
            <Loader text="Loading posts..." />
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className='glass-card rounded-3xl p-10 text-center'>
            <Code2 className='mx-auto h-12 w-12 text-[var(--accent)]' />
            <h3 className='display-title mt-4 text-3xl text-[var(--ink)]'>
              {activeFilter === 'casestudy' ? 'No Case Studies Yet' : activeFilter === 'article' ? 'No Articles Yet' : 'Coming Soon'}
            </h3>
            <p className='mx-auto mt-3 max-w-lg text-[var(--ink-soft)]'>
              {activeFilter === 'casestudy'
                ? 'Case studies are on the way. Check back soon for deep dives on real-world projects.'
                : activeFilter === 'article'
                  ? 'Articles are in progress. Check back for technical writing and field notes.'
                  : 'Fresh writing is in progress. Check back for deep dives and field notes.'}
            </p>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3'>
            {posts.map((post) => (
              <Link
                key={post._id}
                to={`/blog/${post.slug}`}
                className='glass-card group enter-fade block rounded-3xl p-4 md:p-5'
              >
                {post.coverImage && (
                  <div className='relative overflow-hidden rounded-2xl border border-[var(--line)]'>
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className='h-52 w-full object-cover transition duration-500 group-hover:scale-[1.03]'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-[#10182899] to-transparent' />
                    {post.type === 'CASE_STUDY' && (
                      <span className='absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-[#0c7fa3]/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm'>
                        <BookOpenCheck className='h-3 w-3' /> Case Study
                      </span>
                    )}
                    {post.featured && (
                      <span className={`absolute ${post.type === 'CASE_STUDY' ? 'left-3 top-10' : 'left-3 top-3'} inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm`}>
                        Featured
                      </span>
                    )}
                  </div>
                )}

                <div className='mt-4 space-y-3'>
                  <div className='flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-soft)]'>
                    <span className='inline-flex items-center gap-1'>
                      <Calendar className='w-3.5 h-3.5' />
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {post.readingTime && <span>&bull; ~{post.readingTime} min read</span>}
                    {post.type === 'CASE_STUDY' && !post.coverImage && (
                      <span className='ml-auto inline-flex items-center gap-1 rounded-full border border-[var(--accent-2)]/20 bg-[var(--accent-2)]/10 px-2 py-0.5 text-[10px] font-bold text-[var(--accent-2)]'>
                        <BookOpenCheck className='h-3 w-3' /> Case Study
                      </span>
                    )}
                  </div>

                  <h3 className='display-title text-2xl leading-snug text-[var(--ink)] group-hover:text-[var(--accent-2)]'>
                    {post.title}
                  </h3>

                  <p className='line-clamp-3 text-sm leading-relaxed text-[var(--ink-soft)]'>
                    {post.excerpt}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className='inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--ink)]'
                        >
                          <Tag className='w-2.5 h-2.5' /> {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className='flex items-center gap-1 pt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)] transition-all duration-300 group-hover:gap-2'>
                    Read More <ArrowRight className='h-3.5 w-3.5' />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default Blog
