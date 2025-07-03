const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');

router.post('/increase-rooms', authMiddleware, adminMiddleware, adminController.increaseRooms);
router.post('/decrease-rooms', authMiddleware, adminMiddleware, adminController.decreaseRooms);

module.exports = router; 