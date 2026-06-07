const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    siteTitle: {
        type: String,
        required: [true, 'Site title is required'],
        trim: true,
        default: 'My Portfolio',
    },
    tagline: {
        type: String,
        trim: true,
    },
    heroBadge: {
        type: String,
        trim: true,
        default: 'Design + Engineering',
    },
    description: {
        type: String,
        trim: true,
    },
    logoUrl: {
        type: String,
        trim: true,
    },
    faviconUrl: {
        type: String,
        trim: true,
    },
    resumeUrl: {
        type: String,
        trim: true,
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
        default: 'admin@example.com',
    },
    phone: {
        type: String,
        trim: true,
    },
    socialLinks: {
        type: Object,
        default: {
            github: '',
            linkedin: '',
            twitter: '',
            instagram: ''
        }
    },
    availabilityStatus: {
        type: String,
        enum: ['AVAILABLE', 'BUSY', 'UNAVAILABLE'],
        default: 'AVAILABLE',
    },
    homepageSections: {
        type: Object,
        default: {
            projects: true,
            services: true,
            testimonials: true,
            content: true,
            contact: true
        }
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Settings', settingsSchema);
