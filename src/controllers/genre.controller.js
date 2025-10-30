import Genre from '../models/genre.model.js';
import ApiError from '../api_error.js';
import { StatusCodes } from 'http-status-codes';

class GenreController {
  // [POST] /api/genres
  async create(req, res, next) {
    try {
      // Tạo mã thể loại
      const lastGenre = await Genre.findOne().sort({ MATHELOAI: -1 }).lean();

      let newNumber = 1;

      if (lastGenre) {
        const lastNumber = parseInt(lastGenre.MATHELOAI.substring(2));
        newNumber = lastNumber + 1;
      }

      const newCode = 'TL' + newNumber.toString().padStart(3, '0');

      // Lưu nhà xuất bản vào db
      const genre = new Genre({
        MATHELOAI: newCode,
        ...req.body
      });
      await genre.save();
      return res.status(StatusCodes.CREATED).json({
        status: 'success',
        message: 'Thêm thể loại thành công',
        data: genre
      });
    } catch (err) {
      console.error(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Thêm thể loại thất bại, vui lòng thử lại sau'));
    }
  }

  // [GET] /api/genres
  async findAll(req, res, next) {
    try {
      const genres = await Genre.find().lean();
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Lấy thể loại thành công',
        data: genres
      });
    } catch (err) {
      console.error(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối đến server, vui lòng thử lại sau'));
    }
  }

  // [GET] /api/genres/:genreId
  async findOne(req, res, next) {
    try {
      const genre = await Genre.findOne({ MATHELOAI: req.params.genreId }).lean();
      return res.send(genre);
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while retrieving a genre'));
    }
  }

  // [PUT] /api/genres/:genreId
  async update(req, res, next) {
    try {
      const genre = await Genre.findOneAndUpdate(
        { MATHELOAI: req.params.genreId },
        req.body,
        { new: true }
      );
      if (!genre) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'error', 'Không tìm thấy thể loại cần cập nhật'));
      }
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Cập nhật thể loại thành công',
        data: genre
      });
    } catch (err) {
      console.error(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Cập nhật thể loại thất bại, vui lòng thử lại sau'));
    }
  }

  // [DELETE] /api/genres
  async deleteAll(req, res, next) {
    try {
      const result = await Genre.deleteMany();
      return res.send({ message: `${result.deletedCount} genres were deleted successfully` });
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while removing all genres '));
    }
  }

  // [DELETE] /api/genres/:genreId
  async delete(req, res, next) {
    try {
      await Genre.deleteOne({ MATHELOAI: req.params.genreId });
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Xóa thể loại thành công'
      });
    } catch (err) {
      console.error(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Xóa thể loại thất bại, vui lòng thử lại sau'));
    }
  }
}

export default new GenreController();
