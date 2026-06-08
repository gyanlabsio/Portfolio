const express = require('express');
const router = express.Router();
const {
  getProposals,
  getProposal,
  createProposal,
  updateProposal,
  updateProposalStatus,
  deleteProposal,
  getProposalPdf
} = require('../controllers/proposalController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { proposalValidators } = require('../middleware/validators');

// All proposal routes are protected and restricted to admin
router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .get(getProposals)
  .post(proposalValidators.create, validate, createProposal);

router
  .route('/:id')
  .get(proposalValidators.id, validate, getProposal)
  .patch([...proposalValidators.id, ...proposalValidators.update], validate, updateProposal)
  .delete(proposalValidators.id, validate, deleteProposal);

router
  .route('/:id/status')
  .patch([...proposalValidators.id, ...proposalValidators.updateStatus], validate, updateProposalStatus);

router
  .route('/:id/pdf')
  .get(proposalValidators.id, validate, getProposalPdf);

module.exports = router;
