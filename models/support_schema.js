const { Schema, model } = require('mongoose');

const supportModel = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        default: 'seller-admin',
        enum: ['seller-admin', 'seller-user', 'admin-user']
    },
    status: {
        type: String,
        required: true,
        default: 'pending',
        enum: ['pending', 'resolved', 'rejected']
    }
}, {
    timestamps: true
});

const supportChatModel = new Schema({
    ticket: {
        type: Schema.Types.ObjectId,
        ref: 'Support',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    sent_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true
});


const Support = model('Support', supportModel);
const SupportChat = model('SupportChat', supportChatModel);
module.exports = {Support, SupportChat};