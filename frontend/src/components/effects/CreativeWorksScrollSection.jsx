import React, { useRef, useState } from 'react';
// eslint-disable-next-line no-unused-vars
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

    const [selectedDesign, setSelectedDesign] = useState(null);

    // Limit to 6 designs for the asymmetric grid (1 anchor + 5 supporting) to perfectly fill a 3x3 area
    const displayDesigns = featuredDesigns.slice(0, 6);

    if (!featuredDesigns || featuredDesigns.length === 0) return null;

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-[var(--surface)] mb-16" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex w-[200vw]">
                    
                    {/* SLIDE 1: CREATIVE WORKS CAROUSEL */}
                    <div className="w-screen flex-shrink-0 flex items-center justify-center px-6">
                        <div className="w-full mx-auto flex flex-col items-center">
                            
                            <div className='w-full mb-8 flex items-center justify-between max-w-[1400px] pt-16 border-t border-[var(--line)]'>
                                <h2 className='text-sm font-bold uppercase tracking-widest text-[var(--ink)]'>Creative Works</h2>
                                <Link to='/gallery' className='text-xs font-bold uppercase tracking-widest text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors'>
                                    View Gallery
                                </Link>
                            </div>
                            
                            <div className='w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-3 grid-rows-[repeat(6,1fr)] md:grid-rows-3 gap-2 md:gap-4 h-[70vh] min-h-[500px]'>
                                {displayDesigns.map((design, index) => {
                                    const isAnchor = index === 0;
                                    return (
                                        <div 
                                            key={design._id}
                                            onClick={() => setSelectedDesign(design)}
                                            className={`relative group cursor-pointer overflow-hidden bg-[var(--surface)] ${isAnchor ? 'md:col-span-2 md:row-span-2 row-span-2' : 'col-span-1 row-span-1'}`}
                                        >
                                            <img 
                                                src={design.thumbnail} 
                                                alt={design.title} 
                                                className='absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105' 
                                            />
                                            
                                            {/* Top Right Year Badge */}
                                            <div className='absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 tracking-widest uppercase'>
                                                {design.year || '2024'}
                                            </div>

                                            <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6'>
                                                <p className='mb-2 text-xs font-bold uppercase tracking-wider text-white/70 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500'>
                                                    {String(index + 1).padStart(2, '0')} — {design.category}
                                                </p>
                                                <h3 className='text-3xl font-bold text-white mb-2 tracking-tight transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75'>
                                                    {design.title}
                                                </h3>
                                                {design.description && (
                                                    <p className='text-sm text-white/60 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100 line-clamp-1'>
                                                        {design.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
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
