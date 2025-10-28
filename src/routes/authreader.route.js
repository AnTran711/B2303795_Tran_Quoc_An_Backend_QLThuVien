import express from 'express';
import authreaderController from '../controllers/authreader.controller.js';
import authReaderMiddleware from '../middlewares/authReaderMiddleware.js';

const router = express.Router();

// Route đăng kí tài khoản độc giả
router.post('/register', authreaderController.registerReader);

// Router đăng nhập
router.post('/login', authreaderController.loginReader);

// Refresh token
router.post('/refresh', authreaderController.requestRefreshToken);

// Logout
router.post('/logout', authreaderController.readerLogout);

export default router;
