exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, contact, location } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name) user.name = name;
    if (email) user.email = email;
    if (contact) user.contact = contact;
    if (location) user.location = location;
    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const User = require('../models/User');
const Transaction = require('../models/Transaction');


exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; 

    const user = await User.findById(userId).select('-password'); 
    if (!user) return res.status(404).json({ message: 'User not found' });

    
    let purchases = await Transaction.find({ buyer: userId })
      .populate('items.productId', 'name images price')
      .populate('items.seller', 'name email');
    // Deduplicate purchases by _id
    purchases = purchases.filter((order, idx, arr) =>
      arr.findIndex(o => o._id.toString() === order._id.toString()) === idx
    );

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
