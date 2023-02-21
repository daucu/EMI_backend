const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    device_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
    },
    emi_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Emi',
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    amount: {
        type: Number,
        required: true,
    },
    transaction_type: {
        type: String,
        required: true,
        default: 'online',
    },
    status: {
        type: String,
        required: true,
        default: 'pending',
    },
    transaction_mode: {
        type: String,
    },
    description: {
        type: String,
    },
    tracking_id: {
        type: String,
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Transaction', transactionSchema);