const mongoose = require('mongoose');

const analyticsEventSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['PAGE_VIEW', 'CLICK', 'FORM_SUBMISSION', 'IDENTIFY', 'CONSENT'],
        required: [true, 'Event type is required'],
    },
    page: {
        type: String,
        required: [true, 'Page identifier is required'],
        trim: true,
    },
    module: {
        type: String,
        enum: ['PROJECT', 'CONTENT', 'SERVICE', 'CONTACT', 'TESTIMONIAL', 'OTHER'],
        required: [true, 'Module category is required'],
    },
    element: {
        type: String,
        trim: true,
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    visitorId: {
        type: String,
        ref: 'VisitorProfile',
        required: [true, 'Visitor ID is required'],
        index: true,
    },
    sessionId: {
        type: String,
        ref: 'AnalyticsSession',
        index: true,
    },
    visitorLabel: {
        type: String,
        default: 'Anonymous Visitor',
    },
    realName: {
        type: String,
        default: null,
    },
}, {
    timestamps: { createdAt: true, updatedAt: false }, // Analytics events are append-only
});

module.exports = mongoose.model('AnalyticsEvent', analyticsEventSchema);
