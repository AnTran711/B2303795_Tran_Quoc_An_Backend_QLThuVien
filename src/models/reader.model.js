import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const readerSchema = new Schema({
  MADOCGIA: {
    type: String,
    default: () => 'dg' + Date.now() + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
    unique: true
  },
  HOLOT: {
    type: String
  },
  TEN: {
    type: String
  },
  NGAYSINH: {
    type: String
  },
  PHAI: {
    // male: true, female: false
    type: Boolean
  },
  DIACHI: {
    type: String
  },
  DIENTHOAI: {
    type: String
  }
});

export default mongoose.model('DOCGIA', readerSchema, 'DOCGIA');
