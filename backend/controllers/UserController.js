const User = require('../models/User');
const Transaction = require('../models/Transaction');


exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; 

    const user = await User.findById(userId).select('-password'); 
    if (!user) return res.status(404).json({ message: 'User not found' });

    
    const purchases = await Transaction.find({ buyer: userId })
      .populate('items.productId', 'name images price')
      .populate('items.seller', 'name email');

    const sales = await Transaction.find({ 'items.seller': userId })
      .populate('items.productId', 'name images price')
      .populate('buyer', 'name email');

    res.json({
      user,
      purchases,
      sales
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
