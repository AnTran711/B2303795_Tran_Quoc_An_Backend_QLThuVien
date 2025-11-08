import express from 'express';
import borrowRecordController from '../controllers/borrowrecord.controller.js';
import authReaderMiddleware from '../middlewares/authReaderMiddleware.js';
import authEmployeeMiddleware from '../middlewares/authEmployeeMiddleware.js';

const router = express.Router();

router.route('/')
  .get(borrowRecordController.getBorrowRecords)
  .post(authReaderMiddleware.verifyToken, borrowRecordController.borrow);

router.put('/approve/:id', authEmployeeMiddleware.verifyToken, borrowRecordController.approve);
router.put('/reject/:id', authEmployeeMiddleware.verifyToken, borrowRecordController.reject);
router.put('/return/:id', authEmployeeMiddleware.verifyToken, borrowRecordController.returnBook);
router.delete('/cancel-request/:id', authReaderMiddleware.verifyToken, borrowRecordController.cancelRequest);

export default router;
