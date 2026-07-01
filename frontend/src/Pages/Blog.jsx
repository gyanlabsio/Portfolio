import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpenCheck, Calendar, Code2, NotebookTabs, Tag } from 'lucide-react'
import SEO from '../components/SEO'
import { getPosts } from '../api/blog'
import SplitText from '../components/effects/SplitText'
import BlurText from '../components/effects/BlurText'
import Loader from '../components/Loader'
import NewsletterSubscribe from '../components/interactions/NewsletterSubscribe'

const FILTERS = [
  { key: '', label: 'All' },
  { key: 'blog', label: 'Blogs' },
  { key: 'article', label: 'Articles' },
  { key: 'case_study', label: 'Case Studies' },
  { key: 'note', label: 'Notes' },
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

      <section className='mb-24 border-b border-[var(--line)] pb-16'>
        <div className='px-6 md:px-10 lg:px-16'>
          <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
            <div>
              <p className='mb-4 text-xs font-bold uppercase tracking-widest text-[var(--ink)]'>
                Writing &amp; Ideas
              </p>
              <h1 className='text-6xl font-black uppercase tracking-tighter text-[var(--ink)] md:text-8xl'>
                <SplitText text='Blog' delay={0.2} />
              </h1>
              <div className='mt-2 max-w-2xl text-sm font-bold uppercase tracking-[0.11em] text-[var(--ink-soft)]'>
                <BlurText text='Notes on architecture, interfaces, and building things that ship.' delay={0.8} />
              </div>
            </div>
            <div className='text-sm font-bold uppercase tracking-widest text-[var(--ink-soft)]'>
              <p className='text-[var(--ink)]'>{posts.length || 0} posts</p>
              <p>published</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter Tabs ── */}
      <section className='px-6 md:px-10 lg:px-16 mb-16'>
        <div className='flex items-center gap-2 overflow-x-auto pb-4'>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => handleFilterChange(f.key)}
              className={`inline-flex items-center gap-1.5 border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors duration-200 ${
                activeFilter === f.key
                  ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--surface)]'
                  : 'border-[var(--line)] bg-[var(--bg)] text-[var(--ink-soft)] hover:bg-[var(--ink)] hover:text-[var(--surface)] hover:border-[var(--ink)]'
              }`}
            >
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
          <div className=' rounded-none p-10 text-center'>
            <Code2 className='mx-auto h-12 w-12 text-[var(--accent)]' />
            <h3 className='display-title mt-4 text-3xl text-[var(--ink)]'>
              {activeFilter === 'case_study' ? 'No Case Studies Yet' : activeFilter === 'article' ? 'No Articles Yet' : activeFilter === 'blog' ? 'No Blogs Yet' : 'Coming Soon'}
            </h3>
            <p className='mx-auto mt-3 max-w-lg text-[var(--ink-soft)]'>
              {activeFilter === 'case_study'
                ? 'Case studies are on the way. Check back soon for deep dives on real-world projects.'
                : activeFilter === 'article'
                  ? 'Articles are in progress. Check back for technical writing and field notes.'
                  : activeFilter === 'blog'
                    ? 'Blogs are in progress. Check back soon.'
                    : 'Fresh writing is in progress. Check back for deep dives and field notes.'}
            </p>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className='grid grid-cols-1 gap-12 px-6 md:px-10 lg:px-16 lg:grid-cols-2 lg:gap-20'>
            {posts.map((post) => (
              <Link
                key={post._id}
                to={`/blog/${post.slug}`}
                className='group block focus:outline-none'
              >
                {post.coverImage && (
                  <div className='relative overflow-hidden border border-[var(--line)] mb-6'>
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className='h-[400px] w-full object-cover grayscale transition duration-700 group-hover:grayscale-0 group-hover:scale-105'
                    />
                    {post.type === 'CASE_STUDY' && (
                      <span className='absolute left-4 top-4 border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md'>
                        Case Study
                      </span>
                    )}
                  </div>
                )}

                <div className='flex flex-col gap-4'>
                  <div className='flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--ink-soft)]'>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {post.readingTime && <span>&bull; {post.readingTime} min read</span>}
                  </div>

                  <h3 className='text-3xl font-black uppercase tracking-tighter text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors md:text-4xl'>
                    {post.title}
                  </h3>

                  <p className='text-base font-light leading-relaxed text-[var(--ink-soft)]'>
                    {post.excerpt}
                  </p>

                  <div className='flex items-center gap-1 pt-2 text-xs font-bold uppercase tracking-widest text-[var(--ink)] transition-all duration-300 group-hover:gap-2'>
                    Read More <ArrowRight className='h-3.5 w-3.5' />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className='section-wrap mt-12 max-w-2xl mx-auto'>
        <NewsletterSubscribe />
      </section>
    </main>
  )
}

export default Blog
