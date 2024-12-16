const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');

// POST route to add an item to the cart
router.post('/', async (req, res) => {
  const newItem = new CartItem(req.body);
  try {
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error saving item to cart:', error);
    res.status(400).json({ error: error.message });
  }
});

// GET route to fetch all cart items
router.get('/', async (req, res) => {
  try {
    const items = await CartItem.find();
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: error.message });
  }
});
// DELETE route to remove an item from the cart
router.delete('/:id', async (req, res) => {
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



module.exports = router;

