const Settings = require('../models/Settings');

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res, next) => {
    try {
        let settings = await Settings.findOne();
        
        // Ensure singleton exists
        if (!settings) {
            settings = await Settings.create({});
        }

        res.json({ success: true, data: settings });
    } catch (error) {
        next(error);
    }
};

// @desc    Update site settings
// @route   PATCH /api/settings
// @access  Private/Admin
const updateSettings = async (req, res, next) => {
    try {
        let settings = await Settings.findOne();
        
        // Ensure singleton exists
        if (!settings) {
            settings = await Settings.create({});
        }

        // Apply partial updates using Object.assign
        Object.assign(settings, req.body);
        
        // Prevent accidental manipulation of _id
        if (req.body._id) {
            delete settings._id;
        }

        const updatedSettings = await settings.save();

        res.json({ success: true, data: updatedSettings });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSettings,
    updateSettings
};
