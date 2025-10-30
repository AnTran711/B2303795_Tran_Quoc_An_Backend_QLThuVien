import express from 'express';
import genreController from '../controllers/genre.controller.js';

const router = express.Router();

router.route('/')
  .post(genreController.create)
  .get(genreController.findAll)
  .delete(genreController.deleteAll);

router.route('/:genreId')
  .get(genreController.findOne)
  .put(genreController.update)
  .delete(genreController.delete);

export default router;
