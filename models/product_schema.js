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
  },
  category: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  status: {
    type: String,
    required: true,
    default: "active",
  },
});

module.exports = mongoose.model("Product", product_schema);
