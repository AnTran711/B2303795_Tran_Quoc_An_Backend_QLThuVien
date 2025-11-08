import express from 'express';
import authReaderController from '../controllers/authreader.controller.js';

const router = express.Router();

// Route đăng kí tài khoản độc giả
router.post('/register', authReaderController.registerReader);

// Router đăng nhập
router.post('/login', authReaderController.loginReader);

// Refresh token
router.post('/refresh', authReaderController.requestRefreshToken);

// Logout
router.post('/logout', authReaderController.readerLogout);

// Change password
router.post('/change-password', authReaderController.changePassword);

export default router;
