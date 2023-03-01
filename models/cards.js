const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minLength: 2,
    maxLength: 30,
  },
  link: {
    required: true,
    type: String,
  },
  owner: {
    required: true,
    type: ObjectId,
  },
  likes: {
    type: ObjectId,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

const Card = mongoose.model('card', cardSchema);

module.exports = Card;