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
    console.log("[updateSellerProfile] req.user:", req.user);
    console.log("[updateSellerProfile] req.params.sellerId:", req.params.sellerId);
    const seller = await User.findById(req.params.sellerId);
    if (!seller) {
      console.log("[updateSellerProfile] Seller not found");
      return res.status(404).json({ msg: "Seller not found" });
    }
    if (seller.role !== "seller") {
      console.log("[updateSellerProfile] User is not a seller");
      return res.status(404).json({ msg: "User is not a seller" });
    }
    // Only allow editing by self or admin
    if (req.user.role !== "admin" && req.user.id !== seller.id) {
      console.log("[updateSellerProfile] Forbidden: req.user.id:", req.user.id, "seller.id:", seller.id);
      return res.status(403).json({ msg: "Forbidden: You can only edit your own seller profile." });
    }
  const { name, description, avatar, location } = req.body;
  if (typeof name !== 'undefined') seller.name = name;
  if (typeof description !== 'undefined') seller.description = description;
  if (typeof avatar !== 'undefined') seller.avatar = avatar;
  if (typeof location !== 'undefined') seller.location = location;
    await seller.save();
    console.log("[updateSellerProfile] Profile updated successfully");
    res.json({ msg: "Profile updated", seller });
  } catch (err) {
    console.error("[updateSellerProfile] Server error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
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
    // Populate buyer and items.productId (with selected fields)
    const orders = await Transaction.find({ "items.seller": sellerId })
      .populate("buyer", "name")
      .populate({
        path: "items.productId",
        select: "name images rating reviews"
      });
    // Filter only items for this seller
    const sellerOrders = orders.map(order => {
      // For each item, only keep those for this seller
      const filteredItems = order.items.filter(item => item.seller.toString() === sellerId);
      // Return order with filtered items
      return {
        ...order.toObject(),
        items: filteredItems
      };
    }).filter(order => order.items.length > 0);
    res.json(sellerOrders);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};