import Book from '../models/book.model.js';
import ApiError from '../api_error.js';
import { StatusCodes } from 'http-status-codes';

class BookController {
  // [POST] /api/books/
  async create(req, res, next) {
    try {
      // Validate trùng mã sách
      const existingBook = await Book.findOne({ MASACH: req.body.MASACH });
      if (existingBook) {
        return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Mã sách đã tồn tại trong hệ thống'));
      }

      // Thêm sách
      const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

      const book = new Book({
        ...req.body,
        SACHCONLAI: req.body.SOQUYEN,
        ANHBIA: imageUrl
      });
      await book.save();
      return res.status(StatusCodes.CREATED).json({
        status: 'success',
        message: 'Thêm sách thành công',
        data: book
      });
    } catch (err) {
      console.error(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Thêm sách thất bại, vui lòng thử lại sau'));
    }
  }

  // [GET] /api/books/
  async findAll(req, res, next) {
    try {
      const books = await Book.find().lean();
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Lấy sách thành công',
        data: books
      });
    } catch (err) {
      console.error(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối đến server, vui lòng thử lại sau'));
    }
  }

  // [GET] /api/books/:bookId
  async findOne(req, res, next) {
    try {
      const book = await Book.findOne({ MASACH: req.params.bookId }).lean();
      return res.status(200).send(book);
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while retrieving a book'));
    }
  }

  // [PUT] /api/books/:bookId
  async update(req, res, next) {
    try {
      const oldBook = Book.findOne({ MASACH: req.params.bookId });
      const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : oldBook.ANHBIA;

      const updateBook = {
        ...req.body,
        ANHBIA: imageUrl
      };
      const book = await Book.findOneAndUpdate(
        { MASACH: req.params.bookId },
        updateBook,
        { new: true }
      );
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Cập nhật sách thành công',
        data: book
      });
    } catch (err) {
      console.error(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Cập nhật sách thất bại, vui lòng thử lại sau'));
    }
  }

  // [DELETE] /api/books/:bookId
  async delete(req, res, next) {
    try {
      await Book.deleteOne({ MASACH: req.params.bookId });
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Xóa sách thành công'
      });
    } catch (err) {
      console.error(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Xóa sách thất bại, vui lòng thử lại sau'));
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