const mongoose = require('mongoose');

const promptSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        unique: true
    },
    usageCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Prompt', promptSchema);