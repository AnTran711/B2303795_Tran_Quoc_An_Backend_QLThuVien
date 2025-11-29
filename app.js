import express from 'express';
import cors from 'cors';
import bookRouter from './src/routes/book.route.js';
import publisherRouter from './src/routes/publisher.route.js';
import borrowRecordRouter from './src/routes/borrowrecord.route.js';
import authReaderRouter from './src/routes/authreader.route.js';
import authEmployeeRouter from './src/routes/authemployee.route.js';
import genreRouter from './src/routes/genre.route.js';
import dashboardRouter from './src/routes/dashboard.route.js';
import assistantRouter from './src/routes/assistant.route.js';
import ApiError from './src/api_error.js';
import db from './src/utils/mongodb.util.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { StatusCodes } from 'http-status-codes';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to database
db.connect();

app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true);
    },
    // Some legacy browsers (IE11, various SmartTVs) choke on 204
    optionsSuccessStatus: 200,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/books', bookRouter);
app.use('/api/publishers', publisherRouter);
app.use('/api/borrow-records', borrowRecordRouter);
app.use('/api/auth', authReaderRouter);
app.use('/api/auth-employee', authEmployeeRouter);
app.use('/api/genres', genreRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/assistant', assistantRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to library' });
});

// Handle 404 error
app.use((req, res, next) => {
  return next(
    new ApiError(StatusCodes.NOT_FOUND, 'error', 'Resource not found')
  );
});

// Define error-handling middleware last
app.use((err, req, res, next) => {
  res.status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    status: err.status || 'error',
    message: err.message || 'Internal server error'
  });
});

export default app;
