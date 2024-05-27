const Book = require('../models/Book');
const repository = require('../repositories/bookRepository');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

module.exports = {
  createRandomBook: () => {
    return repository.createBook(repository.createRandomBook());
  },

  getAllBooks: async (req, res) => {
    // const token = req.header('Authorization').split(' ')[1];

    // const decoded = jwt.verify(token, 'jwtSecret');

    // const userId = decoded.id;

    const books = await repository.getAllBooks({});
  
    return res.json(books);
  },

  
  validateGetBookById: (req, res, next) => {
    if (req.params.id.length !== 36) {
      return res.status(400).send('Invalid ID');
    }

    return next();
  },
  
  getBookById: async (req, res) => {
    const id = req.params.id;
    const token = req.header('Authorization').split(' ')[1];

    const decoded = jwt.verify(token, 'jwtSecret');

    const userId = decoded.id;

    const book = await repository.getBookById(id, userId);

    if (book) {
      return res.json(book);
    } else {
      return res.status(404).send('Book not found');
    }
  },

  validateCreateOrUpdateBook: (req, res, next) => {
    if (!req.body.title) {
      return res.status(400).send('A title is required');
    }

    if (!req.body.author) {
      return res.status(400).send('An author is required');
    }

    if (!req.body.releaseYear) {
      return res.status(400).send('A release year is required');
    }

    return next();
  },

  createBook: async (req, res) => {
    const { title, author, releaseYear } = req.body;

    // const id = req.params.id;
    const token = req.header('Authorization').split(' ')[1];

    const decoded = jwt.verify(token, 'jwtSecret');

    const userId = decoded.id;

    // console.log(userId);

    const newBook = new Book(uuidv4(), title, author, releaseYear, [], userId);

    // console.log(newBook);

    await repository.createBook(newBook);
    
    return res.status(201).json(newBook);
  },

  updateBook: async (req, res) => {
    const id = req.params.id;

    const { title, author, releaseYear } = req.body;

    const updatedBook = new Book(id, title, author, releaseYear);

    const success = await repository.updateBook(id, updatedBook);

    if (success) {
      return res.status(200).send('Book updated successfully');
    } else {
      return res.status(404).send('Book not found');
    }
  },

  validateDeleteBook: (req, res, next) => {
    if (req.params.id.length !== 36) {
      res.status(400).send('Invalid ID');
    }

    return next();
  },

  deleteBook: async (req, res) => {
    const id = req.params.id;

    const token = req.header('Authorization').split(' ')[1];

    const decoded = jwt.verify(token, 'jwtSecret');

    const userId = decoded.id;

    const book = repository.getBookById(id, userId);

    if (!book) {
      return res.status(400).send('Invalid token');
    }

    await repository.deleteBook(id);

    return res.status(204).send('Book deleted successfully');
  }
};
