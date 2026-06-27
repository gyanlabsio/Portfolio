const mongoose = require('mongoose');
const softDeletePlugin = require('../utils/softDeletePlugin');

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    originalName: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    publicId: {
        type: String,
        required: true,
        unique: true,
    },
    fileType: {
        type: String,
        enum: ['IMAGE', 'PDF', 'OTHER'],
        required: true,
    },
    folder: {
        type: String,
        default: 'root',
        trim: true,
    },
    module: {
        type: String,
        enum: ['PROJECT', 'CONTENT', 'TESTIMONIAL', 'SERVICE', 'GENERAL'],
        default: 'GENERAL',
    },
}, {
    timestamps: true,
});

// Apply soft delete plugin
fileSchema.plugin(softDeletePlugin);

module.exports = mongoose.model('File', fileSchema);
