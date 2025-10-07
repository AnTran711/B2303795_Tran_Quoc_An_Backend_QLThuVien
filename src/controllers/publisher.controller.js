import Publisher from '../models/publisher.model.js';
import ApiError from '../api_error.js';

class PublisherController {
  // [POST] /api/publishers
  async create(req, res, next) {
    try {
      const publisher = new Publisher(req.body);
      await publisher.save();
      return res.send({ message: 'Created a publisher successfully' });
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while creating a publisher'));
    }
  }

  // [GET] /api/publishers
  async findAll(req, res, next) {
    try {
      const publishers = await Publisher.find().lean();
      return res.send(publishers);
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while retrieving publishers '));
    }
  }

  // [GET] /api/publishers/:publisherId
  async findOne(req, res, next) {
    try {
      const publisher = await Publisher.findOne({ MANXB: req.params.publisherId }).lean();
      return res.send(publisher);
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while retrieving a publisher'));
    }
  }

  // [PUT] /api/publishers/:publisherId
  async update(req, res, next) {
    try {
      await Publisher.updateOne({ MANXB: req.params.publisherId }, req.body);
      return res.send({ message: 'A publisher was updated successfully' });
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while updating a publisher'));
    }
  }

  // [DELETE] /api/publishers
  async deleteAll(req, res, next) {
    try {
      const result = await Publisher.deleteMany();
      return res.send({ message: `${result.deletedCount} publishers were deleted successfully` });
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while removing all publishers '));
    }
  }

  // [DELETE] /api/publishers/:publisherId
  async delete(req, res, next) {
    try {
      await Publisher.deleteOne({ MANXB: req.params.publisherId });
      return res.send({ message: 'A publisher was deleted successfully' });
    } catch (err) {
      console.error(err);
      return next(new ApiError(500, 'An error occurred while deleting a publisher'));
    }
  }
}

export default new PublisherController();
