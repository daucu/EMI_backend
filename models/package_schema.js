const {Schema, model} = require('mongoose');

const packageSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    address: {
        type: String,
    },
    delivery_date: {
        type: String,
    },
    delivery_time: {
        type: String,
    },
    status: {
        type: String,
        default: 'pending',
    },
    package: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product',
        }
    ],
    total_amount: {
        type: Number,
        required: true,
    },
    expected_delivery_date: {
        type: String,
    }
},{
    timestamps: true,
})

module.exports = model('Package', packageSchema);
