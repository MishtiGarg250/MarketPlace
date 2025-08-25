const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true } 
    }
  ],
  subtotal: { type: Number, required: true },
  platformFee: { type: Number, default: 0 },
  total: { type: Number, required: true }, 
  status: { type: String, enum: ['success', 'failed', 'pending'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);

