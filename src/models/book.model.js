import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  MASACH: {
    type: String,
    unique: true,
    required: true
  },
  TENSACH: {
    type: String,
    required: true
  },
  ANHBIA: {
    type: String
  },
  DONGIA: {
    type: Number
  },
  SOQUYEN: {
    type: Number
  },
  SACHCONLAI: {
    type: Number
  },
  NAMXUATBAN: {
    type: Number
  },
  MANXB: {
    type: String,
    required: true
  },
  MATACGIA: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('SACH', bookSchema, 'SACH');
