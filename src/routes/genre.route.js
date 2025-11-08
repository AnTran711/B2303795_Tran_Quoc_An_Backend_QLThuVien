import express from 'express';
import genreController from '../controllers/genre.controller.js';
import authEmployeeMiddleware from '../middlewares/authEmployeeMiddleware.js';

const router = express.Router();

router.route('/')
  .post(authEmployeeMiddleware.verifyToken, genreController.create)
  .get(genreController.findAll);

router.route('/:genreId')
  .put(authEmployeeMiddleware.verifyToken, genreController.update)
  .delete(authEmployeeMiddleware.verifyToken, genreController.delete);

export default router;
