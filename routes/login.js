const express = require("express");
const router = express.Router();
const User = require("../models/user_schema");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");



router.post("/", validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await User.findOne({ email }).lean();
    if (!user)
      return res
        .status(400)
        .json({ message: "Email is wrong ", status: "warning" });

    const hash_psw = user.password;

    if (!bcryptjs.compareSync(password, hash_psw))
      return res
        .status(400)
        .json({ message: "Passord is wrong ", status: "warning" });

    // token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        bank: user.bank,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10d",
      }
    );

    // cookies
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      sameSite: "none",
      secure: true,
    });

    // set localstorage
    res.locals.user = {
      id: user._id,
      email: user.email,
      Headers: {
        token: token,
      },
    };

    res.status(200).json({
      message: "You have logged in successfully",
      status: "success",
      token: token,
      // user: res.locals.user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// check user is login or not
router.get("/check", (req, res) => {
  try {
    let token = req.cookies.token || req.headers.token;
    // console.log(token);
    const have_valid_token = jwt.verify(token, process.env.JWT_SECRET);

    // get user if from token
    const id_from_token = have_valid_token.id;

    // check same id have database
    const user_id = User.findById(id_from_token);
    if (user_id == undefined) {
      res.json(false);
    } else {
      res.json(true);
    }
  } catch (error) {
    res.json(false);
  }
});

// check valid token
router.get("/check_valid_token", (req, res) => {
  try {
    let token = req.cookies.token || req.headers.token;

    // console.log(token);
    const have_valid_token = jwt.verify(token, process.env.JWT_SECRET);
    res.json(true);
  } catch (error) {
    res.json(false);
  }
});

// check token id is same with user id
router.get("/checkLogin", (req, res) => {
  try {
    let token = req.cookies.token || req.headers.token;

    const have_valid_token = jwt.verify(token, process.env.JWT_SECRET);
    // get user id from token
    const id_from_token = have_valid_token.id;

    // check same id have same database
    const user_id = User.findById(id_from_token);
    if (user_id == undefined) {
      res.json(false);
    } else {
      res.json(true);
    }
  } catch (error) {
    res.json(false);
  }
});

function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Please provide email",
      status: "warning",
    });
  }
  if (!password) {
    return res.status(400).json({
      message: "Please provide password",
      status: "warning",
    });
  }

  next();

}

module.exports = router;
