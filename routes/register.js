const express = require("express");
const router = express.Router();
const User_Schema = require("../models/user_schema");
const bcryptjs = require("bcryptjs");
const Bank = require("../models/bank_schema");
const { getQRCode } = require("./qrcode");


// create user
router.post("/", SignupValidation, async (req, res) => {

  // hashing password
  const salt = await bcryptjs.genSalt();
  const hashed_password = await bcryptjs.hash(req.body.password, salt);

  const initBank = new Bank();
  await initBank.save();

  const user = new User_Schema({
    ...req.body,
    password: hashed_password,
    age: req.body.age || "",
    image: req.body.image || "",
    role: req.body.role || "user",
    bank: initBank._id,
    business_name: req.body.business_name || ""
  });

  if(req.body.role === "seller"){
    let qr_data = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    let qr_code = "";
    if (req.body.role === "seller") {
      qr_code = await getQRCode(req, qr_data);
    }
    user.qr_code = {
      name: qr_code.file_name,
      path: qr_code.file_path,
      url: qr_code.file_url,
    };
  };

  try {
    const newUser = await user.save();
    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(500).json({ message: error.message, status: "error" });
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

  // if password length is less than 6 characters
  if (req.body.password.length < 6)
    return res
      .status(400)
      .json({ message: "Password is too short", status: "error" });
    
      
  next();
}

module.exports = router;
