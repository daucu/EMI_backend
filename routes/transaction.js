const router = require('express').Router();

const { getAuthUser } = require('../config/authorizer');
const Transaction = require('../models/transaction_schema');


router.get('/', async (req, res) => {
    try {
        const transaction = await Transaction.find();
        res.json({
            message: 'Transaction details fetched successfully',
            transaction
        });
    } catch (error) {
        res.status(500).json({ message: 'error in getting transaction details' });
    }
});

router.get('/id/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findById(id).populate([
            {
                path: 'user_id'
            },
            {
                path: 'product_id'
            },
            {
                path: 'emi_id'
            }
        ])

        res.json({
            message: 'Transaction details fetched successfully',
            transaction
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const newTransaction = new Transaction(req.body);
        const savedTransaction = await newTransaction.save();
        res.json({
            message: 'Transaction added successfully',
            transaction: savedTransaction
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
        const deletedTransaction = await Transaction.findByIdAndDelete(id);

        res.json({
            message: 'Transaction deleted successfully',
            transaction: deletedTransaction
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

});

router.get("/seller", getAuthUser ,async (req, res) => {
    try {
        const user = req.user;

        if(user.role !== "seller"){
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        const transaction = await Transaction.find({ seller: user._id }).populate([
            {
                path: 'user_id'
            },
            {
                path: 'device_id'
            },
            {
                path: 'emi_id'
            }
        ]);

        res.json({
            message: 'Transaction details fetched successfully',
            transaction
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})




module.exports = router;
