import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import connectionRoutes from './routes/connectionRoutes.js'; // ◄ 1. IMPORT YOUR ROUTE FILE HERE
import errorHandler from './utils/errorHandler.js';

const app = express();

app.use(
  cors({
    origin: [process.env.VITE_API_URL, 'http://localhost:5173'],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);

// ◄ 2. MOUNT IT HERE (Must be above /api/users to avoid being intercepted)
app.use('/api/users/connections', connectionRoutes);

app.use('/api/users', userRoutes);

app.use(errorHandler);

export default app;
