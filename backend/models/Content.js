const mongoose = require('mongoose');
const slugify = require('slugify');

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Content title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
        type: String,
        unique: true,
        index: true,
    },
    excerpt: {
        type: String,
        maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    content: {
        type: String,
        required: [true, 'Content body is required'],
    },
    coverImage: {
        type: String, // URL
        default: '',
    },
    author: {
        type: String,
        default: 'Admin',
    },
    type: {
        type: String,
        required: [true, 'Content type is required'],
        enum: ['BLOG', 'ARTICLE', 'CASE_STUDY', 'NOTE'],
    },
    status: {
        type: String,
        enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
        default: 'DRAFT',
    },
    tags: [{
        type: String,
        trim: true,
    }],
    seoTitle: {
        type: String,
        maxlength: [100, 'SEO Title cannot exceed 100 characters'],
    },
    seoDescription: {
        type: String,
        maxlength: [160, 'SEO Description cannot exceed 160 characters'],
    },
    publishedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

// Auto-generate slug from title before saving
contentSchema.pre('validate', function () {
    if (this.title && (!this.slug || this.isModified('title'))) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    // Auto-generate excerpt from content if not provided
    if (this.content && !this.excerpt) {
        this.excerpt = this.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
    }
});

module.exports = mongoose.model('Content', contentSchema);
