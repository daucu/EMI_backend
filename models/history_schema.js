const {Schema, model, default: mongoose} = require('mongoose');


const historySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'device',
        required: true,
        enum: ['device', 'user']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device'
    },
    action: {
        type: String,
        enum: ['create', 'update', 'delete']
    },
}, {
    timestamps: true
});

module.exports = model('History', historySchema);