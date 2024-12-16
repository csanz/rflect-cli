const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    entryCount: {
        type: Number,
        default: 0
    },
    lastSync: {
        type: Date,
        default: null
    },
    storagePreference: {
        type: String,
        enum: ['cloud', 'local', 'both'],
        default: 'local',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);