import mongoose from 'mongoose';
import config from '../config/index.js';

const db = {
  async connect() {
    try {
      await mongoose.connect(config.db.uri);
      console.log('Connected successfully');
    } catch (err) {
      console.error(err);
      console.log('Connect failure!!');
    }
  }
};

export default db;