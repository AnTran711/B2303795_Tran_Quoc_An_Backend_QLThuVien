import express from 'express';
import readerController from '../controllers/reader.controller.js';
import authReaderMiddleware from '../middlewares/authReaderMiddleware.js';

const router = express.Router();

router.route('/')
  .get(authReaderMiddleware.verifyToken, readerController.borrowBook);

export default router;
