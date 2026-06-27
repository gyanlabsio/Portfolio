const express = require('express');
const router = express.Router();
const { 
    getTemplates, 
    getTemplate, 
    createTemplate, 
    updateTemplate, 
    deleteTemplate, 
    sendNewsletter 
} = require('../controllers/newsletterController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin
router.use(protect);
router.use(authorize('admin', 'superadmin'));

router.route('/')
    .get(getTemplates)
    .post(createTemplate);

router.route('/:id')
    .get(getTemplate)
    .put(updateTemplate)
    .delete(deleteTemplate);

router.post('/:id/send', sendNewsletter);

module.exports = router;
