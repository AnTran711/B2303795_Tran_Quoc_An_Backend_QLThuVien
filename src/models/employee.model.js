import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  MSNV: {
    type: String,
    default: () => 'NV' + Date.now() + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
    unique: true
  },
  HOTENNV: {
    type: String,
    required: true
  },
  NGAYSINH: {
    type: String
  },
  PHAI: {
    // nam: true, nữ: false
    type: Boolean
  },
  MATKHAU: {
    type: String
  },
  CHUCVU: {
    type: String
  },
  DIACHI: {
    type: String
  },
  DIENTHOAI: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

export default mongoose.model('NHANVIEN', employeeSchema, 'NHANVIEN');
