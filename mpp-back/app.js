const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const bookController = require('./controllers/bookController');
const reviewController = require('./controllers/reviewController');
const userController = require('./controllers/userController');
const BookModel = require('./models/BookModel');
const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const Book = require('./models/Book');
const Review = require('./models/Review');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

const sendUpdates = () => {
  const update = {
    type: 'new_book',
    data: bookController.createRandomBook()
  };

  wss.clients.forEach(client => {
    client.send(JSON.stringify(update));
  });
}

// Set interval to generate new books and send updates
// setInterval(sendUpdates, 5000);
const uri='mongodb+srv://hertadianalarisa:UR4wRj3HQvCt0WGu@cluster.dadl047.mongodb.net/?retryWrites=true&w=majority';


mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Database connected successfully');
})
.catch(err => {
  console.error('Database connection error:', err);
});

// const createRandomBook = () => {
//   const bookId = uuidv4();

//   return new Book(
//     bookId,
//     faker.lorem.words(3).replace(/\b\w/g, char => char.toUpperCase()),
//     faker.person.fullName(),
//     faker.number.int(1800, 2024),
//     Array.from({ length: 10 }, () => new Review(
//       uuidv4(),
//       bookId,
//       faker.person.fullName(),
//       Math.floor(Math.random() * 10) + 1,
//       faker.lorem.paragraph(),
//       faker.date.past()
//     ))
//   );
// }

// const books = faker.helpers.multiple(createRandomBook, { count: 20 });
// BookModel.insertMany(books);

app.use(express.static('client'));
// Apply rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply the rate limiter to all requests
app.use(limiter);
app.use(cors());

app.use(bodyParser.json());

app.get('/status', (req, res) => res.status(200).send('Server is runnning.'));

app.post('/register', userController.register);
app.post('/login', userController.login);

app.get('/books', userController.protect, bookController.getAllBooks);
app.get('/books/:id', bookController.validateGetBookById, bookController.getBookById);
app.post('/books', bookController.validateCreateOrUpdateBook, bookController.createBook);
app.put('/books/:id', bookController.validateCreateOrUpdateBook, bookController.updateBook);
app.delete('/books/:id', bookController.validateDeleteBook, bookController.deleteBook);

app.get('/reviews/:book_id', reviewController.getReviewsFromBook);
app.post('/reviews/:book_id', reviewController.addReviewToBook);
app.put('/reviews/:book_id/:review_id', userController.protect, reviewController.updateBookReview);
app.delete('/reviews/:book_id/:review_id', userController.protect, reviewController.deleteBookReview);

const PORT = process.env.PORT || 5001;

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (socket) => {
    wss.emit('connection', socket, request);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
