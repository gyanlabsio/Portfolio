const Testimonial = require('../models/Testimonial');

// @desc    Get all approved testimonials
// @route   GET /api/testimonials
exports.getTestimonials = async (req, res, next) => {
    try {
        const filter = { status: 'APPROVED' };
        
        // Admins can see all if they pass ?all=true
        if (req.query.all === 'true' && req.admin) {
            delete filter.status;
        }

        const testimonials = await Testimonial.find(filter)
            .sort({ createdAt: -1 })
            .populate('projectId', 'title slug coverImage');

        res.json({
            success: true,
            count: testimonials.length,
            data: testimonials,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get featured approved testimonials
// @route   GET /api/testimonials/featured
exports.getFeaturedTestimonials = async (req, res, next) => {
    try {
        const testimonials = await Testimonial.find({ 
            status: 'APPROVED',
            featured: true 
        })
        .sort({ createdAt: -1 })
        .populate('projectId', 'title slug');

        res.json({
            success: true,
            count: testimonials.length,
            data: testimonials,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Submit public testimonial
// @route   POST /api/testimonials/submit
exports.submitTestimonial = async (req, res, next) => {
    try {
        const payload = {
            ...req.body,
            status: 'PENDING',
            featured: false,
        };
        // Don't allow public users to supply an image directly for security/abuse reasons.
        // Admin can edit and add image later.
        delete payload.image;

        const testimonial = await Testimonial.create(payload);
        res.status(201).json({ success: true, message: 'Testimonial submitted successfully', data: testimonial });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a testimonial (admin)
// @route   POST /api/testimonials
exports.createTestimonial = async (req, res, next) => {
    try {
        const testimonial = await Testimonial.create(req.body);
        res.status(201).json({ success: true, data: testimonial });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a testimonial (admin)
// @route   PATCH /api/testimonials/:id
exports.updateTestimonial = async (req, res, next) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: 'after',
            runValidators: true,
        });
        if (!testimonial) {
            return res.status(404).json({ success: false, message: 'Testimonial not found' });
        }
        res.json({ success: true, data: testimonial });
    } catch (error) {
        next(error);
    }
};

// @desc    Update testimonial status (admin)
// @route   PATCH /api/testimonials/:id/status
exports.updateTestimonialStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const testimonial = await Testimonial.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { returnDocument: 'after', runValidators: true }
        );
        if (!testimonial) {
            return res.status(404).json({ success: false, message: 'Testimonial not found' });
        }
        res.json({ success: true, data: testimonial });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a testimonial (admin)
// @route   DELETE /api/testimonials/:id
exports.deleteTestimonial = async (req, res, next) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (testimonial) await testimonial.softDelete(req.admin ? req.admin._id : null, "Admin soft delete");
        if (!testimonial) {
            return res.status(404).json({ success: false, message: 'Testimonial not found' });
        }
        res.json({ success: true, message: 'Testimonial deleted' });
    } catch (error) {
        next(error);
    }
};
