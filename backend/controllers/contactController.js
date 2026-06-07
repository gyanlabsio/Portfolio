const Contact = require('../models/Contact');
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
        const contact = await Contact.create(req.body);
        const safeName = escapeHtml(contact.name);
        const safeEmail = escapeHtml(contact.email);
        const safeSubject = escapeHtml(contact.subject);
        const safeMessage = escapeHtml(contact.message).replace(/\n/g, '<br/>');
        const safeCompany = escapeHtml(contact.company || 'N/A');
        const safeBudget = escapeHtml(contact.budget || 'N/A');
        const safeProjectType = escapeHtml(contact.projectType || 'N/A');
        const safeSource = escapeHtml(contact.source || 'N/A');

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
            // Don't fail the request if email fails
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

// @desc    Get single contact (admin)
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

// @desc    Update contact status (admin)
// @route   PATCH /api/contact/:id/status
exports.updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status },
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

// @desc    Mark contact as read (admin)
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

// @desc    Delete contact (admin)
// @route   DELETE /api/contact/:id
exports.deleteContact = async (req, res, next) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }
        res.json({ success: true, message: 'Contact deleted' });
    } catch (error) {
        next(error);
    }
};
