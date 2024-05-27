const Book = require('../models/Book');
const BookModel = require('../models/BookModel');
const Review = require('../models/Review');
const ReviewModel = require('../models/ReviewModel');
const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');


// let books = [
//   new Book(uuidv4(), 'A Game of Thrones', 'George R. R. Martin', 1996),
//   new Book(uuidv4(), 'Caraval', 'Stephanie Garber', 2016),
//   new Book(uuidv4(), '1984', 'George Orwell', 1949),
//   new Book(uuidv4(), 'Carrie', 'Stephen King', 1974),
//   new Book(uuidv4(), 'The Hunger Games', 'Suzanne Collins', 2008),
//   new Book(uuidv4(), 'Kokoro', 'Natsume Sōseki', 1914)
// ];

module.exports = {
  // createRandomBook,

  getAllBooks: async (query) => {
    return await BookModel.find(query);
  },

  getBookById: async (id, userId) => {
    // return await BookModel.findOne({ id, userId });
    return await BookModel.findOne({ id });
  },

  createBook: async book => {
    // books.push(book);
    // console.log(book);

    return await BookModel.create(book);
  },

  updateBook: async (id, updatedBook) => {
    await BookModel.findOneAndUpdate({ id }, updatedBook, { new: true });

    return true;
  },

  deleteBook: async id => {
    return BookModel.findOneAndDelete({ id });
  }
};
