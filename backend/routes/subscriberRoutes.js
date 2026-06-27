const express = require('express');
const router = express.Router();
const {
    subscribe,
    unsubscribe,
    getSubscribers,
    deleteSubscriber,
    sendNewsletter
} = require('../controllers/subscriberController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/subscribe', subscribe);
router.get('/unsubscribe', unsubscribe);

// Admin routes (protected)
router.use(protect);
router.use(authorize('admin'));

router.get('/admin', getSubscribers);
router.delete('/admin/:id', deleteSubscriber);
router.post('/admin/broadcast', sendNewsletter);

module.exports = router;
