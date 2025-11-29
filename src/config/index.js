import dotenv from 'dotenv';
dotenv.config();

const config = {
  app: {
    port: process.env.PORT || 3000
  },
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/library_management'
  },
  jwt: {
    readerAccessKey: process.env.JWT_READER_ACCESS_KEY,
    readerRefreshKey: process.env.JWT_READER_REFRESH_KEY,
    employeeAccessKey: process.env.JWT_EMPLOYEE_ACCESS_KEY,
    employeeRefreshKey: process.env.JWT_EMPLOYEE_REFRESH_KEY
  },
  aiAPI: {
    key: process.env.GEMINI_API_KEY
  }
};

export default config;
