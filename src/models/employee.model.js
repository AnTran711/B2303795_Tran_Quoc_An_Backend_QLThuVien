import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  MSNV: {
    type: String,
    required: true,
    unique: true
  },
  HOTENNV: {
    type: String,
    required: true
  },
  PASSWORD: {
    type: String
  },
  CHUCVU: {
    type: String
  },
  DIACHI: {
    type: String
  },
  SODIENTHOAI: {
    type: String
  }
});

export default mongoose.model('NHANVIEN', employeeSchema, 'NHANVIEN');
