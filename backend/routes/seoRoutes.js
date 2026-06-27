const express = require('express');
const router = express.Router();
const {
    getSeoBySlug,
    getGlobalSeo,
    createSeo,
    updateSeo,
    deleteSeo,
    getSiteSettings,
    updateSiteSettings
} = require('../controllers/seoController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { seoValidators } = require('../middleware/validators');

// Public routes for fetching metadata dynamically
router.get('/settings', getSiteSettings);
router.get('/global', getGlobalSeo);
router.get('/:pageSlug', getSeoBySlug);

// Protected admin routes for managing metadata
router.use(protect);
router.use(authorize('admin'));

router.post('/', seoValidators.create, validate, createSeo);
router.put('/settings', updateSiteSettings);
router.patch('/:pageSlug', seoValidators.update, validate, updateSeo);
router.delete('/:pageSlug', deleteSeo);

module.exports = router;
