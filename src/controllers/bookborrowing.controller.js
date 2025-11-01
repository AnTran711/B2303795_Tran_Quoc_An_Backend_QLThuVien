import BookBorrowing from '../models/bookborrowing.model.js';
import ApiError from '../api_error.js';
import { StatusCodes } from 'http-status-codes';

class BookBorrowingController {
  // [GET] /api/book-borrowing
  async getAllBorrowRecord(req, res, next) {
    try {
      const borrowRecords = await BookBorrowing.find().populate('DOCGIA').populate('SACH').lean();
      return res.json({
        status: 'success',
        message: 'Lấy sách thành công',
        data: borrowRecords
      });
    } catch (error) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối đến server, vui lòng thử lại sau'));
    }
  }

  // [POST] /api/book-borrowing
  async borrow(req, res, next) {
    try {
      const bookBorrowing = new BookBorrowing(req.body);
      await bookBorrowing.save();
      return res.json({
        status: 'success',
        message: 'Gửi yêu cầu mượn sách thành công'
      });
    } catch (err) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối tới server, vui lòng thử lại sau'));
    }
  }

  // [PUT] /api/book-borrowing/approve/:id
  async approve(req, res, next) {
    try {
      const hanTra = new Date();
      hanTra.setDate(hanTra.getDate() + 7);

      await BookBorrowing.findByIdAndUpdate(req.params.id, {
        TRANGTHAI: 'Đã duyệt',
        NGAYMUON: new Date(),
        HANTRA: hanTra
      });
      return res.json({
        status: 'success',
        message: 'Đã duyệt yêu cầu mượn'
      });
    } catch (err) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối tới server, vui lòng thử lại sau'));
    }
  }

  // [PUT] /api/book-borrowing/reject/:id
  async reject(req, res, next) {
    try {
      await BookBorrowing.findByIdAndUpdate(req.params.id, {
        TRANGTHAI: 'Từ chối'
      });
      return res.json({
        status: 'success',
        message: 'Đã từ chối yêu cầu mượn'
      });
    } catch (err) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối tới server, vui lòng thử lại sau'));
    }
  }

  // [PUT] /api/book-borrowing/return/:id
  async return(req, res, next) {
    try {
      await BookBorrowing.findByIdAndUpdate(req.params.id, {
        TRANGTHAI: 'Đã trả',
        NGAYTRA: new Date()
      });
      return res.json({
        status: 'success',
        message: 'Đã trả sách thành công'
      });
    } catch (err) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối tới server, vui lòng thử lại sau'));
    }
  }
}

export default new BookBorrowingController();
