const express = require('express');
const router = express.Router();
const {
    getTestimonials,
    getFeaturedTestimonials,
    submitTestimonial,
    createTestimonial,
    updateTestimonial,
    updateTestimonialStatus,
    deleteTestimonial,
} = require('../controllers/testimonialController');
const { protect, optionalProtect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { testimonialValidators } = require('../middleware/validators');

// Public routes
router.get('/', optionalProtect, getTestimonials);
router.get('/featured', getFeaturedTestimonials);

const submitLimiter = require('express-rate-limit')({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: { success: false, message: 'Too many testimonials submitted from this IP, please try again later.' },
});
router.post('/submit', submitLimiter, testimonialValidators.create, validate, submitTestimonial);

// Admin routes
router.post('/', protect, authorize('admin'), testimonialValidators.create, validate, createTestimonial);
router.patch('/:id', protect, authorize('admin'), testimonialValidators.id, testimonialValidators.update, validate, updateTestimonial);
router.patch('/:id/status', protect, authorize('admin'), testimonialValidators.id, testimonialValidators.updateStatus, validate, updateTestimonialStatus);
router.delete('/:id', protect, authorize('admin'), testimonialValidators.id, validate, deleteTestimonial);

module.exports = router;
