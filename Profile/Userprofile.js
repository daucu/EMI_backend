const express = require("express");
const router = express.Router();
const Register_Models = require("../models/UserSignup");
const JWT = require("jsonwebtoken");

require("dotenv").config();

//  code to get profile data from database
router.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    const user = await Register_Models.findOne({ _id: decoded.id });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
