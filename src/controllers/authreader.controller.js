import Reader from '../models/reader.model.js';
import ApiError from '../api_error.js';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import generateToken from '../utils/jwt.util.js';

class authReaderController {
  // Đăng ký
  // [POST] api/auth/register
  async registerReader(req, res, next) {
    try {
      // Băm mật khẩu để lưu vào db
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.MATKHAU, salt);

      // Kiểm tra trùng số điện thoại
      const phoneDuplicate = await Reader.findOne({ DIENTHOAI: req.body.DIENTHOAI });

      if (phoneDuplicate) {
        return next(new ApiError(StatusCodes.CONFLICT, 'error', 'Số điện thoại này đã được đăng ký tài khoản'));
      }

      // Tạo độc giả mới
      const reader = new Reader({
        HOLOT: req.body.HOLOT,
        TEN: req.body.TEN,
        NGAYSINH: req.body.NGAYSINH,
        PHAI: req.body.PHAI,
        DIACHI: req.body.DIACHI,
        DIENTHOAI: req.body.DIENTHOAI,
        MATKHAU: hash
      });

      // Lưu vào db và trả dữ liệu về cho client
      await reader.save();
      const { MATKHAU, ...others } = reader._doc;
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
  // [POST] api/auth/login
  async loginReader(req, res, next) {
    try {
      // Lấy độc giả từ db
      const reader = await Reader.findOne({ DIENTHOAI: req.body.DIENTHOAI }).lean();
      if (!reader) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'error', 'Tài khoản hoặc mật khẩu không chính xác'));
      }

      // Kiểm tra mật khẩu
      const validPassword = bcrypt.compareSync(req.body.MATKHAU, reader.MATKHAU);
      if (!validPassword) {
        return next(new ApiError(StatusCodes.NOT_FOUND, 'error', 'Tài khoản hoặc mật khẩu không chính xác'));
      }

      // Đăng nhập thành công và gửi reader về cho client

      // Tạo jsonwebtoken
      // Tạo access token
      const accessToken = generateToken.generateReaderAccessToken(reader, config.jwt.readerAccessKey, '30s');

      // Lưu access token vào cookie
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false, // Lúc deploy sửa thành true
        sameSite: 'Strict',
        path: '/'
      });

      // Tạo refresh token
      const refreshToken = generateToken.generateReaderRefreshToken(reader, config.jwt.readerRefeshKey, '365d');

      // Lưu refresh token vào cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false, // Lúc deploy sẽ sửa thành true
        path: '/api/auth/refresh',
        sameSite: 'Strict'
      });

      // Lọc bỏ mật khẩu
      const { MATKHAU, ...others } = reader;

      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Đăng nhập thành công',
        data: { ...others, accessToken }
      });
    } catch (err) {
      console.log(err);
      return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'error', 'Đăng nhập thất bại, vui lòng thử lại sau'));
    }
  }

  // Refresh token
  // [POST] api/auth/refresh
  requestRefreshToken (req, res, next) {
    // Lấy refresh token từ cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'error', 'Bạn chưa đăng nhập'));
    }

    // Xác thực refresh token
    jwt.verify(refreshToken, config.jwt.readerRefeshKey, (err, reader) => {
      if (err) {
        console.log(err);
        return;
      }

      // Tạo access token mới
      const newAccessToken = generateToken.generateReaderAccessToken(reader, config.jwt.readerAccessKey, '30s');

      // Lưu access token vào cookie
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: false, // Lúc deploy sửa thành true
        sameSite: 'Strict',
        path: '/'
      });

      // Gửi access token mới về client
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: 'Refresh token thành công',
        data: { accessToken: newAccessToken }
      });
    });
  }

  // Reader logout
  readerLogout (req, res, next) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Bạn đã đăng xuất'
    });
  }
}

export default new authReaderController();

