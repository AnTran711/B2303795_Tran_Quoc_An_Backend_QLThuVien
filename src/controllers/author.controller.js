import Author from '../models/author.model.js';
import ApiError from '../api_error.js';
import { StatusCodes } from 'http-status-codes';

class AuthorController {
  // [POST] /api/authors
  async create(req, res, next) {
    try {
      const author = new Author(req.body);
      await author.save();
      return res.status(StatusCodes.CREATED).json({
        status: 'success',
        message: 'Thêm tác giả thành công',
        data: author
      });
    } catch (err) {
      console.error(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Thêm tác giả thất bại, vui lòng thử lại sau'));
    }
  }

  // [GET] /api/authors
  async findAll(req, res, next) {
    try {
      const authors = await Author.find().lean();
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Lấy tác giả thành công',
        data: authors
      });
    } catch (err) {
      console.error(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối đến server, vui lòng thử lại sau'));
    }
  }

  // [GET] /api/authors/:authorId
  async findOne(req, res, next) {
    try {
      const author = await Author.findOne({ MATACGIA: req.params.authorId }).lean();
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Lấy tác giả thành công',
        data: author
      });
    } catch (err) {
      console.error(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Tìm tác giả thất bại, vui lòng thử lại sau'));
    }
  }

  // [PUT] /api/authors/:authorId
  async update(req, res, next) {
    try {
      const author = await Author.findOneAndUpdate(
        { MATACGIA: req.params.authorId },
        req.body,
        { new: true }
      );
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Cập nhật tác giả thành công',
        data: author
      });
    } catch (err) {
      console.error(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Cập nhật tác giả thất bại, vui lòng thử lại sau'));
    }
  }

  // [DELETE] /api/authors
  async deleteAll(req, res, next) {
    try {
      const result = await Author.deleteMany();
      return res.send({ message: `${result.deletedCount} authors were deleted successfully` });
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while removing all authors'));
    }
  }

  // [DELETE] /api/authors/:authorId
  async delete(req, res, next) {
    try {
      await Author.deleteOne({ MATACGIA: req.params.authorId });
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Xóa tác giả thành công'
      });
    } catch (err) {
      console.error(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Xóa tác giả thất bại, vui lòng thử lại sau'));
    }
  }
}

export default new AuthorController();
