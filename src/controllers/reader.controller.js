import Reader from '../models/reader.model.js';
import ApiError from '../api_error.js';

class ReaderController {
  // [POST] /api/readers
  async create(req, res, next) {
    try {
      const reader = new Reader(req.body);
      await reader.save();
      return res.send({ message: 'A reader was created successfully' });
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while creating a reader'));
    }
  }

  // [GET] /api/readers
  async findAll(req, res, next) {
    try {
      const readers = await Reader.find().lean();
      return res.send(readers);
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while retrieving all readers'));
    }
  }

  // [GET] /api/readers/:readerId
  async findOne(req, res, next) {
    try {
      const reader = await Reader.findOne({ MADOCGIA: req.params.readerId });
      return res.send(reader);
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while retrieving a reader'));
    }
  }

  // [PUT] /api/readers/:readerId
  async update(req, res, next) {
    try {
      await Reader.updateOne({ MADOCGIA: req.params.readerId }, req.body);
      return res.send({ message: 'A reader was updated successfully' });
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while updating a reader'));
    }
  }

  // [DELETE] /api/readers
  async deleteAll(req, res, next) {
    try {
      const result = await Reader.deleteMany();
      return res.send({ message: `${result.deletedCount} readers were deleted successfully` });
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while removing all readers'));
    }
  }

  // [DELETE] /api/readers/:readerId
  async delete(req, res, next) {
    try {
      await Reader.deleteOne({ MADOCGIA: req.params.readerId });
      return res.send({ message: 'A reader was deleted successfully' });
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while deleting a reader'));
    }
  }
}

export default new ReaderController();
