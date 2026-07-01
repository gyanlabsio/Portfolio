import React from 'react';
import { motion } from 'framer-motion';

const QuoteIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/24/svg" className="text-[var(--accent)] opacity-40 mb-6">
    <path d="M10 8C10 9.1 9.1 10 8 10C6.9 10 6 9.1 6 8C6 6.9 6.9 6 8 6C9.1 6 10 6.9 10 8ZM18 8C18 9.1 17.1 10 16 10C14.9 10 14 9.1 14 8C14 6.9 14.9 6 16 6C17.1 6 18 6.9 18 8ZM10 13.9C10 15.6 8.7 17 7 17H6V15H7C7.6 15 8 14.6 8 14V12H6V6H10V13.9ZM18 13.9C18 15.6 16.7 17 15 17H14V15H15C15.6 15 16 14.6 16 14V12H14V6H18V13.9Z" fill="currentColor"/>
  </svg>
);

const TestimonialGrid = ({ testimonials = [] }) => {
  if (!testimonials || testimonials.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className='w-full pt-20 pb-28 flex flex-col items-center'>
      
      {/* Header Area */}
      <div className='flex flex-col items-center mb-16 text-center'>
        <span className='px-4 py-1 text-xs font-bold uppercase tracking-widest text-[var(--accent)] border border-[var(--accent)] rounded-lg mb-4 inline-block bg-[var(--accent)]/10'>
          TESTIMONIALS
        </span>
        <h2 className='text-4xl md:text-5xl lg:text-6xl font-black text-[var(--ink)] tracking-tight'>
          Our trusted clients
        </h2>
      </div>

      {/* Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1400px]'
      >
        {testimonials.map((t, idx) => (
          <motion.div
            key={t._id || idx}
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.01, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
            className='bg-[var(--surface-light)] p-8 md:p-10 rounded-[2rem] border border-[var(--line)] flex flex-col h-full transition-all duration-300 shadow-sm relative overflow-hidden group'
          >
            {/* Subtle Gradient background matching reference image vibe */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[var(--line)] opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-[2rem] pointer-events-none"></div>

            <QuoteIcon />
            
            <p className='text-[17px] text-[var(--ink-soft)] font-medium leading-[1.8] flex-grow relative z-10'>
              {t.testimonial}
            </p>
            
            <div className='w-full h-px bg-[var(--line)] my-8 relative z-10'></div>
            
            <div className='flex items-center gap-4 relative z-10'>
              {t.avatar ? (
                <img src={t.avatar} alt={t.clientName} className='w-14 h-14 rounded-full object-cover border-2 border-[var(--surface)] shadow-sm' />
              ) : (
                <div className='w-14 h-14 rounded-full bg-[var(--surface)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)] font-black text-lg shadow-sm'>
                  {t.clientName?.charAt(0) || 'C'}
                </div>
              )}
              
              <div className='flex flex-col'>
                <span className='text-base font-bold text-[var(--ink)]'>{t.clientName}</span>
                <span className='text-sm font-medium text-[var(--ink-soft)] mt-0.5'>{t.clientRole}{t.company ? ` @ ${t.company}` : ''}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
};

export default TestimonialGrid;
