const router = require("express").Router();
const EMI = require("../models/emi_schema");

router.get("/", async (req, res) => {
    try {
    const allEMI = await EMI.find();
    return res.json(allEMI);
    
} catch (error) {
    return res.status(500).json({
        message: error.message,
    });
    }
});

module.exports = router;