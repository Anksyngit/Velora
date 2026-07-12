import express from "express";
import multer from "multer";
import cloudinary from "../configs/cloudinary.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Store file in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

// Upload Image
router.post(
  "/image",
  protect,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.json({
          success: false,
          message: "No image selected",
        });
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "velora/profile",
        },
        (error, result) => {
          if (error) {
            return res.json({
              success: false,
              message: error.message,
            });
          }

          return res.json({
            success: true,
            url: result.secure_url,
          });
        }
      );

      uploadStream.end(req.file.buffer);

    } catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
  }
);

export default router;