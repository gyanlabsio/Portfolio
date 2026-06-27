const Comment = require('../models/Comment');
const Content = require('../models/Content');

// @desc    Add a comment (public)
// @route   POST /api/comments
// @access  Public
exports.addComment = async (req, res, next) => {
    try {
        const { contentId, projectId, authorName, text } = req.body;
        
        if (!contentId && !projectId) {
            return res.status(400).json({ success: false, message: 'Please provide either contentId or projectId' });
        }

        if (contentId) {
            const content = await Content.findById(contentId);
            if (!content) {
                return res.status(404).json({ success: false, message: 'Content not found' });
            }
        }

        if (projectId) {
            const Project = require('../models/Project');
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({ success: false, message: 'Project not found' });
            }
        }

        const comment = await Comment.create({
            contentId: contentId || undefined,
            projectId: projectId || undefined,
            authorName,
            text,
            status: 'PENDING'
        });

        res.status(201).json({ success: true, data: comment });
    } catch (error) {
        next(error);
    }
};

// @desc    Get approved comments for a specific post (public)
// @route   GET /api/comments/post/:contentId
// @access  Public
exports.getPostComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ 
            contentId: req.params.contentId,
            status: 'APPROVED'
        }).sort({ createdAt: -1 });

        res.json({ success: true, count: comments.length, data: comments });
    } catch (error) {
        next(error);
    }
};

// @desc    Get approved comments for a specific project (public)
// @route   GET /api/comments/project/:projectId
// @access  Public
exports.getProjectComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ 
            projectId: req.params.projectId,
            status: 'APPROVED'
        }).sort({ createdAt: -1 });

        res.json({ success: true, count: comments.length, data: comments });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all comments (admin)
// @route   GET /api/comments
// @access  Private/Admin
exports.getAllComments = async (req, res, next) => {
    try {
        const comments = await Comment.find()
            .populate('contentId', 'title slug')
            .populate('projectId', 'title slug')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: comments.length, data: comments });
    } catch (error) {
        next(error);
    }
};

// @desc    Update comment status (admin)
// @route   PATCH /api/comments/:id/status
// @access  Private/Admin
exports.updateCommentStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const comment = await Comment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        res.json({ success: true, data: comment });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete comment (admin)
// @route   DELETE /api/comments/:id
// @access  Private/Admin
exports.deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (comment) await comment.softDelete(req.admin ? req.admin._id : null, "Admin soft delete");

        if (!comment) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        res.json({ success: true, message: 'Comment deleted' });
    } catch (error) {
        next(error);
    }
};
