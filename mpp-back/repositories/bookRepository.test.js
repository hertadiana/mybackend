const repository = require('./bookRepository');
const Book = require('./../models/Book');

describe('Book Repository', () => {
  beforeEach(() => {
    // Clear books before each test
    repository.getAllBooks().length = 0;
  });

  test('getAllBooks returns empty array initially', () => {
    const books = repository.getAllBooks();
    expect(books).toEqual([]);
  });

  test('getBookById returns the correct book', () => {
    const book1 = new Book('1', 'A Game of Thrones', 'George R. R. Martin', 1996);
    const book2 = new Book('2', 'Caraval', 'Stephanie Garber', 2016);

    repository.createBook(book1);
    repository.createBook(book2);

    const foundBook = repository.getBookById('2');
    expect(foundBook).toEqual(book2);
  });

  test('createBook adds a new book to the repository', () => {
    const book = new Book('1', 'A Game of Thrones', 'George R. R. Martin', 1996);

    repository.createBook(book);

    const books = repository.getAllBooks();

    expect(books.length).toBe(1);

    expect(books[0]).toEqual(book);
  });

  test('updateBook updates the correct book', () => {
    const initialBook = new Book('1', 'A Game of Thrones', 'George R. R. Martin', 1996);
    const updatedBook = new Book('1', 'Caraval', 'Stephanie Garber', 2016);

    repository.createBook(initialBook);
    repository.updateBook('1', updatedBook);

    const books = repository.getAllBooks();

    expect(books.length).toBe(1);
    expect(books[0]).toEqual(updatedBook);
  });

  test('deleteBook deletes the correct book', () => {
    const book1 = new Book('1', 'A Game of Thrones', 'George R. R. Martin', 1996);
    const book2 = new Book('2', 'Caraval', 'Stephanie Garber', 2016);

    repository.createBook(book1);
    repository.createBook(book2);

    repository.deleteBook('1');

    const books = repository.getAllBooks();

    expect(books.length).toBe(1);
    expect(books[0]).toEqual(book2);
  });
});
