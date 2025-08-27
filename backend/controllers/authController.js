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
    const user = await User.create({ name, email, passwordHash, role, type });
    res.status(201).json({ msg: 'User created', userId: user._id });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

  const match = await user.comparePassword(password);
  if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({ token });
};
