import express from 'express';
import bookBorrowingController from '../controllers/bookborrowing.controller.js';

const router = express.Router();

router.route('/')
  .get(bookBorrowingController.getAllBorrowRecord)
  .post(bookBorrowingController.borrow);

router.put('/approve/:id', bookBorrowingController.approve);
router.put('/reject/:id', bookBorrowingController.reject);
router.put('/return/:id', bookBorrowingController.return);

export default router;
