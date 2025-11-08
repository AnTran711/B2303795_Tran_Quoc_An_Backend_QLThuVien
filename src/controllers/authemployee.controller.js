import Employee from '../models/employee.model.js';
import ApiError from '../api_error.js';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import generateToken from '../utils/jwt.util.js';
import ms from 'ms';

const _verifyToken = async (token, secretSignature) => {
  return jwt.verify(token, secretSignature);
};

class authEmployeeController {
  // Đăng ký
  // [POST] api/auth-enployee/register
  async registerEmployee(req, res, next) {
    try {
      // Băm mật khẩu để lưu vào db
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.MATKHAU, salt);

      // Kiểm tra trùng số điện thoại
      const phoneDuplicate = await Employee.findOne({ DIENTHOAI: req.body.DIENTHOAI });

      if (phoneDuplicate) {
        return next(new ApiError(StatusCodes.CONFLICT, 'error', 'Số điện thoại này đã được đăng ký tài khoản'));
      }

      // Tạo nhân viên mới
      const employee = new Employee({
        HOTENNV: req.body.HOTENNV,
        NGAYSINH: req.body.NGAYSINH,
        PHAI: req.body.PHAI,
        DIACHI: req.body.DIACHI,
        CHUCVU: req.body.CHUCVU,
        DIENTHOAI: req.body.DIENTHOAI,
        MATKHAU: hash
      });

      // Lưu vào db và trả dữ liệu về cho client
      await employee.save();
      const { MATKHAU, ...others } = employee._doc;
      return res.status(StatusCodes.CREATED).json({
        status: 'success',
        message: 'Tạo tài khoản thành công',
        data: others
      });
    } catch (err) {
      console.log(err);
      return next(
        new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Đăng ký tài khoản thất bại, vui lòng thử lại sau'
        )
      );
    }
  }

  // Đăng nhập
  // [POST] api/auth-employee/login
  async loginEmployee(req, res, next) {
    try {
      // Lấy nhân viên từ db
      const employee = await Employee.findOne({ DIENTHOAI: req.body.DIENTHOAI }).lean();
      if (!employee) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'error', 'Tài khoản hoặc mật khẩu không chính xác'));
      }

      // Kiểm tra mật khẩu
      const validPassword = bcrypt.compareSync(req.body.MATKHAU, employee.MATKHAU);
      if (!validPassword) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'error', 'Tài khoản hoặc mật khẩu không chính xác'));
      }

      // Đăng nhập thành công và gửi nhân viên về cho client

      // Tạo jsonwebtoken
      // Tạo access token
      const accessToken = await generateToken.generateEmployeeAccessToken(employee, config.jwt.employeeAccessKey, '10m');

      // Tạo refresh token
      const refreshToken = await generateToken.generateEmployeeRefreshToken(employee, config.jwt.employeeRefreshKey, '2w');

      // Lưu access token vào cookie
      res.cookie('accessTokenEmployee', accessToken, {
        httpOnly: true,
        secure: false, // Lúc deploy sửa thành true
        sameSite: 'lax',
        maxAge: ms('14 days')
      });

      // Lưu refresh token vào cookie
      res.cookie('refreshTokenEmployee', refreshToken, {
        httpOnly: true,
        secure: false, // Lúc deploy sẽ sửa thành true
        sameSite: 'lax',
        maxAge: ms('14 days')
      });

      // Lọc bỏ mật khẩu
      const { MATKHAU, ...others } = employee;

      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Đăng nhập thành công',
        data: others
      });
    } catch (err) {
      console.log(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Đăng nhập thất bại, vui lòng thử lại sau'));
    }
  }

  // Refresh token
  // [POST] api/auth-employee/refresh
  async requestRefreshToken (req, res, next) {
    // Lấy refresh token từ cookie
    const refreshToken = req.cookies?.refreshTokenEmployee;
    if (!refreshToken) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'error', 'Bạn chưa đăng nhập'));
    }

    // Xác thực refresh token
    try {
      const employee = await _verifyToken(refreshToken, config.jwt.employeeRefreshKey);

      // Tạo access token mới
      const newAccessToken = await generateToken.generateEmployeeAccessToken(employee, config.jwt.employeeAccessKey, '10m');

      // Lưu access token vào cookie
      res.cookie('accessTokenEmployee', newAccessToken, {
        httpOnly: true,
        secure: false, // Lúc deploy sửa thành true
        sameSite: 'lax',
        maxAge: ms('14 days')
      });

      // Gửi access token mới về client
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Refresh token thành công',
        data: newAccessToken
      });
    } catch (error) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'error', 'Refresh token không hợp lệ'));
    }
  }

  // Employee logout
  // [POST] /api/auth-employee/logout
  logoutEmployee (req, res, next) {
    res.clearCookie('accessTokenEmployee', { httpOnly: true, secure: false, sameSite: 'lax' });
    res.clearCookie('refreshTokenEmployee', { httpOnly: true, secure: false, sameSite: 'lax' });
    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Bạn đã đăng xuất'
    });
  }

  // [POST] /api/auth-employee/change-password
  async changePassword (req, res, next) {
    // Lấy nhân viên từ db
    const employee = await Employee.findOne({ DIENTHOAI: req.body.DIENTHOAI }).lean();
    if (!employee) {
      return next(new ApiError(StatusCodes.NOT_FOUND, 'error', 'Tài khoản hoặc mật khẩu không chính xác'));
    }

    // Kiểm tra mật khẩu
    const validPassword = bcrypt.compareSync(req.body.MATKHAU, employee.MATKHAU);
    if (!validPassword) {
      return next(new ApiError(StatusCodes.NOT_FOUND, 'error', 'Tài khoản hoặc mật khẩu không chính xác'));
    }

    // Băm mật khẩu để lưu vào db
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.MATKHAUMOI, salt);

    try {
      await Employee.findOneAndUpdate(
        {
          DIENTHOAI: req.body.DIENTHOAI
        },
        {
          MATKHAU: hash
        }
      );

      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Đổi mật khẩu thành công'
      });
    } catch (err) {
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Không thể kết nối đến server, vui lòng thử lại sau'));
    }
  }
}

export default new authEmployeeController();

