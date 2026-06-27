const express = require('express');
const { initTracking, logEvent, identifyVisitor } = require('../controllers/trackingController');

const router = express.Router();

router.post('/init', initTracking);
router.post('/event', logEvent);
router.post('/identify', identifyVisitor);
module.exports = router;
