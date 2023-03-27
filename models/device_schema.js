const {model, Schema} = require("mongoose");

const DeviceSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    device_name: {
        type: String,
        required: true
    },
    imei_no: {
        type: String,
        required: true,
        unique: true
    },
    serial_number: {
        type: String,
        required: true,
    },
    mac_address: {
        type: String,
        required: true,
    },
    device_price: {
        type: Number,
        required: true
    },
    device_image: {
        type: String,
        required: true
    },
    device_status: {
        type: String,
        default: "enrolled",
        enum: ["enrolled", "locked", "removed"]
    },

}, {timestamps: true});

module.exports = model("Device", DeviceSchema);



