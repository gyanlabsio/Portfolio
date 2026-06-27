const mongoose = require('mongoose');

// Map module names to models
const modelsMap = {
    'project': require('../models/Project'),
    'service': require('../models/Service'),
    'testimonial': require('../models/Testimonial'),
    'contact': require('../models/Contact'),
    'comment': require('../models/Comment'),
    'lead': require('../models/Lead'),
    'content': require('../models/Content'),
    'file': require('../models/File'),
};

// @desc    Get all deleted items across supported modules
// @route   GET /api/trash
// @access  Private/Admin
exports.getTrashItems = async (req, res, next) => {
    try {
        const { module } = req.query;
        let trashItems = [];

        const modelsToQuery = module && modelsMap[module] ? [module] : Object.keys(modelsMap);

        for (const mod of modelsToQuery) {
            const Model = modelsMap[mod];
            // We use the query explicit `{ deletedAt: { $ne: null } }` which overrides the plugin
            const items = await Model.find({ deletedAt: { $ne: null } })
                .populate('deletedBy', 'name email')
                .lean();
            
            items.forEach(item => {
                trashItems.push({
                    _id: item._id,
                    module: mod,
                    title: item.title || item.name || item.subject || item.filename || 'Unknown',
                    deletedAt: item.deletedAt,
                    deletedBy: item.deletedBy,
                    deletedReason: item.deletedReason,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                    // keep raw document for export
                    raw: item
                });
            });
        }

        // Sort by deletedAt desc
        trashItems.sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));

        res.json({ success: true, count: trashItems.length, data: trashItems });
    } catch (error) {
        next(error);
    }
};

// @desc    Restore a deleted item
// @route   PUT /api/trash/restore/:module/:id
// @access  Private/Admin
exports.restoreItem = async (req, res, next) => {
    try {
        const { module, id } = req.params;
        const Model = modelsMap[module];

        if (!Model) {
            return res.status(400).json({ success: false, message: 'Invalid module' });
        }

        const item = await Model.findOne({ _id: id, deletedAt: { $ne: null } });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found in trash' });
        }

        await item.restore();

        res.json({ success: true, message: 'Item restored successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Permanently delete an item
// @route   DELETE /api/trash/permanent/:module/:id
// @access  Private/Admin
exports.permanentDelete = async (req, res, next) => {
    try {
        const { module, id } = req.params;
        const Model = modelsMap[module];

        if (!Model) {
            return res.status(400).json({ success: false, message: 'Invalid module' });
        }

        // Must use findOneAndDelete to bypass the soft-delete query override if we want to actually delete it
        // Or we can just use deleteOne with the explicit query
        const result = await Model.deleteOne({ _id: id, deletedAt: { $ne: null } });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Item not found in trash' });
        }

        res.json({ success: true, message: 'Item permanently deleted' });
    } catch (error) {
        next(error);
    }
};

// @desc    Bulk Restore
// @route   POST /api/trash/bulk-restore
// @access  Private/Admin
exports.bulkRestore = async (req, res, next) => {
    try {
        const { items } = req.body; // Array of { module, id }
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ success: false, message: 'Please provide items to restore' });
        }

        let restoredCount = 0;
        for (const item of items) {
            const Model = modelsMap[item.module];
            if (Model) {
                const doc = await Model.findOne({ _id: item.id, deletedAt: { $ne: null } });
                if (doc) {
                    await doc.restore();
                    restoredCount++;
                }
            }
        }

        res.json({ success: true, message: `Successfully restored ${restoredCount} items`, restoredCount });
    } catch (error) {
        next(error);
    }
};

// @desc    Bulk Permanent Delete
// @route   POST /api/trash/bulk-delete
// @access  Private/Admin
exports.bulkDelete = async (req, res, next) => {
    try {
        const { items } = req.body; // Array of { module, id }
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ success: false, message: 'Please provide items to delete' });
        }

        let deletedCount = 0;
        for (const item of items) {
            const Model = modelsMap[item.module];
            if (Model) {
                const result = await Model.deleteOne({ _id: item.id, deletedAt: { $ne: null } });
                if (result.deletedCount > 0) deletedCount++;
            }
        }

        res.json({ success: true, message: `Successfully deleted ${deletedCount} items permanently`, deletedCount });
    } catch (error) {
        next(error);
    }
};

// @desc    Export trash items to JSON/CSV (handled via frontend)
// @route   GET /api/trash/export
// @access  Private/Admin
exports.exportTrashItems = async (req, res, next) => {
    try {
        let trashItems = [];

        for (const [mod, Model] of Object.entries(modelsMap)) {
            const items = await Model.find({ deletedAt: { $ne: null } })
                .populate('deletedBy', 'name email')
                .lean();
            
            items.forEach(item => {
                trashItems.push({
                    _id: item._id,
                    module: mod,
                    title: item.title || item.name || item.subject || item.filename || 'Unknown',
                    deletedAt: item.deletedAt,
                    deletedBy: item.deletedBy ? item.deletedBy.email : 'Unknown',
                    createdAt: item.createdAt,
                });
            });
        }
        res.json({ success: true, data: trashItems });
    } catch (error) {
        next(error);
    }
};
