const express = require('express');
const router = express.Router();
const { 
    recordEvent, 
    getEvents, 
    getSummary, 
    getModulesSummary,
    getTimeSeries,
    getVisitors
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { analyticsValidators } = require('../middleware/validators');

// Public route to log events
router.post('/', analyticsValidators.create, validate, recordEvent);

// Protected admin routes for retrieving stats
router.use(protect);
router.use(authorize('admin'));

router.get('/', protect, authorize('ADMIN'), getEvents);
router.get('/summary', protect, authorize('ADMIN'), getSummary);
router.get('/modules', protect, authorize('ADMIN'), getModulesSummary);
router.get('/timeseries', protect, authorize('ADMIN'), getTimeSeries);
router.get('/visitors', protect, authorize('ADMIN'), getVisitors);

module.exports = router;
