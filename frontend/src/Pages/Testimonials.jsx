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

      <section className='section-wrap enter-fade'>
        <div className='mb-10 text-center'>
          <h1 className='display-title text-4xl text-[var(--ink)] sm:text-5xl'>
            <SplitText text='Client Feedback' delay={0.2} />
          </h1>
          <div className='mt-3 mx-auto max-w-xl text-[var(--ink-soft)]'>
            <BlurText text='Stories and experiences from the people I have collaborated with.' delay={0.6} />
          </div>
        </div>

        <div className='grid gap-8 lg:grid-cols-[1.2fr_0.8fr]'>
          {/* Testimonials List */}
          <div className='space-y-6'>
            {loading ? (
              <Loader text="Loading testimonials..." />
            ) : testimonials.length === 0 ? (
              <div className='glass-card rounded-[30px] p-8 text-center'>
                <MessageSquareText className='mx-auto h-8 w-8 text-[var(--accent-2)]' />
                <p className='mt-4 text-lg font-semibold text-[var(--ink)]'>No Testimonials Yet</p>
                <p className='mt-2 text-[var(--ink-soft)]'>Be the first to share your experience!</p>
              </div>
            ) : (
              <div className='grid gap-6 sm:grid-cols-2'>
                {testimonials.map(t => (
                  <article key={t._id} className='glass-card rounded-[24px] p-6'>
                    <div className='flex items-center gap-1 mb-4'>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < (t.rating || 5) ? 'fill-[var(--accent-2)] text-[var(--accent-2)]' : 'text-[var(--line)]'}`} />
                      ))}
                    </div>
                    <p className='text-sm italic leading-relaxed text-[var(--ink)]'>"{t.testimonial}"</p>
                    <div className='mt-6 flex items-center gap-3 border-t border-[var(--line)] pt-4'>
                      {t.avatar ? (
                        <img src={t.avatar} alt={t.clientName} className='h-10 w-10 rounded-full object-cover border border-[var(--line)]' />
                      ) : (
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] font-nevera text-lg text-[var(--accent)] border border-[var(--line)]'>
                          {t.clientName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className='text-sm font-semibold text-[var(--ink)]'>{t.clientName}</p>
                        <p className='text-xs text-[var(--ink-soft)]'>
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
          <aside className='h-fit sticky top-24'>
            <div className='glass-card rounded-[30px] p-6 md:p-8'>
              <h2 className='text-xl font-semibold text-[var(--ink)]'>Add Your Testimonial</h2>
              <p className='mt-2 mb-6 text-sm text-[var(--ink-soft)]'>
                Have we worked together? I would love to hear your feedback on our collaboration.
              </p>

              <form onSubmit={handleSubmit} className='space-y-4'>
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
                    className='w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--accent-2)]/50 focus:outline-none'
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
                      className='w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--accent-2)]/50 focus:outline-none'
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
                      className='w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--accent-2)]/50 focus:outline-none'
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
                    className='w-full resize-none rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--accent-2)]/50 focus:outline-none'
                  />
                </div>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60'
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
                </button>
                {status && (
                  <p className={`text-sm text-center ${status.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
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
