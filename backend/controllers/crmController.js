const Contact = require('../models/Contact');
const Company = require('../models/Company');
const Tag = require('../models/Tag');
const CustomField = require('../models/CustomField');

// @desc    Get all contacts (with pagination and filtering)
// @route   GET /api/crm/contacts
// @access  Private/Admin
const getContacts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const startIndex = (page - 1) * limit;

        const query = {};
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } }
            ];
        }
        if (req.query.stage) query.lifecycleStage = req.query.stage;
        if (req.query.status) query.status = req.query.status;

        const total = await Contact.countDocuments(query);
        const contacts = await Contact.find(query)
            .populate('companyId', 'name industry')
            .populate('tags', 'name color')
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);

        res.json({
            success: true,
            count: contacts.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: contacts
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single contact
// @route   GET /api/crm/contacts/:id
// @access  Private/Admin
const getContact = async (req, res, next) => {
    try {
        const contact = await Contact.findById(req.params.id)
            .populate('companyId')
            .populate('tags');
            
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }
        res.json({ success: true, data: contact });
    } catch (error) {
        next(error);
    }
};

// @desc    Create contact (Admin)
// @route   POST /api/crm/contacts
// @access  Private/Admin
const createContact = async (req, res, next) => {
    try {
        req.body.ownerId = req.admin._id;
        const contact = await Contact.create(req.body);
        res.status(201).json({ success: true, data: contact });
    } catch (error) {
        next(error);
    }
};

// @desc    Update contact
// @route   PUT /api/crm/contacts/:id
// @access  Private/Admin
const updateContact = async (req, res, next) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }
        res.json({ success: true, data: contact });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete contact
// @route   DELETE /api/crm/contacts/:id
// @access  Private/Admin
const deleteContact = async (req, res, next) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

// @desc    Find duplicates (exact match on email or phone)
// @route   GET /api/crm/duplicates
// @access  Private/Admin
const findDuplicates = async (req, res, next) => {
    try {
        const emailDuplicates = await Contact.aggregate([
            { $group: { _id: "$email", count: { $sum: 1 }, contacts: { $push: "$$ROOT" } } },
            { $match: { count: { $gt: 1 }, _id: { $ne: null, $ne: "" } } }
        ]);

        const phoneDuplicates = await Contact.aggregate([
            { $group: { _id: "$phone", count: { $sum: 1 }, contacts: { $push: "$$ROOT" } } },
            { $match: { count: { $gt: 1 }, _id: { $ne: null, $ne: "" } } }
        ]);

        res.json({
            success: true,
            data: { emailDuplicates, phoneDuplicates }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact,
    findDuplicates
};
