const router = require('express').Router();
const { getAuthUser } = require('../config/authorizer');
const Device = require('../models/device_schema');

router.get('/', getAuthUser, async (req, res) => {
    try {
        let allDevices = [];
        if (req.user.role === 'admin') {
            allDevices = await Device.find().populate([
                {
                    path: 'seller',
                    select: 'name email',
                },
                {
                    path: 'user',
                    select: 'name email',
                },
            ]);
            return res.json(allDevices);
        }
        else if (req.user.role === 'seller') {
            allDevices = await Device.find({
                seller: req.user._id,
            });
            return res.json(allDevices);
        }
        return res.json({ message: 'You are not authorized.' });
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
            serial_number: req.body.serial_number,
            mac_address: req.body.mac_address,
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