const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: String,
  message: String,
  response: String,
  intent: String,
  feedback: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Chat', chatSchema);
