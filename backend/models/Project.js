const mongoose = require('mongoose');
const slugify = require('slugify');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
        type: String,
        unique: true,
        index: true,
    },
    description: {
        type: String,
        required: [true, 'Project description is required'],
        maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    coverImage: {
        type: String, // URL
        default: '',
    },
    techStack: [{
        type: String,
        trim: true,
    }],
    githubLink: {
        type: String,
        default: '',
    },
    liveLink: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        enum: ['WEB_APP', 'SAAS', 'DASHBOARD', 'E_COMMERCE', 'MOBILE', 'OTHER', 'PORTFOLIO'],
    },
    featured: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// Auto-generate slug from title before saving
projectSchema.pre('validate', function () {
    if (this.title && (!this.slug || this.isModified('title'))) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
});

module.exports = mongoose.model('Project', projectSchema);
