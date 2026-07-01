const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    siteTitle: {
        type: String,
        required: [true, 'Site title is required'],
        trim: true,
        default: 'My Portfolio',
    },
    tagline: {
        type: String,
        trim: true,
    },
    heroBadge: {
        type: String,
        trim: true,
        default: 'Design + Engineering',
    },
    description: {
        type: String,
        trim: true,
    },
    aboutImage: {
        type: String,
        trim: true,
    },
    aboutHeroHeading: {
        type: String,
        trim: true,
        default: 'WHERE DESIGN MEETS ENGINEERING',
    },
    aboutHeroSubheading: {
        type: String,
        trim: true,
        default: 'GET TO KNOW ME CLOSELY',
    },
    aboutHeroBrandName: {
        type: String,
        trim: true,
        default: 'GYANARANJAN',
    },
    aboutHeroImages: {
        type: [String],
        default: [],
    },
    aboutStatsHeading: {
        type: String,
        trim: true,
        default: 'OUR IMPACT IN NUMBERS',
    },
    aboutStatsSubheading: {
        type: String,
        trim: true,
        default: 'BUT WHY US?',
    },
    aboutStatsImage: {
        type: String,
        trim: true,
    },
    aboutStats: {
        type: [
            {
                value: String,
                label: String,
                description: String,
            }
        ],
        default: [
            { value: '48+', label: 'SUCCESSFUL PROJECTS', description: 'Delivering impactful digital solutions that combine creativity, precision, and innovation.' },
            { value: '35+', label: 'SATISFIED CLIENTS', description: 'Building long-term partnerships through trust, design excellence, and a commitment to crafting experiences.' },
            { value: '62%', label: 'AVG. INCREASE IN SALES', description: 'Helping businesses achieve measurable growth through strategic design, seamless functionality.' },
            { value: '45%', label: 'COST EFFICIENCY', description: 'Optimizing resources and development processes to ensure maximum value, high performance.' }
        ]
    },
    bioText: {
        type: String,
        trim: true,
    },
    bioHeading: {
        type: String,
        trim: true,
        default: 'Biography',
    },
    bioSubheading: {
        type: String,
        trim: true,
        default: 'Thoughtful engineering. Character-rich interfaces. Relentless iteration.',
    },
    readmeContent: {
        type: String,
        trim: true,
    },
    aboutMyWorkHeading: {
        type: String,
        trim: true,
        default: 'ABOUT OUR COMPANY',
    },
    aboutMyWorkText: {
        type: String,
        trim: true,
    },
    aboutMyWorkDropdowns: {
        type: [
            {
                title: String,
                content: String
            }
        ],
        default: [
            { title: 'OUR MISSION', content: 'To deliver exceptional digital experiences.' },
            { title: 'OUR VISION', content: 'To be the leading engineering partner for growth.' },
            { title: 'OUR JOURNEY', content: 'Started as a solo developer, now partnering with global brands.' }
        ]
    },
    footerHeading: {
        type: String,
        trim: true,
        default: 'Build Something\nRemarkable.',
    },
    footerSubheading: {
        type: String,
        trim: true,
        default: 'Available for selected projects',
    },
    bioSkills: {
        type: [
            {
                title: String,
                icon: String
            }
        ],
        default: [
            { title: 'Product Direction', icon: 'Compass' },
            { title: 'Design Thinking', icon: 'Lightbulb' },
            { title: 'Fast Execution', icon: 'Rocket' }
        ]
    },
    logoUrl: {
        type: String,
        trim: true,
    },
    faviconUrl: {
        type: String,
        trim: true,
    },
    resumeUrl: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
        trim: true,
        lowercase: true,
        default: 'admin@example.com',
    },
    phone: {
        type: String,
        trim: true,
    },
    socialLinks: {
        type: Object,
        default: {
            github: '',
            linkedin: '',
            twitter: '',
            instagram: ''
        }
    },
    availabilityStatus: {
        type: String,
        enum: ['AVAILABLE', 'BUSY', 'UNAVAILABLE'],
        default: 'AVAILABLE',
    },
    homepageSections: {
        type: Object,
        default: {
            projects: true,
            services: true,
            testimonials: true,
            content: true,
            contact: true,
            aboutMyWork: true
        }
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Settings', settingsSchema);
