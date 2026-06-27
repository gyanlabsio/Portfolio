const Seo = require('../models/Seo');
const SiteSettings = require('../models/SiteSettings');
const Project = require('../models/Project');
const Content = require('../models/Content');

// @desc    Get SEO metadata for a specific page
// @route   GET /api/seo/:pageSlug
// @access  Public
const getSeoBySlug = async (req, res, next) => {
    try {
        const { pageSlug } = req.params;
        const seo = await Seo.findOne({ pageSlug });
        
        if (!seo) {
            return res.status(404).json({ success: false, message: 'SEO metadata not found for this page' });
        }
        res.json({ success: true, data: seo });
    } catch (error) {
        next(error);
    }
};

// @desc    Get global/fallback SEO metadata
// @route   GET /api/seo/global
// @access  Public
const getGlobalSeo = async (req, res, next) => {
    try {
        let globalSeo = await Seo.findOne({ pageSlug: 'global' });
        
        if (!globalSeo) {
            // Return empty/default object if not seeded yet to prevent 404s
            globalSeo = { pageSlug: 'global' };
        }
        
        res.json({ success: true, data: globalSeo });
    } catch (error) {
        next(error);
    }
};

// @desc    Create SEO metadata for a page
// @route   POST /api/seo
// @access  Private/Admin
const createSeo = async (req, res, next) => {
    try {
        const { pageSlug } = req.body;
        
        // Ensure no duplicates
        const existing = await Seo.findOne({ pageSlug });
        if (existing) {
            return res.status(400).json({ success: false, message: 'SEO metadata for this page already exists. Please use PATCH.' });
        }

        const seo = await Seo.create(req.body);
        res.status(201).json({ success: true, data: seo });
    } catch (error) {
        next(error);
    }
};

// @desc    Update SEO metadata for a page
// @route   PATCH /api/seo/:pageSlug
// @access  Private/Admin
const updateSeo = async (req, res, next) => {
    try {
        const { pageSlug } = req.params;
        const seo = await Seo.findOneAndUpdate(
            { pageSlug }, 
            req.body, 
            { returnDocument: 'after', runValidators: true }
        );

        if (!seo) {
            return res.status(404).json({ success: false, message: 'SEO metadata not found for this page' });
        }

        res.json({ success: true, data: seo });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete SEO metadata
// @route   DELETE /api/seo/:pageSlug
// @access  Private/Admin
const deleteSeo = async (req, res, next) => {
    try {
        const { pageSlug } = req.params;
        
        // Prevent deleting the global fallback
        if (pageSlug === 'global') {
            return res.status(400).json({ success: false, message: 'Cannot delete global SEO fallback. Use PATCH to clear fields.' });
        }

        const seo = await Seo.findOneAndDelete({ pageSlug });

        if (!seo) {
            return res.status(404).json({ success: false, message: 'SEO metadata not found for this page' });
        }

        res.json({ success: true, message: 'SEO metadata deleted' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get global site settings (robots.txt, default OG image)
// @route   GET /api/seo/settings
// @access  Public
const getSiteSettings = async (req, res, next) => {
    try {
        let settings = await SiteSettings.findOne();
        if (!settings) {
            settings = await SiteSettings.create({});
        }
        res.json({ success: true, data: settings });
    } catch (error) {
        next(error);
    }
};

// @desc    Update site settings
// @route   PUT /api/seo/settings
// @access  Private/Admin
const updateSiteSettings = async (req, res, next) => {
    try {
        let settings = await SiteSettings.findOne();
        if (!settings) {
            settings = new SiteSettings(req.body);
        } else {
            Object.assign(settings, req.body);
        }
        settings.updatedBy = req.admin.id;
        await settings.save();
        res.json({ success: true, data: settings });
    } catch (error) {
        next(error);
    }
};

// @desc    Generate dynamic sitemap
// @route   GET /sitemap.xml
// @access  Public
const generateSitemap = async (req, res, next) => {
    try {
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const projects = await Project.find({ status: 'published' }).select('slug updatedAt');
        const blogs = await Content.find({ type: 'blog', status: 'published' }).select('slug updatedAt');

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Static routes
        const staticRoutes = ['', '/projects', '/services', '/blog', '/contact'];
        staticRoutes.forEach(route => {
            xml += `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
        });

        // Dynamic Projects
        projects.forEach(project => {
            xml += `  <url>\n    <loc>${baseUrl}/projects/${project.slug}</loc>\n    <lastmod>${project.updatedAt.toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
        });

        // Dynamic Blogs
        blogs.forEach(blog => {
            xml += `  <url>\n    <loc>${baseUrl}/blog/${blog.slug}</loc>\n    <lastmod>${blog.updatedAt.toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
        });

        xml += '</urlset>';

        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSeoBySlug,
    getGlobalSeo,
    createSeo,
    updateSeo,
    deleteSeo,
    getSiteSettings,
    updateSiteSettings,
    generateSitemap
};
