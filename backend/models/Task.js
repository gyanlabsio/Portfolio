const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'in_progress', 'completed'],
        default: 'pending' 
    },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
