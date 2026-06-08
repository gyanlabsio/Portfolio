const express = require('express');
const router = express.Router();
const {
  getQuotations,
  getQuotation,
  createQuotation,
  updateQuotation,
  updateQuotationStatus,
  deleteQuotation,
  getQuotationPdf
} = require('../controllers/quotationController');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { quotationValidators } = require('../middleware/validators');

// All quotation routes are protected and restricted to admin
router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .get(getQuotations)
  .post(validate(quotationValidators.create), createQuotation);

router
  .route('/:id')
  .get(validate(quotationValidators.id), getQuotation)
  .patch(validate([...quotationValidators.id, ...quotationValidators.update]), updateQuotation)
  .delete(validate(quotationValidators.id), deleteQuotation);

router
  .route('/:id/status')
  .patch(validate([...quotationValidators.id, ...quotationValidators.updateStatus]), updateQuotationStatus);

router
  .route('/:id/pdf')
  .get(validate(quotationValidators.id), getQuotationPdf);

module.exports = router;
