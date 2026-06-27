const mongoose = require('mongoose');

const leadActivitySchema = new mongoose.Schema({
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead',
        required: true,
        index: true,
    },
    type: {
        type: String,
        enum: ['CALL', 'EMAIL', 'MEETING', 'NOTE'],
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: [2000, 'Content cannot exceed 2000 characters'],
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('LeadActivity', leadActivitySchema);
