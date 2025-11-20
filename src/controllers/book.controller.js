import Book from '../models/book.model.js';
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
    let {
      page,
      limit,
      search,
      genreId,
      sort,
      filterState
    } = req.query;

    // Phân trang
    page = parseInt(page);
    limit = parseInt(limit);

    // Tìm kiếm
    if (search === null || search === 'null' || search === undefined) search = '';

    // Xử lý sắp xếp, mặc định là sắp xếp tăng
    let sortOrder;

    if (sort !== undefined) {
      sortOrder = sort === 'true' ? 1 : -1;
    } else {
      sortOrder = 1;
    }

    try {
      const query = {};

      // Xử lý lọc theo thể loại
      if (genreId !== undefined && genreId !== 'all') {
        query.THELOAI = genreId;
      }

      let books = await Book.find(query)
        .sort({ MASACH: sortOrder })
        .populate('DSTHELOAI')
        .populate('NHAXUATBAN')
        .lean();

      // Tính số lượng sách đang mượn
      const borrowedData = await BorrowRecord.aggregate([
        { $match: { TRANGTHAI: 'borrowed' } },
        { $group: { _id: '$MASACH', count: { $sum: 1 } } }
      ]);

      // Nhận về kết quả là 1 mảng gồm các object có trạng thái borrowed
      // Mỗi object có 2 trường: _id lưu MASACH, count lưu số lượng quyển đang mượn

      const borrowMap = new Map();
      // Lưu vào map với key là MASACH còn value là số lượng quyển đang mượn
      borrowedData.forEach(b => borrowMap.set(b._id, b.count));

      books = books.map(b => {
        const DANGMUON = borrowMap.get(b.MASACH) || 0;
        return {
          ...b,
          DANGMUON,
          SACHCONLAI: b.SOQUYEN - DANGMUON
        };
      });

      // Lọc theo trạng thái sách
      if (filterState === 'available') {
        books = books.filter(b => b.SACHCONLAI > 0);
      } else if (filterState === 'unavailable') {
        books = books.filter(b => b.SACHCONLAI === 0);
      }

      // Xử lý tìm kiếm
      if (search.trim()) {
        const q = removeVietnameseTones(search.trim().toLowerCase());
        books = books.filter(
          b => removeVietnameseTones(b.TENSACH.toLowerCase()).includes(q)
        );
      }

      // Phân trang
      const total = books.length;
      const totalPages = Math.ceil(total / limit);
      if (page > totalPages && totalPages > 0) {
        page = totalPages;
      }
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedBooks = books.slice(start, end);

      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Lấy sách thành công',
        totalPages: totalPages,
        data: paginatedBooks
      });
    } catch (err) {
      console.error(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối đến server, vui lòng thử lại sau'));
    }
  }

  // [GET] /api/books/:bookId
  async findOne(req, res, next) {
    try {
      const DANGMUON = await BorrowRecord.countDocuments({
        MASACH: req.params.bookId,
        TRANGTHAI: 'borrowed'
      });
      let book = await Book.findOne({ MASACH: req.params.bookId }).populate('DSTHELOAI').populate('NHAXUATBAN').lean();
      if (!book) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'error', 'Không tìm thấy sách phù hợp'));
      }
      book = {
        ...book,
        DANGMUON: DANGMUON,
        SACHCONLAI: book.SOQUYEN - DANGMUON
      };
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
      const oldBook = await Book.findOne({ MASACH: req.params.bookId });
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