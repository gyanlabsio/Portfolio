import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from 'lucide-react';

const TestimonialInfiniteCard = ({ testimonials = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const DURATION = 6000; // 6 seconds per slide

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, DURATION);
    return () => clearInterval(interval);
  }, [testimonials.length, currentIndex]); 

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  return (
    <div className='w-full pt-20 pb-28 flex flex-col items-center overflow-hidden'>
      
      {/* Header Area */}
      <div className='flex flex-col items-center mb-16 text-center'>
        <span className='px-4 py-1 text-xs font-bold uppercase tracking-widest text-[var(--accent)] border border-[var(--accent)] rounded-lg mb-4 inline-block bg-[var(--accent)]/10'>
          TESTIMONIALS
        </span>
        <h2 className='text-4xl md:text-5xl lg:text-6xl font-black text-[var(--ink)] tracking-tight'>
          Our trusted clients
        </h2>
      </div>

      {/* Single Card Container */}
      <div className='relative w-full max-w-5xl flex items-center justify-center px-4'>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className='bg-[var(--surface-light)] rounded-[2rem] border border-[var(--line)] w-full shadow-2xl relative overflow-hidden group flex flex-col md:flex-row min-h-[400px]'
          >
            {/* Left side: Feature Image */}
            <div className='md:w-2/5 relative h-64 md:h-auto border-b md:border-b-0 md:border-r border-[var(--line)] bg-[var(--surface)] flex items-center justify-center overflow-hidden'>
              {current.image ? (
                <img src={current.image} alt={current.clientName} className='w-full h-full object-cover absolute inset-0' />
              ) : (
                <div className='flex flex-col items-center justify-center text-[var(--ink-soft)] opacity-30'>
                  <span className='font-nevera text-8xl'>{current.clientName?.charAt(0) || 'C'}</span>
                </div>
              )}
            </div>

            {/* Right side: Content */}
            <div className='md:w-3/5 p-8 md:p-14 flex flex-col justify-center relative'>
              {/* Subtle Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[var(--line)] opacity-10 pointer-events-none"></div>

              <Quote className='w-12 h-12 text-[var(--accent)] opacity-40 mb-8' strokeWidth={1.5} />
              
              <p className='text-[18px] md:text-[22px] text-[var(--ink)] font-medium leading-[1.8] relative z-10 flex-grow italic'>
                "{current.testimonial}"
              </p>
              
              <div className='h-px bg-[var(--line)] my-8 relative z-10 w-full'></div>
              
              <div className='flex flex-col relative z-10'>
                <span className='text-xl font-black tracking-tight text-[var(--ink)]'>{current.clientName}</span>
                <span className='text-sm font-bold uppercase tracking-widest text-[var(--ink-soft)] mt-1'>{current.clientRole}{current.company ? ` @ ${current.company}` : ''}</span>
              </div>
            </div>

            {/* Animated Progress Bar inside the card bottom */}
            {testimonials.length > 1 && (
              <div className="absolute bottom-0 left-0 h-1.5 bg-[var(--line)] w-full">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 6, ease: "linear" }}
                    className="h-full bg-[var(--accent)]"
                 />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
};

export default TestimonialInfiniteCard;
