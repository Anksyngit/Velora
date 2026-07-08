import Reel from "../models/reels.js";
import cloudinary from "../configs/cloudinary.js";
import streamifier from "streamifier";

// ==============================
// CREATE REEL
// ==============================

export const createReel = async (req, res) => {
  try {
    console.log("🔥 Reel upload started");

    const {
      userId,
      username,
      profile_picture,
      caption,
    } = req.body;

    const videoFile = req.file;

    if (!videoFile) {
      return res.json({
        success: false,
        message: "Video missing",
      });
    }

    console.log("📹 Uploading reel to Cloudinary...");

    const uploadedVideo = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "velora_reels",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(videoFile.buffer).pipe(stream);
    });

    console.log("✅ Cloudinary upload success");

    const reel = await Reel.create({
      userId,
      username,
      profile_picture,
      caption,
      video: uploadedVideo.secure_url,
    });

    console.log("✅ Reel saved to DB");

    res.json({
      success: true,
      reel,
    });

  } catch (error) {
    console.log("❌ REEL ERROR:", error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// GET REELS
// ==============================

export const getReels = async (req, res) => {
  try {
    const reels = await Reel.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      reels,
    });

  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};