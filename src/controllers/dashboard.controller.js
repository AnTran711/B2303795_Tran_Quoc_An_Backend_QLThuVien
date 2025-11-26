import ApiError from '../api_error.js';
import { StatusCodes } from 'http-status-codes';
import Book from '../models/book.model.js';
import Reader from '../models/reader.model.js';
import BorrowRecord from '../models/borrowrecord.model.js';

class DashboardController {
  // [GET] /api/dashboard
  async getData(req, res, next) {
    let { selectedYear } = req.query;
    selectedYear = selectedYear ? Number(selectedYear) : new Date().getFullYear();

    try {
      // Tổng số sách
      const totalBooks = await Book.countDocuments();
      // Tổng số độc giả đăng ký tài khoản
      const totalReaders = await Reader.countDocuments();
      // Tổng số sách đang chờ duyệt
      const pendingBookCount = await BorrowRecord.countDocuments({ TRANGTHAI: 'pending' });
      // Tổng số sách đang mượn
      const borrowedBookCount = await BorrowRecord.countDocuments({ TRANGTHAI: 'borrowed' });

      // Dữ liệu cho biểu đồ
      const rawChart = await BorrowRecord.aggregate([
        {
          $match: {
            TRANGTHAI: { $in: ['borrowed', 'returned'] },
            $expr: {
              $eq: [
                { $year: '$NGAYMUON' },
                selectedYear
              ]
            }
          }
        },
        {
          $group: {
            _id: {
              month: { $month: '$NGAYMUON' }
            },
            total: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.month': 1 }
        }
      ]);

      // Khởi tạo mảng 12 phần tử full 0
      const chartData = Array(12).fill(0);

      // Điền giá trị vào mảng theo thứ tự 12 tháng
      rawChart.forEach(item => {
        chartData[item._id.month - 1] = item.total;
      });

      // Dữ liệu cho bảng top 5 sách mượn nhiều nhất
      const tableTop5Data = await BorrowRecord.aggregate([
        {
          $match: {
            TRANGTHAI: { $in: ['borrowed', 'returned'] }
          }
        },
        {
          $group: {
            _id: '$MASACH',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { 'count': -1 }
        },
        {
          $limit: 5
        },
        {
          $lookup: {
            from: 'SACH',
            localField: '_id',
            foreignField: 'MASACH',
            as: 'bookInfo'
          }
        },
        {
          $unwind: { path: '$bookInfo' }
        },
        {
          $project: {
            _id: 0,
            MASACH: '$_id',
            count: 1,
            TENSACH: '$bookInfo.TENSACH'
          }
        }
      ]);

      const dashboardData = {
        totalBooks,
        totalReaders,
        pendingBookCount,
        borrowedBookCount,
        chartData,
        tableTop5Data
      };

      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Lấy dữ liệu dashboard thành công',
        data: dashboardData
      });
    } catch (err) {
      console.log(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối tới server, vui lòng thử lại sau'));
    }
  }
}

export default new DashboardController();