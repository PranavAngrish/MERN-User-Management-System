const mongoose = require('mongoose')

const sleepSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  sleep: {
    type: String,
    required: true
  },
  wake: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Sleep', sleepSchema)