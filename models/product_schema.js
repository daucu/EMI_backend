const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const product_schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("product", product_schema);
