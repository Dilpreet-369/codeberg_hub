import express from 'express';
import cors from 'cors'; // 1. Import the cors package
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './utils/errorHandler.js';

const app = express();

// 2. Configure and use CORS middleware
// Allowing your Vite frontend port explicitly is highly recommended
app.use(
  cors({
    origin: [process.env.VITE_API_URL, "http://localhost:5173"], // Add your frontend URL here
    credentials: true, // Allows frontend to pass cookies/headers if needed later
  }),
);

// Parsing middleware for raw JSON request payloads 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes); // Dedicated to credentials & session tokens
app.use('/api/users', userRoutes); // Dedicated to profiles, onboarding, and user states (New)

// Error Handling
app.use(errorHandler);

export default app;
