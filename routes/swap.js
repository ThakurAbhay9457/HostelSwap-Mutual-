const express = require('express');
const router = express.Router();
const swapController = require('../controllers/swapController');
const authMiddleware = require('../middlewares/auth');

router.post('/request', authMiddleware, swapController.requestSwap);
router.post('/accept', authMiddleware, swapController.acceptSwap);
router.get('/list', authMiddleware, swapController.listSwaps);

module.exports = router; 