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
    readerRefeshKey: process.env.JWT_READER_REFRESH_KEY
  }
};

export default config;
