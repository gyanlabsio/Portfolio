const mongoose = require('mongoose');

const quotationItemSchema = new mongoose.Schema({
  quotationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quotation',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity must be non-negative']
  },
  rate: {
    type: Number,
    required: true,
    min: [0, 'Rate must be non-negative']
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount must be non-negative']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('QuotationItem', quotationItemSchema);
