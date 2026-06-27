const Content = require('../models/Content');

// @desc    Get all published content
// @route   GET /api/blog
exports.getContent = async (req, res, next) => {
    try {
        const filter = { status: 'PUBLISHED' };
        
        // Admins can see all content if they pass ?all=true
        if (req.query.all === 'true' && req.admin) {
             delete filter.status;
        }

        if (req.query.type) {
            filter.type = req.query.type.toUpperCase();
        }

        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 50);
        const skip = (page - 1) * limit;

        const [content, total] = await Promise.all([
            Content.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Content.countDocuments(filter),
        ]);

        res.json({
            success: true,
            count: content.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: content,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get published content by type
// @route   GET /api/blog/type/:type
exports.getContentByType = async (req, res, next) => {
    try {
        const filter = { 
            status: 'PUBLISHED',
            type: req.params.type.toUpperCase(),
        };

        const content = await Content.find(filter).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: content.length,
            data: content,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single content item by slug
// @route   GET /api/blog/:slug
exports.getContentBySlug = async (req, res, next) => {
    try {
        const content = await Content.findOne({ slug: req.params.slug });
        if (!content) {
            return res.status(404).json({ success: false, message: 'Content not found' });
        }
        res.json({ success: true, data: content });
    } catch (error) {
        next(error);
    }
};

// @desc    Create content (admin)
// @route   POST /api/blog
exports.createContent = async (req, res, next) => {
    try {
        if (req.body.slug) {
            const existing = await Content.findOne({ slug: req.body.slug });
            if (existing) {
                req.body.slug = `${req.body.slug}-${Math.random().toString(36).substring(2, 7)}`;
            }
        }
        const content = await Content.create(req.body);
        res.status(201).json({ success: true, data: content });
    } catch (error) {
        next(error);
    }
};

// @desc    Update content (admin)
// @route   PATCH /api/blog/:id
exports.updateContent = async (req, res, next) => {
    try {
        if (req.body.slug) {
            const existing = await Content.findOne({ slug: req.body.slug, _id: { $ne: req.params.id } });
            if (existing) {
                req.body.slug = `${req.body.slug}-${Math.random().toString(36).substring(2, 7)}`;
            }
        }
        const content = await Content.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: 'after',
            runValidators: true,
        });
        if (!content) {
            return res.status(404).json({ success: false, message: 'Content not found' });
        }
        res.json({ success: true, data: content });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete content (admin)
// @route   DELETE /api/blog/:id
exports.deleteContent = async (req, res, next) => {
    try {
        const content = await Content.findById(req.params.id);
        if (content) await content.softDelete(req.admin ? req.admin._id : null, "Admin soft delete");
        if (!content) {
            return res.status(404).json({ success: false, message: 'Content not found' });
        }
        res.json({ success: true, message: 'Content deleted' });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle like for a blog post
// @route   POST /api/blog/:id/like
// @access  Public
exports.toggleLike = async (req, res, next) => {
    try {
        const { visitorId } = req.body;
        if (!visitorId) {
            return res.status(400).json({ success: false, message: 'visitorId is required' });
        }

        const content = await Content.findById(req.params.id);
        if (!content) {
            return res.status(404).json({ success: false, message: 'Content not found' });
        }

        const hasLiked = content.likes.includes(visitorId);
        
        if (hasLiked) {
            // Unlike
            content.likes = content.likes.filter(id => id !== visitorId);
        } else {
            // Like
            content.likes.push(visitorId);
        }

        await content.save();

        res.json({ 
            success: true, 
            liked: !hasLiked,
            likesCount: content.likes.length 
        });
    } catch (error) {
        next(error);
    }
};

exports.getContentVersions = async (req, res, next) => {
    try {
        const versions = await ContentVersion.find({ contentId: req.params.id }).sort({ savedAt: -1 });
        res.json({ success: true, data: versions });
    } catch (error) {
        next(error);
    }
};

exports.rollbackContent = async (req, res, next) => {
    try {
        const version = await ContentVersion.findById(req.params.versionId);
        if (!version) return res.status(404).json({ success: false, message: 'Version not found' });
        const content = await Content.findByIdAndUpdate(req.params.id, { ...version.contentSnapshot, status: 'DRAFT' }, { new: true });
        res.json({ success: true, data: content });
    } catch (error) {
        next(error);
    }
};

exports.getRSSFeed = async (req, res, next) => {
    try {
        const posts = await Content.find({ status: 'PUBLISHED' }).sort({ createdAt: -1 }).limit(20);
        let rss = '<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0">\n<channel>\n<title>Portfolio Blog</title>\n';
        posts.forEach(post => {
            rss += `<item><title>${post.title}</title><link>${process.env.CLIENT_URL}/blog/${post.slug}</link></item>\n`;
        });
        rss += '</channel></rss>';
        res.type('application/xml').send(rss);
    } catch (error) {
        next(error);
    }
};
