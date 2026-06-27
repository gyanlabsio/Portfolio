const express = require('express');
const router = express.Router();
const {
    addComment,
    getPostComments,
    getProjectComments,
    getAllComments,
    updateCommentStatus,
    deleteComment
} = require('../controllers/commentController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/', addComment);
router.get('/post/:contentId', getPostComments);
router.get('/project/:projectId', getProjectComments);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllComments);
router.patch('/:id/status', updateCommentStatus);
router.delete('/:id', deleteComment);

module.exports = router;
