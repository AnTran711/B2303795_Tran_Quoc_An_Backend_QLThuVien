import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import ApiError from '../api_error.js';
import { StatusCodes } from 'http-status-codes';

const _verifyToken = async (token, secretSignature) => {
  return jwt.verify(token, secretSignature);
};

const authEmployeeMiddleware = {
  // Xác thực người dùng
  async verifyToken (req, res, next) {

    const accessToken = req.cookies?.accessTokenEmployee;
    if (!accessToken) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'error', 'Bạn chưa đăng nhập'));
    }

    try {
      const employee = await _verifyToken(accessToken, config.jwt.employeeAccessKey);
      // Token hợp lệ
      req.employee = employee;
      next();
    } catch (error) {
      if (error?.message?.includes('jwt expired')) {
        next(new ApiError(StatusCodes.GONE, 'error', 'Need to refresh token!'));
        return;
      }
      next(new ApiError(StatusCodes.UNAUTHORIZED, 'error', 'Unauthorized!'));
    }
  }
};

export default authEmployeeMiddleware;
