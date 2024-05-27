const Review = require('../models/Review');
const bookRepository = require('../repositories/bookRepository');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  createRandomReview: bookId => {
    return reviewRepository.createBook(reviewRepository.createRandomReview());
  },

  getReviewsFromBook: async (req, res) => {
    const bookId = req.params.book_id;
    const book = await bookRepository.getBookById(bookId);

    return res.json(book.reviews);
  },

  
  addReviewToBook: async (req, res, next) => {
    const review = new Review(
        uuidv4(),
        req.params.book_id,
        req.body.reviewer,
        req.body.rating,
        req.body.text,
        new Date()
    );

    const bookToUpdate = await bookRepository.getBookById(review.bookId);
    bookToUpdate.reviews.push(review);

    const success = await bookRepository.updateBook(bookToUpdate.id, bookToUpdate);

    if (success) {
      return res.status(200).send('Review added successfully');
    } else {
      return res.status(404).send('Book not found');
    }
  },
  
  updateBookReview: async (req, res) => {
    const bookId = req.params.book_id;
    const reviewId = req.params.review_id;

    const bookToUpdate = await bookRepository.getBookById(bookId);

    const reviewToUpdateIndex = bookToUpdate.reviews.findIndex(review => review.id === reviewId);

    if (reviewToUpdateIndex !== -1) {
        const reviewToUpdate = bookToUpdate.reviews[reviewToUpdateIndex];

        reviewToUpdate.rating = req.body.rating;
        reviewToUpdate.text = req.body.text;
        reviewToUpdate.date = new Date();

        bookToUpdate.reviews[reviewToUpdateIndex] = reviewToUpdate;
    
        await bookRepository.updateBook(bookId, bookToUpdate);

        return res.status(200).send('Review updated successfully');
    } 
    
    return res.status(404).send('Review not found')
  },

  deleteBookReview: async (req, res) => {
    const bookId = req.params.book_id;
    const reviewId = req.params.review_id;

    const bookToUpdate = await bookRepository.getBookById(bookId);

    const reviewToDeleteIndex = bookToUpdate.reviews.findIndex(review => review.id === reviewId);

    if (reviewToDeleteIndex !== -1) {
        bookToUpdate.reviews.splice(reviewToDeleteIndex, 1);
        await bookRepository.updateBook(bookId, bookToUpdate);
        
        return res.status(200).send('Review deleted successfully')
    }

    return res.status(404).send('Review not found');
  }
};
