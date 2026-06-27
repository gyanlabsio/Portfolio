const mongoose = require('mongoose');
const softDeletePlugin = require('../utils/softDeletePlugin');

const newsletterTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    bodyHtml: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'sent'],
        default: 'draft'
    },
    sentAt: {
        type: Date,
        default: null
    },
    sentCount: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    }
}, {
    timestamps: true
});

newsletterTemplateSchema.plugin(softDeletePlugin);

module.exports = mongoose.model('NewsletterTemplate', newsletterTemplateSchema);
