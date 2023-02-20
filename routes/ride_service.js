const router = require('express').Router();
const Ride = require('../models/ride_schema');

router.get('/', async (req, res) => {
    try {
        const rides = await Ride.find();
        res.json({
            message: 'Ride details fetched successfully',
            rides
        });
    } catch (error) {
        res.status(500).json({ message: 'error in getting ride details' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const rideData = await Ride.findById(id).populate([
            {
                path: 'user_id'
            }
        ])
        res.json({
            message: 'Ride details fetched successfully',
            ride: rideData
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
})

// add new ride
router.post('/', async (req, res) => {
    try {
        const newRide = new Ride(req.body);
        const savedRide = await newRide.save();
        res.json({
            message: 'Ride added successfully',
            ride: savedRide
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// update ride
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const updateRide = await Ride.findByIdAndUpdate(id, req.body, { new: true });

        res.json({
            message: 'Ride updated successfully',
            ride: updateRide
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });

    }
});

// delete ride
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deleteRide = await Ride.findByIdAndDelete(id);

        res.json({
            message: 'Ride deleted successfully',
            ride: deleteRide
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });

    }
});

module.exports = router;