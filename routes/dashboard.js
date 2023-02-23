const { getAuthUser } = require('../config/authorizer');

const router = require('express').Router();
const Device = require('../models/device_schema');
const Payment = require('../models/payment_schema');


router.get('/devices', getAuthUser, async (req, res) => {
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
            licence_keys = enrolled_devices + locked_devices + removed_devices;
            return res.json({ enrolled_devices, licence_keys, locked_devices, removed_devices });
        }
        else if (user.role !== "admin") {
            enrolled_devices = await Device.find({ device_status: "enrolled" }).countDocuments();
            locked_devices = await Device.find({ device_status: "locked" }).countDocuments();
            removed_devices = await Device.find({ device_status: "removed" }).countDocuments();
            licence_keys = enrolled_devices + locked_devices + removed_devices;
            return res.json({ enrolled_devices, licence_keys, locked_devices, removed_devices });
        }
        else {
            return res.json({ enrolled_devices, licence_keys, locked_devices, removed_devices });
        }
    } catch (err) {
        return res.json({ message: err.message });
    }
});

router.get('/payments', getAuthUser, async (req, res) => {
    try {
        const user = req.user;
        let pending_payments = 0;
        let success_payments = 0;
        let total_loan = 0;
        let total_payments = 0;

        if (user.role === "seller") {
            const pending_payments_data = await Payment.find({ paid_to: user._id, status: "pending" })
            const success_payments_data = await Payment.find({ paid_to: user._id, status: "success" })

            const total_loan_data = await Device.find({ seller: user._id, device_status: "enrolled" });
            
            total_loan = total_loan_data.reduce((a, b) => a + b.device_price, 0);
            pending_payments = pending_payments_data.reduce((a, b) => a + b.total_amount, 0);
            success_payments = success_payments_data.reduce((a, b) => a + b.total_amount, 0);
            
            total_payments = pending_payments + success_payments;
            return res.json({ pending_payments, success_payments, total_payments, total_loan });
        }
        else if (user.role === "admin") {
            const pending_payments_data = await Payment.find({ status: "pending" })
            const success_payments_data = await Payment.find({ status: "success" })
            const total_loan_data = await Device.find({ device_status: "enrolled" });
            
            total_loan = total_loan_data.reduce((a, b) => a + b.device_price, 0);
            pending_payments = pending_payments_data.reduce((a, b) => a + b.total_amount, 0);
            success_payments = success_payments_data.reduce((a, b) => a + b.total_amount, 0);
            
            total_payments = pending_payments + success_payments;
            return res.json({ pending_payments, success_payments, total_payments, total_loan });
        }
        else {
            return res.json({ pending_payments, success_payments, total_payments, total_loan });
        }
    } catch (err) {
        return res.json({ message: err.message });
    }
});




module.exports = router;