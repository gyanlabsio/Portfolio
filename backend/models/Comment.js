const mongoose = require('mongoose');
const softDeletePlugin = require('../utils/softDeletePlugin');

const commentSchema = new mongoose.Schema({
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content'
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    authorName: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    text: {
        type: String,
        required: [true, 'Please add text'],
        maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    }
}, {
    timestamps: true
});

// Apply soft delete plugin
commentSchema.plugin(softDeletePlugin);

module.exports = mongoose.model('Comment', commentSchema);
