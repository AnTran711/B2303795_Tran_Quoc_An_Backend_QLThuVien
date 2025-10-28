import express from 'express';
import bookController from '../controllers/book.controller.js';
import { uploadMiddleware } from '../middlewares/uploadMiddleware.js';
import authReaderMiddleware from '../middlewares/authReaderMiddleware.js';

const router = express.Router();

router.route('/')
  .get(authReaderMiddleware.verifyToken, bookController.findAll)
  .post(uploadMiddleware.upload.single('ANHBIA'), bookController.create)
  .delete(bookController.deleteAll);

router.route('/:bookId')
  .get(bookController.findOne)
  .put(uploadMiddleware.upload.single('ANHBIA'), bookController.update)
  .delete(bookController.delete);

export default router;
