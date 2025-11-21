import Publisher from '../models/publisher.model.js';
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

class PublisherController {
  // [POST] /api/publishers
  async create(req, res, next) {
    try {
      // Tạo mã nhà xuất bản
      const lastPublisher = await Publisher.findOne().sort({ MANXB: -1 }).lean();

      let newNumber = 1;

      if (lastPublisher) {
        const lastNumber = parseInt(lastPublisher.MANXB.substring(3));
        newNumber = lastNumber + 1;
      }

      const newCode = 'NXB' + newNumber.toString().padStart(3, '0');

      // Lưu nhà xuất bản vào db
      const publisher = new Publisher({
        MANXB: newCode,
        ...req.body
      });
      await publisher.save();
      return res.status(StatusCodes.CREATED).json({
        status: 'success',
        message: 'Thêm nhà xuất bản thành công',
        data: publisher
      });
    } catch (err) {
      console.error(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Thêm nhà xuất bản thất bại, vui lòng thử lại sau'));
    }
  }

  // [GET] /api/publishers
  async findAll(req, res, next) {
    let {
      page,
      limit,
      search,
      sort
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
      let publishers = await Publisher.find().sort({ MANXB: sortOrder }).lean();

      // Xử lý tìm kiếm
      if (search.trim()) {
        const q = removeVietnameseTones(search.trim().toLowerCase());
        publishers = publishers.filter(
          p => removeVietnameseTones(p.TENNXB.toLowerCase()).includes(q)
        );
      }

      let start, end, totalPages;

      // Phân trang
      if (page === -1) {
        start = 0;
        end = publishers.length;
        totalPages = 1;
      } else {
        const total = publishers.length;
        totalPages = Math.ceil(total / limit);
        if (page > totalPages && totalPages > 0) {
          page = totalPages;
        }
        start = (page - 1) * limit;
        end = start + limit;
      }

      const paginatedPublishers = publishers.slice(start, end);

      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Lấy nhà xuất bản thành công',
        totalPages: totalPages,
        data: paginatedPublishers
      });
    } catch (err) {
      console.error(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối đến server, vui lòng thử lại sau'));
    }
  }

  // [PUT] /api/publishers/:publisherId
  async update(req, res, next) {
    try {
      const publisher = await Publisher.findOneAndUpdate(
        { MANXB: req.params.publisherId },
        req.body,
        { new: true }
      );
      if (!publisher) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'error', 'Không tìm thấy nhà xuất bản cần cập nhật'));
      }
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Cập nhật nhà xuất bản thành công',
        data: publisher
      });
    } catch (err) {
      console.error(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Cập nhật nhà xuất bản thất bại, vui lòng thử lại sau'));
    }
  }

  // [DELETE] /api/publishers/:publisherId
  async delete(req, res, next) {
    try {
      await Publisher.deleteOne({ MANXB: req.params.publisherId });
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Xóa nhà xuất bản thành công'
      });
    } catch (err) {
      console.error(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Xóa nhà xuất bản thất bại, vui lòng thử lại sau'));
    }
  }
}

export default new PublisherController();
