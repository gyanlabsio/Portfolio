const Quotation = require('../models/Quotation');
const QuotationItem = require('../models/QuotationItem');
const { generateQuotationPdf } = require('../utils/pdfService');

// @desc    Get all quotations
// @route   GET /api/quotations
// @access  Private/Admin
const getQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: quotations.length,
      data: quotations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single quotation
// @route   GET /api/quotations/:id
// @access  Private/Admin
const getQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }
    const items = await QuotationItem.find({ quotationId: quotation._id });
    
    res.json({
      success: true,
      data: {
        ...quotation.toObject(),
        items
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create new quotation
// @route   POST /api/quotations
// @access  Private/Admin
const createQuotation = async (req, res) => {
  try {
    const { items, tax = 0, ...quotationData } = req.body;

    // Generate unique quotation number QT-YYYY-XXX
    const year = new Date().getFullYear();
    const count = await Quotation.countDocuments({ 
      createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } 
    });
    const quotationNumber = `QT-${year}-${String(count + 1).padStart(3, '0')}`;

    // Calculate subtotal from items
    let subtotal = 0;
    const validatedItems = items.map(item => {
      const amount = Number(item.quantity) * Number(item.rate);
      subtotal += amount;
      return { ...item, amount };
    });

    const total = subtotal + Number(tax);

    const quotation = await Quotation.create({
      ...quotationData,
      quotationNumber,
      subtotal,
      tax: Number(tax),
      total
    });

    // Create items
    const itemsToCreate = validatedItems.map(item => ({
      ...item,
      quotationId: quotation._id
    }));
    await QuotationItem.insertMany(itemsToCreate);

    const savedItems = await QuotationItem.find({ quotationId: quotation._id });

    res.status(201).json({
      success: true,
      data: {
        ...quotation.toObject(),
        items: savedItems
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update quotation
// @route   PATCH /api/quotations/:id
// @access  Private/Admin
const updateQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    
    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }

    if (quotation.status !== 'DRAFT') {
      return res.status(400).json({ success: false, message: 'Can only update quotations in DRAFT status' });
    }

    const { items, tax, ...quotationData } = req.body;

    let newSubtotal = quotation.subtotal;
    let newTax = tax !== undefined ? Number(tax) : quotation.tax;

    // Update items if provided
    if (items && items.length > 0) {
      // Delete existing items
      await QuotationItem.deleteMany({ quotationId: quotation._id });
      
      newSubtotal = 0;
      const validatedItems = items.map(item => {
        const amount = Number(item.quantity) * Number(item.rate);
        newSubtotal += amount;
        return { ...item, amount, quotationId: quotation._id };
      });
      
      await QuotationItem.insertMany(validatedItems);
    }

    const newTotal = newSubtotal + newTax;

    const updatedQuotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      {
        ...quotationData,
        subtotal: newSubtotal,
        tax: newTax,
        total: newTotal
      },
      { new: true, runValidators: true }
    );

    const savedItems = await QuotationItem.find({ quotationId: quotation._id });

    res.json({
      success: true,
      data: {
        ...updatedQuotation.toObject(),
        items: savedItems
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update quotation status
// @route   PATCH /api/quotations/:id/status
// @access  Private/Admin
const updateQuotationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }

    res.json({
      success: true,
      data: quotation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Delete quotation
// @route   DELETE /api/quotations/:id
// @access  Private/Admin
const deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    
    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }

    await QuotationItem.deleteMany({ quotationId: quotation._id });
    await quotation.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Generate and download PDF
// @route   GET /api/quotations/:id/pdf
// @access  Private/Admin
const getQuotationPdf = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    
    if (!quotation) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }

    const items = await QuotationItem.find({ quotationId: quotation._id });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${quotation.quotationNumber}.pdf`);

    await generateQuotationPdf(quotation, items, res);
    
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error generating PDF', error: error.message });
  }
};

module.exports = {
  getQuotations,
  getQuotation,
  createQuotation,
  updateQuotation,
  updateQuotationStatus,
  deleteQuotation,
  getQuotationPdf
};
