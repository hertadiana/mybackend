const mongoose = require('mongoose');
const ReviewSchema = require('./ReviewModel');

const BookSchema = new mongoose.Schema({
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    releaseYear: {
      type: Number,
      required: true
    },
    reviews: [ReviewSchema],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  });

module.exports = mongoose.model('Book', BookSchema);
  