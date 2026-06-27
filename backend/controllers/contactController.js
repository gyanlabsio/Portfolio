const Contact = require('../models/Contact');
const Lead = require('../models/Lead');
const LeadActivity = require('../models/LeadActivity');
const sendEmail = require('../utils/sendEmail');

const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// @desc    Submit contact form (public)
// @route   POST /api/contact
exports.submitContact = async (req, res, next) => {
    try {
        // 1. Save strictly as a Contact (Message Inbox)
        let contact = await Contact.findOne({ email: req.body.email });
        if (contact) {
            contact.name = req.body.name || contact.name;
            contact.phone = req.body.phone || contact.phone;
            contact.subject = req.body.subject || contact.subject;
            contact.message = req.body.message || contact.message;
            await contact.save();
        } else {
            contact = await Contact.create(req.body);
        }

        // 2. Ingest into CRM as a Lead if it doesn't exist
        let lead = await Lead.findOne({ email: req.body.email });
        if (!lead) {
            lead = await Lead.create({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                company: req.body.company || 'N/A',
                projectType: req.body.projectType || 'OTHER',
                budget: req.body.budget || 'NOT_SPECIFIED',
                source: req.body.source || 'WEBSITE',
                status: 'NEW',
                notes: `Contact form subject: ${req.body.subject}`
            });
        }

        // 3. Log interaction in CRM history
        await LeadActivity.create({
            leadId: lead._id,
            type: 'NOTE',
            content: `Form submitted via Contact page. Subject: ${req.body.subject || 'N/A'}. Message: ${req.body.message || 'N/A'}`
        });

        const safeName = escapeHtml(contact.name);
        const safeEmail = escapeHtml(contact.email);
        const safeSubject = escapeHtml(contact.subject);
        const safeMessage = escapeHtml(contact.message).replace(/\n/g, '<br/>');
        const safeCompany = escapeHtml(req.body.company || 'N/A');
        const safeBudget = escapeHtml(req.body.budget || 'N/A');
        const safeProjectType = escapeHtml(req.body.projectType || 'N/A');
        const safeSource = escapeHtml(req.body.source || 'N/A');

        // Send email notification to site owner
        try {
            await sendEmail({
                to: process.env.CONTACT_EMAIL,
                subject: `Portfolio Contact: ${safeSubject}`,
                html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Company:</strong> ${safeCompany}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <p><strong>Budget:</strong> ${safeBudget}</p>
          <p><strong>Project Type:</strong> ${safeProjectType}</p>
          <p><strong>Source:</strong> ${safeSource}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        `,
            });
        } catch (emailError) {
            console.error('Email notification failed:', emailError.message);
        }

        res.status(201).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all contacts (admin)
// @route   GET /api/contact
exports.getContacts = async (req, res, next) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({ success: true, count: contacts.length, data: contacts });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single contact
// @route   GET /api/contact/:id
exports.getContact = async (req, res, next) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }
        res.json({ success: true, data: contact });
    } catch (error) {
        next(error);
    }
};

// @desc    Update contact status
// @route   PATCH /api/contact/:id/status
exports.updateStatus = async (req, res, next) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status }, 
            { new: true, runValidators: true }
        );
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }
        res.json({ success: true, data: contact });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark contact as read
// @route   PATCH /api/contact/:id/read
exports.markAsRead = async (req, res, next) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id, 
            { isRead: true }, 
            { new: true }
        );
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }
        res.json({ success: true, data: contact });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete contact
// @route   DELETE /api/contact/:id
exports.deleteContact = async (req, res, next) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }
        await contact.softDelete(req.admin.id, 'Admin deletion');
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
