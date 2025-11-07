import express from 'express';
import borrowRecordController from '../controllers/borrowrecord.controller.js';

const router = express.Router();

router.route('/')
  .get(borrowRecordController.getBorrowRecords)
  .post(borrowRecordController.borrow);

router.put('/approve/:id', borrowRecordController.approve);
router.put('/reject/:id', borrowRecordController.reject);
router.put('/return/:id', borrowRecordController.returnBook);
router.delete('/cancel-request/:id', borrowRecordController.cancelRequest);

export default router;
