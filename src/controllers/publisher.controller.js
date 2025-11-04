import Publisher from '../models/publisher.model.js';
import ApiError from '../api_error.js';
import { StatusCodes } from 'http-status-codes';

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
    try {
      const publishers = await Publisher.find().lean();
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Lấy nhà xuất bản thành công',
        data: publishers
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
