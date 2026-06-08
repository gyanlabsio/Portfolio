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
const validate = require('../middleware/validate');
const { quotationValidators } = require('../middleware/validators');

// All quotation routes are protected and restricted to admin
router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .get(getQuotations)
  .post(quotationValidators.create, validate, createQuotation);

router
  .route('/:id')
  .get(quotationValidators.id, validate, getQuotation)
  .patch([...quotationValidators.id, ...quotationValidators.update], validate, updateQuotation)
  .delete(quotationValidators.id, validate, deleteQuotation);

router
  .route('/:id/status')
  .patch([...quotationValidators.id, ...quotationValidators.updateStatus], validate, updateQuotationStatus);

router
  .route('/:id/pdf')
  .get(quotationValidators.id, validate, getQuotationPdf);

module.exports = router;
