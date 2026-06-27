const mongoose = require('mongoose');

const visitorProfileSchema = new mongoose.Schema({
    visitorId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin', // Using Admin or User if there are regular users
        default: null
    },
    isIdentified: {
        type: Boolean,
        default: false
    },
    consentStatus: {
        type: String,
        enum: ['pending', 'granted', 'denied'],
        default: 'pending'
    },
    firstSeen: {
        type: Date,
        default: Date.now
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    totalSessions: {
        type: Number,
        default: 0
    },
    totalTimeSpent: {
        type: Number,
        default: 0 // in seconds
    },
    lastKnownIp: String,
    lastKnownDevice: {
        os: String,
        browser: String,
        deviceType: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('VisitorProfile', visitorProfileSchema);
