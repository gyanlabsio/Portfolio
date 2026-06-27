const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  quotationNumber: {
    type: String,
    required: true,
    unique: true
  },
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: false
  },
  clientName: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    required: true
  },
  company: {
    type: String
  },
  projectTitle: {
    type: String,
    required: true
  },
  projectDescription: {
    type: String
  },
  clientAddress: {
    type: String
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  discountType: {
    type: String,
    enum: ['PERCENTAGE', 'FLAT'],
    default: 'FLAT'
  },
  tax: {
    type: Number,
    required: true,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  validUntil: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['DRAFT', 'SENT', 'VIEWED', 'ACCEPTED', 'REJECTED', 'EXPIRED'],
    default: 'DRAFT'
  },
  notes: {
    type: String
  },
  termsAndConditions: {
    type: String
  },
  useGlobalTerms: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quotation', quotationSchema);
