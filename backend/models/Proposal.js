const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  proposalNumber: {
    type: String,
    required: true,
    unique: true
  },
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead'
  },
  quotationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quotation'
  },
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  clientEmail: {
    type: String,
    required: [true, 'Client email is required'],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  projectTitle: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  executiveSummary: {
    type: String,
    required: [true, 'Executive summary is required']
  },
  problemStatement: {
    type: String,
    required: [true, 'Problem statement is required']
  },
  objectives: {
    type: String,
    required: [true, 'Objectives are required']
  },
  scopeOfWork: {
    type: String,
    required: [true, 'Scope of work is required']
  },
  deliverables: {
    type: String,
    required: [true, 'Deliverables are required']
  },
  timeline: {
    type: String,
    required: [true, 'Timeline is required']
  },
  assumptions: {
    type: String,
    required: [true, 'Assumptions are required']
  },
  pricingSummary: {
    type: String,
    required: [true, 'Pricing summary is required']
  },
  status: {
    type: String,
    enum: ['DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'REJECTED', 'EXPIRED'],
    default: 'DRAFT'
  },
  validUntil: {
    type: Date,
    required: [true, 'Valid until date is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Proposal', proposalSchema);
