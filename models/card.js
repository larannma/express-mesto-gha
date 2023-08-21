const mongoose = require('mongoose');

const cardShema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlenght: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardShema);
