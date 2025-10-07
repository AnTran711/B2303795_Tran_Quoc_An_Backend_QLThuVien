import express from 'express';
import readerController from '../controllers/reader.controller.js';

const router = express.Router();

router.route('/')
  .post(readerController.create)
  .get(readerController.findAll)
  .delete(readerController.deleteAll);

router.route('/:readerId')
  .get(readerController.findOne)
  .put(readerController.update)
  .delete(readerController.delete);

export default router;
