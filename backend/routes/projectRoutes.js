const express = require('express');
const router = express.Router();
const {
    getProjects,
    getFeaturedProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { projectValidators } = require('../middleware/validators');

// Public routes
router.get('/', getProjects);
router.get('/featured', getFeaturedProjects);
router.get('/:slug', getProject);

// Admin routes
router.post('/', protect, projectValidators.createOrUpdate, validate, createProject);
router.put('/:id', protect, projectValidators.id, projectValidators.createOrUpdate, validate, updateProject);
router.delete('/:id', protect, projectValidators.id, validate, deleteProject);

module.exports = router;
