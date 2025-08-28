const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  SKU: { type: String, unique: true },
  category: String,
  condition: { type: String, enum: ['New', 'Used'], default: 'New' },
  location: String,
  images: [
    {
      url: { type: String },
      alt: { type: String, default: "Product Image" }
    }
  ],
  features: [{ type: String }], // Key features
  specifications: { type: Object }, // Specifications as key-value pairs
  quantity: { type: Number, default: 1 },
  isFeatured: { type: Boolean, default: false },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
