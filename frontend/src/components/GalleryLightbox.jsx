// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const GalleryLightbox = ({ design, isOpen, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [prevDesignId, setPrevDesignId] = useState(null);

    // Reset index when design changes
    if (design && design._id !== prevDesignId) {
        setPrevDesignId(design._id);
        setCurrentImageIndex(0);
    }

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !design) return null;

    const images = [
        { url: design.thumbnail, caption: design.title },
        ...(design.galleryImages || [])
    ];

    const handlePrev = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-[#000000]/90 p-4 backdrop-blur-xl md:p-8"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 z-[999] flex h-10 w-10 items-center justify-center rounded-none bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative flex h-full max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-none bg-[#161b22] border border-white/10  md:flex-row"
                    >
                        {/* Image Viewer */}
                        <div className="relative flex flex-1 items-center justify-center bg-black/50 overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentImageIndex}
                                    src={images[currentImageIndex]?.url}
                                    alt={images[currentImageIndex]?.caption || design.title}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                    className="h-full w-full object-cover"
                                />
                            </AnimatePresence>

                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        className="absolute left-4 top-1/2 flex -translate-y-1/2 h-10 w-10 items-center justify-center rounded-none bg-black/50 text-white backdrop-blur-md transition hover:bg-black/80"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="absolute right-4 top-1/2 flex -translate-y-1/2 h-10 w-10 items-center justify-center rounded-none bg-black/50 text-white backdrop-blur-md transition hover:bg-black/80"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-none bg-black/50 px-3 py-1 text-xs text-white/70 backdrop-blur-md">
                                        {currentImageIndex + 1} / {images.length}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Sidebar Info */}
                        <div className="w-full shrink-0 overflow-y-auto border-t border-white/10 bg-[#161b22] p-6 md:w-[350px] md:border-l md:border-t-0 lg:w-[400px]">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-none border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#22d3ee]">
                                {design.category}
                            </div>
                            <h2 className="mb-2 font-nevera text-2xl tracking-wide text-white md:text-3xl">
                                {design.title}
                            </h2>
                            {design.subtitle && (
                                <p className="mb-6 text-sm text-white/70">
                                    {design.subtitle}
                                </p>
                            )}
                            
                            {design.description && (
                                <div className="mb-8 text-sm leading-relaxed text-white/80">
                                    {design.description}
                                </div>
                            )}

                            <div className="space-y-4 rounded-none bg-black/30 p-5">
                                {design.client && (
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-white/50">Client</p>
                                        <p className="text-sm text-white/90">{design.client}</p>
                                    </div>
                                )}
                                {design.role && (
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-white/50">Role</p>
                                        <p className="text-sm text-white/90">{design.role}</p>
                                    </div>
                                )}
                                {design.tools && design.tools.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-white/50">Tools</p>
                                        <div className="mt-1 flex flex-wrap gap-2">
                                            {design.tools.map((tool) => (
                                                <span key={tool} className="rounded-none border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80">
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {design.year && (
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-white/50">Year</p>
                                        <p className="text-sm text-white/90">{design.year}</p>
                                    </div>
                                )}
                            </div>

                            {design.linkType === 'external' && design.externalUrl && (
                                <a
                                    href={design.externalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-none bg-[var(--accent)] py-3 text-sm font-semibold text-white transition hover:brightness-110"
                                >
                                    View Live <ExternalLink className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GalleryLightbox;
