const express = require('express');
const router = express.Router();
const imalathaneController = require('../controllers/imalathaneController');

router.get('/', imalathaneController.getImalathanePage);
router.get('/filter', imalathaneController.getFilteredOrders);

router.post('/production', imalathaneController.saveProduction);

module.exports = router;

