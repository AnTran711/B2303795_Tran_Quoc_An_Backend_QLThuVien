import express from 'express';
import bookBorrowingController from '../controllers/bookborrowing.controller.js';

const router = express.Router();

router.route('/')
  .get(bookBorrowingController.show);

export default router;
