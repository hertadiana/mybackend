const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    bookId: {
        type: String,
        required: true
    },
    reviewer: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

module.exports = ReviewSchema;

  