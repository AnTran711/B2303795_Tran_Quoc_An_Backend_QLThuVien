import { StatusCodes } from 'http-status-codes';
import ApiError from '../api_error.js';
import Reader from '../models/reader.model.js';

class readerController {
  async borrowBook (req, res, next) {
    try {
      const readers = await Reader.find().lean();
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Thành công',
        data: readers
      });
    } catch (error) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Thất bại'));
    }
  }
}

export default new readerController();
