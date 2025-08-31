const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getSellerConversations } = require('../controllers/chatController');

// Get all conversations for a seller (seller dashboard)
router.get('/conversations', protect, getSellerConversations);

// Legacy route for backward compatibility
router.get('/messages', protect, getSellerConversations);

module.exports = router;
