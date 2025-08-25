const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  SKU: { type: String, unique: true },
  category: String,
  images: [
        {
            url: { type: String },
            alt: { type: String, default: "Product Image" }
        }
    ],
  quantity: { type: Number, default: 1 },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
