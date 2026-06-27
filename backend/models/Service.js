const mongoose = require('mongoose');
const softDeletePlugin = require('../utils/softDeletePlugin');
const slugify = require('slugify');

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Service title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
        type: String,
        unique: true,
        index: true,
    },
    description: {
        type: String,
        required: [true, 'Service description is required'],
        maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    features: [{
        type: String,
        trim: true,
        maxlength: [150, 'Feature cannot exceed 150 characters'],
    }],
    startingPrice: {
        type: mongoose.Schema.Types.Mixed, // String or Number
        trim: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// Auto-generate slug from title before saving
serviceSchema.pre('validate', function () {
    if (this.title && (!this.slug || this.isModified('title'))) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
});

// Apply soft delete plugin
serviceSchema.plugin(softDeletePlugin);

module.exports = mongoose.model('Service', serviceSchema);
