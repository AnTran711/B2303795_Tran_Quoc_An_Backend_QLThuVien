import BorrowRecord from '../models/borrowrecord.model.js';
import ApiError from '../api_error.js';
import { StatusCodes } from 'http-status-codes';

class BorrowRecordController {
  // [GET] /api/book-borrowing
  async getBorrowRecords(req, res, next) {
    try {
      const borrowRecords = await BorrowRecord.find().populate('DOCGIA').populate('SACH').lean();
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
      const bookBorrowing = new BorrowRecord(req.body);
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

      const record = await BorrowRecord.findOneAndUpdate({
        _id: req.params.id,
        TRANGTHAI: 'Chờ duyệt'
      }, {
        TRANGTHAI: 'Đang mượn',
        NGAYMUON: new Date(),
        HANTRA: hanTra
      }, {
        new: true
      }).populate('DOCGIA').populate('SACH').lean();

      if (!record) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'error', 'Không tìm thấy yêu cầu mượn'));
      }

      return res.json({
        status: 'success',
        message: 'Đã duyệt yêu cầu mượn',
        data: record
      });
    } catch (err) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối tới server, vui lòng thử lại sau'));
    }
  }

  // [PUT] /api/book-borrowing/reject/:id
  async reject(req, res, next) {
    try {
      const record = await BorrowRecord.findOneAndUpdate({
        _id: req.params.id,
        TRANGTHAI: 'Chờ duyệt'
      }, {
        TRANGTHAI: 'Từ chối'
      }, {
        new: true
      }).populate('DOCGIA').populate('SACH').lean();

      if (!record) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'error', 'Không tìm thấy yêu cầu mượn'));
      }

      return res.json({
        status: 'success',
        message: 'Đã từ chối yêu cầu mượn',
        data: record
      });
    } catch (err) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối tới server, vui lòng thử lại sau'));
    }
  }

  // [PUT] /api/book-borrowing/return/:id
  async returnBook(req, res, next) {
    try {
      const record = await BorrowRecord.findOneAndUpdate({
        _id: req.params.id,
        TRANGTHAI: 'Đang mượn'
      }, {
        TRANGTHAI: 'Đã trả',
        NGAYTRA: new Date()
      }, {
        new: true
      }).populate('DOCGIA').populate('SACH').lean();

      if (!record) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'error', 'Không tìm thấy sách cần trả'));
      }

      return res.json({
        status: 'success',
        message: 'Xác nhận trả sách thành công',
        data: record
      });
    } catch (err) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối tới server, vui lòng thử lại sau'));
    }
  }
}

export default new BorrowRecordController();
