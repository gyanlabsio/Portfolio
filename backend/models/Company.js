const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    domain: { type: String, trim: true },
    industry: { type: String, trim: true },
    size: { type: String, trim: true }, // e.g., '1-10', '11-50'
    revenue: { type: Number },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
