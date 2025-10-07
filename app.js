import express from 'express';
import cors from 'cors';
import bookRouter from './src/routes/book.route.js';
import publisherRouter from './src/routes/publisher.route.js';
import employeeRouter from './src/routes/employee.route.js';
import authorRouter from './src/routes/author.route.js';
import readerRouter from './src/routes/reader.route.js';
import bookBorrowingRouter from './src/routes/bookborrowing.route.js';
import ApiError from './src/api_error.js';
import db from './src/utils/mongodb.util.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to database
db.connect();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/books', bookRouter);
app.use('/api/publishers', publisherRouter);
app.use('/api/employees', employeeRouter);
app.use('/api/authors', authorRouter);
app.use('/api/readers', readerRouter);
app.use('/api/bookBorrowings', bookBorrowingRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to library' });
});

// Handle 404 error
app.use((req, res, next) => {
  return next(new ApiError(404, 'Resource not found'));
});

// Define error-handling middleware last
app.use((err, req, res) => {
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

export default app;
