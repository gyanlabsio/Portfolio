const Seo = require('../models/Seo');

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
            { new: true, runValidators: true }
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

module.exports = {
    getSeoBySlug,
    getGlobalSeo,
    createSeo,
    updateSeo,
    deleteSeo
};
