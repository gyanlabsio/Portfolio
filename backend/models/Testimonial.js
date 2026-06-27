const mongoose = require('mongoose');
const softDeletePlugin = require('../utils/softDeletePlugin');

const testimonialSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true,
        maxlength: [100, 'Client name cannot exceed 100 characters'],
    },
    clientRole: {
        type: String,
        trim: true,
        maxlength: [100, 'Client role cannot exceed 100 characters'],
    },
    company: {
        type: String,
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    avatar: {
        type: String, // URL only
        default: '',
    },
    testimonial: {
        type: String,
        required: [true, 'Testimonial content is required'],
        maxlength: [2000, 'Testimonial cannot exceed 2000 characters'],
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
    },
    featured: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'ARCHIVED'],
        default: 'PENDING',
    },
    source: {
        type: String,
        enum: ['LINKEDIN', 'UPWORK', 'FIVERR', 'EMAIL', 'DIRECT_CLIENT', 'OTHER'],
        default: 'OTHER',
    },
    sourceUrl: {
        type: String, // URL
        default: '',
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    },
}, {
    timestamps: true,
});

// Apply soft delete plugin
testimonialSchema.plugin(softDeletePlugin);

module.exports = mongoose.model('Testimonial', testimonialSchema);
