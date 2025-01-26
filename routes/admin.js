const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


router.get('/getStockData', adminController.getStockData);
router.get('/getMonthlySalesData', adminController.getMonthlySalesData);
router.get('/', adminController.renderAdminPage);

module.exports = router;
