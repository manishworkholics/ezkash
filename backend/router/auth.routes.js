const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');


router.post('/register-vendor', authController.registerVendor);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/login', authController.login);


router.post('/forget-password', authController.forgotPassword);
router.post('/verify-otp-for-password', authController.verifyOtpForPasswordReset);
router.post('/reset-password', authController.resetPassword);


router.get('/get-all-vender', authController.getAllVender);
router.get('/get-venderById/:id', authController.getAllVenderId);

router.post('/change-password', authController.changePassword);

module.exports = router;
