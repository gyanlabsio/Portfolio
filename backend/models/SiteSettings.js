const mongoose = require('mongoose');
const softDeletePlugin = require('../utils/softDeletePlugin');

const siteSettingsSchema = new mongoose.Schema({
    globalTitleSuffix: {
        type: String,
        default: ' | Portfolio',
        trim: true
    },
    defaultOgImage: {
        type: String,
        default: '',
        trim: true
    },
    robotsTxt: {
        type: String,
        default: 'User-agent: *\nAllow: /',
    },
    globalQuotationTerms: {
        type: String,
        default: '1. Payment is due within 15 days.\n2. Work commences upon receipt of 50% deposit.'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
}, { timestamps: true });

siteSettingsSchema.plugin(softDeletePlugin);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
