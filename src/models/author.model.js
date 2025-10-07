import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const authorSchema = new Schema({
  MATACGIA: {
    type: String,
    required: true,
    unique: true
  },
  HOTENTACGIA: {
    type: String,
    required: true
  }
});

export default mongoose.model('TACGIA', authorSchema, 'TACGIA');