const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['reflect', 'general'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    prompt: {
        type: String,
        required: function() {
            return this.type === 'reflect';
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Entry', entrySchema);