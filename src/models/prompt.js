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
    category: {
        type: String,
        enum: ['question', 'quote', 'gratitude', 'growth', 'mindfulness'],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Prompt', promptSchema);