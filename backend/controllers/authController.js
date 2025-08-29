const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  // Set type field for consistency with role
  let type = 'Buyer';
  if (role === 'seller') type = 'Seller';
  if (role === 'admin') type = 'Admin';

  try {
    // Check if user with same email and role already exists
    const existing = await User.findOne({ email, role });
    if (existing) {
      return res.status(400).json({ msg: `A user with this email is already registered as a ${role}.` });
    }
    // Allow same email for different roles (buyer/seller)
    const user = await User.create({ name, email, passwordHash, role, type });
    res.status(201).json({ msg: 'User created', userId: user._id });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  if (!role) return res.status(400).json({ msg: 'Role is required (buyer or seller)' });
  // Find user by email and role
  const user = await User.findOne({ email, role });
  if (!user) return res.status(400).json({ msg: 'Invalid credentials or role' });

  const match = await user.comparePassword(password);
  if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  // Return user info for frontend display
  res.json({
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};
