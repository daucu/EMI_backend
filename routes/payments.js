const router = require('express').Router();
const Payment = require('../models/payment_schema');

router.get('/', async (req, res) => {
    try {
        const payments = await Payment.find();
        res.json(payments);
    } catch (err) {
        res.json({ message: err });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        res.json(payment);
    } catch (err) {
        res.json({ message: err });
    }
});

router.post('/', async (req, res) => {
    const payment = new Payment({
        title: req.body.title,
        description: req.body.description,
        amount: req.body.amount,
        tax_amount: req.body.tax_amount,
        gst_no: req.body.gst_no,
        paid_to: req.body.paid_to,
        paid_by: req.body.paid_by,
        payment_mode: req.body.payment_mode,
        device_id: req.body.device_id,
        status: req.body.status || "pending",
    });

    try {
        const savedPayment = await payment.save();
        res.json(savedPayment);
    } catch (err) {
        res.json({ message: err });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const removedPayment = await Payment.remove({ _id: req.params.id });
        res.json(removedPayment);
    } catch (err) {
        res.json({ message: err });
    }
});

router.patch('/:id', async (req, res) => {
    try {

        const updatedPayment = await Payment.updateOne(
            { _id: req.params.id },
            { ...req.body },
            { new: true }
        );
        return res.json(updatedPayment);
    } catch (err) {
        res.json({ message: err });
    }
});



module.exports = router;