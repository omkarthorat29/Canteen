const express = require('express');
const router = express.Router();
const canteenController = require('../controllers/canteenController');

router.post('/', canteenController.createOrUpdateRecord);
router.post('/admin-entry', canteenController.createOrUpdateRecordForAdmin);
router.get('/admin-entry', canteenController.getAdminEntries);
router.get('/by-date', canteenController.getAllRecords);


module.exports = router;
