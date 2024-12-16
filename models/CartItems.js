const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  title: String,
  price: String,
  size: String,
  quantity: Number,
  image: String
});

module.exports = mongoose.model('CartItem', CartItemSchema);