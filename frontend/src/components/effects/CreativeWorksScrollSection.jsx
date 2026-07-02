import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import GalleryLightbox from '../GalleryLightbox';

const CreativeWorksScrollSection = ({ featuredDesigns = [] }) => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

    const [activeDesignIndex, setActiveDesignIndex] = useState(0);
    const [isDesignsPaused, setIsDesignsPaused] = useState(false);
    const [selectedDesign, setSelectedDesign] = useState(null);

    useEffect(() => {
        if (featuredDesigns.length <= 1 || isDesignsPaused) return;
        
        const interval = setInterval(() => {
            setActiveDesignIndex((prev) => (prev + 1) % featuredDesigns.length);
        }, 3000); 
        
        return () => clearInterval(interval);
    }, [featuredDesigns.length, isDesignsPaused]);

    if (!featuredDesigns || featuredDesigns.length === 0) return null;

    return (
        <section ref={targetRef} className="relative h-[200vh] bg-[var(--surface)] mb-16" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex w-[200vw]">
                    
                    {/* SLIDE 1: CREATIVE WORKS CAROUSEL */}
                    <div className="w-screen flex-shrink-0 flex items-center justify-center px-6 border-t border-[var(--line)]">
                        <div className="w-full mx-auto flex flex-col items-center">
                            
                            <div className='w-full mb-12 flex items-center justify-between max-w-4xl pt-16'>
                                <h2 className='text-sm font-bold uppercase tracking-widest text-[var(--ink)]'>Creative Works</h2>
                                <Link to='/gallery' className='text-xs font-bold uppercase tracking-widest text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors'>
                                    View Gallery
                                </Link>
                            </div>
                            
                            <div 
                                className='relative h-[400px] md:h-[450px] flex items-center justify-center w-full max-w-6xl'
                                onMouseEnter={() => setIsDesignsPaused(true)}
                                onMouseLeave={() => setIsDesignsPaused(false)}
                            >
                                {featuredDesigns.map((design, index) => {
                                let offset = index - activeDesignIndex;
                                if (offset < -Math.floor(featuredDesigns.length / 2)) offset += featuredDesigns.length;
                                if (offset > Math.floor(featuredDesigns.length / 2)) offset -= featuredDesigns.length;
                                
                                const isCenter = offset === 0;
                                const zIndex = 100 - Math.abs(offset);
                                const scale = isCenter ? 1 : Math.max(0.75, 1 - Math.abs(offset) * 0.1);
                                const transX = offset * (window.innerWidth < 768 ? 80 : 200); 
                                const opacity = Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.2;

                                return (
                                    <motion.div 
                                    key={design._id} 
                                    onClick={() => {
                                        if (isCenter) {
                                            setSelectedDesign(design);
                                        } else {
                                            setActiveDesignIndex(index);
                                        }
                                    }}
                                    animate={{ x: transX, scale, zIndex, opacity }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                    className={`absolute cursor-pointer rounded-none overflow-hidden border border-[var(--line)] bg-[var(--surface)] transition-all duration-500 w-[280px] md:w-[400px] h-[350px] md:h-[420px] ${isCenter ? 'shadow-[0_20px_40px_rgba(0,0,0,0.25)] border-[var(--accent)]/50' : 'brightness-50'}`}
                                    style={{ pointerEvents: isCenter ? 'auto' : opacity > 0 ? 'auto' : 'none' }}
                                    >
                                    <img src={design.thumbnail} alt={design.title} className={`w-full h-full object-cover transition-transform duration-700 ${isCenter ? 'hover:scale-105' : ''}`} />
                                    <div className={`absolute inset-0 bg-gradient-to-t from-[#000000]/90 via-[#000000]/20 to-transparent transition-opacity duration-500 ${isCenter ? 'opacity-80' : 'opacity-40'}`} />
                                    
                                    <div className={`absolute bottom-0 left-0 right-0 p-6 transition-all duration-500 ${isCenter ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                        <p className='mb-2 text-xs font-bold uppercase tracking-wider text-white/50'>{design.category}</p>
                                        <h3 className='text-xl font-semibold text-white mb-2'>{design.title}</h3>
                                        <div className='inline-flex items-center gap-1 text-xs font-medium text-white/70'>
                                        View <ArrowUpRight className='h-3 w-3' />
                                        </div>
                                    </div>
                                    </motion.div>
                                )
                                })}
                            </div>

                        </div>
                    </div>

                    {/* SLIDE 2: CINEMATIC TYPOGRAPHY */}
                    <div className="w-screen flex-shrink-0 flex items-center justify-center px-6">
                        <div className="flex flex-col items-center text-center gap-12 max-w-5xl mx-auto">
                            <h2 className="flex flex-col items-center justify-center text-center uppercase text-[var(--ink)] leading-[0.9]">
                                <span className="block text-lg sm:text-2xl md:text-3xl tracking-[0.4em] text-[var(--ink-soft)] font-semibold mb-8" style={{ fontFamily: "'Manrope', sans-serif" }}>
                                    NEXT
                                </span>
                                <span className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-bold tracking-tight" style={{ fontFamily: "'Oswald', sans-serif", transform: 'scaleY(1.1)' }}>
                                    YOUR DESIGN
                                </span>
                                <span className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] mt-4 text-[var(--accent)] italic tracking-tighter" style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}>
                                    CAN BE HERE
                                </span>
                            </h2>
                            <Link to="/Contact" className="bg-[var(--accent)] text-[var(--surface)] px-12 py-5 text-sm font-bold uppercase tracking-widest hover:bg-[var(--ink)] transition-colors inline-block mt-4 shadow-xl">
                                Start a Project
                            </Link>
                        </div>
                    </div>

                </motion.div>
            </div>

            <GalleryLightbox 
                isOpen={!!selectedDesign}
                design={selectedDesign}
                onClose={() => setSelectedDesign(null)}
            />
        </section>
    );
};

export default CreativeWorksScrollSection;
