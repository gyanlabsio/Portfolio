import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const CinematicScroll = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.75, 1, 1.15]);
    const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);

    return (
        <section ref={targetRef} className="py-32 overflow-hidden flex flex-col items-center justify-center min-h-[80vh] border-t border-[var(--line)]">
            <motion.div 
                style={{ scale, opacity, y }}
                className="flex flex-col items-center text-center gap-12 px-6"
            >
                <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-[var(--ink)] leading-[0.95]">
                    <span className="block text-xl sm:text-3xl md:text-4xl tracking-widest text-[var(--ink-soft)] font-bold mb-6">NEXT</span>
                    YOUR DESIGN<br/>
                    <span className="text-[var(--accent)]">CAN BE HERE</span>
                </h2>
                <Link to="/Contact" className="bg-[var(--accent)] text-[var(--surface)] px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-[var(--ink)] transition-colors inline-block mt-4">
                    Start a Project
                </Link>
            </motion.div>
        </section>
    );
};

export default CinematicScroll;
