const router = require('express').Router();
const { getAuthUser } = require('../config/authorizer');
const Device = require('../models/device_schema');

router.get('/', getAuthUser, async (req, res) => {
    try {
        if (req.user.role !== 'seller') {
            return res.json({ message: 'You are not authorized.' });
        }
        const devices = await Device.find({
            seller: req.user._id,
        });
        res.json(devices);
    } catch (err) {
        res.json({ message: err.message });
    }
});

router.post('/', getAuthUser, async (req, res) => {
    try {
        if (req.user.role !== 'seller') {
            return res.json({ message: 'You are not authorized.' });
        }

        const device = new Device({
            user: req.body.user,
            seller: req.user._id,
            imei_no: req.body.imei_no,
            device_name: req.body.device_name,
            device_type: req.body.device_type,
            device_model: req.body.device_model,
            device_price: req.body.device_price,
            device_image: req.body.device_image,
            device_status: req.body.device_status || "enrolled",
        });

        const newDevice = await device.save();
        res.json(newDevice);
    } catch (err) {
        res.json({ message: err.message });
    }
});


router.get("/count", getAuthUser, async (req, res) => {
    try {

        const user = req.user;
        if (user.role !== "seller") {
            return res.json({ message: "You are not authorized." });
        }
        const all_device = await Device.find({ seller: user._id }).countDocuments();

        return all_device;
    } catch (error) {
        return res.json({ message: error.message });
    }
})



module.exports = router;