const express = require("express");
const router = express.Router();

const emi_schema = new mongoose.Schema({
  // code to create schema for emi
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userSignup",
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
  monthly_emi: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("emi", emi_schema);
