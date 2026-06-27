const express = require('express');
const router = express.Router();
const {
    getLeads,
    getLeadById,
    submitLead,
    createLead,
    updateLead,
    deleteLead,
    getLeadActivities,
    createLeadActivity,
    getLeadTasks,
    createLeadTask,
    updateLeadTask,
    deleteLeadTask,
    importLeads,
    exportLeads
} = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { leadValidators } = require('../middleware/validators');

// Public route for lead submission
const submitLimiter = require('express-rate-limit')({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: { success: false, message: 'Too many project requests submitted from this IP. Please try again later.' },
});
router.post('/submit', submitLimiter, leadValidators.create, validate, submitLead);

// All Lead CRM routes below are strictly admin-only
router.use(protect);
router.use(authorize('admin'));

router.get('/', getLeads);
router.post('/import', importLeads);
router.get('/export', exportLeads);
router.get('/:id', leadValidators.id, validate, getLeadById);
router.post('/', leadValidators.create, validate, createLead);
router.patch('/:id', leadValidators.id, leadValidators.update, validate, updateLead);
router.delete('/:id', leadValidators.id, validate, deleteLead);

// Activity Timeline endpoints
router.get('/:id/activities', getLeadActivities);
router.post('/:id/activities', createLeadActivity);

// Task Tracking endpoints
router.get('/:id/tasks', getLeadTasks);
router.post('/:id/tasks', createLeadTask);
router.patch('/:id/tasks/:taskId', updateLeadTask);
router.delete('/:id/tasks/:taskId', deleteLeadTask);

module.exports = router;
