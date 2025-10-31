import BookBorrowing from '../models/bookborrowing.model.js';
import ApiError from '../api_error.js';

class BookBorrowingController {
  // [POST] /api/borrow-book
  async borrow(req, res, next) {
  }

  async show(req, res, next) {
    try {
      const bookBorrowings = BookBorrowing.find().lean();
      return res.send(bookBorrowings);
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while show book borrowing table'));
    }
  }
}

export default new BookBorrowingController();
