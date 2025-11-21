import Genre from '../models/genre.model.js';
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
      let genres = await Genre.find().sort({ MATHELOAI: sortOrder }).lean();

      // Xử lý tìm kiếm
      if (search.trim()) {
        const q = removeVietnameseTones(search.trim().toLowerCase());
        genres = genres.filter(
          g => removeVietnameseTones(g.TENTHELOAI.toLowerCase()).includes(q)
        );
      }

      let start, end, totalPages;

      // Phân trang
      if (page === -1) {
        start = 0;
        end = genres.length;
        totalPages = 1;
      } else {
        const total = genres.length;
        totalPages = Math.ceil(total / limit);
        if (page > totalPages && totalPages > 0) {
          page = totalPages;
        }
        start = (page - 1) * limit;
        end = start + limit;
      }

      const paginatedGenres = genres.slice(start, end);

      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Lấy thể loại thành công',
        totalPages: totalPages,
        data: paginatedGenres
      });
    } catch (err) {
      console.error(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối đến server, vui lòng thử lại sau'));
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
