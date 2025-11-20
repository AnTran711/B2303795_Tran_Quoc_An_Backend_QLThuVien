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
  MOTA: {
    type: String
  },
  DONGIA: {
    type: Number
  },
  SOQUYEN: {
    type: Number
  },
  NAMXUATBAN: {
    type: Number
  },
  MANXB: {
    type: String,
    required: true
  },
  TENTACGIA: {
    type: String
  },
  THELOAI: [
    {
      type: String
    }
  ]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate
bookSchema.virtual('DSTHELOAI', {
  ref: 'THELOAI',
  localField: 'THELOAI',
  foreignField: 'MATHELOAI',
  justOne: false
});

bookSchema.virtual('NHAXUATBAN', {
  ref: 'NHAXUATBAN',
  localField: 'MANXB',
  foreignField: 'MANXB',
  justOne: true
});

export default mongoose.model('SACH', bookSchema, 'SACH');
