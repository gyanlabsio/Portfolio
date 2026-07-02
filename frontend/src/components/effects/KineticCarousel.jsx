import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const KineticCarousel = ({ projects = [] }) => {
  const [cards, setCards] = useState(projects);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (projects.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCards((prevCards) => {
        const newCards = [...prevCards];
        const firstCard = newCards.shift();
        newCards.push(firstCard);
        return newCards;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [projects.length, isPaused]);

  if (!projects || projects.length === 0) {
    return <p className='text-[var(--ink-soft)] font-light'>New case studies are in progress. Check back shortly.</p>;
  }

  const handleNext = () => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      const firstCard = newCards.shift();
      newCards.push(firstCard);
      return newCards;
    });
  };

  const CARD_OFFSET = 16; // Distance between stacked cards
  const SCALE_FACTOR = 0.05; // Scale decrease per card

  return (
    <div 
      className='relative w-full h-[360px] md:h-[420px]'
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence>
        {cards.map((project, index) => {
          const isFront = index === 0;
          
          return (
            <motion.div
              key={project._id}
              layout
              initial={false}
              animate={{
                top: index * CARD_OFFSET,
                scale: 1 - index * SCALE_FACTOR,
                zIndex: cards.length - index,
                opacity: 1 - index * 0.2,
                y: 0,
              }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className={`absolute top-0 left-0 w-full h-full rounded-none border border-[var(--line)] bg-[var(--surface)] overflow-hidden cursor-pointer shadow-lg`}
              onClick={handleNext}
              drag={isFront ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, { offset }) => {
                const swipe = offset.x;
                if (swipe < -50 || swipe > 50) {
                  handleNext();
                }
              }}
            >
              <div className='w-full h-full flex flex-col group'>
                {/* Image Section */}
                <div className='w-full h-[55%] border-b border-[var(--line)] bg-[var(--surface-light)] relative overflow-hidden'>
                  {project.coverImage ? (
                    <img 
                      src={project.coverImage} 
                      alt={project.title} 
                      className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                    />
                  ) : (
                    // Sleek fallback if no image
                    <div className='w-full h-full flex items-center justify-center opacity-30'>
                      <div className='w-[150%] h-[150%] bg-gradient-to-tr from-[var(--ink)] to-transparent opacity-10 blur-xl absolute'></div>
                      <span className='text-4xl font-black uppercase tracking-widest text-[var(--ink-soft)]'>
                        {project.title.substring(0, 2)}
                      </span>
                    </div>
                  )}
                  {/* Overlay badge */}
                  {project.category && (
                    <div className='absolute top-4 left-4 px-3 py-1 bg-[var(--surface)] border border-[var(--line)] text-[9px] uppercase tracking-widest font-bold text-[var(--ink)]'>
                      {project.category.replace('_', ' ')}
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className='p-6 flex flex-col justify-between flex-grow'>
                  <div>
                    <h3 className='text-xl font-bold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors'>{project.title}</h3>
                    <p className='mt-3 text-sm font-light leading-relaxed text-[var(--ink-soft)] line-clamp-2'>
                      {project.description}
                    </p>
                  </div>
                  {isFront && (
                    <div className='mt-4 flex items-center gap-2'>
                      <Link 
                        to={`/Projects`} 
                        className='text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] hover:text-[var(--ink)] transition-colors inline-flex items-center gap-2'
                        onClick={(e) => e.stopPropagation()} // Prevent card cycling when clicking the link
                      >
                        View Project
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default KineticCarousel;
