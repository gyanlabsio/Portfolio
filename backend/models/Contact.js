const mongoose = require('mongoose');
const softDeletePlugin = require('../utils/softDeletePlugin');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
        type: String,
        trim: true
    },
    jobTitle: {
        type: String,
        trim: true
    },
    subject: {
        type: String,
        trim: true,
        maxlength: [200, 'Subject cannot exceed 200 characters'],
        default: 'No Subject',
    },
    message: {
        type: String,
        maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    customFields: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    lifecycleStage: {
        type: String,
        enum: ['LEAD', 'MQL', 'SQL', 'CUSTOMER', 'CHURNED', 'OTHER'],
        default: 'LEAD'
    },
    status: {
        type: String,
        enum: ['NEW', 'CONTACTED', 'IN_DISCUSSION', 'CLOSED', 'SPAM'],
        default: 'NEW',
    },
    source: {
        type: String,
        enum: ['PORTFOLIO', 'LINKEDIN', 'TWITTER', 'INSTAGRAM', 'REFERRAL', 'OTHER'],
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    socialLinks: {
        linkedin: String,
        twitter: String,
        github: String,
        website: String
    },
    privacy: {
        consentGiven: { type: Boolean, default: false },
        unsubscribed: { type: Boolean, default: false }
    }
}, {
    timestamps: true,
});

// Apply soft delete plugin
contactSchema.plugin(softDeletePlugin);

module.exports = mongoose.model('Contact', contactSchema);
