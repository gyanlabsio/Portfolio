import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, image, url }) => {
    const siteName = 'Gyanaranjan Das — Portfolio';
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const defaultDescription = 'Full-Stack MERN Developer crafting immersive digital experiences.';
    const desc = description || defaultDescription;
    const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : null);

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={desc} />
            <meta name="robots" content="index,follow" />
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={desc} />
            <meta property="og:type" content="website" />
            {image && <meta property="og:image" content={image} />}
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={desc} />
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
};

export default SEO;
