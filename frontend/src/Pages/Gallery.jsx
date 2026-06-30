import { useState, useEffect } from 'react';
import { Layers3, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { getDesigns } from '../api/design';
import SplitText from '../components/effects/SplitText';
import Loader from '../components/Loader';
import GalleryLightbox from '../components/GalleryLightbox';

const ALL_CATEGORIES = 'All Works';

const Gallery = () => {
    const [designs, setDesigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
    const [lightboxDesign, setLightboxDesign] = useState(null);

    useEffect(() => {
        const fetchDesigns = async () => {
            try {
                const { data } = await getDesigns();
                setDesigns(data.data || []);
            } catch (err) {
                console.error('Failed to load designs', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDesigns();
    }, []);

    // Extract unique categories
    const categories = [ALL_CATEGORIES, ...new Set(designs.map(d => d.category))];

    const filteredDesigns = selectedCategory === ALL_CATEGORIES
        ? designs
        : designs.filter(d => d.category === selectedCategory);

    const handleCardClick = (e, design) => {
        if (design.linkType === 'external' && design.externalUrl) {
            // Let the regular anchor tag handle it if we want, or handle programmatic redirect
            return; 
        }
        
        if (design.linkType === 'detail') {
            // Let the <Link> handle it
            return;
        }

        // Default: Popup/Lightbox
        e.preventDefault();
        setLightboxDesign(design);
    };

    return (
        <main className="pb-16 pt-8 md:pt-12">
            <SEO title="Design Gallery" description="Showcase of landing pages, mockups, posters, thumbnails, and other creative works." />

            <section className="section-wrap enter-fade">
                <div className="relative overflow-hidden rounded-[32px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.16)] md:p-10">
                    <div className="pointer-events-none absolute -left-14 -top-14 h-44 w-44 rounded-full bg-[var(--accent-2)]/20 blur-3xl" />
                    <div className="pointer-events-none absolute -right-14 bottom-0 h-44 w-44 rounded-full bg-[var(--accent)]/20 blur-3xl" />

                    <div className="relative flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-soft)]">
                                <ImageIcon className="h-3.5 w-3.5 text-[var(--accent)]" />
                                Visual Exploration
                            </div>
                            <h1 className="display-title mt-3 text-4xl text-[var(--ink)] sm:text-6xl">
                                <SplitText text="Design Gallery" delay={0.2} />
                            </h1>
                        </div>

                        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink-soft)]">
                            <p className="font-semibold text-[var(--ink)]">{designs.length || 0} pieces</p>
                            <p>curated works</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-wrap mt-8">
                {/* Category Filter */}
                {!loading && designs.length > 0 && (
                    <div className="mb-8 flex flex-wrap gap-2 enter-fade">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`focus-ring rounded-full border px-4 py-2 text-sm font-semibold transition ${
                                    selectedCategory === cat
                                        ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                                        : 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--ink)]'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader text="Loading gallery..." />
                    </div>
                )}

                {!loading && designs.length === 0 && (
                    <div className="glass-card rounded-3xl p-10 text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-[var(--accent)]" />
                        <h3 className="display-title mt-4 text-3xl text-[var(--ink)]">Coming Soon</h3>
                        <p className="mx-auto mt-3 max-w-lg text-[var(--ink-soft)]">
                            The visual gallery is being populated. Check back shortly.
                        </p>
                    </div>
                )}

                {!loading && filteredDesigns.length > 0 && (
                    <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
                        {filteredDesigns.map((design) => {
                            const isExternal = design.linkType === 'external';
                            const isDetail = design.linkType === 'detail';
                            
                            const CardWrapper = isDetail ? Link : (isExternal ? 'a' : 'button');
                            const wrapperProps = isDetail 
                                ? { to: `/gallery/${design.slug}` }
                                : isExternal 
                                    ? { href: design.externalUrl, target: "_blank", rel: "noopener noreferrer" }
                                    : { onClick: (e) => handleCardClick(e, design) };

                            return (
                                <CardWrapper
                                    key={design._id}
                                    {...wrapperProps}
                                    className="group relative mb-5 block break-inside-avoid overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)] text-left focus-ring"
                                >
                                    <div className="relative w-full overflow-hidden">
                                        {design.thumbnail ? (
                                            <img
                                                src={design.thumbnail}
                                                alt={design.title}
                                                loading="lazy"
                                                className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="aspect-[4/3] w-full bg-[var(--bg-alt)]" />
                                        )}
                                        
                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        
                                        <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 transition-all duration-300 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100">
                                            <div className="flex items-center justify-between gap-2">
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--accent-2)]">
                                                        {design.category}
                                                    </p>
                                                    <h3 className="mt-1 font-nevera text-xl tracking-wide text-white">
                                                        {design.title}
                                                    </h3>
                                                    {design.subtitle && (
                                                        <p className="mt-1 text-sm text-white/80 line-clamp-1">
                                                            {design.subtitle}
                                                        </p>
                                                    )}
                                                </div>
                                                
                                                {isExternal && (
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </div>
                                                )}
                                                {!isExternal && !isDetail && (
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md">
                                                        <ImageIcon className="h-4 w-4" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardWrapper>
                            );
                        })}
                    </div>
                )}
            </section>

            <GalleryLightbox 
                isOpen={!!lightboxDesign} 
                design={lightboxDesign} 
                onClose={() => setLightboxDesign(null)} 
            />
        </main>
    );
};

export default Gallery;
