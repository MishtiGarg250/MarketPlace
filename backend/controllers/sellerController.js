const User = require("../models/User");
const Product = require("../models/Product");
const Review = require("../models/Review");
const Transaction = require("../models/Transaction");

// Get seller profile
exports.getSellerProfile = async (req, res) => {
  try {
    const seller = await User.findById(req.params.sellerId).select("-passwordHash");
    if (!seller || seller.role !== "seller") return res.status(404).json({ msg: "Seller not found" });
    res.json(seller);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Update seller profile (name, description, avatar, location, etc)
exports.updateSellerProfile = async (req, res) => {
  try {
    const seller = await User.findById(req.params.sellerId);
    if (!seller || seller.role !== "seller") return res.status(404).json({ msg: "Seller not found" });
    // Only allow editing by self or admin
    if (req.user.role !== "admin" && req.user.id !== seller.id) return res.status(403).json({ msg: "Forbidden" });
    const { name, description, avatar, location } = req.body;
    if (name) seller.name = name;
    if (description) seller.description = description;
    if (avatar) seller.avatar = avatar;
    if (location) seller.location = location;
    await seller.save();
    res.json({ msg: "Profile updated", seller });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get seller reviews
exports.getSellerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ seller: req.params.sellerId }).populate("buyer", "name");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get seller analytics (basic: total sales, total revenue, product count)
exports.getSellerAnalytics = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const products = await Product.find({ sellerId });
    const productIds = products.map(p => p._id);
    const orders = await Transaction.find({ "items.seller": sellerId, status: "success" });
    let totalSales = 0, totalRevenue = 0;
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.seller.toString() === sellerId) {
          totalSales += item.quantity;
          totalRevenue += item.price * item.quantity;
        }
      });
    });
    res.json({
      productCount: products.length,
      totalSales,
      totalRevenue
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get seller orders (all orders containing seller's products)
exports.getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const orders = await Transaction.find({ "items.seller": sellerId }).populate("buyer", "name");
    // Filter only items for this seller
    const sellerOrders = orders.map(order => ({
      ...order.toObject(),
      items: order.items.filter(item => item.seller.toString() === sellerId)
    })).filter(order => order.items.length > 0);
    res.json(sellerOrders);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};