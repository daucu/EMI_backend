const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const sold_product_schema = new mongoose.Schema({
  // code to create schema for sold product
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
  quantity: {
    type: Number,
    required: true,
  },
  total_amount: {
    type: Number,
    required: true,
  },
  down_payment: {
    type: Number,
    required: true,
  },
  time_period: {
    type: Number,
    required: true,
  },
  interest_rate: {
    type: Number,
    required: true,
  },

  emi_amount: {
    type: Number,
    required: true,
  },

  emi_status: {
    type: String,
    required: true,
  },
  emi_start_date: {
    type: Date,
    required: true,
  },
  emi_end_date: {
    type: Date,
    required: true,
  },
  monthly_payment: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("SoldProduct", sold_product_schema);
