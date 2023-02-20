const {Schema, model} = require('mongoose');

const activitySchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,

    },
    description: {
        type: String,
    },
    status: {
        type: String,
        default: 'active',
    }
},{
    timestamps: true,
})

module.exports = model('Activity', activitySchema);