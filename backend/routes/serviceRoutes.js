const express = require('express');
const router = express.Router();
const {
    getServices,
    getServiceBySlug,
    createService,
    updateService,
    deleteService,
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { serviceValidators } = require('../middleware/validators');

// Public routes
router.get('/', getServices);
router.get('/:slug', getServiceBySlug);

// Admin routes
router.post('/', protect, authorize('admin'), serviceValidators.create, validate, createService);
router.patch('/:id', protect, authorize('admin'), serviceValidators.id, serviceValidators.update, validate, updateService);
router.delete('/:id', protect, authorize('admin'), serviceValidators.id, validate, deleteService);

module.exports = router;
