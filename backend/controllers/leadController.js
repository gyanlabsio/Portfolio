const Lead = require('../models/Lead');

// @desc    Get all leads
// @route   GET /api/leads
exports.getLeads = async (req, res, next) => {
    try {
        const { status, projectType, source } = req.query;
        const filter = {};

        if (status) filter.status = status.toUpperCase();
        if (projectType) filter.projectType = projectType.toUpperCase();
        if (source) filter.source = source.toUpperCase();

        const leads = await Lead.find(filter).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: leads.length,
            data: leads,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Submit public lead (Start a Project)
// @route   POST /api/leads/submit
exports.submitLead = async (req, res, next) => {
    try {
        const payload = {
            ...req.body,
            status: 'NEW',
        };
        const lead = await Lead.create(payload);
        res.status(201).json({ success: true, message: 'Lead submitted successfully', data: lead });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single lead by ID
// @route   GET /api/leads/:id
exports.getLeadById = async (req, res, next) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }
        res.json({ success: true, data: lead });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a lead (admin manual creation)
// @route   POST /api/leads
exports.createLead = async (req, res, next) => {
    try {
        const lead = await Lead.create(req.body);
        res.status(201).json({ success: true, data: lead });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a lead (admin)
// @route   PATCH /api/leads/:id
exports.updateLead = async (req, res, next) => {
    try {
        const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!lead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }
        res.json({ success: true, data: lead });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a lead (admin)
// @route   DELETE /api/leads/:id
exports.deleteLead = async (req, res, next) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }
        res.json({ success: true, message: 'Lead deleted' });
    } catch (error) {
        next(error);
    }
};
