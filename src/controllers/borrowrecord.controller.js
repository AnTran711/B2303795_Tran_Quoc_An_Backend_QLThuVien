import BorrowRecord from '../models/borrowrecord.model.js';
import ApiError from '../api_error.js';
import { StatusCodes } from 'http-status-codes';

// Hàm xóa dấu
function removeVietnameseTones(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

class BorrowRecordController {
  // [GET] /api/borrow-records
  async getBorrowRecords(req, res, next) {
    try {
      let { filter, sort, search, readerId } = req.query;

      if (search === null || search === 'null' || search === undefined) search = '';

      const sortOrder = sort === 'asc' ? 1 : -1;

      const query = {};

      if (filter !== 'all') query.TRANGTHAI = filter;
      if (readerId) query.MADOCGIA = readerId;

      let borrowRecords = await BorrowRecord.find(query)
        .sort({ NGAYYEUCAU: sortOrder })
        .populate('SACH')
        .populate('DOCGIA')
        .lean();

      if (search.trim()) {
        const q = removeVietnameseTones(search.trim().toLowerCase());
        borrowRecords = borrowRecords.filter(
          br => removeVietnameseTones(br.SACH.TENSACH.toLowerCase()).includes(q)
        );
      }

      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Lấy sách thành công',
        data: borrowRecords
      });
    } catch (error) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối đến server, vui lòng thử lại sau'));
    }
  }

  // [POST] /api/borrow-records
  async borrow(req, res, next) {
    try {
      const numberOfBookBorrowing = await BorrowRecord.countDocuments({
        MADOCGIA: req.body.MADOCGIA,
        TRANGTHAI: { $in: ['borrowed', 'pending'] }
      });

      if (numberOfBookBorrowing >= 3) {
        return next(new ApiError(StatusCodes.CONFLICT, 'error', 'Bạn đã có tối đa 3 cuốn đang chờ duyệt hoặc đang mượn, không thể gửi thêm yêu cầu'));
      }

      const bookBorrowing = new BorrowRecord(req.body);
      await bookBorrowing.save();
      return res.status(StatusCodes.CREATED).json({
        status: 'success',
        message: 'Gửi yêu cầu mượn sách thành công'
      });
    } catch (err) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối tới server, vui lòng thử lại sau'));
    }
  }

  // [PUT] /api/borrow-records/approve/:id
  async approve(req, res, next) {
    try {
      const hanTra = new Date();
      hanTra.setDate(hanTra.getDate() + 7);

      const record = await BorrowRecord.findOneAndUpdate({
        _id: req.params.id,
        TRANGTHAI: 'pending'
      }, {
        TRANGTHAI: 'borrowed',
        NGAYMUON: new Date(),
        HANTRA: hanTra
      }, {
        new: true
      }).populate('DOCGIA').populate('SACH').lean();

      if (!record) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'error', 'Không tìm thấy yêu cầu mượn'));
      }

      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Đã duyệt yêu cầu mượn',
        data: record
      });
    } catch (err) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối tới server, vui lòng thử lại sau'));
    }
  }

  // [PUT] /api/borrow-records/reject/:id
  async reject(req, res, next) {
    try {
      const record = await BorrowRecord.findOneAndUpdate({
        _id: req.params.id,
        TRANGTHAI: 'pending'
      }, {
        TRANGTHAI: 'rejected'
      }, {
        new: true
      }).populate('DOCGIA').populate('SACH').lean();

      if (!record) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'error', 'Không tìm thấy yêu cầu mượn'));
      }

      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Đã từ chối yêu cầu mượn',
        data: record
      });
    } catch (err) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối tới server, vui lòng thử lại sau'));
    }
  }

  // [PUT] /api/borrow-records/return/:id
  async returnBook(req, res, next) {
    try {
      const record = await BorrowRecord.findOneAndUpdate({
        _id: req.params.id,
        TRANGTHAI: 'borrowed'
      }, {
        TRANGTHAI: 'returned',
        NGAYTRA: new Date()
      }, {
        new: true
      }).populate('DOCGIA').populate('SACH').lean();

      if (!record) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'error', 'Không tìm thấy sách cần trả'));
      }

      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Xác nhận trả sách thành công',
        data: record
      });
    } catch (err) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối tới server, vui lòng thử lại sau'));
    }
  }

  async cancelRequest(req, res, next) {
    try {
      const deletedRecord = await BorrowRecord.findOneAndDelete({
        _id: req.params.id,
        TRANGTHAI: 'pending'
      });
      console.log(deletedRecord);
      if (!deletedRecord) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'error', 'Không tìm thấy yêu cầu mượn sách mà bạn muốn hủy'));
      }

      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Hủy yêu cầu mượn sách thành công',
        data: deletedRecord
      });
    } catch (err) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối tới server, vui lòng thử lại sau'));
    }
  }
}

export default new BorrowRecordController();
