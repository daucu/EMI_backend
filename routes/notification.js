const router = require('express').Router();
const Notification = require('../models/notification_schema');
const {getAuthUser} = require('../config/authorizer');

router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find();
        res.json({
            message: 'Notifications found',
            notifications
        });
    } catch (err) {
        res.json({ message: err });
    }
});

router.post('/',getAuthUser, async (req, res) => {
    const user = req.user;

    const notification = new Notification({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        user: user._id
    });
    try {
        const savedNotification = await notification.save();
        res.json({
            message: 'Notification created',
            notification: savedNotification
        });
    }
    catch (err) {
        res.json({ message: err });
    }
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const notification = await Notification.findById(id);
        res.json({
            message: 'Notification found',
            notification
        });
    }
    catch (err) {
        res.json({ message: err });
    }
});


router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const notification = await Notification.findByIdAndDelete(id);
        res.json({
            message: 'Notification deleted',
            notification
        });
    }
    catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;