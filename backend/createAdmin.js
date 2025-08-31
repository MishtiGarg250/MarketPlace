// createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = "mongodb+srv://gargmishti9:WYoB9ekNbhYF3A5W@cluster0.dwrg43q.mongodb.net/";
const ADMIN_NAME = "gargmishti9";
const ADMIN_EMAIL = "gargmishti9@gmail.com";
const ADMIN_PASSWORD = "geekhaven"; // Plaintext from .env
const User = require('./models/User'); // Adjust path if needed

async function createAdmin() {
  await mongoose.connect(MONGODB_URI);
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  // Check if admin already exists
  const existing = await User.findOne({ email: ADMIN_EMAIL, role: 'admin' });
  if (existing) {
    console.log('Admin user already exists.');
    process.exit(0);
  }

  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    passwordHash,
    role: 'admin',
    type: 'Admin',
    status: 'Active'
  });

  console.log('Admin user created!');
  process.exit(0);
}

createAdmin();