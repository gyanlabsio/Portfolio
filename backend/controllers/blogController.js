const BlogPost = require('../models/BlogPost');

// @desc    Get all published blog posts
// @route   GET /api/blog
exports.getPosts = async (req, res, next) => {
    try {
        const filter = req.query.all === 'true' ? {} : { published: true };

        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 50);
        const skip = (page - 1) * limit;

        const [posts, total] = await Promise.all([
            BlogPost.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            BlogPost.countDocuments(filter),
        ]);

        res.json({
            success: true,
            count: posts.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: posts,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single blog post by slug
// @route   GET /api/blog/:slug
exports.getPost = async (req, res, next) => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug });
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.json({ success: true, data: post });
    } catch (error) {
        next(error);
    }
};

// @desc    Create blog post (admin)
// @route   POST /api/blog
exports.createPost = async (req, res, next) => {
    try {
        const post = await BlogPost.create(req.body);
        res.status(201).json({ success: true, data: post });
    } catch (error) {
        next(error);
    }
};

// @desc    Update blog post (admin)
// @route   PUT /api/blog/:id
exports.updatePost = async (req, res, next) => {
    try {
        const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.json({ success: true, data: post });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete blog post (admin)
// @route   DELETE /api/blog/:id
exports.deletePost = async (req, res, next) => {
    try {
        const post = await BlogPost.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.json({ success: true, message: 'Post deleted' });
    } catch (error) {
        next(error);
    }
};
