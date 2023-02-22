const router = require('express').Router();
const { getAuthUser } = require('../config/authorizer');
const History = require('../models/history_schema');

router.get('/', getAuthUser, async (req, res) => {
    const user = req.user;
    let allhistory;
    if (user.role !== "admin") {
        allhistory = await History.find({});
    }
    else if (user.role !== "seller") {
        allhistory = await History.find({ user: user._id });
    } else {
        return res.json({ message: "You are not authorized to view this page" });
    }
    return res.json({
        history: allhistory,
        message: "History fetched successfully"
    });
});

router.post('/', getAuthUser, async (req, res) => {
    try {
        const user = req.user;
        
        
        if (user.role === "admin" || user.role === "seller") {
            
        }else{
            return res.json({ message: "You are not authorized to view this page" });
        }
        const history = new History({
            ...req.body,
            user: user._id
        });
        await history.save();
        return res.json({
            history,
            message: "History created successfully"
        });

    } catch (err) {
        return res.json({ message: err.message });
    }
});

router.delete('/:id', getAuthUser, async (req, res) => {
    try {
        const user = req.user;
        if (!user || user.role !== "admin") {
            return res.json({ message: "You are not authorized to view this page" });
        }

        const history = await History.findById(req.params.id);
        if (!history) {
            return res.json({ message: "History not found" });
        }
        await history.remove();
        return res.json({
            history,
            message: "History deleted successfully"
        });
    } catch (err) {
        return res.json({ message: err.message });
    }
});

module.exports = router;