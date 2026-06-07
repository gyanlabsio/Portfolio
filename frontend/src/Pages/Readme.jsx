import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import SEO from '../components/SEO'
import { getSettings } from '../api/settings'
import ReactMarkdown from 'react-markdown'
import SplitText from '../components/effects/SplitText'

const Readme = () => {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await getSettings()
        setConfig(data.data)
      } catch (err) {
        console.error('Failed to load site config in Readme', err)
      } finally {
        setLoading(false)
      }
    }
    fetchConfig()
  }, [])

  return (
    <main className='pb-16 pt-8 md:pt-12'>
      <SEO title='Readme' description='Detailed documentation and readme.' />

      <section className='section-wrap enter-fade'>
        <div className='glass-card rounded-[30px] p-6 md:p-10 lg:p-12 max-w-4xl mx-auto'>
          <div className='mb-8'>
            <Link to='/Bio' className='inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink-soft)] hover:text-[var(--accent)] transition'>
              <ArrowLeft className='h-4 w-4' />
              Back to Bio
            </Link>
          </div>

          <h1 className='display-title text-4xl text-[var(--ink)] sm:text-5xl mb-10'>
            <SplitText text="Readme" delay={0.2} />
          </h1>

          <div className='mt-8 space-y-4 text-base leading-relaxed text-[var(--ink-soft)] [&_p]:mb-4 [&_a]:text-[var(--accent)] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-[var(--ink)] [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[var(--ink)] [&_h2]:mb-3 [&_h2]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[var(--ink)] [&_h3]:mb-2 [&_h3]:mt-4 [&_pre]:bg-[var(--surface)] [&_pre]:p-4 [&_pre]:rounded-xl [&_code]:bg-[var(--surface)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--line)] [&_blockquote]:pl-4 [&_blockquote]:italic'>
            {loading ? (
              <p className='ink-soft'>Loading readme...</p>
            ) : config?.readmeContent ? (
              <ReactMarkdown>{config.readmeContent}</ReactMarkdown>
            ) : (
              <p>No Readme content available.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Readme
