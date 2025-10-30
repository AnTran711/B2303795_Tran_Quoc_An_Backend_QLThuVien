import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const genreSchema = new Schema({
  MATHELOAI: {
    type: String,
    required: true,
    unique: true
  },
  TENTHELOAI: {
    type: String,
    required: true
  },
  MOTA: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('THELOAI', genreSchema, 'THELOAI');
