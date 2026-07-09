import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); 
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // Limit file size to 50MB

export const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Dynamically configure Cloudinary using your new verified account variables
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Upload the file with optimization arguments applied instantly
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "codeberghub_posts", 
      // ─── OPTIMIZATION ARGUMENTS FROM THE TEST SCRIPT ───
      fetch_format: "auto", // Automatically chooses WebP/AVIF for faster mobile loads
      quality: "auto",      // Compresses file size intelligently without losing quality
    });
    
    // Clean up local /temp file storage safely
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    
    return response.secure_url; // Returns the permanent secure optimized image URL string
  } catch (error) {
    console.error("Cloudinary upload failed error:", error);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};