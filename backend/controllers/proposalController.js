const Proposal = require('../models/Proposal');
const { generateProposalPdf } = require('../utils/pdfService');

// @desc    Get all proposals
// @route   GET /api/proposals
// @access  Private/Admin
const getProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: proposals.length,
      data: proposals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single proposal
// @route   GET /api/proposals/:id
// @access  Private/Admin
const getProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }
    
    res.json({
      success: true,
      data: proposal
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create new proposal
// @route   POST /api/proposals
// @access  Private/Admin
const createProposal = async (req, res) => {
  try {
    const proposalData = req.body;

    // Generate unique proposal number PR-YYYY-XXX
    const year = new Date().getFullYear();
    const count = await Proposal.countDocuments({ 
      createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } 
    });
    const proposalNumber = `PR-${year}-${String(count + 1).padStart(3, '0')}`;

    const proposal = await Proposal.create({
      ...proposalData,
      proposalNumber
    });

    res.status(201).json({
      success: true,
      data: proposal
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update proposal
// @route   PATCH /api/proposals/:id
// @access  Private/Admin
const updateProposal = async (req, res) => {
  try {
    let proposal = await Proposal.findById(req.params.id);
    
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    if (proposal.status !== 'DRAFT') {
      return res.status(400).json({ success: false, message: 'Can only update proposals in DRAFT status' });
    }

    proposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: proposal
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update proposal status
// @route   PATCH /api/proposals/:id/status
// @access  Private/Admin
const updateProposalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const proposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    res.json({
      success: true,
      data: proposal
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Delete proposal
// @route   DELETE /api/proposals/:id
// @access  Private/Admin
const deleteProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    await proposal.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Generate and download PDF
// @route   GET /api/proposals/:id/pdf
// @access  Private/Admin
const getProposalPdf = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${proposal.proposalNumber}.pdf`);

    await generateProposalPdf(proposal, res);
    
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error generating PDF', error: error.message });
  }
};

module.exports = {
  getProposals,
  getProposal,
  createProposal,
  updateProposal,
  updateProposalStatus,
  deleteProposal,
  getProposalPdf
};
