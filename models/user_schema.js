require("dotenv").config();
const mongoose = require("mongoose");

// schema
const user_sehema = new mongoose.Schema({
  name: {
    type: String,
  },
  business_name: {
    type: String,
  },
  phone: {
    type: String,
  },
  otp: {
    type: String,
  },
  address: {
    type: String,
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
  },
  role: {
    type: String,
    reqired: true,
    default: "user",
  },
  image: {
    type: String,
  },
  bank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bank",
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  qr_code: {
    // type: mixed,
    type: mongoose.Schema.Types.Mixed,
  },
  pin: {
    type: String,
  },
  have_pin: {
    type: Boolean,
    required: true,
    default: false,
  },
},{
  timestamps: true,
});

module.exports = mongoose.model("User", user_sehema);
