const mongoose = require('mongoose');

const contentVersionSchema = new mongoose.Schema({
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content',
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
    },
    excerpt: {
        type: String,
    },
    content: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
    },
    versionNumber: {
        type: Number,
        required: true,
    },
    updatedBy: {
        type: String,
        default: 'Admin',
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('ContentVersion', contentVersionSchema);
