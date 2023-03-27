const express = require("express");
const { getAuthUser } = require("../config/authorizer");
const router = express.Router();
require("dotenv").config();

//  code to get profile data from database
router.get("/",getAuthUser, async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
