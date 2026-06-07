const mongoose = require('mongoose');

const seoSchema = new mongoose.Schema({
    pageSlug: {
        type: String,
        required: [true, 'Page slug is required'],
        unique: true,
        trim: true,
    },
    seoTitle: {
        type: String,
        trim: true,
    },
    seoDescription: {
        type: String,
        trim: true,
    },
    canonicalUrl: {
        type: String,
        trim: true,
    },
    ogTitle: {
        type: String,
        trim: true,
    },
    ogDescription: {
        type: String,
        trim: true,
    },
    ogImage: {
        type: String,
        trim: true,
    },
    twitterCard: {
        type: String,
        enum: ['summary', 'summary_large_image'],
    },
    twitterTitle: {
        type: String,
        trim: true,
    },
    twitterDescription: {
        type: String,
        trim: true,
    },
    siteName: {
        type: String,
        trim: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Seo', seoSchema);
