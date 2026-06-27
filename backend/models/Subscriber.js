const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email address'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address',
        ],
    },
    status: {
        type: String,
        enum: ['SUBSCRIBED', 'UNSUBSCRIBED'],
        default: 'SUBSCRIBED',
    },
    token: {
        type: String,
        required: true,
    },
    unsubscribeReason: {
        type: String,
        trim: true,
        maxlength: [200, 'Reason cannot exceed 200 characters'],
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Subscriber', subscriberSchema);
