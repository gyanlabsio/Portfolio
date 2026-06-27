const mongoose = require('mongoose');

const customFieldSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    type: { 
        type: String, 
        enum: ['text', 'number', 'date', 'dropdown', 'checkbox', 'url'],
        default: 'text' 
    },
    options: [{ type: String }], // Only used if type is 'dropdown'
    required: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('CustomField', customFieldSchema);
