const Lead = require('../models/Lead');
const LeadActivity = require('../models/LeadActivity');
const LeadTask = require('../models/LeadTask');

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
            returnDocument: 'after',
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
        const lead = await Lead.findById(req.params.id);
        if (lead) await lead.softDelete(req.admin ? req.admin._id : null, "Admin soft delete");
        if (!lead) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }
        res.json({ success: true, message: 'Lead deleted' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get activities for a lead
// @route   GET /api/leads/:id/activities
exports.getLeadActivities = async (req, res, next) => {
    try {
        const activities = await LeadActivity.find({ leadId: req.params.id }).sort({ createdAt: -1 });
        res.json({ success: true, count: activities.length, data: activities });
    } catch (error) {
        next(error);
    }
};

// @desc    Create an activity for a lead
// @route   POST /api/leads/:id/activities
exports.createLeadActivity = async (req, res, next) => {
    try {
        const { type, content } = req.body;
        const activity = await LeadActivity.create({
            leadId: req.params.id,
            type,
            content
        });
        res.status(201).json({ success: true, data: activity });
    } catch (error) {
        next(error);
    }
};

// @desc    Get tasks for a lead
// @route   GET /api/leads/:id/tasks
exports.getLeadTasks = async (req, res, next) => {
    try {
        const tasks = await LeadTask.find({ leadId: req.params.id }).sort({ dueDate: 1 });
        res.json({ success: true, count: tasks.length, data: tasks });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a task for a lead
// @route   POST /api/leads/:id/tasks
exports.createLeadTask = async (req, res, next) => {
    try {
        const { title, dueDate } = req.body;
        const task = await LeadTask.create({
            leadId: req.params.id,
            title,
            dueDate
        });
        res.status(201).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a task (toggle completion)
// @route   PATCH /api/leads/:id/tasks/:taskId
exports.updateLeadTask = async (req, res, next) => {
    try {
        const task = await LeadTask.findOneAndUpdate(
            { _id: req.params.taskId, leadId: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.json({ success: true, data: task });
    } catch (error) {
        next(error);

    }
};

// @desc    Delete a task
// @route   DELETE /api/leads/:id/tasks/:taskId
exports.deleteLeadTask = async (req, res, next) => {
    try {
        const task = await LeadTask.findOneAndDelete({ _id: req.params.taskId, leadId: req.params.id });
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Import Leads from JSON array (via CSV)
// @route   POST /api/leads/import
// @access  Private/Admin
exports.importLeads = async (req, res, next) => {
    try {
        const leads = req.body;
        
        if (!Array.isArray(leads) || leads.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid data format' });
        }
        
        let importedCount = 0;
        let skippedCount = 0;
        
        for (const leadData of leads) {
            if (!leadData.email) continue;
            
            const existing = await Lead.findOne({ email: leadData.email });
            if (existing) {
                skippedCount++;
                continue;
            }
            
            await Lead.create({
                name: leadData.name || 'Unknown',
                email: leadData.email,
                phone: leadData.phone || '',
                company: leadData.company || 'N/A',
                projectType: leadData.projectType || 'OTHER',
                budget: leadData.budget || 'NOT_SPECIFIED',
                source: leadData.source || 'OTHER',
                status: 'NEW',
                notes: leadData.notes || 'Imported via CSV'
            });
            importedCount++;
        }
        
        res.json({ success: true, message: `Imported ${importedCount} leads. Skipped ${skippedCount} duplicates.`, importedCount, skippedCount });
    } catch (error) {
        next(error);
    }
};

// @desc    Export Leads to JSON (for CSV generation on frontend)
// @route   GET /api/leads/export
// @access  Private/Admin
exports.exportLeads = async (req, res, next) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json({ success: true, data: leads });
    } catch (error) {
        next(error);
    }
};
