const express = require('express');
const router = express.Router();
const {
    getContent,
    getContentBySlug,
    getContentByType,
    createContent,
    updateContent,
    deleteContent,
} = require('../controllers/contentController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { contentValidators } = require('../middleware/validators');

// Admin routes
router.get('/admin/all', protect, authorize('admin'), (req, res, next) => {
    req.query.all = 'true';
    getContent(req, res, next);
});

// Public routes
router.get('/', getContent);
router.get('/type/:type', getContentByType);
router.get('/:slug', getContentBySlug);

// Admin routes
router.post('/', protect, authorize('admin'), contentValidators.create, validate, createContent);
router.patch('/:id', protect, authorize('admin'), contentValidators.id, contentValidators.update, validate, updateContent);
router.delete('/:id', protect, authorize('admin'), contentValidators.id, validate, deleteContent);

module.exports = router;
