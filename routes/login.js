const express = require("express");
const router = express.Router();
const User = require("../models/user_schema");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getAuthUser } = require("../config/authorizer")



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

    let userdata = user;
    delete userdata.password;
    delete userdata.otp;
    delete userdata.pin;

    res.status(200).json({
      message: "You have logged in successfully",
      status: "success",
      token: token,
      user: userdata,
      // user: res.locals.user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// check user is login or not
router.get("/check", getAuthUser, async (req, res) => {
  try {

    const user = req.user;

    if (!user) {
      return res.status(404).json({
        logged_in: false
      });
    }
    let userdata = user;
    delete userdata.password;
    delete userdata.otp;
    delete userdata.pin;

    res.status(200).json({
      logged_in: true,
      have_pin: user.have_pin,
      user: userdata
    });

  } catch (error) {
    res.json({
      message: error.message,
      status: "error",
      logged_in: false
    });
  }
});



// check pin 
router.post("/check/pin", getAuthUser, async (req, res) => {
  try {
    const { pin } = req.body;
    const user = await User.findById(req.user.id).lean();
    if (!user)
      return res
        .status(400)
        .json({ message: "User not found ", status: "warning" });


    if (user.role !== "seller") {
      return res
        .status(400)
        .json({ message: "You are not a seller ", status: "warning" });
    }

    if (user.pin !== pin) {
      return res
        .status(400)
        .json({ message: "PIN is Wrong", status: "warning" });
    }

    let userdata = user;
    delete userdata.password;
    delete userdata.otp;
    delete userdata.pin;

    res.status(200).json({
      message: "Pin is correct",
      status: "success",
      user: userdata
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});


// add  pin 
router.post("/add/pin", getAuthUser, async (req, res) => {
  try {
    const { pin } = req.body;
    const pin_valid = validatePin(pin);

    if (!pin_valid)
      return res
        .status(400)
        .json({ message: "Pin must be 4 digit", status: "warning" });
        
    const user = await User.findById(req.user.id).lean();
    if (!user)
      return res
        .status(400)
        .json({ message: "User not found ", status: "warning" });


    if (user.role !== "seller") {
      return res
        .status(400)
        .json({ message: "You are not a seller ", status: "warning" });
    }

    const update = await User.findByIdAndUpdate(req.user.id, { 
      pin: pin,
      have_pin: true 
    }, { new: true });

    let userdata = update;
    delete userdata.password;
    delete userdata.otp;
    delete userdata.pin;

    res.status(200).json({
      message: "Pin updated successfully",
      status: "success",
      user: userdata
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// change  pin 
router.post("/change/pin", getAuthUser, async (req, res) => {
  try {
    const { old_pin, new_pin } = req.body;
    const o_validpin = validatePin(old_pin);
    const n_validpin = validatePin(new_pin);

    if (!o_validpin && !n_validpin)
      return res
        .status(400)
        .json({ message: "Old Pin must be 4 digit", status: "warning" });

    const user = await User.findById(req.user.id).lean();
    if (!user)
      return res
        .status(400)
        .json({ message: "User not found ", status: "warning" });


    if (user.role !== "seller") {
      return res
        .status(400)
        .json({ message: "You are not a seller ", status: "warning" });
    }

    if (user.pin !== old_pin) {
      return res
        .status(400)
        .json({ message: "Old Pin is incorrect.", status: "warning" });
    }

    const update = await User.findByIdAndUpdate(req.user.id, { 
      pin: new_pin,
      have_pin: true 
    }, { new: true });

    let userdata = update;
    delete userdata.password;
    delete userdata.otp;
    delete userdata.pin;

    res.status(200).json({
      message: "Pin updated successfully",
      status: "success",
      user: userdata
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// change  pin 
router.delete("/remove/pin", getAuthUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user)
      return res
        .status(400)
        .json({ message: "User not found ", status: "warning" });


    if (user.role !== "seller") {
      return res
        .status(400)
        .json({ message: "You are not a seller ", status: "warning" });
    }

    const update = await User.findByIdAndUpdate(req.user.id, { 
      have_pin: false 
    }, { new: true });

    let userdata = update;
    delete userdata.password;
    delete userdata.otp;
    delete userdata.pin;

    res.status(200).json({
      message: "Pin updated successfully",
      status: "success",
      user: userdata
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
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

function validatePin(pin) {
  if(pin.length !== 4) {
    return false;
  }
  if(isNaN(pin)) {
    return false;
  }
  return true;
}

module.exports = router;
