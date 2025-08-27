const User = require('../models/User');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');


exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Transaction.countDocuments();
    const totalRevenue = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    res.json({
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching stats' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching users' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching products' });
  }
};
