import { useState } from 'react'
import { Rocket, CheckCircle2, ArrowRight } from 'lucide-react'
import SEO from '../components/SEO'
import { submitLead } from '../api/lead'
import { recordEvent } from '../api/analytics'
import SplitText from '../components/effects/SplitText'
import BlurText from '../components/effects/BlurText'

const PROJECT_TYPES = [
  { value: 'WEB_APP', label: 'Web Application' },
  { value: 'SAAS', label: 'SaaS Platform' },
  { value: 'E_COMMERCE', label: 'E-Commerce' },
  { value: 'DASHBOARD', label: 'Admin Dashboard' },
  { value: 'MOBILE', label: 'Mobile App' },
  { value: 'OTHER', label: 'Other' }
]

const BUDGETS = [
  { value: 'UNDER_1000', label: '< $1,000' },
  { value: '1000_5000', label: '$1k - $5k' },
  { value: '5000_10000', label: '$5k - $10k' },
  { value: '10000_PLUS', label: '$10k+' },
  { value: 'NOT_SPECIFIED', label: 'Not Sure Yet' }
]

const SOURCES = [
  { value: 'PORTFOLIO', label: 'Search / Portfolio' },
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'TWITTER', label: 'Twitter/X' },
  { value: 'REFERRAL', label: 'Referral' },
  { value: 'OTHER', label: 'Other' }
]

const StartProject = () => {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    source: '',
    notes: ''
  })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => s - 1)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus(null)
    
    try {
      await submitLead(formData)
      localStorage.setItem('visitor_real_name', formData.name)
      
      // Track analytics
      recordEvent({
          type: 'FORM_SUBMISSION',
          page: '/StartProject',
          module: 'OTHER',
          visitorId: localStorage.getItem('visitor_id') || undefined,
          visitorLabel: localStorage.getItem('visitor_label') || undefined,
          realName: formData.name
      }).catch(console.error);

      setStatus('success')
    } catch (error) {
      console.error(error);
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'success') {
    return (
      <main className='min-h-[80vh] flex items-center justify-center pt-8 pb-16 md:pt-14'>
        <SEO title='Request Received' description='Your project request has been successfully submitted.' />
        <div className='glass-card max-w-lg w-full rounded-3xl p-10 text-center enter-fade'>
          <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent)]/10 text-[var(--accent)]'>
            <CheckCircle2 className='h-10 w-10' />
          </div>
          <h1 className='font-nevera text-3xl tracking-wide text-[var(--ink)] mb-4'>Request Received!</h1>
          <p className='text-[var(--ink-soft)] leading-relaxed mb-8'>
            Thank you for reaching out, {formData.name.split(' ')[0]}. I've received your project details and will review them shortly. Expect to hear back from me within 24-48 hours to discuss the next steps!
          </p>
          <button onClick={() => window.location.href = '/'} className='rounded-full bg-[var(--surface)] border border-[var(--line)] px-6 py-3 text-sm font-semibold text-[var(--ink)] hover:border-[var(--accent)] transition'>
            Return Home
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className='pt-8 pb-16 md:pt-14'>
      <SEO title='Start a Project' description='Tell me about your project and lets build something amazing together.' />

      <section className='section-wrap enter-fade max-w-3xl mx-auto'>
        <div className='mb-10 text-center'>
          <div className='inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)] mb-4'>
            <Rocket className='h-3.5 w-3.5 text-[var(--accent)]' />
            Let's Build
          </div>
          <h1 className='display-title text-4xl text-[var(--ink)] sm:text-5xl'>
            <SplitText text='Start a Project' delay={0.2} />
          </h1>
          <div className='mt-3 mx-auto max-w-xl text-[var(--ink-soft)]'>
            <BlurText text='Tell me about what you want to build, and I will help you bring it to life.' delay={0.6} />
          </div>
        </div>

        <div className='glass-card rounded-[34px] p-6 md:p-10'>
          {/* Progress Bar */}
          <div className='mb-8'>
            <div className='flex justify-between text-xs font-semibold text-[var(--ink-soft)] mb-2'>
              <span className={step >= 1 ? 'text-[var(--accent)]' : ''}>1. Basics</span>
              <span className={step >= 2 ? 'text-[var(--accent)]' : ''}>2. Scope</span>
              <span className={step >= 3 ? 'text-[var(--accent)]' : ''}>3. Details</span>
            </div>
            <div className='h-2 w-full rounded-full bg-[var(--bg-alt)] overflow-hidden'>
              <div 
                className='h-full bg-[var(--accent)] transition-all duration-500 ease-out' 
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
            {step === 1 && (
              <div className='space-y-5 enter-fade'>
                <h2 className='text-2xl font-semibold text-[var(--ink)] mb-6'>Let's start with the basics.</h2>
                <div className='grid gap-5 md:grid-cols-2'>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-[var(--ink-soft)]'>Full Name *</label>
                    <input required type='text' name='name' value={formData.name} onChange={handleChange} className='w-full rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3.5 text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none transition' placeholder='Jane Doe' />
                  </div>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-[var(--ink-soft)]'>Email Address *</label>
                    <input required type='email' name='email' value={formData.email} onChange={handleChange} className='w-full rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3.5 text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none transition' placeholder='jane@example.com' />
                  </div>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-[var(--ink-soft)]'>Company (Optional)</label>
                    <input type='text' name='company' value={formData.company} onChange={handleChange} className='w-full rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3.5 text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none transition' placeholder='Acme Inc.' />
                  </div>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-[var(--ink-soft)]'>Phone (Optional)</label>
                    <input type='tel' name='phone' value={formData.phone} onChange={handleChange} className='w-full rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3.5 text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none transition' placeholder='+1 (555) 000-0000' />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className='space-y-6 enter-fade'>
                <h2 className='text-2xl font-semibold text-[var(--ink)] mb-6'>What are we building?</h2>
                
                <div>
                  <label className='mb-3 block text-sm font-medium text-[var(--ink-soft)]'>Project Type *</label>
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                    {PROJECT_TYPES.map(pt => (
                      <button 
                        key={pt.value} 
                        type="button"
                        onClick={() => handleSelect('projectType', pt.value)}
                        className={`rounded-2xl border p-4 text-left transition ${formData.projectType === pt.value ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--accent-2)]'}`}
                      >
                        <span className='block text-sm font-semibold'>{pt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className='mb-3 block text-sm font-medium text-[var(--ink-soft)]'>Estimated Budget *</label>
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                    {BUDGETS.map(b => (
                      <button 
                        key={b.value} 
                        type="button"
                        onClick={() => handleSelect('budget', b.value)}
                        className={`rounded-2xl border p-4 text-center transition ${formData.budget === b.value ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--accent-2)]'}`}
                      >
                        <span className='block text-sm font-semibold'>{b.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className='space-y-6 enter-fade'>
                <h2 className='text-2xl font-semibold text-[var(--ink)] mb-6'>The final details.</h2>
                
                <div>
                  <label className='mb-2 block text-sm font-medium text-[var(--ink-soft)]'>Project Details *</label>
                  <textarea 
                    required 
                    rows={5} 
                    name='notes' 
                    value={formData.notes} 
                    onChange={handleChange} 
                    className='w-full resize-none rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3.5 text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none transition' 
                    placeholder='Describe your project, timeline, and any specific requirements or links...' 
                  />
                </div>

                <div>
                  <label className='mb-3 block text-sm font-medium text-[var(--ink-soft)]'>How did you find me? (Optional)</label>
                  <div className='flex flex-wrap gap-3'>
                    {SOURCES.map(s => (
                      <button 
                        key={s.value} 
                        type="button"
                        onClick={() => handleSelect('source', s.value)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${formData.source === s.value ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]' : 'border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:bg-[var(--surface)]'}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {status === 'error' && (
                  <p className='text-red-500 text-sm mt-4'>There was an error submitting your request. Please ensure all required fields are filled out.</p>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className='mt-10 flex items-center justify-between border-t border-[var(--line)] pt-6'>
              {step > 1 ? (
                <button type='button' onClick={prevStep} className='rounded-full border border-[var(--line)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--bg-alt)] transition'>
                  Back
                </button>
              ) : <div></div>}

              <button 
                type='submit' 
                disabled={isSubmitting || (step === 2 && (!formData.projectType || !formData.budget))}
                className='inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50'
              >
                {step === 3 ? (isSubmitting ? 'Submitting...' : 'Send Request') : 'Continue'}
                {step < 3 && <ArrowRight className='h-4 w-4' />}
              </button>
            </div>

          </form>
        </div>
      </section>
    </main>
  )
}

export default StartProject
