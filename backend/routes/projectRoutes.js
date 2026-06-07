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
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { projectValidators } = require('../middleware/validators');

// Public routes
router.get('/', getProjects);
router.get('/featured', getFeaturedProjects);
router.get('/:slug', getProject);

// Admin routes
router.post('/', protect, authorize('admin'), projectValidators.create, validate, createProject);
router.patch('/:id', protect, authorize('admin'), projectValidators.id, projectValidators.update, validate, updateProject);
router.delete('/:id', protect, authorize('admin'), projectValidators.id, validate, deleteProject);

module.exports = router;
