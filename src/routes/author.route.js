import express from 'express';
import authorController from '../controllers/author.controller.js';

const router = express.Router();

router.route('/')
  .post(authorController.create)
  .get(authorController.findAll)
  .delete(authorController.deleteAll);

router.route('/:authorId')
  .get(authorController.findOne)
  .put(authorController.update)
  .delete(authorController.delete);

export default router;
