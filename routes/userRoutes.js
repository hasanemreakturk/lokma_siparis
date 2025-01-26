const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Kullanıcı Kaydı Sayfasını Getir
router.get('/register', userController.getRegisterForm);

// Kullanıcı Kaydı Yap
router.post('/register', userController.registerUser);

router.get('/login', userController.getLoginForm);

// Giriş yap
router.post('/login', userController.loginUser);

// Çıkış yap
router.get('/logout', userController.logoutUser);

module.exports = router;
