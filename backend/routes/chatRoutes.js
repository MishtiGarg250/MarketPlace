const express = require('express');
const router = express.Router();
const { 
  startConversation, 
  getUserConversations, 
  getConversationMessages, 
  sendMessage,
  // Legacy support
  getChatSellers,
  getChatMessages
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

// Start or get conversation for a product
router.post('/conversation/:productId', protect, startConversation);

// Get all conversations for current user (buyer perspective)
router.get('/conversations', protect, getUserConversations);

// Get messages for a specific conversation
router.get('/conversation/:conversationId/messages', protect, getConversationMessages);

// Send a message in a conversation (REST fallback)
router.post('/conversation/:conversationId/message', protect, sendMessage);

// Debug endpoint to list all conversations
router.get('/debug/all', async (req, res) => {
  try {
    const { Conversation } = require('../models/Chat');
    const conversations = await Conversation.find({})
      .populate('productId', 'name')
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email')
      .sort({ updatedAt: -1 });
    
    const debug = conversations.map(conv => ({
      id: conv._id,
      product: conv.productId.name,
      buyer: conv.buyerId.name,
      seller: conv.sellerId.name,
      messageCount: conv.messages.length,
      lastMessage: conv.lastMessage?.content || 'none'
    }));
    
    res.json({ conversations: debug });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint for seller conversations (no auth)
router.get('/debug/seller/:sellerId', async (req, res) => {
  try {
    const { Conversation } = require('../models/Chat');
    const { sellerId } = req.params;
    
    console.log(`[DEBUG] Looking for conversations for seller: ${sellerId}`);
    
    const conversations = await Conversation.find({ sellerId })
      .populate('productId', 'name images')
      .populate('buyerId', 'name email')
      .populate('sellerId', 'name email')
      .sort({ updatedAt: -1 });
    
    console.log(`[DEBUG] Found ${conversations.length} conversations for seller ${sellerId}`);
    
    res.json({ conversations });
  } catch (error) {
    console.error('[DEBUG] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Legacy routes for backward compatibility
router.get('/sellers', protect, getChatSellers);
router.get('/messages/:sellerId', protect, getChatMessages);
router.post('/messages/:sellerId', protect, sendMessage);

module.exports = router;
