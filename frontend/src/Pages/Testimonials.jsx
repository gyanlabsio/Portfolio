import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquareText, Star } from 'lucide-react'
import SEO from '../components/SEO'
import { getTestimonials, submitTestimonial } from '../api/testimonial'
import SplitText from '../components/effects/SplitText'
import BlurText from '../components/effects/BlurText'
import Loader from '../components/Loader'

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  // Form State
  const [formData, setFormData] = useState({ clientName: '', clientRole: '', company: '', testimonial: '', rating: 5 })
  const [status, setStatus] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await getTestimonials()
        // Only show approved testimonials publicly
        const approved = (data.data || []).filter(t => t.status === 'APPROVED')
        setTestimonials(approved)
      } catch (err) {
        console.error('Failed to load testimonials', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus(null)
    try {
      await submitTestimonial(formData)
      setStatus({ type: 'success', message: 'Testimonial submitted successfully! It will appear once approved.' })
      setFormData({ clientName: '', clientRole: '', company: '', testimonial: '', rating: 5 })
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to submit. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className='pb-16 pt-8 md:pt-12'>
      <SEO title='Testimonials' description='Read what clients and collaborators have to say about working with me.' />

      <section className='enter-fade max-w-7xl mx-auto px-6 md:px-10 lg:px-16'>
        <div className='mb-16 border-b border-[var(--line)] pb-12'>
          <h1 className='text-6xl font-black uppercase tracking-tighter text-[var(--ink)] sm:text-7xl lg:text-8xl'>
            <SplitText text='Client Feedback' delay={0.2} />
          </h1>
          <div className='mt-6 max-w-xl text-sm font-bold uppercase tracking-widest text-[var(--ink-soft)]'>
            <BlurText text='Stories and experiences from the people I have collaborated with.' delay={0.6} />
          </div>
        </div>

        <div className='grid gap-8 lg:grid-cols-[1.2fr_0.8fr]'>
          {/* Testimonials List */}
          <div className='space-y-6'>
            {loading ? (
              <Loader text="Loading testimonials..." />
            ) : testimonials.length === 0 ? (
              <div className='p-8 text-center border border-[var(--line)] bg-[var(--bg)]'>
                <MessageSquareText className='mx-auto h-8 w-8 text-[var(--ink)]' />
                <p className='mt-4 text-xs font-bold uppercase tracking-widest text-[var(--ink)]'>No Testimonials Yet</p>
                <p className='mt-2 text-sm font-light text-[var(--ink-soft)]'>Be the first to share your experience!</p>
              </div>
            ) : (
              <div className='grid gap-6 sm:grid-cols-2'>
                {testimonials.map(t => (
                  <article key={t._id} className='p-8 border border-[var(--line)] bg-[var(--bg)] transition-colors hover:border-[var(--ink)]'>
                    <div className='flex items-center gap-1 mb-6'>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < (t.rating || 5) ? 'fill-[var(--ink)] text-[var(--ink)]' : 'text-[var(--line)]'}`} />
                      ))}
                    </div>
                    <p className='text-sm italic font-light leading-relaxed text-[var(--ink)]'>" {t.testimonial} "</p>
                    <div className='mt-8 flex items-center gap-4 border-t border-[var(--line)] pt-6'>
                      {t.avatar ? (
                        <img src={t.avatar} alt={t.clientName} className='h-12 w-12 object-cover border border-[var(--line)]' />
                      ) : (
                        <div className='flex h-12 w-12 items-center justify-center bg-[var(--ink)] text-sm font-bold uppercase tracking-widest text-white border border-[var(--ink)]'>
                          {t.clientName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className='text-xs font-bold uppercase tracking-widest text-[var(--ink)]'>{t.clientName}</p>
                        <p className='mt-1 text-xs font-light text-[var(--ink-soft)]'>
                          {t.clientRole}{t.clientRole && t.company && ' @ '}{t.company}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Submission Form */}
          <aside className='h-fit lg:sticky lg:top-24'>
            <div className='p-8 border border-[var(--line)] bg-[var(--bg)]'>
              <h2 className='text-xl font-black uppercase tracking-tighter text-[var(--ink)]'>Add Your Testimonial</h2>
              <p className='mt-4 mb-8 text-sm font-light text-[var(--ink-soft)]'>
                Have we worked together? I would love to hear your feedback on our collaboration.
              </p>

              <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                  <label htmlFor='clientName' className='sr-only'>Your Name</label>
                  <input
                    id='clientName'
                    type='text'
                    name='clientName'
                    value={formData.clientName}
                    onChange={handleChange}
                    placeholder='Your Name'
                    required
                    className='w-full border border-[var(--line)] bg-[var(--bg)] px-4 py-4 text-sm font-bold uppercase tracking-widest text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--ink)] focus:outline-none transition-colors'
                  />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label htmlFor='clientRole' className='sr-only'>Your Role</label>
                    <input
                      id='clientRole'
                      type='text'
                      name='clientRole'
                      value={formData.clientRole}
                      onChange={handleChange}
                      placeholder='Role (e.g. CEO)'
                      className='w-full border border-[var(--line)] bg-[var(--bg)] px-4 py-4 text-sm font-bold uppercase tracking-widest text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--ink)] focus:outline-none transition-colors'
                    />
                  </div>
                  <div>
                    <label htmlFor='company' className='sr-only'>Company</label>
                    <input
                      id='company'
                      type='text'
                      name='company'
                      value={formData.company}
                      onChange={handleChange}
                      placeholder='Company'
                      className='w-full border border-[var(--line)] bg-[var(--bg)] px-4 py-4 text-sm font-bold uppercase tracking-widest text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--ink)] focus:outline-none transition-colors'
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor='testimonial' className='sr-only'>Your Feedback</label>
                  <textarea
                    id='testimonial'
                    name='testimonial'
                    value={formData.testimonial}
                    onChange={handleChange}
                    placeholder='Your feedback...'
                    required
                    rows={4}
                    className='w-full resize-none border border-[var(--line)] bg-[var(--bg)] px-4 py-4 text-sm font-bold uppercase tracking-widest text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--ink)] focus:outline-none transition-colors'
                  />
                </div>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full border border-[var(--ink)] bg-[var(--ink)] px-6 py-4 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-[var(--ink)] disabled:opacity-60'
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
                </button>
                {status && (
                  <p className={`text-xs font-bold uppercase tracking-widest mt-4 text-center ${status.type === 'success' ? 'text-[var(--ink)]' : 'text-red-600'}`}>
                    {status.message}
                  </p>
                )}
              </form>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default Testimonials
