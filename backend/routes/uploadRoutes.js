const express = require('express');
const router = express.Router();
const { upload, uploadSingle, uploadMultiple, deleteFile, getAllFiles, bulkDelete } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { uploadValidators } = require('../middleware/validators');

// All upload routes are protected admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllFiles);
router.post('/bulk-delete', bulkDelete);
router.post('/', upload.single('file'), uploadValidators.moduleCheck, validate, uploadSingle);
router.post('/multiple', upload.array('files', 10), uploadValidators.moduleCheck, validate, uploadMultiple);
router.delete('/:id', uploadValidators.id, validate, deleteFile);

module.exports = router;
