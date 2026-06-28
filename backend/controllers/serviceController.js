const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
exports.getServices = async (req, res, next) => {
    try {
        const services = await Service.find().sort({ order: 1, createdAt: -1 });

        res.json({
            success: true,
            count: services.length,
            data: services,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single service by slug
// @route   GET /api/services/:slug
exports.getServiceBySlug = async (req, res, next) => {
    try {
        const service = await Service.findOne({ slug: req.params.slug });
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        res.json({ success: true, data: service });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a service (admin)
// @route   POST /api/services
exports.createService = async (req, res, next) => {
    try {
        const service = await Service.create(req.body);
        res.status(201).json({ success: true, data: service });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a service (admin)
// @route   PATCH /api/services/:id
exports.updateService = async (req, res, next) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: 'after',
            runValidators: true,
        });
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        res.json({ success: true, data: service });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a service (admin)
// @route   DELETE /api/services/:id
exports.deleteService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);
        if (service) await service.softDelete(req.admin ? req.admin._id : null, "Admin soft delete");
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service not found' });
        }
        res.json({ success: true, message: 'Service deleted' });
    } catch (error) {
        next(error);
    }
};
