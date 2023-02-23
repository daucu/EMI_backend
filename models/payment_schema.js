const {Schema, model, SchemaTypes}  = require('mongoose');

const paymentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    tax_amount: {
        type: Number,
        required: true,
        default: 0
    },
    total_amount: {
        type: Number,
        default: function() {
            return this.amount + this.tax_amount;
        }
    },
    gst_no: {
        type: String,
    },
    paid_to: {
        type: SchemaTypes.ObjectId,
        required: true,
    },
    paid_by: {
        type: SchemaTypes.ObjectId,
        required: true
    },
    payment_mode: {
        type: String,
        required: true,
        default: 'upi',
        enum: ['upi', 'card', 'cash']
    },
    device_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Device'
    },
    status: {
        type: String,
        required: true,
        default: 'pending',
        enum: ['pending', 'success', 'failed']
    },
},
{
    timestamps: true
});

module.exports = model('Payment', paymentSchema);