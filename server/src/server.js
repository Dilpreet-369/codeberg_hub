import { httpServer } from './app.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

connectDB()
  .then(() => {
    httpServer.on('error', (error) => {
      console.log('Server error', error);
      throw error;
    });
    
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Socket.io ready for connections`);
    });
  })
  .catch((error) => {
    console.log('Mongo DB connection FAILED', error);
  });