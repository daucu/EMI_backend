const express = require("express");
const router = express.Router();
const User_Schema = require("../models/user_schema");
const bcryptjs = require("bcryptjs");
const Bank = require("../models/bank_schema");


// create user
router.post("/", SignupValidation, async (req, res) => {

    // hashing password
    const salt = await bcryptjs.genSalt();
    const hashed_password = await bcryptjs.hash(req.body.password, salt);

    const initBank = new Bank();

    await initBank.save();


    const user = new User_Schema({
      name: req.body.name,
      username: req.body.username,
      phone: req.body.phone,
      address: req.body.address,
      email: req.body.email,
      password: hashed_password,
      age: req.body.age || "",
      image: req.body.image || "",
      role: req.body.role || "user",
      bank: initBank._id,
    });

    try {
      const newUser = await user.save();
      res.json(newUser);
    } catch (error) {
      res.status(500).json({ message: error.message, status: "error" });
    }
  }
);


// middleware for register user validation
async function SignupValidation(req, res, next) {
  // check if user exist
  const user = await User_Schema.findOne({ email: req.body.email });
  if (user)
    return res
      .status(400)
      .json({ message: "User already exists", status: "error" });

  // check email is valid
  const email = req.body.email;
  const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!email_regex.test(email))
    return res
      .status(400)
      .json({ message: "Email is not valid ", status: "error" });

  //Check username is valid
  const username = req.body.username;
  const username_regex = /^[a-zA-Z0-9]{3,20}$/;
  if (!username_regex.test(username))
    return res.status(400).json({
      message: "Username is not valid",
      status: "error",
    });

  //Check Phone Number is valid
  if (req.body.phone) {
    const phone = req.body.phone;
    const phone_regex = /^[0-9]{10}$/;
    if (!phone_regex.test(phone))
      return res.status(400).json({
        message: "Phone Number is not valid",
        status: "error",
      });
  }


  next();
}

module.exports = router;
