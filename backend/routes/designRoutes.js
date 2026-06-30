const express = require('express');
const {
    getDesigns,
    getFeaturedDesigns,
    getDesign,
    createDesign,
    updateDesign,
    deleteDesign
} = require('../controllers/designController');

const router = express.Router();
const { protect } = require('../middleware/auth');

router
    .route('/')
    .get(getDesigns)
    .post(protect, createDesign);

router
    .route('/featured')
    .get(getFeaturedDesigns);

router
    .route('/:slug')
    .get(getDesign);
    
router
    .route('/:id')
    .put(protect, updateDesign)
    .delete(protect, deleteDesign);

module.exports = router;
