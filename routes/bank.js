const router = require("express").Router();
const Bank = require("../models/bank_schema");
const User = require("../models/user_schema");

// code to get all bank details from database
router.get("/", async (req, res) => {
    try {
        const bankdetails = await Bank.find();
        res.json(bankdetails);
    } catch (error) {
        res.status(500).json({ message: "error in getting bank details" });
    }
});


// code to get all bank details from database
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const bankdetails = await Bank.findById(id);
        return res.json(bankdetails);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

//  code to post bank details with token
router.patch("/:id", async (req, res) => {
    try {
        const token = req.cookies.token || req.headers["token"];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { id } = decoded;
        const UserData = await User.findById(id);

        if (UserData == null) {
            return res.status(404).json({ message: "user not found" });
        }

        const bankdetails = await Bank.findById(UserData.bank);
        if (bankdetails == null) {
            return res.status(404).json({ message: "bank details not found" });
        }

        const updatedBank = await Bank.findByIdAndUpdate(UserData.bank, req.body, { new: true })
        res.json({
            bank: updatedBank,
            message: "bank details updated"
        });

    } catch (error) {
        res.status(500).json({ message: "error in posting bank details" });
    }
});


module.exports = router;
