const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    type: { 
        type: String, 
        enum: ['note', 'call', 'email', 'meeting', 'status_change', 'form_submission'],
        required: true 
    },
    description: { type: String, required: true },
    metadata: { type: Object }, // e.g., call duration, email subject
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
