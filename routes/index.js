const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController'); // Controller dosyasını dahil et

// Ana Sayfa Rotası
router.get('/', indexController.renderIndex);

module.exports = router;
