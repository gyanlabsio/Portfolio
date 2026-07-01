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

      <section className='enter-fade px-6 md:px-10 lg:px-16'>
        <div className='grid gap-12 lg:gap-20 lg:grid-cols-[1fr_1fr] items-start'>
          <article className='pt-12'>
            <h1 className='text-6xl font-black uppercase tracking-tighter text-[var(--ink)] sm:text-7xl lg:text-8xl'>
              <SplitText text='Contact' delay={0.2} />
            </h1>
            <div className='mt-6 max-w-md text-sm font-bold uppercase tracking-widest text-[var(--ink-soft)]'>
              <BlurText text='Have an idea, collaboration, or build request? Send a note and I will get back soon.' delay={0.8} />
            </div>

            <div className='mt-16 space-y-6'>
              <div className='flex items-start gap-4 border-l-2 border-[var(--ink)] pl-6'>
                <div>
                  <p className='text-xs font-bold uppercase tracking-widest text-[var(--ink)]'>Email</p>
                  <p className='mt-1 text-sm font-light text-[var(--ink-soft)]'>Best for project briefs and partnerships.</p>
                </div>
              </div>
              <div className='flex items-start gap-4 border-l-2 border-[var(--ink)] pl-6'>
                <div>
                  <p className='text-xs font-bold uppercase tracking-widest text-[var(--ink)]'>Quick Response</p>
                  <p className='mt-1 text-sm font-light text-[var(--ink-soft)]'>Clear goals get faster timelines and scoped estimates.</p>
                </div>
              </div>
              <div className='flex items-start gap-4 border-l-2 border-[var(--ink)] pl-6'>
                <div>
                  <p className='text-xs font-bold uppercase tracking-widest text-[var(--ink)]'>Consultation</p>
                  <p className='mt-1 text-sm font-light text-[var(--ink-soft)]'>Include your preferred timezone and communication mode.</p>
                </div>
              </div>
            </div>
          </article>

          <article className='border border-[var(--line)] bg-[var(--bg)] p-8 md:p-12 lg:mt-12'>
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
                className='border border-[var(--line)] bg-[var(--bg)] px-4 py-4 text-sm font-bold uppercase tracking-widest text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--ink)] focus:outline-none md:col-span-1 transition-colors'
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
                className='border border-[var(--line)] bg-[var(--bg)] px-4 py-4 text-sm font-bold uppercase tracking-widest text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--ink)] focus:outline-none md:col-span-1 transition-colors'
              />
              <label htmlFor='contact-subject' className='sr-only'>Subject</label>
              <input
                id='contact-subject'
                type='text'
                name='subject'
                value={contactData.subject}
                onChange={handleContactChange}
                placeholder='Subject'
                className='border border-[var(--line)] bg-[var(--bg)] px-4 py-4 text-sm font-bold uppercase tracking-widest text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--ink)] focus:outline-none md:col-span-2 transition-colors'
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
                className='resize-none border border-[var(--line)] bg-[var(--bg)] px-4 py-4 text-sm font-bold uppercase tracking-widest text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--ink)] focus:outline-none md:col-span-2 transition-colors'
              />
              <div className='md:col-span-2 flex flex-col items-start gap-4 sm:flex-row sm:items-center pt-2'>
                <button
                  type='submit'
                  disabled={contactLoading}
                  className='inline-flex items-center border border-[var(--ink)] bg-[var(--ink)] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-[var(--ink)] disabled:opacity-60'
                >
                  {contactLoading ? 'Sending...' : 'Send Message'}
                </button>
                {contactStatus && (
                  <p className={`text-xs font-bold uppercase tracking-widest ${contactStatus.type === 'success' ? 'text-[var(--ink)]' : 'text-red-600'}`}>
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
