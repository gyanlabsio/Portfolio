const express = require('express');
const router = express.Router();
const {
    getSettings,
    updateSettings
} = require('../controllers/settingsController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { settingsValidators } = require('../middleware/validators');

// Public route to dynamically fetch site configuration
router.get('/', getSettings);

// Protected admin route for updating settings
router.patch('/', protect, authorize('admin'), settingsValidators.update, validate, updateSettings);

module.exports = router;
