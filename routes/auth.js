const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/student/signup', authController.studentSignup);
router.post('/student/signin', authController.studentSignin);
router.post('/admin/signin', authController.adminSignin);

// WILL ADD THE GOOGLE AUTH LATER
// router.get('/google', authController.googleAuth);
// router.get('/google/callback', authController.googleCallback);
router.post('/phone/signup', authController.phoneSignup);
router.post('/phone/verify', authController.verifyOTP);

module.exports = router; 
