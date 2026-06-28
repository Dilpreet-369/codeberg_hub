import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './utils/errorHandler.js';

const app = express();

// Parsing middleware for raw JSON request payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/auth', authRoutes);

app.use(errorHandler);
export default app;
