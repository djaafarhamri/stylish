// uploadConfig.ts
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { v2 as cloudinary } from 'cloudinary';

// Extended File interface to include cloudinary property
declare global {
  namespace Express {
    namespace Multer {
      interface File {
        cloudinary?: {
          url: string;
          public_id: string;
          resource_type: string;
        };
      }
    }
  }
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create the multer instance
const multerUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});


// Middleware to handle Cloudinary upload for **a single file**
const handleSingleCloudinaryUpload = async (file: Express.Multer.File) => {
  const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(base64Image, {
    folder: "uploads",
    resource_type: "auto",
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
    resource_type: result.resource_type,
  };
};

const handleCloudinaryUploads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files) return next();

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Process each file field dynamically
    const uploadPromises = Object.entries(files).map(async ([fieldname, fileArray]) => {
      if (!Array.isArray(fileArray)) return; // Skip invalid fields

      if (fileArray.length === 1) {
        // Single file upload
        req.body[fieldname] = await handleSingleCloudinaryUpload(fileArray[0]);
      } else {
        // Multiple files upload
        req.body[fieldname] = await Promise.all(fileArray.map(handleSingleCloudinaryUpload));
      }
    });

    await Promise.all(uploadPromises); // Ensure all uploads complete before proceeding

    next();
  } catch (error) {
    next(error);
  }
};

// Combine multer and Cloudinary into a single middleware
const upload = {
  fields: (fields: { name: string; maxCount: number }[]) => [
    multerUpload.fields(fields),
    handleCloudinaryUploads,
  ],
};

export default upload;