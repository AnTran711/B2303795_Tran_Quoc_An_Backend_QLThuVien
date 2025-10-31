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
}, {
  timestamps: true
});

// Virtual populate
bookBorrowingSchema.virtual('DOCGIA', {
  ref: 'DOCGIA',
  localField: 'MADOCGIA',
  foreignField: 'MADOCGIA',
  justOne: true
});

bookBorrowingSchema.virtual('SACH', {
  ref: 'SACH',
  localField: 'MASACH',
  foreignField: 'MASACH',
  justOne: true
});

export default mongoose.model('THEODOIMUONSACH', bookBorrowingSchema, 'THEODOIMUONSACH');
