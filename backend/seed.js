/**
 * Seed script — creates initial admin user and sample data
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const Project = require('./models/Project');
const Content = require('./models/Content');
const Testimonial = require('./models/Testimonial');
const Service = require('./models/Service');
const Lead = require('./models/Lead');
const SiteConfig = require('./models/SiteConfig');

const initialAdminEmail = process.env.SEED_ADMIN_EMAIL;
const initialAdminPassword = process.env.SEED_ADMIN_PASSWORD;

const seedData = async () => {
    await connectDB();

    console.log('Seeding database...');

    // --- Admin User ---
    if (!initialAdminEmail || !initialAdminPassword) {
        throw new Error('Missing SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD in environment');
    }

    // Single-admin mode for personal portfolio:
    // keep exactly one admin account and force credentials from env.
    await Admin.deleteMany({ email: { $ne: initialAdminEmail } });

    const existingAdmin = await Admin.findOne({ email: initialAdminEmail }).select('+password');
    if (!existingAdmin) {
        await Admin.create({
            email: initialAdminEmail,
            password: initialAdminPassword,
            role: 'admin',
        });
        console.log(`✅ Admin user created (${initialAdminEmail})`);
    } else {
        existingAdmin.password = initialAdminPassword;
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log(`✅ Admin user updated (${initialAdminEmail})`);
    }

    // --- Site Config ---
    const existingConfig = await SiteConfig.findOne();
    if (!existingConfig) {
        await SiteConfig.create({
            heroTitle: 'GYANARANJAN DAS',
            heroSubtitle: 'Full-Stack MERN Developer',
            aboutText: 'Gyanaranjan Das, a full-stack developer based in India, crafts immersive digital experiences that blend clean architecture with striking design. His work transforms complex problems into seamless, high-performance web applications that connect users with technology.',
            socialLinks: {
                github: 'https://github.com/gyanaranjan-das',
                linkedin: 'https://www.linkedin.com/in/gyanaranjan-das/',
                instagram: 'https://www.instagram.com/gyanlabs.io/',
                email: 'gyanlabs.io@gmail.com',
            },
        });
        console.log('✅ Site config created');
    } else {
        console.log('⏩ Site config already exists');
    }

    // --- Sample Projects ---
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
        await Project.insertMany([
            {
                title: 'E-Commerce App',
                description: 'A full-stack e-commerce application with product management, shopping cart, secure checkout, and user authentication. Built with React, Node.js, Express, and MongoDB.',
                techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe'],
                coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
                githubLink: 'https://github.com/gyanaranjan-das',
                category: 'E_COMMERCE',
                featured: true,
            },
            {
                title: 'SaaS Dashboard',
                description: 'A modern data analytics dashboard with real-time charts, user management, and responsive design. Features dark mode, interactive filters, and export capabilities.',
                techStack: ['React', 'Tailwind CSS', 'Chart.js', 'Node.js'],
                coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
                liveLink: 'https://example.com',
                category: 'DASHBOARD',
                featured: true,
            },
            {
                title: 'Portfolio V1',
                description: 'The first version of my personal portfolio website, featuring a dramatic dark theme with neon red accents, custom typography, and responsive design.',
                techStack: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion'],
                coverImage: '',
                liveLink: 'https://example.com',
                category: 'PORTFOLIO',
                featured: true,
            },
        ]);
        console.log('✅ Sample projects created');
    } else {
        console.log('⏩ Projects already exist');
    }

    // --- Sample Content ---
    const contentCount = await Content.countDocuments();
    if (contentCount === 0) {
        await Content.insertMany([
            {
                title: 'Building a Scalable Microservices Architecture',
                content: 'In this article, we explore the challenges and solutions of building a scalable microservices architecture using Node.js and Docker. We will cover service discovery, API gateways, and inter-service communication.\n\n### Why Microservices?\nMicroservices allow teams to work independently...',
                type: 'ARTICLE',
                status: 'PUBLISHED',
                tags: ['Architecture', 'Node.js', 'Docker', 'Microservices'],
                coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
            },
            {
                title: 'Case Study: 500% Increase in Conversion Rate',
                content: '## Problem\nOur client was struggling with a low conversion rate on their e-commerce platform.\n\n## Solution\nWe redesigned the checkout flow, implemented one-click purchasing, and optimized performance.\n\n## Architecture\nReact frontend, Node.js backend, Redis caching.\n\n## Results\nConversion rate increased from 1.2% to 6.1% within 3 months.',
                type: 'CASE_STUDY',
                status: 'PUBLISHED',
                tags: ['E-commerce', 'React', 'Optimization', 'Case Study'],
                coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop',
            },
        ]);
        console.log('✅ Sample content created');
    } else {
        console.log('⏩ Content already exists');
    }

    // --- Sample Testimonials ---
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
        await Testimonial.insertMany([
            {
                clientName: 'Jane Doe',
                clientRole: 'CEO',
                company: 'Tech Solutions Inc.',
                testimonial: 'Working with this developer was an absolute pleasure. They delivered our SaaS dashboard ahead of schedule and the code quality was exceptional.',
                rating: 5,
                featured: true,
                status: 'APPROVED',
                source: 'UPWORK',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
            },
            {
                clientName: 'John Smith',
                clientRole: 'CTO',
                company: 'E-Commerce Plus',
                testimonial: 'Great communication and solid technical skills. Our conversion rate improved significantly after the redesign.',
                rating: 4,
                featured: false,
                status: 'APPROVED',
                source: 'LINKEDIN',
            },
        ]);
        console.log('✅ Sample testimonials created');
    } else {
        console.log('⏩ Testimonials already exist');
    }

    // --- Sample Services ---
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
        await Service.insertMany([
            {
                title: 'Full Stack Web Development',
                description: 'End-to-end web application development using modern JavaScript frameworks. I handle everything from database design to frontend UI implementation.',
                features: ['React / Next.js Frontend', 'Node.js / Express Backend', 'Database Architecture', 'API Development', 'Deployment & CI/CD'],
                startingPrice: '$2,000',
                featured: true,
            },
            {
                title: 'Backend API Architecture',
                description: 'Scalable, secure, and well-documented REST or GraphQL APIs for your existing frontend or mobile application.',
                features: ['Performance Optimization', 'Authentication & Authorization', 'Third-party Integrations', 'Thorough Documentation'],
                startingPrice: '$1,000',
                featured: false,
            },
        ]);
        console.log('✅ Sample services created');
    } else {
        console.log('⏩ Services already exist');
    }

    // --- Sample Leads ---
    const leadCount = await Lead.countDocuments();
    if (leadCount === 0) {
        await Lead.insertMany([
            {
                name: 'Alice Johnson',
                email: 'alice.johnson@example.com',
                company: 'InnovateTech',
                projectType: 'SAAS',
                budget: '10000_PLUS',
                source: 'PORTFOLIO',
                status: 'NEW',
                notes: 'Interested in a completely new SaaS dashboard build.',
            },
            {
                name: 'Bob Smith',
                email: 'bob.smith@example.com',
                phone: '+1234567890',
                projectType: 'E_COMMERCE',
                budget: '5000_10000',
                source: 'LINKEDIN',
                status: 'IN_DISCUSSION',
                notes: 'Wants to migrate from Shopify to a custom Next.js stack.',
            },
        ]);
        console.log('✅ Sample leads created');
    } else {
        console.log('⏩ Leads already exist');
    }

    console.log('\n🎉 Seed complete!');
    process.exit(0);
};

seedData().catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
});
