import express from 'express';
import genreController from '../controllers/genre.controller.js';

const router = express.Router();

router.route('/')
  .post(genreController.create)
  .get(genreController.findAll);

router.route('/:genreId')
  .put(genreController.update)
  .delete(genreController.delete);

export default router;
