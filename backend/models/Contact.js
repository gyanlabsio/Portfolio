const mongoose = require('mongoose');

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
    subject: {
        type: String,
        trim: true,
        maxlength: [200, 'Subject cannot exceed 200 characters'],
        default: 'No Subject',
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },
    company: {
        type: String,
        trim: true,
        maxlength: [100, 'Company cannot exceed 100 characters'],
    },
    budget: {
        type: String,
        enum: ['UNDER_1000', '1000_5000', '5000_10000', '10000_PLUS', 'NOT_SPECIFIED'],
    },
    projectType: {
        type: String,
        enum: ['WEB_APP', 'SAAS', 'PORTFOLIO', 'E_COMMERCE', 'DASHBOARD', 'API', 'OTHER'],
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
}, {
    timestamps: true,
});

module.exports = mongoose.model('Contact', contactSchema);
