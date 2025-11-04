import Book from '../models/book.model.js';
import ApiError from '../api_error.js';
import { StatusCodes } from 'http-status-codes';

class BookController {
  // [POST] /api/books/
  async create(req, res, next) {
    try {
      // Thêm sách

      // Tại đường đẫn tới hình ảnh
      const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

      // Logic mã sách tự tăng
      // Lấy sách có mã sách lớn nhất
      const lastBook = await Book.findOne().sort({ MASACH: -1 }).lean();

      let newNumber = 1;

      if (lastBook) {
        // Lấy ra số của mã sách
        const lastNumber = parseInt(lastBook.MASACH.substring(1));
        newNumber = lastNumber + 1;
      }

      const newCode = 'S' + newNumber.toString().padStart(3, '0');

      // Lưu sách
      const book = new Book({
        MASACH: newCode,
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
      const book = await Book.findOne({ MASACH: req.params.bookId }).populate('DSTHELOAI').populate('NHAXUATBAN').lean();
      if (!book) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'error', 'Không tìm thấy sách phù hợp'));
      }
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Lấy sách thành công',
        data: book
      });
    } catch (err) {
      console.error(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối đến server, vui lòng thử lại sau'));
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
      if (!book) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'error', 'Không tìm thấy sách cần cập nhật'));
      }
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
}

export default new BookController();