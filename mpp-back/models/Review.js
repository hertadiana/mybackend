const mongoose = require('mongoose');

class Review {
    constructor(id, bookId, reviewer, rating, text, date) {
      this.id = id;
      this.bookId = bookId;
      this.reviewer = reviewer;
      this.rating = rating;
      this.text = text;
      this.date = date;
    }
}

module.exports =  Review;