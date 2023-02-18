const express = require("express");
const router = express.Router();
const User_Schema = require("../models/UserSignup");
require("dotenv").config();
const bcryptjs = require("bcryptjs");

router.get("/", (req, res) => {
    res.clearCookie("token")
    res.json({ message: "Logout Success", status: "success" })
})
module.exports = router;