const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content',
        required: true
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

module.exports = mongoose.model('Comment', commentSchema);
