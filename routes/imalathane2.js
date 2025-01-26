const express = require('express');
const router = express.Router();
const imalathane2Controller = require('../controllers/imalathane2Controller');

router.get('/', imalathane2Controller.getImalathane2Page);
router.get('/products', imalathane2Controller.getProductsByCategory);
router.post('/save', imalathane2Controller.saveSelectedProduction);

module.exports = router;
