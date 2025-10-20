import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import ApiError from '../api_error.js';
import { StatusCodes } from 'http-status-codes';

const authReaderMiddleware = {
  // Xác thực người dùng
  verifyToken (req, res, next) {
    const token = req.headers.token;
    // Nếu có token => người dùng đã đăng nhập
    if (token) {
      const accessToken = token.split(' ')[1];
      jwt.verify(accessToken, config.jwt.readerAccessKey, (err, reader) => {
        if (err) {
          return next(new ApiError(StatusCodes.FORBIDDEN, 'error', 'Hết phiên đăng nhập'));
        }
        req.reader = reader;
        next();
      });
    } else { // Không có token => người dùng chưa đăng nhập
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'error', 'Bạn chưa đăng nhập'));
    }
  }
};

export default authReaderMiddleware;
