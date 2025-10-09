import Publisher from '../models/publisher.model.js';
import ApiError from '../api_error.js';
import { StatusCodes } from 'http-status-codes';

class PublisherController {
  // [POST] /api/publishers
  async create(req, res, next) {
    try {
      const publisher = new Publisher(req.body);
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

  // [GET] /api/publishers/:publisherId
  async findOne(req, res, next) {
    try {
      const publisher = await Publisher.findOne({ MANXB: req.params.publisherId }).lean();
      return res.send(publisher);
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while retrieving a publisher'));
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
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Cập nhật sách thành công',
        data: publisher
      });
    } catch (err) {
      console.error(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Cập nhật sách thất bại, vui lòng thử lại sau'));
    }
  }

  // [DELETE] /api/publishers
  async deleteAll(req, res, next) {
    try {
      const result = await Publisher.deleteMany();
      return res.send({ message: `${result.deletedCount} publishers were deleted successfully` });
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while removing all publishers '));
    }
  }

  // [DELETE] /api/publishers/:publisherId
  async delete(req, res, next) {
    try {
      await Publisher.deleteOne({ MANXB: req.params.publisherId });
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

export default new PublisherController();
