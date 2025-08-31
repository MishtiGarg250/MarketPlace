const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ASSIGNMENT_SEED = process.env.ASSIGNMENT_SEED;
const ADMIN_EMAIL = process.env.EMAIL;
const ADMIN_USERNAME = process.env.USERNAME;
const ADMIN_PASSWORD = process.env.PASSWORD;

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  
  let type = 'Buyer';
  if (role === 'seller') type = 'Seller';
  if (role === 'admin') type = 'Admin';

  try {
    if (role === 'admin') {
      // Only allow admin registration if credentials match .env
      if (email !== ADMIN_EMAIL || name !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        return res.status(403).json({ msg: 'Only the configured admin can register as admin.' });
      }
      // Check if admin already exists
      const existing = await User.findOne({ email, role });
      if (existing) {
        return res.status(400).json({ msg: `A user with this email is already registered as a ${role}.` });
      }
      const user = await User.create({ name, email, passwordHash, role, type });
      return res.status(201).json({ msg: 'Admin user created', userId: user._id });
    }
    // Non-admin registration
    const existing = await User.findOne({ email, role });
    if (existing) {
      return res.status(400).json({ msg: `A user with this email is already registered as a ${role}.` });
    }
    const user = await User.create({ name, email, passwordHash, role, type });
    res.status(201).json({ msg: 'User created', userId: user._id });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  if (!role) return res.status(400).json({ msg: 'Role is required (buyer, seller, or admin)' });

  // Admin login: only allow .env credentials, use ASSIGNMENT_SEED for JWT
  if (role === 'admin') {
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(403).json({ msg: 'Invalid admin credentials.' });
    }
    // Find admin user
    const user = await User.findOne({ email, role });
    if (!user) return res.status(400).json({ msg: 'Admin user not found.' });
    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      ASSIGNMENT_SEED,
      { expiresIn: '1d' }
    );
    return res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  }


  const user = await User.findOne({ email, role });
  if (!user) return res.status(400).json({ msg: 'Invalid credentials or role' });

  const match = await user.comparePassword(password);
  if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};
