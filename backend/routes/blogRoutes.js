const express = require('express');
const router = express.Router();
const {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { blogValidators } = require('../middleware/validators');

// Public routes
router.get('/', getPosts);
router.get('/:slug', getPost);

// Admin routes
router.post('/', protect, blogValidators.createOrUpdate, validate, createPost);
router.put('/:id', protect, blogValidators.id, blogValidators.createOrUpdate, validate, updatePost);
router.delete('/:id', protect, blogValidators.id, validate, deletePost);

module.exports = router;
