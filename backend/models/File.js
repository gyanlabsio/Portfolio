const mongoose = require('mongoose');

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
    module: {
        type: String,
        enum: ['PROJECT', 'CONTENT', 'TESTIMONIAL', 'SERVICE'],
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('File', fileSchema);
