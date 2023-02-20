const router = require('express').Router();
const Activity = require('../models/activity_schema');

router.get('/', async (req, res) => {
    try {
        const activity = await Activity.find();
        res.json({
            message: 'Activity details fetched successfully',
            activity
        });
    } catch (error) {
        res.status(500).json({ message: 'error in getting activity details' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const activity = await Activity.findById(id).populate([
            {
                path: 'user_id'
            }
        ])
        
        res.json({
            message: 'Activity details fetched successfully',
            activity
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const newActivity = new Activity(req.body);
        const savedActivity = await newActivity.save();
        res.json({
            message: 'Activity added successfully',
            activity: savedActivity
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedActivity = await Activity.findByIdAndDelete(id);
        res.json({
            message: 'Activity deleted successfully',
            activity: deletedActivity
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


module.exports = router;