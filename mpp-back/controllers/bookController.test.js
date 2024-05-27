const controller = require('./../controllers/bookController');
const repository = require('./../repositories/bookRepository');
const Book = require('./../models/Book');

jest.mock('./../repositories/bookRepository');
jest.mock('uuid', () => ({ v4: jest.fn(() => '1') }));

describe('Controller', () => {
  beforeEach(() => {
    repository.getAllBooks.mockClear();
    repository.createBook.mockClear();
    repository.getBookById.mockClear();
    repository.updateBook.mockClear();
    repository.deleteBook.mockClear();
  });

  test('getAllBooks returns empty array initially', () => {
    repository.getAllBooks.mockReturnValueOnce([]);

    const req = {};
    const res = {
      json: jest.fn()
    };

    controller.getAllBooks(req, res);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  test('getBookById returns the correct book', () => {
    const book = new Book('1', 'A Game of Thrones', 'George R. R. Martin', 1996);

    repository.getBookById.mockReturnValueOnce(book);

    const req = {
      params: { id: '1' }
    };

    const res = {
      json: jest.fn()
    };

    controller.getBookById(req, res);

    expect(repository.getBookById).toHaveBeenCalledWith('1');

    expect(res.json).toHaveBeenCalledWith(book);
  });

  test('createBook adds a new book to the repository and responds with the new book', () => {
    const newBook = new Book('1', 'A Game of Thrones', 'George R. R. Martin', 1996);

    repository.createBook.mockReturnValueOnce(newBook);

    const req = {
      body: {
        title: 'A Game of Thrones',
        author: 'George R. R. Martin',
        releaseYear: 1996
      }
    };

    const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
    };

    controller.createBook(req, res);

    expect(repository.createBook).toHaveBeenCalledWith(expect.any(Book));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json.mock.calls[0][0].title).toBe('A Game of Thrones');
    expect(res.json.mock.calls[0][0].author).toBe('George R. R. Martin');
    expect(res.json.mock.calls[0][0]).toHaveProperty('id');
  });

  test('updateBook updates the correct todo and responds with success message', () => {
    const updatedBook = new Book('1', 'A Game of Thrones', 'George R. R. Martin', 1996);

    repository.updateBook.mockReturnValueOnce(true);

    const req = {
      params: { id: '1' },
      body: updatedBook
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    controller.updateBook(req, res);

    expect(repository.updateBook).toHaveBeenCalledWith('1', expect.any(Book));

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.send).toHaveBeenCalledWith('Book updated successfully');
  });

  test('deleteBook deletes the correct book and responds with success', () => {
    repository.deleteBook.mockReturnValueOnce(true);

    const req = {
      params: { id: '1' }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    controller.deleteBook(req, res);
    
    expect(repository.deleteBook).toHaveBeenCalledWith('1');

    expect(res.status).toHaveBeenCalledWith(204);

    expect(res.send).toHaveBeenCalled();
  });
});
