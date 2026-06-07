const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { submitContact, getContacts, getContact, updateStatus, markAsRead, deleteContact } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { contactValidators } = require('../middleware/validators');

const contactSubmitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many messages sent. Please try again later.' },
});

// Public
router.post('/', contactSubmitLimiter, contactValidators.create, validate, submitContact);

// Admin
router.get('/', protect, authorize('admin'), getContacts);
router.get('/:id', protect, authorize('admin'), contactValidators.id, validate, getContact);
router.patch('/:id/status', protect, authorize('admin'), contactValidators.id, contactValidators.updateStatus, validate, updateStatus);
router.patch('/:id/read', protect, authorize('admin'), contactValidators.id, validate, markAsRead);
router.delete('/:id', protect, authorize('admin'), contactValidators.id, validate, deleteContact);

module.exports = router;
