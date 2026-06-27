const express = require('express');
const {
    getTrashItems,
    restoreItem,
    permanentDelete,
    bulkRestore,
    bulkDelete,
    exportTrashItems
} = require('../controllers/recycleBinController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));

router.route('/')
    .get(getTrashItems);

router.route('/export')
    .get(exportTrashItems);

router.route('/bulk-restore')
    .post(bulkRestore);

router.route('/bulk-delete')
    .post(bulkDelete);

router.route('/restore/:module/:id')
    .put(restoreItem);

router.route('/permanent/:module/:id')
    .delete(permanentDelete);

module.exports = router;
