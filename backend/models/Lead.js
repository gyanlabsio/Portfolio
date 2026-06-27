const mongoose = require('mongoose');
const softDeletePlugin = require('../utils/softDeletePlugin');

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        trim: true,
        maxlength: [20, 'Phone number cannot exceed 20 characters'],
    },
    company: {
        type: String,
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    projectType: {
        type: String,
        enum: ['WEB_APP', 'SAAS', 'DASHBOARD', 'E_COMMERCE', 'MOBILE', 'OTHER'],
    },
    budget: {
        type: String,
        enum: ['UNDER_1000', '1000_5000', '5000_10000', '10000_PLUS', 'NOT_SPECIFIED'],
    },
    source: {
        type: String,
        enum: ['PORTFOLIO', 'LINKEDIN', 'TWITTER', 'INSTAGRAM', 'REFERRAL', 'OTHER'],
    },
    status: {
        type: String,
        enum: ['NEW', 'CONTACTED', 'IN_DISCUSSION', 'WON', 'LOST'],
        default: 'NEW',
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    dealValue: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

// Apply soft delete plugin
leadSchema.plugin(softDeletePlugin);

module.exports = mongoose.model('Lead', leadSchema);
