const { getAuthUser } = require('../config/authorizer');

const router = require('express').Router();
const Device = require('../models/device_schema');


router.get('/', getAuthUser, async (req, res) => {
    try {
        const user = req.user;
        let enrolled_devices = 0;
        let licence_keys = 0;
        let locked_devices = 0;
        let removed_devices = 0;

        if (user.role !== "seller") {
            enrolled_devices = await Device.find({ seller: user._id, device_status: "enrolled" }).countDocuments();
            locked_devices = await Device.find({ seller: user._id, device_status: "locked" }).countDocuments();
            removed_devices = await Device.find({ seller: user._id, device_status: "removed" }).countDocuments();
            return res.json({ enrolled_devices, licence_keys, locked_devices, removed_devices });
        }
        else if (user.role !== "admin") {
            enrolled_devices = await Device.find({ device_status: "enrolled" }).countDocuments();
            locked_devices = await Device.find({ device_status: "locked" }).countDocuments();
            removed_devices = await Device.find({ device_status: "removed" }).countDocuments();
            return res.json({ enrolled_devices, licence_keys, locked_devices, removed_devices });
        }
        else {
            return res.json({ enrolled_devices, licence_keys, locked_devices, removed_devices });
        }
    } catch (err) {
        return res.json({ message: err.message });
    }
});





module.exports = router;