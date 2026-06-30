const Design = require('../models/Design');

// @desc    Get all designs
// @route   GET /api/designs
// @access  Public
exports.getDesigns = async (req, res, next) => {
    try {
        let query;
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);

        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        query = Design.find(JSON.parse(queryStr));

        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 50;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Design.countDocuments(JSON.parse(queryStr));

        query = query.skip(startIndex).limit(limit);

        const designs = await query;

        // Pagination result
        const pagination = {};
        if (endIndex < total) {
            pagination.next = { page: page + 1, limit };
        }
        if (startIndex > 0) {
            pagination.prev = { page: page - 1, limit };
        }

        res.status(200).json({
            success: true,
            count: designs.length,
            pagination,
            data: designs
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get featured designs
// @route   GET /api/designs/featured
// @access  Public
exports.getFeaturedDesigns = async (req, res, next) => {
    try {
        const designs = await Design.find({ featured: true }).sort('-createdAt').limit(6);

        res.status(200).json({
            success: true,
            count: designs.length,
            data: designs
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single design
// @route   GET /api/designs/:slug
// @access  Public
exports.getDesign = async (req, res, next) => {
    try {
        // try finding by slug first, if not found, find by ID
        let design = await Design.findOne({ slug: req.params.slug });

        if (!design) {
            if (req.params.slug.match(/^[0-9a-fA-F]{24}$/)) {
                design = await Design.findById(req.params.slug);
            }
        }

        if (!design) {
            return res.status(404).json({ success: false, message: 'Design not found' });
        }

        res.status(200).json({
            success: true,
            data: design
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new design
// @route   POST /api/designs
// @access  Private
exports.createDesign = async (req, res, next) => {
    try {
        const design = await Design.create(req.body);

        res.status(201).json({
            success: true,
            data: design
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update design
// @route   PUT /api/designs/:id
// @access  Private
exports.updateDesign = async (req, res, next) => {
    try {
        let design = await Design.findById(req.params.id);

        if (!design) {
            return res.status(404).json({ success: false, message: 'Design not found' });
        }

        // Force regeneration of slug if title changed
        if (req.body.title && req.body.title !== design.title) {
            req.body.slug = undefined; 
            design.title = req.body.title; // Update title on instance so pre('validate') catches it
        }

        design = await Object.assign(design, req.body).save(); // Use save to trigger middleware

        res.status(200).json({
            success: true,
            data: design
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete design
// @route   DELETE /api/designs/:id
// @access  Private
exports.deleteDesign = async (req, res, next) => {
    try {
        const design = await Design.findById(req.params.id);

        if (!design) {
            return res.status(404).json({ success: false, message: 'Design not found' });
        }

        await design.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
