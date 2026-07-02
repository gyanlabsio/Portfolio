import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { getGlobalSeo, getSeoBySlug, getSiteSettings } from '../api/seo';

const SEO = ({ title, description, image, url, slug }) => {
    const location = useLocation();
    const [seoData, setSeoData] = useState(null);
    const [siteSettings, setSiteSettings] = useState(null);

    useEffect(() => {
        const fetchSEO = async () => {
            try {
                // Try to find specific SEO for this route/slug
                const targetSlug = slug || location.pathname.split('/')[1] || 'home';
                try {
                    const { data } = await getSeoBySlug(targetSlug);
                    if (data?.data) {
                        setSeoData(data.data);
                        return;
                    }
                } catch {
                    // Ignore 404, fallback to global
                }

                // Fallback to global SEO
                const { data } = await getGlobalSeo();
                if (data?.data) {
                    setSeoData(data.data);
                }
                // Fetch Site Settings
                try {
                    const { data: settingsData } = await getSiteSettings();
                    if (settingsData?.data) {
                        setSiteSettings(settingsData.data);
                    }
                } catch {
                    // Ignore settings error
                }
            } catch (error) {
                console.error("Failed to fetch SEO config", error);
            }
        };

        fetchSEO();
    }, [location.pathname, slug]);

    const siteName = seoData?.siteName || 'Gyanaranjan Das';
    const suffix = siteSettings?.globalTitleSuffix || ' — Portfolio';
    
    // Priority: API specific title -> Prop title
    const displayTitle = seoData?.seoTitle || title;
    
    // Determine the title
    let finalTitle = `${siteName}${suffix}`;
    if (seoData?.seoTitle) {
        finalTitle = seoData.seoTitle;
    } else if (displayTitle) {
        if (displayTitle.toLowerCase() === 'home') {
            finalTitle = `${siteName}${suffix}`;
        } else {
            finalTitle = `${displayTitle} | ${siteName}${suffix}`;
        }
    }
    
    const finalDescription = seoData?.seoDescription || description || 'Full-Stack MERN Developer crafting immersive digital experiences.';
    const finalCanonicalUrl = seoData?.canonicalUrl || url || (typeof window !== 'undefined' ? window.location.href : null);
    const finalImage = seoData?.ogImage || image;

    return (
        <Helmet>
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            <meta name="robots" content="index,follow" />
            {finalCanonicalUrl && <link rel="canonical" href={finalCanonicalUrl} />}
            
            <meta property="og:title" content={seoData?.ogTitle || finalTitle} />
            <meta property="og:description" content={seoData?.ogDescription || finalDescription} />
            <meta property="og:type" content="website" />
            {finalImage && <meta property="og:image" content={finalImage} />}
            {finalCanonicalUrl && <meta property="og:url" content={finalCanonicalUrl} />}
            
            <meta name="twitter:card" content={seoData?.twitterCard || "summary_large_image"} />
            <meta name="twitter:title" content={seoData?.twitterTitle || finalTitle} />
            <meta name="twitter:description" content={seoData?.twitterDescription || finalDescription} />
            {finalImage && <meta name="twitter:image" content={finalImage} />}
        </Helmet>
    );
};

export default SEO;
