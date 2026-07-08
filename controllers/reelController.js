import Reel from "../models/reels.js";

import cloudinary from "../configs/cloudinary.js";

import fs from "fs";

// ==============================
// CREATE REEL
// ==============================

export const createReel = async (
  req,
  res
) => {

  try {

    console.log(
      "🔥 Reel upload started"
    );

    const {
      userId,
      username,
      profile_picture,
      caption,
    } = req.body;

    const videoFile =
      req.file;

    // CHECK VIDEO
    if (!videoFile) {

      return res.json({

        success: false,

        message:
          "Video missing",

      });

    }

    console.log(
      "📹 Uploading to Cloudinary..."
    );

    // CLOUDINARY VIDEO UPLOAD
    const uploadedVideo =
      await cloudinary.uploader.upload(
        videoFile.path,
        {

          resource_type:
            "video",

          folder:
            "velora_reels",

        }
      );

    console.log(
      "✅ Cloudinary upload success"
    );

    // DELETE LOCAL FILE
    fs.unlinkSync(
      videoFile.path
    );

    // SAVE TO DATABASE
    const reel =
      await Reel.create({

        userId,

        username,

        profile_picture,

        caption,

        video:
          uploadedVideo.secure_url,

      });

    console.log(
      "✅ Reel saved to DB"
    );

    res.json({

      success: true,

      reel,

    });

  } catch (error) {

    console.log(
      "❌ REEL ERROR:",
      error
    );

    res.json({

      success: false,

      message:
        error.message,

    });

  }

};

// ==============================
// GET REELS
// ==============================

export const getReels = async (
  req,
  res
) => {

  try {

    const reels =
      await Reel.find().sort({

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

      message:
        error.message,

    });

  }

};