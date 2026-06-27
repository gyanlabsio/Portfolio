const mongoose = require('mongoose');

const savedViewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    filters: {
        type: Object,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('SavedView', savedViewSchema);
