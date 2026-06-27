const express = require('express');
const router = express.Router();
const {
    getContent,
    getContentBySlug,
    getContentByType,
    createContent,
    updateContent,
    deleteContent,
    toggleLike,
    getContentVersions,
    rollbackContent,
    getRSSFeed
} = require('../controllers/contentController');
const { protect, optionalProtect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { contentValidators } = require('../middleware/validators');

// Admin routes
router.get('/admin/all', protect, authorize('admin'), (req, res, next) => {
    req.query.all = 'true';
    getContent(req, res, next);
});

// Public routes
router.get('/', optionalProtect, getContent);
router.get('/type/:type', optionalProtect, getContentByType);
router.get('/feed', getRSSFeed);
router.get('/:slug', optionalProtect, getContentBySlug);
router.post('/:id/like', toggleLike);

// Admin routes
router.post('/', protect, authorize('admin'), contentValidators.create, validate, createContent);
router.get('/:id/versions', protect, authorize('admin'), getContentVersions);
router.post('/:id/versions/:versionId/rollback', protect, authorize('admin'), rollbackContent);
router.patch('/:id', protect, authorize('admin'), contentValidators.id, contentValidators.update, validate, updateContent);
router.delete('/:id', protect, authorize('admin'), contentValidators.id, validate, deleteContent);

module.exports = router;
