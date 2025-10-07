import express from 'express';
import publisherController from '../controllers/publisher.controller.js';

const router = express.Router();

router.route('/')
  .post(publisherController.create)
  .get(publisherController.findAll)
  .delete(publisherController.deleteAll);

router.route('/:publisherId')
  .get(publisherController.findOne)
  .put(publisherController.update)
  .delete(publisherController.delete);

export default router;
