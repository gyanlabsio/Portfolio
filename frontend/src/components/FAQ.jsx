import React, { useState } from 'react'
 
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "What is your typical project timeline?",
      answer: "A standard web application or full-scale portfolio typically takes 4 to 8 weeks from initial discovery to launch. Complex platforms with custom backends may take longer. We establish clear milestones before development begins so you always know what to expect."
    },
    {
      question: "Do you provide ongoing support after launch?",
      answer: "Yes. I offer flexible maintenance and retainer packages after the project is deployed to ensure your application stays updated, secure, and performs optimally as your business scales."
    },
    {
      question: "What technologies do you specialize in?",
      answer: "I specialize in modern JavaScript/TypeScript ecosystems, primarily React, Next.js, Node.js, and Express, alongside scalable databases like MongoDB and PostgreSQL. I always choose the right tool for the job to ensure high performance and maintainability."
    },
    {
      question: "How do you handle project pricing?",
      answer: "Pricing is value-based and determined by the scope and complexity of your project. After our initial consultation, I provide a detailed proposal outlining the exact costs. Most projects are billed at a flat rate so there are no surprises."
    },
    {
      question: "Can you redesign or scale an existing application?",
      answer: "Absolutely. Whether you need a fresh UX overhaul for an aging product, or need to refactor a legacy codebase for better performance and scalability, I can audit your current setup and execute a phased improvement plan."
    }
  ]

  return (
    <div className='flex flex-col'>
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index
        
        return (
          <div key={index} className={`border-b border-[var(--line)] last:border-0 ${index === 0 ? 'pt-0' : 'pt-6'} pb-6`}>
            <button 
              onClick={() => setOpenIndex(isOpen ? null : index)} 
              className='w-full flex items-center justify-between text-left focus:outline-none group'
            >
              <h3 className='text-sm font-bold tracking-widest uppercase text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors pr-8'>
                {faq.question}
              </h3>
              <div className='flex-shrink-0 text-[var(--ink-soft)] group-hover:text-[var(--accent)] transition-colors'>
                {isOpen ? <Minus size={18} /> : <Plus size={18} />}
              </div>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className='overflow-hidden'
                >
                  <p className='pt-6 text-base font-light text-[var(--ink-soft)] leading-relaxed'>
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

export default FAQ
