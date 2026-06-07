import { useState } from 'react'
import { Mail, MessageSquareText, PhoneCall } from 'lucide-react'
import SEO from '../components/SEO'
import { submitContact } from '../api/contact'
import { recordEvent } from '../api/analytics'
import SplitText from '../components/effects/SplitText'
import BlurText from '../components/effects/BlurText'

const Contact = () => {
  // Contact form state
  const [contactData, setContactData] = useState({ name: '', email: '', subject: '', message: '' })
  const [contactStatus, setContactStatus] = useState(null)
  const [contactLoading, setContactLoading] = useState(false)

  const handleContactChange = (e) => {
    setContactData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setContactLoading(true)
    setContactStatus(null)
    try {
      await submitContact(contactData)
      localStorage.setItem('visitor_real_name', contactData.name)
      
      // Track analytics
      recordEvent({
          type: 'FORM_SUBMISSION',
          page: '/Contact',
          module: 'CONTACT',
          visitorId: localStorage.getItem('visitor_id') || undefined,
          visitorLabel: localStorage.getItem('visitor_label') || undefined,
          realName: contactData.name
      }).catch(console.error);

      setContactStatus({ type: 'success', message: 'Message sent! I\'ll get back to you soon.' })
      setContactData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setContactStatus({ type: 'error', message: error.response?.data?.message || 'Failed to send. Please try again.' })
    } finally {
      setContactLoading(false)
    }
  }

  return (
    <main className='pb-16 pt-8 md:pt-12'>
      <SEO title='Contact' description='Start a conversation for collaborations, projects, or product ideas.' />

      <section className='section-wrap enter-fade'>
        <div className='grid gap-6 lg:grid-cols-[0.9fr_1.1fr]'>
          <article className='glass-card rounded-[30px] p-6 md:p-8'>
            <h1 className='display-title text-4xl text-[var(--ink)] sm:text-5xl'>
              <SplitText text='Get In Touch' delay={0.2} />
            </h1>
            <div className='mt-3 max-w-md text-[var(--ink-soft)]'>
              <BlurText text='Have an idea, collaboration, or build request? Send a note and I will get back soon.' delay={0.8} />
            </div>

            <div className='mt-8 space-y-3'>
              <div className='flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4'>
                <Mail className='mt-0.5 h-5 w-5 text-[var(--accent-2)]' />
                <div>
                  <p className='text-sm font-semibold text-[var(--ink)]'>Email</p>
                  <p className='text-sm text-[var(--ink-soft)]'>Best for project briefs and partnerships.</p>
                </div>
              </div>
              <div className='flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4'>
                <MessageSquareText className='mt-0.5 h-5 w-5 text-[var(--accent)]' />
                <div>
                  <p className='text-sm font-semibold text-[var(--ink)]'>Quick Response</p>
                  <p className='text-sm text-[var(--ink-soft)]'>Clear goals get faster timelines and scoped estimates.</p>
                </div>
              </div>
              <div className='flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4'>
                <PhoneCall className='mt-0.5 h-5 w-5 text-[var(--accent-3)]' />
                <div>
                  <p className='text-sm font-semibold text-[var(--ink)]'>Consultation</p>
                  <p className='text-sm text-[var(--ink-soft)]'>Include your preferred timezone and communication mode.</p>
                </div>
              </div>
            </div>
          </article>

          <article className='glass-card rounded-[30px] p-6 md:p-8'>
            <form onSubmit={handleContactSubmit} className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <label htmlFor='contact-name' className='sr-only'>Your Name</label>
              <input
                id='contact-name'
                type='text'
                name='name'
                value={contactData.name}
                onChange={handleContactChange}
                placeholder='Your Name'
                autoComplete="name"
                required
                className='rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--accent-2)]/50 focus:outline-none md:col-span-1'
              />
              <label htmlFor='contact-email' className='sr-only'>Your Email</label>
              <input
                id='contact-email'
                type='email'
                name='email'
                value={contactData.email}
                onChange={handleContactChange}
                placeholder='Your Email'
                autoComplete="email"
                required
                className='rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--accent-2)]/50 focus:outline-none md:col-span-1'
              />
              <label htmlFor='contact-subject' className='sr-only'>Subject</label>
              <input
                id='contact-subject'
                type='text'
                name='subject'
                value={contactData.subject}
                onChange={handleContactChange}
                placeholder='Subject'
                className='rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--accent-2)]/50 focus:outline-none md:col-span-2'
              />
              <label htmlFor='contact-message' className='sr-only'>Your Message</label>
              <textarea
                id='contact-message'
                name='message'
                value={contactData.message}
                onChange={handleContactChange}
                placeholder='Your Message'
                required
                rows={5}
                className='resize-none rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--accent-2)]/50 focus:outline-none md:col-span-2'
              />
              <div className='md:col-span-2 flex flex-col items-start gap-3 sm:flex-row sm:items-center'>
                <button
                  type='submit'
                  disabled={contactLoading}
                  className='inline-flex items-center rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60'
                >
                  {contactLoading ? 'Sending...' : 'Send Message'}
                </button>
                {contactStatus && (
                  <p className={`text-sm ${contactStatus.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {contactStatus.message}
                  </p>
                )}
              </div>
            </form>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Contact
