const express = require('express');
const {
    getContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact,
    findDuplicates
} = require('../controllers/crmController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/contacts')
    .get(protect, authorize('admin'), getContacts)
    .post(protect, authorize('admin'), createContact);

router.route('/contacts/duplicates')
    .get(protect, authorize('admin'), findDuplicates);

router.route('/contacts/:id')
    .get(protect, authorize('admin'), getContact)
    .put(protect, authorize('admin'), updateContact)
    .delete(protect, authorize('admin'), deleteContact);

module.exports = router;
