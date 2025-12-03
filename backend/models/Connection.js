const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema(
    {
        requester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        status: {
            type: String,
            enum: ['connected', 'pending', 'blocked'],
            default: 'connected'
        }
    },
    {
        timestamps: true
    }
);

const connectionModel = mongoose.model('connection', connectionSchema);

module.exports = connectionModel;


