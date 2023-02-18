require("dotenv").config();
const mongoose = require("mongoose");

// schema
const user_sehema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    reqired: true,
  },

  address: {
    type: String,
    reqired: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    reqired: true,
  },
  age: {
    type: String,
    reqired: true,
  },
  role: {
    type: String,
    reqired: true,
  },
  image: {
    type: String,
  },

  bank_name: {
    type: String,
    required: true,
  },
  account_name: {
    type: String,
    required: true,
  },
  account_number: {
    type: String,
    required: true,
  },
  account_type: {
    type: String,
    required: true,
  },
  pan_card: {
    type: String,
    required: true,
  },
  ifsc_code: {
    type: String,
    required: true,
  },
  branch_name: {
    type: String,
    required: true,
  },
  branch_address: {
    type: String,
    required: true,
  },
  branch_city: {
    type: String,
    required: true,
  },
  branch_state: {
    type: String,
    required: true,
  },
  branch_pincode: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("users", user_sehema);
