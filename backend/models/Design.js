const mongoose = require('mongoose');
const slugify = require('slugify');
const softDeletePlugin = require('../utils/softDeletePlugin');

const designSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Design title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
        type: String,
        unique: true,
        index: true,
    },
    subtitle: {
        type: String,
        trim: true,
        maxlength: [150, 'Subtitle cannot exceed 150 characters'],
    },
    thumbnail: {
        type: String, // URL
        required: [true, 'Thumbnail image is required'],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Branding', 'UI/UX', 'Web Design', 'Motion', 'Print', 'Case Study', 'Other'],
    },
    description: {
        type: String,
        maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    role: {
        type: String,
        trim: true,
    },
    tools: [{
        type: String,
        trim: true,
    }],
    client: {
        type: String,
        trim: true,
    },
    year: {
        type: String,
        trim: true,
    },
    linkType: {
        type: String,
        enum: ['detail', 'popup', 'external'],
        default: 'popup',
    },
    externalUrl: {
        type: String,
        trim: true,
    },
    galleryImages: [{
        url: { type: String, required: true },
        caption: { type: String, trim: true },
    }],
    featured: {
        type: Boolean,
        default: false,
    },
    order: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

// Auto-generate slug from title before saving
designSchema.pre('validate', function () {
    if (this.title && (!this.slug || this.isModified('title'))) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
});

// Apply soft delete plugin
designSchema.plugin(softDeletePlugin);

module.exports = mongoose.model('Design', designSchema);
