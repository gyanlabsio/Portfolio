import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import SEO from '../components/SEO';
import { getDesign } from '../api/design';
import Loader from '../components/Loader';
import SplitText from '../components/effects/SplitText';

const DesignDetails = () => {
    const { slug } = useParams();
    const [design, setDesign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDesign = async () => {
            try {
                const { data } = await getDesign(slug);
                setDesign(data.data);
            } catch (err) {
                console.error('Error fetching design details:', err);
                setError('Failed to load design details.');
            } finally {
                setLoading(false);
            }
        };
        fetchDesign();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center pt-20">
                <Loader text="Loading design details..." />
            </div>
        );
    }

    if (error || !design) {
        return (
            <div className="flex min-h-screen items-center justify-center pt-20">
                <div className=" rounded-none p-10 text-center">
                    <h2 className="display-title text-3xl text-[var(--ink)]">Not Found</h2>
                    <p className="mt-3 text-[var(--ink-soft)]">{error || 'Design project not found.'}</p>
                    <Link to="/gallery" className="mt-6 inline-block rounded-none bg-[var(--accent)] px-6 py-2 text-white hover:brightness-110">
                        Back to Gallery
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="pb-20 pt-24 md:pt-32">
            <SEO 
                title={`${design.title} | Design Gallery`} 
                description={design.subtitle || design.description || `Design details for ${design.title}`} 
                image={design.thumbnail}
            />

            <article className="section-wrap max-w-4xl enter-fade">
                <Link to="/gallery" className="group mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink-soft)] transition hover:text-[var(--accent)]">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back to Gallery
                </Link>

                <div className="mb-6 inline-flex items-center gap-2 rounded-none border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent-2)]">
                    {design.category}
                </div>

                <h1 className="display-title mb-4 text-4xl leading-tight text-[var(--ink)] md:text-6xl">
                    <SplitText text={design.title} delay={0.1} />
                </h1>

                {design.subtitle && (
                    <p className="mb-10 text-xl font-medium text-[var(--ink-soft)] md:text-2xl">
                        {design.subtitle}
                    </p>
                )}

                <div className="mb-12 overflow-hidden rounded-none border border-[var(--line)] bg-[var(--bg-alt)]">
                    <img 
                        src={design.thumbnail} 
                        alt={design.title} 
                        className="w-full h-auto object-cover" 
                    />
                </div>

                <div className="grid gap-10 md:grid-cols-[1fr_300px]">
                    <div className="space-y-8 text-lg leading-relaxed text-[var(--ink-soft)]">
                        {design.description ? (
                            <div className="whitespace-pre-wrap">{design.description}</div>
                        ) : (
                            <p>No detailed description provided for this design.</p>
                        )}
                        
                        {design.galleryImages && design.galleryImages.length > 0 && (
                            <div className="mt-12 space-y-8">
                                <h3 className="display-title text-2xl text-[var(--ink)]">Visuals</h3>
                                {design.galleryImages.map((img, idx) => (
                                    <div key={idx} className="overflow-hidden rounded-none border border-[var(--line)]">
                                        <img src={img.url} alt={img.caption || `Gallery image ${idx + 1}`} className="w-full object-cover" />
                                        {img.caption && (
                                            <div className="bg-[var(--surface)] p-3 text-center text-sm font-medium text-[var(--ink-soft)] border-t border-[var(--line)]">
                                                {img.caption}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <aside className="space-y-6 shrink-0">
                        <div className=" space-y-5 rounded-none p-6">
                            {design.client && (
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]">Client</p>
                                    <p className="mt-1 font-medium text-[var(--ink)]">{design.client}</p>
                                </div>
                            )}
                            {design.role && (
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]">Role</p>
                                    <p className="mt-1 font-medium text-[var(--ink)]">{design.role}</p>
                                </div>
                            )}
                            {design.tools && design.tools.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]">Tools</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {design.tools.map(tool => (
                                            <span key={tool} className="rounded-none border border-[var(--line)] bg-[var(--surface)] px-2 py-1 text-xs font-medium text-[var(--ink)]">
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {design.year && (
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]">Year</p>
                                    <p className="mt-1 font-medium text-[var(--ink)]">{design.year}</p>
                                </div>
                            )}
                            
                            {design.linkType === 'external' && design.externalUrl && (
                                <div className="pt-4 border-t border-[var(--line)]">
                                    <a
                                        href={design.externalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex w-full items-center justify-center gap-2 rounded-none bg-[var(--accent)] py-3 text-sm font-bold text-white transition hover:brightness-110"
                                    >
                                        Visit Live <ExternalLink className="h-4 w-4" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </article>
        </main>
    );
};

export default DesignDetails;
