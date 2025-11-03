import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const borrowRecordSchema = new Schema({
  MADOCGIA: {
    type: String
  },
  MASACH: {
    type: String
  },
  NGAYYEUCAU: {
    type: Date,
    default: () => Date.now()
  },
  NGAYMUON: {
    type: Date,
    default: null
  },
  NGAYTRA: {
    type: Date,
    default: null
  },
  HANTRA: {
    type: Date,
    default: null
  },
  TRANGTHAI: {
    type: String,
    default: 'Chờ duyệt'
  }
});

// Virtual populate
borrowRecordSchema.virtual('DOCGIA', {
  ref: 'DOCGIA',
  localField: 'MADOCGIA',
  foreignField: 'MADOCGIA',
  justOne: true
});

borrowRecordSchema.virtual('SACH', {
  ref: 'SACH',
  localField: 'MASACH',
  foreignField: 'MASACH',
  justOne: true
});

export default mongoose.model('THEODOIMUONSACH', borrowRecordSchema, 'THEODOIMUONSACH');
