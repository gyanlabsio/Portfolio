import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';

const TestimonialCarousel = ({ testimonials = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  
  // Spring config for smooth cursor tracking
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const cursorX = useSpring(-100, springConfig);
  const cursorY = useSpring(-100, springConfig);

  const DURATION = 5000; // 5 seconds per slide

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, DURATION);
    return () => clearInterval(interval);
  }, [testimonials.length, currentIndex]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Calculate position relative to the container
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
  };

  if (!testimonials || testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  return (
    <div className='w-full text-[var(--ink)] overflow-hidden pt-8 pb-16'>
      <div className='w-full flex items-center justify-between mb-16'>
        <h2 className='text-sm font-bold uppercase tracking-widest text-[var(--ink)]'>What They Say</h2>
        
        {/* Minimalist Nav with Progress */}
        <div className='flex items-center gap-6'>
           <span className='text-xs font-bold text-[var(--ink-soft)] w-12 text-right'>
             0{currentIndex + 1} / 0{testimonials.length}
           </span>
           <div className='flex items-center gap-3'>
              {testimonials.map((_, idx) => (
                <div key={idx} className="relative flex items-center h-4 cursor-pointer" onClick={() => setCurrentIndex(idx)}>
                  {/* Background Track */}
                  <div className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-16 bg-[var(--line)]' : 'w-4 bg-[var(--line)] hover:bg-[var(--ink-soft)]'}`} />
                  
                  {/* Active Fill */}
                  {idx === currentIndex && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-[var(--ink)] rounded-full pointer-events-none"
                    />
                  )}
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Main Hover Container */}
      <div 
        ref={containerRef}
        className='relative w-full min-h-[500px] flex flex-col justify-center items-center py-20 cursor-crosshair group'
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            className='w-full max-w-5xl mx-auto text-center z-10 relative'
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40, transition: { duration: 0.3 } }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
             <h3 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[1.2] text-[var(--ink)]'>
               "{current.testimonial}"
             </h3>
             
             <div className='mt-12 flex flex-col items-center'>
                {/* Mobile-only inline avatar */}
                <div className='md:hidden w-24 h-24 mb-6 border-2 border-[var(--line)] p-1 bg-[var(--surface-light)]'>
                   {current.avatar ? (
                     <img src={current.avatar} alt={current.clientName} className='w-full h-full object-cover grayscale contrast-125' />
                   ) : (
                     <div className='w-full h-full flex items-center justify-center bg-[var(--line)]'>
                       <span className='text-4xl font-black text-[var(--ink-soft)]'>{current.clientName?.charAt(0) || 'C'}</span>
                     </div>
                   )}
                </div>
                
                <p className='text-lg font-bold uppercase tracking-widest text-[var(--ink)]'>
                  — {current.clientName}
                </p>
                <p className='text-sm mt-2 font-bold tracking-widest text-[var(--ink-soft)] uppercase'>
                  {current.clientRole}{current.clientRole && current.company ? ' | ' : ''}{current.company}
                </p>
             </div>
          </motion.div>
        </AnimatePresence>

        {/* Floating Avatar (Desktop only) */}
        <motion.div
          className='hidden md:block absolute pointer-events-none z-50 w-72 h-72 bg-[var(--surface-light)] p-2 shadow-2xl'
          style={{
            x: cursorX,
            y: cursorY,
            translateX: "-50%",
            translateY: "-50%"
          }}
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            scale: isHovered ? 1 : 0.8,
            rotate: isHovered ? (cursorX.get() > 500 ? 5 : -5) : -5
          }}
          transition={{
             opacity: { duration: 0.2 },
             scale: { duration: 0.4, ease: "easeOut" }
          }}
        >
          {current.avatar ? (
            <AnimatePresence mode="wait">
              <motion.img 
                key={current.avatar}
                src={current.avatar} 
                alt={current.clientName} 
                className='w-full h-full object-cover grayscale contrast-125 border border-[var(--line)]'
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            </AnimatePresence>
          ) : (
            <AnimatePresence mode="wait">
               <motion.div 
                 key={current.clientName}
                 className='w-full h-full border border-[var(--line)] bg-[var(--surface)] flex items-center justify-center'
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
               >
                 <span className='text-9xl font-black text-[var(--ink-soft)]'>{current.clientName?.charAt(0) || 'C'}</span>
               </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
