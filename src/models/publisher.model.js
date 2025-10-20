import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const publisherSchema = new Schema({
  MANXB: {
    type: String,
    required: true,
    unique: true
  },
  TENNXB: {
    type: String,
    required: true
  },
  DIACHI: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('NHAXUATBAN', publisherSchema, 'NHAXUATBAN');
