const router = require('express').Router();
const User_Schema = require("../models/user_schema");
const jwt = require("jsonwebtoken");
const { getAuthUser } = require('../config/authorizer');

// get user
router.get("/", async (req, res) => {
    // res.json({ message: "Getting signup API" })
    try {
        const user = await User_Schema.find().populate([
            {
                path: "bank",

            }
        ])
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
router.get("/id/:id", async (req, res) => {
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

// get all users by seller 
router.get("/seller",getAuthUser, async (req, res) => {
    try {
        if(req.user.role !== "seller"){
            return res.json({message:"You are not authorized."});
        }

        const user = await User_Schema.find({ seller: req.user._id }).populate([
            {
                path: "bank",
            }
        ]);
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: error.message, status: "error" });
    }
});


module.exports = router;