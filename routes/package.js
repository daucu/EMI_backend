const router = require('express').Router();
const Package = require('../models/package_schema');

router.get('/', async (req, res) => {
    try {
        const packages = await Package.find();
        res.json({
            message: 'Package details fetched successfully',
            packages
        });
    } catch (error) {
        res.status(500).json({ message: 'error in getting package details' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const packageData = await Package.findById(id).populate([
            {
                path: 'user_id'
            },
            {
                path: 'package'
            }
        ])
        res.json({
            message: 'Package details fetched successfully',
            package: packageData
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
})

// add new package 
router.post('/', async (req, res) => {
    try {
        const newPackage = new Package(req.body);
        const savedPackage = await newPackage.save();
        res.json({
            message: 'Package added successfully',
            package: savedPackage
        });
        
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// update package
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const updatePackage = await Package.findByIdAndUpdate(id, req.body, { new: true });
        res.json({
            message: 'Package updated successfully',
            package: updatePackage
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// delete package
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const getPackage = await Package.findOne({_id: id, status: "completed" });
        const cancelledPackage = await Package.findOne({_id: id, status: "cancelled" });

        if(!getPackage || !cancelledPackage){
            return res.status(400).json({
                message: "Package delivery is not completed or cancelled yet."
            });
        }

        const deletePackage = await Package.findByIdAndDelete(id);
        res.json({
            message: 'Package deleted successfully',
            package: deletePackage
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});



        const deletePackage = await Package.findByIdAndDelete(id);


module.exports = router;