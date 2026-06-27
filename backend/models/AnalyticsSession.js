const mongoose = require('mongoose');

const analyticsSessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    visitorId: {
        type: String,
        ref: 'VisitorProfile',
        required: true,
        index: true
    },
    ipAddress: {
        type: String, // Store raw IP address
    },
    location: {
        country: String,
        city: String,
        region: String
    },
    deviceInfo: {
        os: String,
        browser: String,
        deviceType: String // 'desktop', 'mobile', 'tablet'
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date,
        default: Date.now
    },
    duration: {
        type: Number,
        default: 0 // in seconds
    },
    pageViews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AnalyticsSession', analyticsSessionSchema);
