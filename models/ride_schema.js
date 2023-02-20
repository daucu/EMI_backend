const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rideSchema = new Schema({
    location: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
    },
    vehicle_type: {
        type: String,
        required: true,
        "enum": ["two-wheeler", "four-wheeler"]
    },
    status: {
        type: String,
        required: true,
        default: "active",
        "enum": ["active", "inactive", "completed", "cancelled"]
    },
    time_slot: {
        start_time: {
            type: String,
            required: true
        },
        end_time: {
            type: String,
            required: true
        }
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
       
}, 
{
    timestamps: true
});

module.exports = mongoose.model('Ride', rideSchema);
