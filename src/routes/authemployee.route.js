import express from 'express';
import authEmployeeController from '../controllers/authemployee.controller.js';

const router = express.Router();

// Route đăng kí tài khoản nhân viên
router.post('/register', authEmployeeController.registerEmployee);

// Router đăng nhập
router.post('/login', authEmployeeController.loginEmployee);

// Refresh token
router.post('/refresh', authEmployeeController.requestRefreshToken);

// Logout
router.post('/logout', authEmployeeController.logoutEmployee);

// Change password
router.post('/change-password', authEmployeeController.changePassword);

export default router;
