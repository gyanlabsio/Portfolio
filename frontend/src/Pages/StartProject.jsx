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
        <div className='max-w-lg w-full p-10 text-center enter-fade border border-[var(--line)] bg-[var(--bg)]'>
          <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center border-2 border-[var(--ink)] text-[var(--ink)]'>
            <CheckCircle2 className='h-8 w-8' />
          </div>
          <h1 className='text-4xl font-black uppercase tracking-tighter text-[var(--ink)] mb-4'>Request Received!</h1>
          <p className='text-sm font-light uppercase tracking-widest text-[var(--ink-soft)] leading-relaxed mb-8'>
            Thank you for reaching out, {formData.name.split(' ')[0]}. I've received your project details and will review them shortly. Expect to hear back from me within 24-48 hours to discuss the next steps!
          </p>
          <button onClick={() => window.location.href = '/'} className='border border-[var(--ink)] bg-[var(--ink)] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-[var(--ink)]'>
            Return Home
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className='pt-8 pb-16 md:pt-14'>
      <SEO title='Start a Project' description='Tell me about your project and lets build something amazing together.' />

      <section className='enter-fade max-w-4xl mx-auto px-6 md:px-10 lg:px-16'>
        <div className='mb-16 text-center border-b border-[var(--line)] pb-12'>
          <div className='inline-flex items-center gap-2 border border-[var(--ink)] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--ink)] mb-6'>
            <Rocket className='h-3.5 w-3.5' />
            Let's Build
          </div>
          <h1 className='text-6xl font-black uppercase tracking-tighter text-[var(--ink)] sm:text-7xl lg:text-8xl'>
            <SplitText text='Start a Project' delay={0.2} />
          </h1>
          <div className='mt-6 mx-auto max-w-xl text-sm font-bold uppercase tracking-widest text-[var(--ink-soft)]'>
            <BlurText text='Tell me about what you want to build, and I will help you bring it to life.' delay={0.6} />
          </div>
        </div>

        <div className='p-6 md:p-10 border border-[var(--line)] bg-[var(--bg)]'>
          {/* Progress Bar */}
          <div className='mb-12'>
            <div className='flex justify-between text-xs font-bold uppercase tracking-widest text-[var(--ink-soft)] mb-4'>
              <span className={step >= 1 ? 'text-[var(--ink)]' : ''}>1. Basics</span>
              <span className={step >= 2 ? 'text-[var(--ink)]' : ''}>2. Scope</span>
              <span className={step >= 3 ? 'text-[var(--ink)]' : ''}>3. Details</span>
            </div>
            <div className='h-1 w-full bg-[var(--line)] overflow-hidden'>
              <div 
                className='h-full bg-[var(--ink)] transition-all duration-500 ease-out' 
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
            {step === 1 && (
              <div className='space-y-8 enter-fade'>
                <h2 className='text-4xl font-black uppercase tracking-tighter text-[var(--ink)] mb-8'>Let's start with the basics.</h2>
                <div className='grid gap-6 md:grid-cols-2'>
                  <div>
                    <label className='mb-3 block text-xs font-bold uppercase tracking-widest text-[var(--ink)]'>Full Name *</label>
                    <input required type='text' name='name' value={formData.name} onChange={handleChange} className='w-full border border-[var(--line)] bg-[var(--bg)] px-4 py-4 text-sm font-bold uppercase tracking-widest text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--ink)] focus:outline-none transition-colors' placeholder='Jane Doe' />
                  </div>
                  <div>
                    <label className='mb-3 block text-xs font-bold uppercase tracking-widest text-[var(--ink)]'>Email Address *</label>
                    <input required type='email' name='email' value={formData.email} onChange={handleChange} className='w-full border border-[var(--line)] bg-[var(--bg)] px-4 py-4 text-sm font-bold uppercase tracking-widest text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--ink)] focus:outline-none transition-colors' placeholder='jane@example.com' />
                  </div>
                  <div>
                    <label className='mb-3 block text-xs font-bold uppercase tracking-widest text-[var(--ink)]'>Company (Optional)</label>
                    <input type='text' name='company' value={formData.company} onChange={handleChange} className='w-full border border-[var(--line)] bg-[var(--bg)] px-4 py-4 text-sm font-bold uppercase tracking-widest text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--ink)] focus:outline-none transition-colors' placeholder='Acme Inc.' />
                  </div>
                  <div>
                    <label className='mb-3 block text-xs font-bold uppercase tracking-widest text-[var(--ink)]'>Phone (Optional)</label>
                    <input type='tel' name='phone' value={formData.phone} onChange={handleChange} className='w-full border border-[var(--line)] bg-[var(--bg)] px-4 py-4 text-sm font-bold uppercase tracking-widest text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--ink)] focus:outline-none transition-colors' placeholder='+1 (555) 000-0000' />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className='space-y-8 enter-fade'>
                <h2 className='text-4xl font-black uppercase tracking-tighter text-[var(--ink)] mb-8'>What are we building?</h2>
                
                <div>
                  <label className='mb-3 block text-xs font-bold uppercase tracking-widest text-[var(--ink)]'>Project Type *</label>
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                    {PROJECT_TYPES.map(pt => (
                      <button 
                        key={pt.value} 
                        type="button"
                        onClick={() => handleSelect('projectType', pt.value)}
                        className={`border px-4 py-4 text-center transition-colors ${formData.projectType === pt.value ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--ink)]'}`}
                      >
                        <span className='block text-xs font-bold uppercase tracking-widest'>{pt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className='mb-3 block text-xs font-bold uppercase tracking-widest text-[var(--ink)]'>Estimated Budget *</label>
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                    {BUDGETS.map(b => (
                      <button 
                        key={b.value} 
                        type="button"
                        onClick={() => handleSelect('budget', b.value)}
                        className={`border px-4 py-4 text-center transition-colors ${formData.budget === b.value ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--ink)]'}`}
                      >
                        <span className='block text-xs font-bold uppercase tracking-widest'>{b.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className='space-y-8 enter-fade'>
                <h2 className='text-4xl font-black uppercase tracking-tighter text-[var(--ink)] mb-8'>The final details.</h2>
                
                <div>
                  <label className='mb-3 block text-xs font-bold uppercase tracking-widest text-[var(--ink)]'>Project Details *</label>
                  <textarea 
                    required 
                    rows={5} 
                    name='notes' 
                    value={formData.notes} 
                    onChange={handleChange} 
                    className='w-full resize-none border border-[var(--line)] bg-[var(--bg)] px-4 py-4 text-sm font-bold uppercase tracking-widest text-[var(--ink)] placeholder:text-[var(--ink-soft)] focus:border-[var(--ink)] focus:outline-none transition-colors' 
                    placeholder='Describe your project, timeline, and any specific requirements or links...' 
                  />
                </div>

                <div>
                  <label className='mb-3 block text-xs font-bold uppercase tracking-widest text-[var(--ink)]'>How did you find me? (Optional)</label>
                  <div className='flex flex-wrap gap-3'>
                    {SOURCES.map(s => (
                      <button 
                        key={s.value} 
                        type="button"
                        onClick={() => handleSelect('source', s.value)}
                        className={`border px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${formData.source === s.value ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] hover:border-[var(--ink)]'}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {status === 'error' && (
                  <p className='text-red-600 text-xs font-bold uppercase tracking-widest mt-4'>There was an error submitting your request. Please ensure all required fields are filled out.</p>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className='mt-12 flex items-center justify-between border-t border-[var(--line)] pt-8'>
              {step > 1 ? (
                <button type='button' onClick={prevStep} className='border border-[var(--line)] bg-[var(--bg)] px-8 py-4 text-xs font-bold uppercase tracking-widest text-[var(--ink)] hover:border-[var(--ink)] transition-colors'>
                  Back
                </button>
              ) : <div></div>}

              <button 
                type='submit' 
                disabled={isSubmitting || (step === 2 && (!formData.projectType || !formData.budget))}
                className='inline-flex items-center gap-2 border border-[var(--ink)] bg-[var(--ink)] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white hover:text-[var(--ink)] disabled:opacity-50'
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
