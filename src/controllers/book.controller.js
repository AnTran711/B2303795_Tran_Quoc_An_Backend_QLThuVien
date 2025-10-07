import Book from '../models/book.model.js';
import ApiError from '../api_error.js';

class BookController {
  // [POST] /api/books/
  async create(req, res, next) {
    try {
      const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

      const book = new Book({
        ...req.body,
        SACHCONLAI: req.body.SOQUYEN,
        ANHBIA: imageUrl
      });
      await book.save();
      return res.send(book);
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while creating a book'));
    }
  }

  // [GET] /api/books/
  async findAll(req, res, next) {
    try {
      const books = await Book.find().lean();
      return res.send(books);
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while retrieving books'));
    }
  }

  // [GET] /api/books/:bookId
  async findOne(req, res, next) {
    try {
      const book = await Book.findOne({ MASACH: req.params.bookId }).lean();
      return res.send(book);
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while retrieving a book'));
    }
  }

  // [PUT] /api/books/:bookId
  async update(req, res, next) {
    try {
      await Book.updateOne({ MASACH: req.params.bookId }, req.body);
      return res.send({ message: 'A book was updated successully' });
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while updating a book'));
    }
  }

  // [DELETE] /api/books/:bookId
  async delete(req, res, next) {
    try {
      await Book.deleteOne({ MASACH: req.params.bookId });
      return res.send({ message: 'A book was deleted successfully' });
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while deleting a book'));
    }
  }

  // [DELETE] /api/books/
  async deleteAll(req, res, next) {
    try {
      const result = await Book.deleteMany();
      return res.send({ message: `${result.deletedCount} books were deleted successfully` });
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while removing all books'));
    }
  }
}

export default new BookController();