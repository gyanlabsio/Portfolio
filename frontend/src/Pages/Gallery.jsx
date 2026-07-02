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

      <section className='mb-24 border-b border-[var(--line)] pb-16'>
        <div className='px-6 md:px-10 lg:px-16'>
          <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
            <div>
              <p className='mb-4 text-xs font-bold uppercase tracking-widest text-[var(--ink)]'>
                Visual Exploration
              </p>
              <h1 className='text-6xl font-black uppercase tracking-tighter text-[var(--ink)] md:text-8xl'>
                <SplitText text='Gallery' delay={0.2} />
              </h1>
            </div>

            <div className='text-sm font-bold uppercase tracking-widest text-[var(--ink-soft)]'>
              <p className='text-[var(--ink)]'>{designs.length || 0} pieces</p>
              <p>curated works</p>
            </div>
          </div>
        </div>
      </section>

            <section className="section-wrap mt-8">
                {/* Category Filter */}
                {!loading && designs.length > 0 && (
                    <div className="mb-12 flex flex-wrap gap-2 px-6 md:px-10 lg:px-16 enter-fade">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors duration-200 ${
                                    selectedCategory === cat
                                        ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--surface)]'
                                        : 'border-[var(--line)] bg-[var(--bg)] text-[var(--ink-soft)] hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--surface)]'
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
                    <div className=" rounded-none p-10 text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-[var(--accent)]" />
                        <h3 className="display-title mt-4 text-3xl text-[var(--ink)]">Coming Soon</h3>
                        <p className="mx-auto mt-3 max-w-lg text-[var(--ink-soft)]">
                            The visual gallery is being populated. Check back shortly.
                        </p>
                    </div>
                )}

                {!loading && filteredDesigns.length > 0 && (
                    <div className="columns-1 gap-5 px-6 md:px-10 lg:px-16 sm:columns-2 lg:columns-3 xl:columns-4">
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
                                    className="group relative mb-5 block break-inside-avoid overflow-hidden border border-[var(--line)] bg-[var(--bg)] text-left focus:outline-none"
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
                                        <div className="absolute inset-0 bg-[var(--ink)]/80 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                                        
                                        <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center opacity-0 transition-all duration-300 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-2">
                                                {design.category}
                                            </p>
                                            <h3 className="text-xl font-black uppercase tracking-widest text-white">
                                                {design.title}
                                            </h3>
                                            {design.subtitle && (
                                                <p className="mt-2 text-xs font-light text-white/80 line-clamp-2">
                                                    {design.subtitle}
                                                </p>
                                            )}
                                            
                                            <div className="mt-6 flex gap-3">
                                                {isExternal && (
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/30 text-white hover:bg-white hover:text-black transition-colors">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </div>
                                                )}
                                                {!isExternal && !isDetail && (
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/30 text-white hover:bg-white hover:text-black transition-colors">
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
