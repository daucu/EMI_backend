const express = require("express");
const router = express.Router();
const User_Schema = require("../models/UserSignup");
const bcryptjs = require("bcryptjs");
const upload = require("../config/image_upload");

// get user
router.get("/", async (req, res) => {
  // res.json({ message: "Getting signup API" })
  try {
    const user = await User_Schema.find();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "error in getting user", status: "error" });
  }
});

// code to count all users
router.get("/count/alluser", async (req, res) => {
  try {
    const user = await User_Schema.find();
    res.json(user.length);
  } catch (error) {
    res.status(500).json({ message: "error in getting user", status: "error" });
  }
});

//  getting user by id from database
router.get("/:id", async (req, res) => {
  try {
    const user = await User_Schema.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "error in getting user", status: "error" });
  }
});

// update uniqueKey of user by getting user
router.patch("/update/:id", async (req, res) => {
  try {
    const user = await User_Schema.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "user not found" });
    }
    if (req.body.uniqueKey != null) {
      user.uniqueKey = req.body.uniqueKey;
    }
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// create user
router.post(
  "/",
  upload.single("picture"),
  SignupValidation,
  async (req, res) => {
    const url = req.protocol + "://" + req.get("host");
    console.log(req.body);

    // hashing password
    const salt = await bcryptjs.genSalt();
    const hashed_password = await bcryptjs.hash(req.body.password, salt);

    const user = new User_Schema({
      name: req.body.name,
      username: req.body.username,
      phone: req.body.phone,
      address: req.body.address,
      email: req.body.email,
      password: hashed_password,
      age: req.body.age,
      image: url + "/medias/" + req.file.filename,
      role: req.body.role,
      bank_name: req.body.bank_name,
      account_name: req.body.account_name,
      account_type: req.body.account_type,
      account_number: req.body.account_number,
      pan_card: req.body.pan_card,
      ifsc_code: req.body.ifsc_code,
      branch_name: req.body.branch_name,
      branch_address: req.body.branch_address,
      branch_city: req.body.branch_city,
      branch_state: req.body.branch_state,
      branch_pincode: req.body.branch_pincode,
    });

    try {
      const newUser = await user.save();
      res.json(newUser);
    } catch (error) {
      res.status(500).json({ message: error.message, status: "error" });
    }
  }
);
// code to update password of user by getting user id from database
router.patch("/update/password/:id", async (req, res) => {
  try {
    const user = await User_Schema.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "user not found" });
    }
    if (req.body.password != null) {
      // hashing password
      const salt = await bcryptjs.genSalt();
      const hashed_password = await bcryptjs.hash(req.body.password, salt);
      user.password = hashed_password;
    }
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

//  code to delete user by getting user id from database
router.delete("/delete/:id", async (req, res) => {
  try {
    const user = await User_Schema.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "user not found" });
    }
    await user.remove();
    res.json({ message: "user deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

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

  //check age
  if (req.body.age) {
    const age = req.body.age;
    const min_age = 18;
    if (age < min_age)
      return res.status(400).json({
        message: "You are not eligible because of your age is less than 18",
        status: "error",
      });
  }

  next();
}

module.exports = router;
