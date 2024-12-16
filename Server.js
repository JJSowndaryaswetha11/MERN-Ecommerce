const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/User');
const CartItem = require('./models/CartItems'); 
require('dotenv').config();


const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));
  
 

// Cart Routes
app.get('/api/cart', async (req, res) => {
  try {
    const items = await CartItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cart', async (req, res) => {
  const newItem = new CartItem(req.body);
  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE route to remove an item from the cart
app.delete('/api/cart/:id', async (req, res) => {
  try {
    const result = await CartItem.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted' });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT route to update an item in the cart
app.put('/api/cart/:id', async (req, res) => {
  try {
    const updatedItem = await CartItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User Registration Route
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
  
    console.log('Received registration request:', req.body);
  
    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
  
      // Create new user (password is stored as plaintext)
      const newUser = new User({ username, email, password });
  
      // Save the user to the database
      const savedUser = await newUser.save();
  
      console.log('Saved user:', savedUser);
  
      res.status(201).json({
        message: 'User successfully registered',
        user: savedUser,
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: error.message || 'Server error' });
    }
  });
  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      if (user.password !== password) {
        return res.status(400).json({ error: 'Incorrect password' });
      }
  
      res.json({ message: 'Login successful', user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
