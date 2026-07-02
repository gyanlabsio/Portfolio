import { Mail, MessageSquareText, PhoneCall } from 'lucide-react'
import SEO from '../components/SEO'
import SplitText from '../components/effects/SplitText'
import BlurText from '../components/effects/BlurText'
import ContactForm from '../components/ContactForm'

const Contact = () => {

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
            <ContactForm />
          </article>
        </div>
      </section>
    </main>
  )
}

export default Contact
