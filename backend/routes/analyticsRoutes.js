const express = require('express');
const router = express.Router();
const { 
    recordEvent, 
    getEvents, 
    getSummary, 
    getModulesSummary,
    getTimeSeries,
    getVisitors,
    getSavedViews,
    createSavedView,
    getVisitorDetails
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { analyticsValidators } = require('../middleware/validators');

// Public route to log events
router.post('/', analyticsValidators.create, validate, recordEvent);

// Protected admin routes for retrieving stats
router.use(protect);
router.use(authorize('admin'));

router.get('/', getEvents);
router.get('/summary', getSummary);
router.get('/modules', getModulesSummary);
router.get('/timeseries', getTimeSeries);
router.get('/visitors', getVisitors);
router.get('/visitors/:visitorId', getVisitorDetails);
router.get('/views', getSavedViews);
router.post('/views', createSavedView);

module.exports = router;
