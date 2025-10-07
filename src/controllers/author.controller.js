import Author from '../models/author.model.js';
import ApiError from '../api_error.js';

class AuthorController {
  // [POST] /api/authors
  async create(req, res, next) {
    try {
      const author = new Author(req.body);
      await author.save();
      return res.send({ message: 'A author was created successfully' });
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while creating a author'));
    }
  }

  // [GET] /api/authors
  async findAll(req, res, next) {
    try {
      const authors = await Author.find().lean();
      return res.send(authors);
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while retrieving authors'));
    }
  }

  // [GET] /api/authors/:authorId
  async findOne(req, res, next) {
    try {
      const author = await Author.findOne({ MATACGIA: req.params.authorId }).lean();
      return res.send(author);
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while retrieving an author'));
    }
  }

  // [PUT] /api/authors/:authorId
  async update(req, res, next) {
    try {
      await Author.updateOne({ MATACGIA: req.params.authorId }, req.body);
      return res.send({ message: 'An author was updated successfully' });
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while updating an author'));
    }
  }

  // [DELETE] /api/authors
  async deleteAll(req, res, next) {
    try {
      const result = await Author.deleteMany();
      return res.send({ message: `${result.deletedCount} authors were deleted successfully` });
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while removing all authors'));
    }
  }

  // [DELETE] /api/authors/:authorId
  async delete(req, res, next) {
    try {
      await Author.deleteOne({ MATACGIA: req.params.authorId });
      return res.send({ message: 'An author was deleted successfully' });
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while deleting an author'));
    }
  }
}

export default new AuthorController();
