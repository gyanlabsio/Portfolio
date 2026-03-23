import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Code2, NotebookTabs, Tag } from 'lucide-react'
import SEO from '../components/SEO'
import { getPosts } from '../api/blog'

const Blog = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await getPosts()
        setPosts(data.data || [])
      } catch (err) {
        console.error('Failed to load blog posts', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  return (
    <main className='pb-16 pt-8 md:pt-12'>
      <SEO title='Blog' description='Thoughts on web development, design systems, and product architecture.' />

      <section className='section-wrap enter-fade'>
        <div className='relative overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-br from-white/90 via-[#f0ede3]/90 to-[#ece7dc]/90 p-6 shadow-[0_24px_80px_rgba(18,23,32,0.16)] md:p-10'>
          <div className='pointer-events-none absolute -left-12 top-0 h-44 w-44 rounded-full bg-[#f3a712]/16 blur-3xl' />
          <div className='pointer-events-none absolute -right-12 bottom-0 h-44 w-44 rounded-full bg-[#0c7fa3]/18 blur-3xl' />

          <div className='relative flex flex-wrap items-center justify-between gap-4'>
            <div>
              <div className='inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#516173]'>
                <NotebookTabs className='h-3.5 w-3.5 text-[#0c7fa3]' />
                Writing & Ideas
              </div>
              <h1 className='display-title mt-3 text-4xl text-[#162133] sm:text-6xl'>Blog</h1>
              <p className='mt-2 max-w-2xl text-sm uppercase tracking-[0.11em] text-[#5a6979]'>
                Notes on architecture, interfaces, and building things that ship.
              </p>
            </div>
            <div className='rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm text-[#435063]'>
              <p className='font-semibold text-[#182234]'>{posts.length || 0} posts</p>
              <p>currently published</p>
            </div>
          </div>
        </div>
      </section>

      <section className='section-wrap mt-8'>
        {loading && (
          <div className='glass-card rounded-3xl p-10 text-center'>
            <div className='mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#ef3e2f]/30 border-t-[#ef3e2f]' />
            <p className='mt-3 ink-soft'>Loading posts...</p>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className='glass-card rounded-3xl p-10 text-center'>
            <Code2 className='mx-auto h-12 w-12 text-[#ef3e2f]' />
            <h3 className='display-title mt-4 text-3xl text-[#1a2535]'>Coming Soon</h3>
            <p className='mx-auto mt-3 max-w-lg text-[#4b5766]'>
              Fresh writing is in progress. Check back for deep dives and field notes.
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
                {post.featuredImage && (
                  <div className='relative overflow-hidden rounded-2xl border border-black/10'>
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className='h-52 w-full object-cover transition duration-500 group-hover:scale-[1.03]'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-[#10182899] to-transparent' />
                  </div>
                )}

                <div className='mt-4 space-y-3'>
                  <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#647486]'>
                    <Calendar className='w-3.5 h-3.5' />
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>

                  <h3 className='display-title text-2xl leading-snug text-[#192334] group-hover:text-[#0c7fa3]'>
                    {post.title}
                  </h3>

                  <p className='line-clamp-3 text-sm leading-relaxed text-[#4f5a67]'>
                    {post.excerpt}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className='inline-flex items-center gap-1 rounded-full border border-black/10 bg-white/80 px-2.5 py-1 text-xs font-semibold text-[#475569]'
                        >
                          <Tag className='w-2.5 h-2.5' /> {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className='flex items-center gap-1 pt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#ef3e2f] transition-all duration-300 group-hover:gap-2'>
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
