// controllers/userController.js
const User = require('../models/User');

// Get all users
exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// Create a user
exports.createUser = async (req, res) => {
  let { itkey, type } = req.body;
  if (itkey === 'admin') {
    type = 'admin'
  } else {
    type ='employee'
  }
  try {
    const user = await User.findOne({
        itkey, type
    });
    if (user) res.json(user);
    else {
        const newUser = new User({ itkey, type });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) res.json(user);
  else res.status(404).json({ error: 'User not found' });
};

// Delete user
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (user) res.json({ message: 'User deleted' });
  else res.status(404).json({ error: 'User not found' });
};
