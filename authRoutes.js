// routes/authRoutes.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body; // Changed 'name' to 'username'

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create new user (no password hashing for simplicity)
    const newUser = new User({
      username, // Store the username
      email,
      password, // Store password as plain text (not secure, consider hashing it)
    });

    // Save the user to the database
    await newUser.save();

    // Send success response
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login route
router.post('/login', (req, res) => {
  const { usernameOrEmail, password } = req.body;

  // Input validation
  if (!usernameOrEmail || !password) {
    return res.status(400).json({ error: 'Username/Email and password are required' });
  }

  // Find user by username or email
  User.findOne({ 
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] 
  })
    .then(user => {
      if (user) {
        // Compare the passwords directly (no hashing involved)
        if (user.password === password) {
          // Password matches, return success
          res.json({
            message: 'Login successful',
            user: {
              username: user.username,
              email: user.email,  // Returning email as well
            },
          });
        } else {
          // Password doesn't match
          res.status(400).json({ error: 'Incorrect password' });
        }
      } else {
        // No user found with that username or email
        res.status(400).json({ error: 'No user found with this username or email' });
      }
    })
    .catch(error => {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Server error' });
    });
});

module.exports = router;

