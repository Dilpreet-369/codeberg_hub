import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Use an absolute path resolution so Linux (Render) and Windows/macOS (Local) understand it identically
const tempDir = path.resolve('./public/temp');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create directory synchronously if it doesn't exist yet before Multer writes to it
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
}); // Limit file size to 50MB

export const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Dynamically configure Cloudinary using your variables
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Upload the file with optimization arguments applied instantly
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder: 'codeberghub_posts',
      fetch_format: 'auto', 
      quality: 'auto', 
    });

    // Clean up local /temp file storage safely
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response.secure_url; 
  } catch (error) {
    console.error('Cloudinary upload failed error:', error);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};