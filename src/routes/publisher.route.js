import express from 'express';
import publisherController from '../controllers/publisher.controller.js';
import authEmployeeMiddleware from '../middlewares/authEmployeeMiddleware.js';

const router = express.Router();

router.route('/')
  .post(authEmployeeMiddleware.verifyToken, publisherController.create)
  .get(publisherController.findAll);

router.route('/:publisherId')
  .put(authEmployeeMiddleware.verifyToken, publisherController.update)
  .delete(authEmployeeMiddleware.verifyToken, publisherController.delete);

export default router;
