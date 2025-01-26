const express = require('express');
const router = express.Router();
const siparisController = require('../controllers/siparisController');

router.get('/', siparisController.renderSiparis);
router.get('/tumSiparisler', siparisController.renderAllOrders);

router.post('/onayla', siparisController.handleSubmitOrders);
router.post('/tatliKaydet', siparisController.handleTatliSiparis);
router.post('/pastaKaydet', siparisController.handlePastaSiparis);
router.post('/cesitKaydet', siparisController.handleCesitSiparis); // Çeşit siparişlerini kaydetmek için
router.post('/siparisGonder', siparisController.sendOrdersToDaily);

module.exports = router;
