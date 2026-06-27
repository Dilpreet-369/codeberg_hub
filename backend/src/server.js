import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js'; // Note the explicit '.js' extension required by ESM
import connectDB from './db/db.js';

// Recreate __dirname since it's not natively available in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly point dotenv to your .env file located one level up in the backend folder root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Start Server Listener
app.listen(PORT, () => {
  console.log(`🚀 Server sprinting smoothly on port ${PORT}`);
  console.log(
    `📡 Database URI Loaded Check: ${process.env.MONGO_URI ? 'SUCCESS' : 'FAILED'}`,
  );
});
