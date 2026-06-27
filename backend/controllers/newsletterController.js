const NewsletterTemplate = require('../models/NewsletterTemplate');
const Subscriber = require('../models/Subscriber');
const nodemailer = require('nodemailer');

// Helper to configure transporter
const getTransporter = () => {
    // In production, fetch these from process.env or a Settings model
    return nodemailer.createTransport({
        service: 'gmail', // or use host/port for SMTP
        auth: {
            user: process.env.EMAIL_USER || 'test@example.com',
            pass: process.env.EMAIL_PASS || 'password'
        }
    });
};

// @desc    Get all templates
// @route   GET /api/subscribers/newsletter
// @access  Private/Admin
exports.getTemplates = async (req, res, next) => {
    try {
        const templates = await NewsletterTemplate.find()
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name email');
            
        res.json({ success: true, count: templates.length, data: templates });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single template
// @route   GET /api/subscribers/newsletter/:id
// @access  Private/Admin
exports.getTemplate = async (req, res, next) => {
    try {
        const template = await NewsletterTemplate.findById(req.params.id)
            .populate('createdBy', 'name email');
            
        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }
        
        res.json({ success: true, data: template });
    } catch (error) {
        next(error);
    }
};

// @desc    Create template
// @route   POST /api/subscribers/newsletter
// @access  Private/Admin
exports.createTemplate = async (req, res, next) => {
    try {
        req.body.createdBy = req.admin.id;
        
        const template = await NewsletterTemplate.create(req.body);
        
        res.status(201).json({ success: true, data: template });
    } catch (error) {
        next(error);
    }
};

// @desc    Update template
// @route   PUT /api/subscribers/newsletter/:id
// @access  Private/Admin
exports.updateTemplate = async (req, res, next) => {
    try {
        let template = await NewsletterTemplate.findById(req.params.id);
        
        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }
        
        if (template.status === 'sent') {
            return res.status(400).json({ success: false, message: 'Cannot edit a sent newsletter' });
        }
        
        template = await NewsletterTemplate.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        res.json({ success: true, data: template });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete template
// @route   DELETE /api/subscribers/newsletter/:id
// @access  Private/Admin
exports.deleteTemplate = async (req, res, next) => {
    try {
        const template = await NewsletterTemplate.findById(req.params.id);
        
        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }
        
        await template.softDelete(req.admin.id, 'Admin deletion');
        
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

// @desc    Send newsletter
// @route   POST /api/subscribers/newsletter/:id/send
// @access  Private/Admin
exports.sendNewsletter = async (req, res, next) => {
    try {
        const template = await NewsletterTemplate.findById(req.params.id);
        
        if (!template) {
            return res.status(404).json({ success: false, message: 'Template not found' });
        }
        
        if (template.status === 'sent') {
            return res.status(400).json({ success: false, message: 'Newsletter already sent' });
        }

        // Get all active subscribers
        const subscribers = await Subscriber.find({ status: 'subscribed' });
        
        if (subscribers.length === 0) {
            return res.status(400).json({ success: false, message: 'No active subscribers found' });
        }

        const transporter = getTransporter();
        
        // Setup base mail options
        const mailOptions = {
            from: process.env.EMAIL_FROM || '"Admin" <admin@portfolio.com>',
            subject: template.subject,
            html: template.bodyHtml
        };

        // In a real production app, you'd want to use a queue (BullMQ/RabbitMQ)
        // or a bulk email API to send to hundreds of users asynchronously.
        // For this MVP, we loop and send asynchronously.
        
        let sentCount = 0;
        
        for (const sub of subscribers) {
            try {
                // Add unsubscribe link dynamically if needed
                const personalizedHtml = template.bodyHtml + `<br><br><small><a href="${process.env.FRONTEND_URL}/unsubscribe/${sub._id}">Unsubscribe</a></small>`;
                
                await transporter.sendMail({
                    ...mailOptions,
                    to: sub.email,
                    html: personalizedHtml
                });
                sentCount++;
            } catch (err) {
                console.error(`Failed to send to ${sub.email}:`, err.message);
            }
        }
        
        template.status = 'sent';
        template.sentAt = Date.now();
        template.sentCount = sentCount;
        await template.save();
        
        res.json({ success: true, data: template, message: `Sent to ${sentCount} subscribers.` });
    } catch (error) {
        next(error);
    }
};
