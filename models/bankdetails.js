const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const BankDetails = new mongoose.Schema({
 
});

module.exports = mongoose.model("bankdetails", BankDetails);
