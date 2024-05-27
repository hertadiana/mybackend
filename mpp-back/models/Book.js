const mongoose = require('mongoose');
const ReviewSchema = require('./Review');

class Book {
    constructor(id, title, author, releaseYear, reviews, userId) {
      this.id = id;
      this.title = title;
      this.author = author;
      this.releaseYear = releaseYear;
      this.reviews = reviews;
      this.userId = userId;
    }
}

module.exports = Book;
  