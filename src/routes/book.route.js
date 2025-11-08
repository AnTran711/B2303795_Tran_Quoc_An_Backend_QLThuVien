import express from 'express';
import bookController from '../controllers/book.controller.js';
import { uploadMiddleware } from '../middlewares/uploadMiddleware.js';
import authEmployeeMiddleware from '../middlewares/authEmployeeMiddleware.js';

const router = express.Router();

router.route('/')
  .get(bookController.findAll)
  .post(uploadMiddleware.upload.single('ANHBIA'), bookController.create);

router.route('/:bookId')
  .get(bookController.findOne)
  .put(uploadMiddleware.upload.single('ANHBIA'), bookController.update)
  .delete(authEmployeeMiddleware.verifyToken, bookController.delete);

export default router;
