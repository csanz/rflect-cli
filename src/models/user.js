const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  entryCount: {
    type: Number,
    default: 0,
  },
  storagePreference: {
    type: String,
    enum: ['cloud', 'local', 'both'],
    default: 'local',
    required: true,
  },
  streaks: {
    current: { type: Number, default: 0 },
    best: { type: Number, default: 0 },
    lastEntry: { type: Date }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('User', userSchema);
