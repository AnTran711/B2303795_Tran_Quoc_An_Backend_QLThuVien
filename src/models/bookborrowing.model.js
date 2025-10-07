import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const bookBorrowingSchema = new Schema({
  MADOCGIA: {
    type: String
  },
  MASACH: {
    type: String
  },
  NGAYMUON: {
    type: Date
  },
  NGAYTRA: {
    type: Date
  }
});

export default mongoose.model('THEODOIMUONSACH', bookBorrowingSchema, 'THEODOIMUONSACH');
